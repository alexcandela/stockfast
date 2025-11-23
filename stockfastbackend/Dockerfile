# Usa la imagen oficial de PHP 8.3 con Apache
FROM php:8.3-apache

# Instala las extensiones necesarias para Laravel y PostgreSQL
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql pgsql

# Instala Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copia el código fuente al directorio de Apache
COPY . /var/www/html

# Establece el directorio de trabajo
WORKDIR /var/www/html/stockfastbackend

# Instala dependencias de Composer
RUN composer install --optimize-autoloader --no-scripts --no-interaction

# Configura los permisos para storage y bootstrap/cache
RUN chown -R www-data:www-data storage bootstrap/cache

# Expone el puerto 80
EXPOSE 80

# Comando para lanzar Apache en primer plano
CMD ["apache2-foreground"]