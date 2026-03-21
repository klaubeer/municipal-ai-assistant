import express from 'express';
import puppeteer from 'puppeteer';
import bodyParser from 'body-parser';
import fs from 'fs'; 

console.log('🟢 [BOOT] Iniciando aplicação Puppeteer Democrata...');

const app = express();
app.use(bodyParser.json());

// Middleware para tratamento de erros globais (catch-all)
app.use((err, req, res, next) => {
  console.error('🔥 [ERRO GLOBAL] Erro inesperado no servidor Express:', err);
  res.status(500).json({ erro: 'Erro interno inesperado no serviço Puppeteer' });
});

// Endpoint 1: /schroeder/buscar - Para buscar e listar os 10 primeiros resultados
app.post('/schroeder/buscar', async (req, res) => {
    console.log('⚡ [HANDLER] POST /schroeder/buscar - Requisição de busca recebida');

    const { termo } = req.body;
    if (!termo) {
        console.warn('⚠️ [VALIDAÇÃO] Termo de busca não informado na requisição.');
        return res.status(400).json({ erro: 'Por favor, informe o "termo" para a busca.' });
    }

    let browser;
    // O seletor para as linhas da tabela de resultados.
    // Importante: Se a primeira <td> da linha for um checkbox ou algo não textual,
    // o seletor dentro de page.evaluate para 'contentCell' precisará ser ajustado (ex: querySelectorAll('td')[1])
    let resultRowSelector = 'table.table.table-striped.table-bordered tbody tr';

    try {
        console.log('🧠 [PUPPETEER] Inicializando navegador...');
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] // Corrigido --disable-setuid-uid para --disable-setuid-sandbox
        });

        const page = await browser.newPage();
        const url = `https://sapl.schroeder.sc.leg.br/sistema/search/`;
        console.log(`🚀 [NAVIGATE] Acessando URL: ${url}`);

        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        console.log('✅ [NAVIGATE] Página de busca do SAPL carregada com sucesso.');

        const checkboxSelector = '#id_check_all';
        try {
            await page.waitForSelector(checkboxSelector, { timeout: 10000 });
            const isChecked = await page.$eval(checkboxSelector, checkbox => checkbox.checked);
            if (!isChecked) {
                await page.click(checkboxSelector);
                console.log('✅ [ACTION] Checkbox "Marcar/Desmarcar Todos" clicado.');
            } else {
                console.log('ℹ️ [ACTION] Checkbox "Marcar/Desmarcar Todos" já estava marcado.');
            }
        } catch (checkboxErr) {
            console.warn(`⚠️ [WARNING] Não foi possível encontrar/clicar no checkbox "${checkboxSelector}". Prosseguindo sem ele. Erro: ${checkboxErr.message}`);
        }

        const searchInputSelector = '#id_q';
        await page.waitForSelector(searchInputSelector, { timeout: 20000 });
        console.log(`[ACTION] Digitando o termo "${termo}" no campo de busca (${searchInputSelector}).`);
        await page.type(searchInputSelector, termo);

        const searchButtonSelector = 'input[type="submit"][value="Pesquisar"]';
        await page.waitForSelector(searchButtonSelector, { timeout: 10000 });
        console.log('[ACTION] Clicando no botão "Pesquisar".');
        await page.click(searchButtonSelector);

        await page.waitForSelector(resultRowSelector, { timeout: 15000 });
        console.log('✅ [DOM] Resultados da busca aparentemente carregados na tabela.');

        const searchResults = await page.evaluate((rowSelector, maxResultsToScrape) => {
            const results = [];
            const rows = document.querySelectorAll(rowSelector);

            console.log(`[DEBUG - Browser Context] Encontradas ${rows.length} linhas com o seletor "${rowSelector}".`);

            for (let i = 0; i < Math.min(rows.length, maxResultsToScrape); i++) {
                const row = rows[i];
                const itemData = {
                    materia_principal: { titulo: null, link: null },
                    ementa: null,
                    texto_original: { descricao: null, link: null },
                    outros_campos: {}
                };

                // Tentativa de selecionar a célula de conteúdo.
                // A imagem do HTML sugere que o conteúdo está na segunda <td> (índice 1).
                // Se a primeira <td> (índice 0) for discreta (ex: checkbox), esta é uma boa suposição.
                // Ajuste o índice [1] se a estrutura for diferente (ex: [0] se for a primeira).
                const cells = Array.from(row.querySelectorAll('td'));
                const contentCell = cells.length > 1 ? cells[1] : cells[0]; // Tenta a segunda, senão a primeira.

                if (!contentCell) {
                    console.warn(`[DEBUG - Browser Context] Linha ${i}: célula de conteúdo não encontrada.`);
                    continue;
                }
                
                const paragraphs = Array.from(contentCell.querySelectorAll('p'));

                paragraphs.forEach((p, pIndex) => {
                    // Processar o conteúdo do parágrafo, quebrando por <br> para tratar "linhas"
                    const linesHTML = p.innerHTML.split(/<br\s*\/?>/gi);
                    
                    linesHTML.forEach(lineHTML => {
                        if (!lineHTML.trim()) return;

                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = lineHTML.trim();

                        const strongTag = tempDiv.querySelector('strong');
                        const aTag = tempDiv.querySelector('a');
                        
                        let labelText = null;
                        let valueText = tempDiv.innerText.trim(); // Texto completo da "linha"
                        let valueLink = aTag ? aTag.href : null;
                        let valueLinkText = aTag ? aTag.innerText.trim() : null;

                        if (strongTag) {
                            labelText = strongTag.innerText.replace(':', '').trim();
                            // Remove o texto do label do valor principal para não duplicar
                            valueText = tempDiv.innerText.replace(strongTag.innerText, '').trim();
                        }

                        // Lógica para preencher os campos específicos e 'outros_campos'
                        if (pIndex === 0) { // Geralmente, o primeiro parágrafo tem os dados principais
                            if (labelText === 'Matéria Legislativa') {
                                itemData.materia_principal.titulo = valueLinkText || valueText;
                                itemData.materia_principal.link = valueLink;
                            } else if (labelText === 'Texto Original') {
                                itemData.texto_original.descricao = valueLinkText || valueText;
                                itemData.texto_original.link = valueLink;
                            } else if (!labelText && valueText && valueText.length > 10 && !itemData.ementa) {
                                // Se não há label, é um texto solto e a ementa ainda não foi pega, assume como ementa.
                                // Evita pegar o título da matéria como ementa se ele não tiver strong.
                                if (!itemData.materia_principal.titulo || (itemData.materia_principal.titulo && !valueText.startsWith(itemData.materia_principal.titulo))) {
                                   itemData.ementa = valueText;
                                }
                            } else if (labelText && valueText) { // Outros campos no primeiro parágrafo
                                itemData.outros_campos[labelText] = valueLink ? { texto: valueLinkText || valueText, link: valueLink } : valueText;
                            }
                        } else { // Parágrafos subsequentes
                            if (labelText && valueText) {
                                itemData.outros_campos[labelText] = valueLink ? { texto: valueLinkText || valueText, link: valueLink } : valueText;
                            } else if (valueText && !labelText) { // Texto solto em parágrafos subsequentes
                                itemData.outros_campos[`info_adicional_${Object.keys(itemData.outros_campos).length + 1}`] = valueText;
                            }
                        }
                    });
                });
                
                // Fallback para o link de download original se não foi pego pela lógica de label
                if (!itemData.texto_original.link) {
                    const originalFileLinkElement = contentCell.querySelector('p a[href*="/media/sapl/public/"]');
                    if (originalFileLinkElement) {
                        itemData.texto_original.descricao = originalFileLinkElement.innerText.trim();
                        itemData.texto_original.link = originalFileLinkElement.href;
                    }
                }
                 // Fallback para título se não foi pego por "Matéria Legislativa"
                if (!itemData.materia_principal.titulo && paragraphs.length > 0) {
                    const firstLinkInFirstP = paragraphs[0].querySelector('a');
                    if (firstLinkInFirstP && (!itemData.texto_original.link || itemData.texto_original.link !== firstLinkInFirstP.href) ) {
                         itemData.materia_principal.titulo = firstLinkInFirstP.innerText.trim();
                         itemData.materia_principal.link = firstLinkInFirstP.href;
                    }
                }


                results.push(itemData);
            }
            return results;
        }, resultRowSelector, 10); // Passando resultRowSelector e o número máximo de resultados

        console.log(`[EXTRACT] ${searchResults.length} resultados detalhados extraídos.`);
        res.json({ resultados: searchResults });

    } catch (err) {
        console.error('❌ [ERRO] Falha na execução da busca Puppeteer:', err);
        if (err.name === 'TimeoutError' && err.message.includes(resultRowSelector)) {
            console.warn('⚠️ [PUPPETEER] Nenhum resultado encontrado para o termo:', termo, 'ou a tabela de resultados não apareceu no tempo esperado.');
            return res.status(200).json({ resultados: [], mensagem: "Nenhum resultado encontrado para o termo pesquisado." });
        }
        if (err.name === 'TimeoutError' && err.message.includes(searchInputSelector)) {
            console.error(`🔴 [ERRO CRÍTICO] O campo de busca (${searchInputSelector}) NÃO FOI ENCONTRADO APÓS 20s. Verifique o carregamento da página ou se há algum popup/overlay.`);
        }
        res.status(500).json({ erro: 'Falha na busca ou extração de dados no SAPL', detalhes: err.message });
    } finally {
        if (browser) {
            console.log('[CLOSE] Fechando navegador Puppeteer.');
            await browser.close();
        }
    }
});

const PORT = process.env.VIRTUAL_PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`📢 [READY] Serviço Puppeteer Democrata rodando na porta ${PORT}`);
    console.log(`Endpoint de busca: POST http://localhost:${PORT}/schroeder/buscar`);
});
