#!/bin/bash

# Attendre que MySQL soit prêt
until mysql -h "$MYSQL_HOST" -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" -e "select 1" > /dev/null 2>&1; do
    >&2 echo "MySQL n'est pas encore disponible - en attente..."
    sleep 1
done

# Exécuter le script SQL
until mysql -h "$MYSQL_HOST" -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" -e "select 1" > /dev/null 2>&1; do

# Démarrer le serveur
exec "$@"