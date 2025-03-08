#!/bin/bash

# Start the script to create the DB and user and show the logs
# echo "Running database configuration script..."
# sh /usr/src/app/configure-db.sh

# Start SQL Server and show the logs
# echo "Starting SQL Server..."
# sh /opt/mssql/bin/sqlservr

#!/usr/bin/env bash
echo "-> starting prisma migrations to postgres...\n"
cd /usr/src/app/
./wait-for-it.sh bo_athor_db:1433 -t 40 -- echo "db online\n"
# npm run migrate:save --name init_prod
# npm run migrate:up
sleep 5
npm run prisma:deploy
npm run start:prod