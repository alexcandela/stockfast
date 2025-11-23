FROM php:8.3-apache

RUN apt-get update && apt-get install -y libpq-dev unzip git zip libzip-dev \
    && docker-php-ext-install pdo pdo_pgsql pgsql zip

RUN sed -i 's|/var/www/html|/var/www/html/public|g' /etc/apache2/sites-available/000-default.conf \
    && a2enmod rewrite

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

RUN composer install --optimize-autoloader --no-interaction

EXPOSE 80