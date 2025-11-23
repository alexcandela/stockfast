#!/bin/bash
# Copia archivo .env si no existe (opcional)
if [ ! -f .env ]; then
  cp .env.example .env
fi

# Genera key, jwt y limpia/recachea la configuración usando las variables en runtime
php artisan key:generate
php artisan jwt:secret --force

php artisan config:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Ejecuta migraciones en la base de datos con las variables reales
php artisan migrate --force

# Arranca Apache en primer plano
apache2-foreground
