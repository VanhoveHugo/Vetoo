#!/bin/bash

# Attendre que MySQL soit prêt
until mysql -h$MYSQL_HOST -P$MYSQL_PORT -uroot -proot -e ";" 2>/dev/null; do
    >&2 echo "MySQL n'est pas encore disponible - en attente..."
    sleep 1
done

# Exécuter le script SQL
mysql -h$MYSQL_HOST -P$MYSQL_PORT -uroot -proot < ./setup.sql

# Démarrer le serveur
exec "$@"