# Dockerfile-db
FROM mcr.microsoft.com/mssql/server:2019-latest

USER root

# Establece las variables de entorno necesarias para SQL Server
ENV ACCEPT_EULA=Y
ENV SA_PASSWORD=${SA_PASSWORD}

# Copia los archivos necesarios
COPY ./entrypoint.sh /entrypoint.sh
COPY ./db-init.sh /db-init.sh
COPY ./db-init.sql /db-init.sql


RUN chmod +x /entrypoint.sh /db-init.sh /db-init.sql

# Define el comando para iniciar SQL Server
CMD /bin/bash /entrypoint.sh