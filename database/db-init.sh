#!/bin/bash
sleep 30s

echo "running set up script"

/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -C  -i /db-init.sql
