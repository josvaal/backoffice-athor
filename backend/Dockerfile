# Usa una imagen base de Node.js 20
FROM node:20-alpine

# Instalar bash en Alpine Linux
RUN apk add --no-cache bash

# Define el directorio de trabajo en el contenedor
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Copia los archivos de tu proyecto al contenedor
COPY . /usr/src/app

# RUN chmod +x /usr/src/app/wait-for-it.sh
# RUN chmod +x /usr/src/app/entrypoint.sh
RUN chmod +x /usr/src/app/run-it.sh
RUN chmod +x /usr/src/app/wait-for-it.sh
RUN chmod +x /usr/src/app/configure-db.sh

# ARG for build-time environment variables
ARG DATABASE_URL

# Set the environment variable for the build process
ENV DATABASE_URL=${DATABASE_URL}

RUN npm cache clean --force
# Instala las dependencias del proyecto
RUN npm install


# Compila el backend
RUN npm run build

# Expose el puerto donde tu aplicación NestJS correrá
EXPOSE 3000

# Ejecuta las migraciones de Prisma si es necesario (suponiendo que tienes un script de migración)
# RUN ./wait-for.sh bo_athor_db:1735 -- npx prisma migrate deploy
# RUN npx prisma migrate deploy

# Comando para ejecutar el proyecto
# CMD ["/usr/src/app/run-it.sh"]
CMD ["bash", "./run-it.sh"]
# CMD ["sh", "-c", "tail -f /dev/null"]
# CMD ["./wait-for.sh", "bo_athor_db:1735", "--", "npm", "run", "start:prod"]
# CMD ["npm", "run", "start:prod"]