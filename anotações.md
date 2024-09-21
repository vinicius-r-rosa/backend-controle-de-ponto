# Anotações

> Este documento contém anotações sobre o projeto, como premissas, implementações futuras, entre outros.

- O README foi escrito para ser mais semelhante ao README de um projeto real, por isso inclui este arquivo de anotações que não existiria em um projeto real.

## Observações gerais

- O `api.yml` e o README original do desafio estão na pasta `docs` para facilitar a leitura e a compreensão do projeto.
- Também na pasta `docs` está o arquivo `api.postman_collection.json` para facilitar a importação das rotas no Postman.
- Também na pasta `docs` está o arquivo `requests.http` para facilitar a execução das rotas usando a extensão REST Client do VSCode.
- Os arquivos de `.env` estão PROPOSITALMENTE no repositório para facilitar a execução do projeto. Num projeto real eu incluiria apenas o `.env.example`.
- A organização das pastas varia de acordo com o projeto. Para este projeto mais simples, optei por separar os arquivos em pastas de acordo com cada 'service' como o Nest cria por padrão. Isso poderia ser diferente em um projeto maior para facilitar o princípio de manutenibilidade.
- Eu particularmente prefiro criar códigos 100% em inglês para garantir uma padronização e facilitar a leitura do código por qualquer pessoa, especialmente em times internacionais. Mas neste projeto, como a descrição do projeto e o `api.yml` estavam em português, eu acabei mesclando português e inglês.
- Eu poderia ter criado um arquivo geral de interfaces para padronizar os tipos de dados, mas como o projeto é pequeno e as interfaces são utilizadas apenas nos próprios arquivos (não tem duplicidade), eu optei por criar as interfaces diretamente nos arquivos que as utilizam.
- O "index da API" ("/") foi mantido para retornar apenas "Hello World" como na inicialização do Nest, mas num projeto real este endpoint poderia ser modificado para retornar informações úteis sobre a API.
- Pelo `api.yml` considerei como uma aplicação pt-BR apenas, mas, para um projeto real, eu criaria um arquivo de configuração para permitir a internacionalização da aplicação.

## Regras de Negócio ATUAIS

- Todos os funcionários têm uma jornada de 8h de trabalho.
- Só são contabilizadas como horas trabalhadas e horas excedentes os dias que possuem as 4 marcações de ponto, sendo elas:
  - Início do expediente
  - Início do intervalo
  - Fim do intervalo
  - Fim do expediente
- A jornada de trabalho deve ser obrigatoriamente realizada das 06:00 até no máximo 20:00.
- O intervalo entre as batidas deve ser no mínimo de 15 minutos.

## Implementações futuras

### Mocks e Testes

- Criar mocks para rodar o projeto localmente sem depender de um banco de dados, para serem utilizados nos testes, etc

### Autenticação e Autorização

- Criar endpoints para autenticação e autorização OU receber as informações de autenticação e autorização via requisição HTTP.
- Criar roles para que os "funcionários" possam acessar apenas os endpoints de marcação de ponto e os "gestores" possam acessar todos os endpoints.
- Permitir que o "gestor" inclua, modifique ou delete registros do ponto eletrônico para os "funcionários".

### Localização, Fuso Horário e Internacionalização

- Implementar uma lógica que utilize a localidade do usuário para calcular o fuso horário de forma dinâmica.
- Internacionalizar a aplicação para pt-BR e en-US. Como: Logs, mensagens de erro, mensagens de sucesso, mensagens de validação, etc.

### CI/CD e Configuração

- Escrever os arquivos de configuração dos pipelines de CI/CD.
- Generalizar alguns pontos do projeto para possibilitar de forma automática ter diferentes ambientes (dev, qa, prod, etc).

### Middlewares e Wrappers

- Criar um wrapper de logs para padronizar os logs e estruturar os logs da aplicação, além de permitir alterar o nível de log via variável de ambiente.
- Criar um middleware para tratar erros e padronizar as respostas de erro da aplicação.
- Criar um middleware para tratar a autenticação e autorização dos usuários.

### Jornadas de Trabalho e Projetos

- Permitir jornadas de trabalho diferentes para cada funcionário.
- Permitir lançar horas em projetos específicos.
- Permitir adicional de periculosidade, insalubridade, noturno, etc.

### Batidas de Ponto

- Permitir que o usuário informe a localização da batida de ponto.
- Permitir que o usuário informe o tipo de batida de ponto (início do expediente, início do intervalo, fim do intervalo, fim do expediente).
- Permitir que o usuário informe o projeto da batida de ponto.
- Adicionar/Modificar/Excluir uma batida de ponto. Para usuários com perfil de gestor.

### Relatórios

- Relatório de horas trabalhadas por funcionário.
- Relatório de horas trabalhadas por projeto.
- Relatório por período personalizado e não apenas por ano e mês.
