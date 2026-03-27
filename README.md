# 💰 Sistema de Controle de Gastos Residenciais

Este repositório contém a solução completa para o desafio técnico de implementação de um sistema de controle de gastos residenciais.  
O projeto foi desenvolvido no formato de **Monorepo**, contendo uma API RESTful robusta no backend e uma interface de usuário moderna e responsiva no frontend. O foco principal foi a aplicação de princípios de arquitetura limpa, separação de responsabilidades e aderência estrita às regras de negócio.

---

## 🚀 Tecnologias e Ferramentas

### ⚙️ Backend
Desenvolvido em **C# com .NET 8**, utilizando uma arquitetura N-Layer focada no domínio.
* **Entity Framework Core:** ORM para mapeamento objeto-relacional.
* **SQLite:** Banco de dados relacional leve (escolhido para facilitar a execução local, sem necessidade de containers ou setups complexos).
* **xUnit:** Framework para testes unitários automatizados.
* **Moq:** Framework para criação de mocks nos testes.
* **Swagger/OpenAPI:** Documentação interativa e testes manuais da API.

### 🎨 Frontend
Desenvolvido em **React** (via Vite), garantindo alta performance e tipagem estática.
* **TypeScript:** Para garantir a integridade dos dados e contratos (interfaces) com a API.
* **Tailwind CSS (v4):** Framework utilitário para estilização fluida e moderna.
* **React Router DOM:** Gerenciamento de rotas (SPA).
* **Axios:** Cliente HTTP para comunicação com o backend.

---

## 🏗️ Estrutura e Arquitetura

### Arquitetura do Backend
O backend foi dividido nas seguintes camadas para garantir escalabilidade e fácil manutenção:

1. **`Gastos.Domain`** – O núcleo. Contém as **Entidades** (`Pessoa`, `Categoria`, `Transacao`) e **Enumerações**.
2. **`Gastos.Infrastructure`** – Acesso a dados. Gerencia o `DbContext` e configurações como a **deleção em cascata**.
3. **`Gastos.Application`** – A camada de negócio. Contém os **DTOs** (Data Transfer Objects) e os **Serviços** (ex: `TransacaoService`), onde as regras de negócio são validadas antes da persistência.
4. **`Gastos.Api`** – A porta de entrada. Contém os **Controllers** e as configurações de injeção de dependência, CORS e Swagger.
5. **`Gastos.Tests`** – Projeto de garantia de qualidade, com testes unitários cobrindo a camada de aplicação.

### 🧠 Regras de Negócio Implementadas
Todas as regras solicitadas no desafio técnico foram rigorosamente implementadas no `TransacaoService`:

* **Restrição de Idade:** Pessoas menores de 18 anos podem registrar apenas **despesas**; receitas são bloqueadas.
* **Compatibilidade de Categoria:** O sistema valida se o tipo da transação corresponde à finalidade da categoria vinculada.
* **Valores Válidos:** Transações com valores zerados ou negativos são rejeitadas.
* **Exclusão em Cascata:** A exclusão de uma Pessoa resulta na exclusão automática de todas as suas transações vinculadas.

### 🔄 Tratamento de Erros e Ciclos de Serialização
* **DTOs** foram criados para evitar ciclos de referência (ex: `Transacao` → `Pessoa` → `Transacoes`). A API nunca retorna entidades diretamente, garantindo respostas limpas e sem loops.
* O **frontend** trata os erros de forma estruturada: extrai a mensagem enviada pelo backend (campo `erro`) e exibe feedbacks claros no formulário.

---

## ⚙️ Como Executar o Projeto Localmente

### Pré-requisitos
* [Node.js](https://nodejs.org/) (v18 ou superior)
* [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)

### 1. Rodando o Backend (API)

Abra um terminal na raiz do projeto e siga os passos:

```bash
# Navegue até a pasta do backend
cd backend

# Restaure as dependências e compile o projeto
dotnet build

# O banco de dados (gastos.db) será gerado automaticamente. Inicie o servidor:
dotnet run --project Gastos.Api/Gastos.Api.csproj
```

A API estará rodando. Anote a porta que aparecerá no terminal (ex: `http://localhost:5066`).  
Você pode acessar o Swagger em: `http://localhost:<porta>/swagger`


### 2. Configurando e Rodando o Frontend

Por boas práticas e segurança, o arquivo de variáveis de ambiente (`.env`) não é versionado. É necessário criá-lo localmente antes de rodar.

Abra um novo terminal na raiz do projeto e siga os passos:

```bash
# Navegue até a pasta do frontend
cd frontend

# Instale as dependências do Node
npm install


**Crie o arquivo de ambiente:** Na pasta `frontend`, você encontrará um arquivo chamado `.env.example`. Copie-o, renomeie a cópia para **`.env`** e certifique-se de que a porta informada nele corresponde à porta em que a sua API está rodando:

```env
VITE_API_URL=http://localhost:5066/api
```

*Nota: o valor deve ser exatamente a URL base da API, incluindo `/api` no final.*

Após configurar o ambiente, inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse a aplicação no navegador pelo link gerado (geralmente `http://localhost:5173`).

---

## 📁 Estrutura de Pastas do Projeto

```
controle-gastos-residenciais/
├── backend/
│   ├── Gastos.Api/               # Controllers, Program.cs, configurações
│   ├── Gastos.Application/       # DTOs, Serviços (regras de negócio)
│   ├── Gastos.Domain/            # Entidades, Enums
│   ├── Gastos.Infrastructure/    # DbContext, migrações, repositórios
│   ├── Gastos.Tests/             # Testes unitários
│   └── controle-gastos.db        # Banco SQLite (gerado automaticamente)
├── frontend/
│   ├── src/
│   │   ├── api.ts                # Cliente Axios com tratamento de erro estruturado
│   │   ├── types.ts              # Interfaces TypeScript (Pessoa, Transacao, etc.)
│   │   └── pages/                # Páginas da aplicação (Transacoes, etc.)
│   ├── .env.example              # Modelo de variáveis de ambiente
│   └── package.json
└── README.md                     # Este arquivo
```

---

## 🧪 Testes

Os testes unitários estão localizados no projeto `Gastos.Tests` e podem ser executados com:

```bash
cd backend
dotnet test
```

Eles cobrem as regras de negócio implementadas no `TransacaoService`, garantindo que as validações de idade, categoria e valores estejam funcionando corretamente.

---

## 📌 Observações Importantes

- O **banco de dados SQLite** (`gastos.db`) é criado na primeira execução da API. Não é necessário nenhum passo adicional.
- O arquivo `.env` do frontend **não deve ser versionado**. Foi incluído um arquivo `.env.example` para facilitar a configuração.
- A política de **CORS** está configurada para permitir requisições de qualquer origem durante o desenvolvimento. Em produção, isso deve ser ajustado.
