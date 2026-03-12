# 🇧🇷 PT-BR

# AI Assistant for Municipal Public Information

Assistente baseado em **Inteligência Artificial e Large Language Models** desenvolvido para simplificar o acesso a **informações públicas municipais**.

O sistema permite que cidadãos consultem informações governamentais utilizando **linguagem natural**, eliminando a necessidade de navegar manualmente por portais institucionais complexos ou documentos extensos.

A plataforma atua como uma **interface inteligente para dados públicos**, combinando **RAG, processamento de documentos e recuperação semântica** para fornecer respostas precisas baseadas em fontes oficiais.

---

# Objetivo do Projeto

O objetivo do projeto é **reduzir a fricção no acesso à informação pública**, permitindo que cidadãos obtenham respostas rápidas e confiáveis sobre:

* leis municipais
* decretos
* serviços públicos
* procedimentos administrativos
* impostos e taxas
* obras e infraestrutura urbana
* regulamentações municipais

A solução busca melhorar **transparência, acesso à informação e eficiência administrativa**.

---

# Arquitetura do Sistema

O sistema segue uma arquitetura baseada em **Retrieval-Augmented Generation (RAG)** para garantir que as respostas do modelo sejam baseadas em dados reais.

Fluxo simplificado:

```
Usuário
↓
Interface Conversacional
↓
Processamento de Pergunta
↓
Busca Semântica (Vector Search)
↓
Recuperação de Documentos Oficiais
↓
Seleção de Contexto
↓
LLM
↓
Resposta com base em documentos públicos
```

---

# Pipeline de Dados

O projeto inclui um pipeline de ingestão e processamento de dados públicos.

### Coleta de dados

Informações são obtidas através de:

* portais institucionais
* publicações oficiais
* legislação municipal
* documentos administrativos

Utilizando **web scraping automatizado**.

---

### Processamento de documentos

Os dados coletados passam por um pipeline de processamento:

```
Web Scraping
↓
Limpeza de dados
↓
Parsing de documentos
↓
Chunking de texto
↓
Geração de embeddings
↓
Armazenamento vetorial
```

---

# Sistema de Recuperação (RAG)

Os documentos processados são armazenados em um **vector database**, permitindo busca semântica eficiente.

Quando um usuário faz uma pergunta:

1. a pergunta é transformada em embedding
2. o sistema executa busca semântica
3. os documentos mais relevantes são recuperados
4. o contexto é enviado ao LLM
5. o modelo gera uma resposta fundamentada

Esse processo reduz **alucinações do modelo** e garante respostas baseadas em dados públicos.

---

# Dashboard Analítico

Além do assistente conversacional, o projeto inclui um **painel analítico** que monitora as interações dos usuários.

O dashboard permite:

* identificar perguntas recorrentes da população
* detectar demandas de serviços públicos
* monitorar temas mais consultados
* gerar insights para gestores públicos

Isso permite transformar as consultas da população em **dados estratégicos para gestão pública**.

---

# Funcionalidades

✔ Consulta de informações públicas em linguagem natural
✔ Recuperação semântica de documentos oficiais
✔ Pipeline de scraping e atualização de dados
✔ Assistente conversacional baseado em LLM
✔ Dashboard analítico de consultas da população
✔ Insights para gestão pública e transparência

---

# Stack Tecnológica

### Inteligência Artificial

* Large Language Models (LLMs)
* Retrieval-Augmented Generation (RAG)
* AI Agents
* Prompt Engineering

---

### Data Engineering

* Web Scraping
* Puppeteer
* Document Processing
* Data Pipelines

---

### Infraestrutura

* Python
* Supabase
* Vector Databases
* REST APIs

---

### Analytics

* BI Dashboards
* Query Monitoring
* Data Insights

---

# 🇺🇸 English Version

# AI Assistant for Municipal Public Information

AI-powered assistant designed to simplify access to **municipal public information** using natural language.

The system enables citizens to query government-related information without manually navigating complex institutional portals or legal documents.

The platform acts as an **intelligent interface for public data**, combining **Retrieval-Augmented Generation (RAG), document processing, and semantic search** to provide grounded answers based on official sources.

---

# Project Objective

The goal of the project is to **reduce friction in accessing public information**, enabling citizens to quickly obtain reliable answers about:

* municipal laws
* decrees
* public services
* administrative procedures
* taxes and fees
* infrastructure works
* municipal regulations

The solution aims to improve **transparency, accessibility, and efficiency in public services**.

---

# System Architecture

The system follows a **Retrieval-Augmented Generation architecture**.

High-level flow:

```
User
↓
Conversational Interface
↓
Query Processing
↓
Semantic Search
↓
Official Document Retrieval
↓
Context Selection
↓
LLM
↓
Answer grounded in public documents
```

---

# Data Pipeline

The project includes an automated public data ingestion pipeline.

### Data collection

Data is collected from:

* government portals
* official publications
* municipal legislation
* administrative documents

Using automated **web scraping pipelines**.

---

### Document processing

Collected data is processed through:

```
Web Scraping
↓
Data Cleaning
↓
Document Parsing
↓
Text Chunking
↓
Embedding Generation
↓
Vector Storage
```

---

# Retrieval System (RAG)

Processed documents are stored in a **vector database**, enabling semantic retrieval.

When a user asks a question:

1. the query is converted into an embedding
2. semantic search is performed
3. the most relevant documents are retrieved
4. context is passed to the LLM
5. the model generates a grounded response

This significantly reduces hallucinations and improves response accuracy.

---

# Analytical Dashboard

The project also includes an **analytical dashboard** that tracks user queries.

The dashboard allows:

* identification of recurring citizen questions
* monitoring of public service demand
* analysis of most consulted topics
* generation of insights for public administrators

This turns citizen interactions into **actionable data for public governance**.

---

# Key Features

✔ Natural language access to public information
✔ Semantic retrieval of official documents
✔ Automated data scraping pipeline
✔ LLM-powered conversational assistant
✔ Public query analytics dashboard
✔ Insights for transparency and governance

---

# Tech Stack

Python
Large Language Models (LLM)
Retrieval-Augmented Generation (RAG)
AI Agents
Web Scraping
Puppeteer
Supabase
Vector Databases
REST APIs
BI & Analytics Dashboards
