# Usa una imagen base de Node.js 20
FROM node:20-alpine

# Instalar bash en Alpine Linux
RUN apk add --no-cache bash

# Define el directorio de trabajo en el contenedor
RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

# Copia los archivos de tu proyecto al contenedor
COPY . /usr/src/app

RUN chmod +x /usr/src/app/run-it.sh
RUN chmod +x /usr/src/app/wait-for-it.sh

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

RUN npm cache clean --force
RUN npm install

# Compila el backend
RUN npm run build

CMD [ "bash", "run-it.sh" ]