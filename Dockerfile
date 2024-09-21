# Usar a imagem do Node.js
FROM node:20

# Definir o fuso horário
ENV TZ=America/Sao_Paulo
RUN apt-get update && apt-get install -y tzdata

# Definir o diretório de trabalho
WORKDIR /app

# Copiar o package.json e o package-lock.json
COPY package*.json ./

# Instalar as dependências
RUN npm install date-fns-tz --legacy-peer-deps

# Copiar o restante dos arquivos do projeto
COPY . .

# Compilar o projeto NestJS
RUN npm run build

# Expor a porta 3000
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["npm", "run", "start:prod"]
