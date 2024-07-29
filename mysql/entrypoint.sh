#!/bin/bash

# Fonction pour vérifier si MySQL est accessible
mysql_is_up() {
    mysql -h "$MYSQL_HOST" -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" -e "select 1" > /dev/null 2>&1
}

# Attendre que MySQL soit accessible pendant un temps limité
wait_time=60  # Temps maximum d'attente en secondes
elapsed_time=0

until mysql_is_up || [ $elapsed_time -gt $wait_time ]; do
    echo "MySQL n'est pas encore disponible - en attente..."
    sleep 1
    elapsed_time=$((elapsed_time + 1))
done

# Vérifier si MySQL est maintenant accessible
if mysql_is_up; then
    echo "MySQL est prêt à accepter des connexions."
else
    echo "Échec de la connexion à MySQL après $wait_time secondes. Arrêt du script."
    exit 1
fi

# Démarrer le serveur ou d'autres commandes passées en arguments
exec "$@"
