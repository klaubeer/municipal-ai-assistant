<div align="center">

# 🏛️ O Democrata

**Assistente de IA para consulta de informações públicas municipais em linguagem natural — combinando RAG, scraping automatizado e dashboard analítico para aproximar o cidadão da gestão pública.**

[![Python](https://img.shields.io/badge/Backend-Python-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![Supabase](https://img.shields.io/badge/Banco_de_Dados-Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![Puppeteer](https://img.shields.io/badge/Scraping-Puppeteer-40B5A4?style=flat-square&logo=puppeteer&logoColor=white)](https://pptr.dev)

</div>

---

## Visão Geral

O Democrata é uma plataforma de **IA aplicada à transparência pública**. O cidadão digita uma pergunta em linguagem natural — sobre leis, decretos, impostos, serviços ou procedimentos municipais — e recebe uma resposta precisa, fundamentada em documentos oficiais.

O sistema elimina a necessidade de navegar por portais institucionais complexos ou ler legislação extensa. Por baixo, um pipeline completo coleta dados de fontes governamentais, processa e indexa os documentos, e serve as consultas via RAG — garantindo que cada resposta seja rastreável a uma fonte pública real.

Além do assistente, o projeto inclui um **dashboard analítico** que transforma as perguntas da população em dados estratégicos para gestores públicos.

---

## Arquitetura

```
Portais Institucionais / Publicações Oficiais
               │
               ▼
     Pipeline de Scraping (Puppeteer)
               │
               ▼
     Processamento de Documentos
      ├─── Limpeza de dados
      ├─── Parsing e chunking
      └─── Geração de embeddings
               │
               ▼
     Supabase (pgvector)
               │
        ┌──────┴──────┐
        ▼             ▼
  Assistente      Dashboard
 Conversacional   Analítico
        │
        ▼
   Pergunta do Usuário
        │
        ▼
   Embedding da Query
        │
        ▼
   Busca Semântica
        │
        ▼
   Recuperação de Documentos
        │
        ▼
   LLM + Contexto Oficial
        │
        ▼
   Resposta Fundamentada
```

---

## Componentes Principais

### 🔍 Pipeline de Ingestão de Dados

Documentos públicos são coletados automaticamente de portais municipais via **Puppeteer**, passando por um pipeline estruturado antes de chegarem ao vector store:

```
Web Scraping (Puppeteer)
        │
        ▼
  Limpeza e Normalização
        │
        ▼
  Parsing de Documentos
        │
        ▼
  Chunking de Texto
        │
        ▼
  Geração de Embeddings
        │
        ▼
  Upsert no Supabase pgvector
```

Fontes incluem legislação municipal, decretos, atos administrativos, tabelas de taxas e publicações de serviços públicos. O pipeline pode ser agendado para manter a base atualizada automaticamente.

### 🧠 Sistema de Recuperação (RAG)

Quando o cidadão faz uma pergunta, o sistema:

1. Converte a pergunta em embedding
2. Executa busca semântica no vector store
3. Recupera os trechos de documentos mais relevantes
4. Monta o contexto e envia ao LLM
5. Retorna uma resposta fundamentada com rastreabilidade à fonte oficial

Isso reduz alucinações e garante que o modelo nunca "invente" informações sobre legislação ou procedimentos — cada resposta tem um documento público como origem.

### 📊 Dashboard Analítico

O painel transforma o volume de consultas em inteligência para a gestão pública:

- Identifica perguntas recorrentes da população
- Mapeia demandas por serviços públicos
- Monitora os temas mais consultados por período
- Gera insights acionáveis para administradores e gestores

Isso permite que prefeituras e órgãos públicos entendam, de forma quantitativa, quais são as dúvidas e necessidades reais dos cidadãos.

---

## Casos de Uso

| Consulta do Cidadão | O Sistema Faz |
|---|---|
| "Como emitir minha certidão negativa de débitos?" | Recupera o procedimento oficial e links do portal |
| "Qual é o prazo para pagamento do IPTU com desconto?" | Busca o decreto vigente com as datas e condições |
| "Quais documentos preciso para abrir um alvará?" | Recupera a legislação e checklist oficial |
| "A Lei X ainda está em vigor?" | Consulta o histórico legislativo municipal |
| "Onde denunciar um problema de saneamento?" | Retorna os canais oficiais de atendimento |

---

## Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| **LLM** | Large Language Models via API |
| **RAG** | Retrieval-Augmented Generation com pgvector |
| **Base Vetorial** | Supabase pgvector |
| **Scraping** | Puppeteer (Node.js) |
| **Backend** | Python |
| **Banco de Dados** | Supabase (PostgreSQL) |
| **Analytics** | Dashboard BI sobre logs de consulta |

---

## Decisões de Arquitetura

**RAG sobre fine-tuning** — documentos municipais mudam com frequência (decretos, leis, tabelas de taxas). Fine-tuning seria obsoleto rapidamente. Com RAG, basta re-indexar os documentos novos e o sistema já responde com as informações atualizadas, sem retreinar o modelo.

**Supabase como backend unificado** — o mesmo projeto Supabase serve como vector store (pgvector), banco relacional (logs, metadados de documentos, analytics) e backend de autenticação. Reduz operações e mantém tudo em um lugar.

**Scraping com Puppeteer** — portais municipais frequentemente usam JavaScript pesado para renderizar conteúdo, tornando scrapers HTTP simples ineficazes. Puppeteer roda um browser headless real, garantindo que o conteúdo renderizado seja capturado corretamente.

**Dashboard como produto secundário** — as consultas dos cidadãos são, por si só, dados valiosos. O dashboard não é um extra cosmético — é o mecanismo que transforma o assistente em uma ferramenta de gestão pública, justificando adoção institucional.

---

## Impacto Esperado

- **Para o cidadão**: acesso imediato a informações públicas sem burocracia
- **Para gestores**: visibilidade sobre as principais dúvidas e demandas da população
- **Para a administração pública**: redução de carga em canais de atendimento para perguntas simples e repetitivas

---

## Como Começar

### Pré-requisitos

- Python 3.10+
- Node.js (para o pipeline de scraping com Puppeteer)
- Projeto Supabase com extensão pgvector habilitada
- Chave de API do provedor LLM

### Configuração

1. **Clone** este repositório
2. **Instale as dependências** Python e Node.js
3. **Configure as variáveis de ambiente** (ver `.env.example`)
4. **Execute o pipeline de ingestão** para popular o vector store com os documentos municipais
5. **Inicie o servidor** — o assistente estará disponível

Referência completa de configuração em [`docs/setup.md`](docs/setup.md).
