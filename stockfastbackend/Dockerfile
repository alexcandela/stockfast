FROM php:8.2-fpm

# Instalar dependencias del sistema y extensiones PHP necesarias
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    libzip-dev \
    zip \
    && docker-php-ext-install pdo_pgsql zip

# Copiar Composer desde la imagen oficial
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Establecer directorio de trabajo
WORKDIR /var/www/html

# Copiar el código fuente
COPY . .

# Instalar dependencias de Laravel optimizadas para producción
RUN composer install --no-dev --optimize-autoloader

# Crear carpetas necesarias y dar permisos
RUN mkdir -p storage/framework/views storage/framework/cache storage/logs bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Enlazar storage
RUN php artisan storage:link

# Exponer el puerto 8000
EXPOSE 8000

# Comando para ejecutar migraciones, limpiar cachés y arrancar el servidor Laravel integrado
CMD ["/bin/sh", "-c", "php artisan migrate --force && php artisan config:clear && php artisan cache:clear && php artisan route:clear && php artisan view:clear && php artisan serve --host=0.0.0.0 --port=8000"]