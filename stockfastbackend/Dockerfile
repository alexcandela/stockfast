FROM php:8.3-apache

# Instalar extensiones necesarias para PostgreSQL y Laravel
RUN apt-get update && apt-get install -y libpq-dev unzip git \
    && docker-php-ext-install pdo pdo_pgsql pgsql zip

# Habilitar módulo rewrite para Laravel
RUN a2enmod rewrite

# Copiar código fuente al directorio público de Apache
COPY . /var/www/html

# Ajustar permisos, si es necesario
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Instalar dependencias con Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
WORKDIR /var/www/html
RUN composer install --optimize-autoloader --no-interaction

# Exponer puerto 80
EXPOSE 80

# Apache ya está configurado para correr como proceso principal