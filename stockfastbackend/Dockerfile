FROM php:8.3-fpm

# Instalar extensiones necesarias, por ejemplo:
RUN apt-get update && apt-get install -y libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql pgsql

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copiar código y archivos composer.json y composer.lock
WORKDIR /var/www/html
COPY . .

# Instalar dependencias con Composer
RUN composer install --optimize-autoloader --no-interaction

# Configurar permisos, variables y puertos según necesites

CMD php-fpm

# Exponer puerto de la app, por ejemplo 9000
EXPOSE 9000