# 💰 Sistema de Controle de Gastos Residenciais

Este repositório contém a solução completa para o desafio técnico de implementação de um sistema de controle de gastos residenciais. 

O projeto foi desenvolvido no formato de **Monorepo**, contendo uma API RESTful robusta no backend e uma interface de usuário moderna e responsiva no frontend. O foco principal do desenvolvimento foi a aplicação de princípios de arquitetura limpa, separação de responsabilidades e aderência estrita às regras de negócio.

---

## 🚀 Tecnologias e Ferramentas

### ⚙️ Backend
Desenvolvido em **C# com .NET 8**, utilizando uma arquitetura N-Layer focada no domínio.
* **Entity Framework Core:** ORM para mapeamento objeto-relacional.
* **SQLite:** Banco de dados relacional leve (escolhido para facilitar a execução local pelos avaliadores, sem necessidade de containers Docker ou setups complexos de SGDBs).
* **xUnit:** Framework para testes unitários automatizados.
* **Swagger/OpenAPI:** Documentação interativa e testes manuais da API.

### 🎨 Frontend
Desenvolvido em **React** (via Vite), garantindo alta performance e tipagem estática.
* **TypeScript:** Para garantir a integridade dos dados e contratos (interfaces) com a API.
* **Tailwind CSS (v4):** Framework utilitário para estilização fluida, moderna e sem arquivos CSS globais inflados.
* **React Router DOM:** Gerenciamento de rotas (SPA).
* **Axios:** Cliente HTTP para comunicação com o backend.

---

## 🏗️ Estrutura e Arquitetura

### Arquitetura do Backend
O backend foi dividido nas seguintes camadas para garantir escalabilidade e fácil manutenção:
1.  **`Gastos.Domain`:** O núcleo. Contém as Entidades (`Pessoa`, `Categoria`, `Transacao`) e Enumerações.
2.  **`Gastos.Infrastructure`:** Acesso a dados. Gerencia o `DbContext` e configurações como a **deleção em cascata**.
3.  **`Gastos.Application`:** O cérebro. Contém os DTOs e os Serviços (ex: `TransacaoService`), onde as regras de negócio são validadas antes de qualquer persistência.
4.  **`Gastos.Api`:** A porta de entrada. Contém os Controllers e as configurações de Injeção de Dependência e CORS.
5.  **`Gastos.Tests`:** Projeto de garantia de qualidade cobrindo a camada de aplicação.

### 🧠 Regras de Negócio Implementadas
Todas as regras solicitadas no desafio técnico foram estritamente implementadas no `TransacaoService`:
* **Restrição de Idade:** Usuários menores de 18 anos são bloqueados ao tentar registrar receitas (apenas despesas permitidas).
* **Compatibilidade de Categoria:** O sistema valida se o tipo da transação corresponde à finalidade da categoria vinculada.
* **Valores Válidos:** Transações com valores zerados ou negativos são rejeitadas.
* **Exclusão em Cascata:** A exclusão de uma Pessoa resulta na exclusão automática de todas as suas transações vinculadas.

---

## ⚙️ Como Executar o Projeto Localmente

### Pré-requisitos
* [Node.js](https://nodejs.org/) (v18 ou superior)
* [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)

### 1. Rodando o Backend (API)
Abra um terminal e siga os passos:

```bash
# Navegue até a pasta do backend
cd backend

# Restaure as dependências e compile o projeto
dotnet build

# O banco de dados (gastos.db) será gerado automaticamente. Inicie o servidor:
dotnet run --project Gastos.Api/Gastos.Api.csproj