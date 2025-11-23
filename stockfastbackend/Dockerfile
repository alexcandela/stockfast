FROM php:8.3-apache

# Instalar dependencias del sistema y extensiones PHP necesarias
RUN apt-get update && apt-get install -y libpq-dev unzip git zip libzip-dev \
    && docker-php-ext-install pdo pdo_pgsql pgsql zip \
    && a2enmod rewrite

# Copiar archivo composer desde la imagen oficial
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Establecer directorio de trabajo
WORKDIR /var/www/html

# Copiar todo el código al contenedor
COPY . .

# Ajustar permisos para Laravel
RUN chown -R www-data:www-data storage bootstrap/cache

# Instalar dependencias PHP con Composer optimizadas para producción
RUN composer install --optimize-autoloader --no-interaction

# Exponer puerto 80 para HTTP
EXPOSE 80

# Apache corre automáticamente al iniciar el contenedor