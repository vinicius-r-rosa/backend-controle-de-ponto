# Controle de Ponto

> OBS: Veja o arquivo [anotações.md](anotações.md) para mais informações complementares sobre o projeto.
> API para gerenciamento do controle de ponto eletrônico de funcionários.

Esta API foi desenvolvida para facilitar o registro e a visualização do ponto eletrônico de funcionários em uma empresa. Os funcionários podem registrar seus horários de início de jornada, início de intervalo, fim de intervalo e fim de jornada. Os gestores podem, por sua vez, visualizar os registros de ponto dos funcionários.

## Tecnologias Utilizadas

A API foi construída com as seguintes tecnologias:

- **[NestJS](https://nestjs.com/)**: um framework para construir aplicações server-side eficientes e escaláveis em Node.js.
- **[TypeScript](https://www.typescriptlang.org/)**: um superconjunto de JavaScript que adiciona tipagem estática e outros recursos.
- **[Docker](https://www.docker.com/)**: plataforma para criar, testar e implantar aplicações rapidamente.
- **[MongoDB](https://www.mongodb.com/)**: banco de dados NoSQL orientado a documentos.

### Bibliotecas Auxiliares

- **[class-validator]**: para validação de dados.
- **[date-fns]**: para manipulação de datas.
- **[mongoose]**: para modelagem de dados e ORM.
- **[jest]**: para testes unitários.

## Estrutura do Projeto

A estrutura da API está organizada da seguinte forma:

``` text
/src
├── /app
│   ├── Arquivos relativos ao APP
├── /batida
│   ├── Arquivos relativos a Batida
├── /relatorio
│   ├── Arquivos relativos a Relatório
├── /expediente
│   ├── Arquivos relativos a Expediente
├── config.ts
│   ├── Arquivo de configuração da aplicação
├── main.ts
│   ├── Arquivo de inicialização da aplicação
├── utils.ts
│   ├── Funções utilitárias
```

---

## Pré-requisitos

Antes de executar o Controle de Ponto, certifique-se de ter os seguintes itens instalados:

- **Docker**
  - Docker (Engine)
  - Docker Compose

## Configuração Inicial com Docker

> Execute estas etapas a primeira vez que for configurar o projeto do zero.

1. Clone o repositório do projeto:

   ```bash
   git clone https://github.com/vinicius-r-rosa/backend-controle-de-ponto.git
   ```

2. Navegue até a pasta do projeto:

   ```bash
   cd backend-controle-de-ponto
   ```

3. Construa e inicie a imagem do Docker:

   ```bash
   docker-compose up --build
   ```

## Execução do Serviço Localmente com Docker

> Siga estes passos sempre que for iniciar o serviço localmente.

1. Navegue até a pasta do projeto:

   ```bash
   cd backend-controle-de-ponto
   ```

2. Inicie o serviço:

   ```bash
   docker-compose up
   ```

## Execução de Testes com Docker

> Para rodar os testes, siga estas etapas:

1. Navegue até a pasta do projeto:

   ```bash
   cd backend-controle-de-ponto
   ```

2. Execute os testes:

   ```bash
   docker-compose run --rm api npm run test
   ```

---

## Contribuindo

Quando for contribuir utilize [conventional commits](https://www.conventionalcommits.org) para suas mensagens de commit.

### Estrutura de Mensagens de Commit

Use o formato: `<tipo>[escopo opcional]: <descrição>`.

#### Tipos Válidos

- **fix**: correção de um bug (relaciona-se ao PATCH do Versionamento Semântico).
- **feat**: introdução de um novo recurso (relaciona-se ao MINOR).
- **breaking change or \<tipo\>!**: introduz uma mudança de API quebrada (relaciona-se ao MAJOR).
- **chore**: alterações que não se relacionam com correções ou recursos.
- **refactor**: refatoração de código que não corrige bugs nem adiciona recursos.

#### Exemplos de Mensagens

- Mensagem de commit com descrição: `feat: permitir que o objeto de configuração fornecido estenda outros configs`
- Mensagem de commit com ! para chamar a atenção para a mudança quebrada: `feat!: enviar um e-mail ao cliente quando um produto é enviado`
- Mensagem de commit com escopo: `feat(lang): adicionar idioma polonês`

### Lista de Contribuidores

> Para mais informações, você pode entrar em contato com os seguintes colaboradores:

- <vinirodrosa@gmail.com>
