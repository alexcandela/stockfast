FROM php:8.3-apache

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql pgsql \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY ./ /var/www/html

WORKDIR /var/www/html

RUN composer install --optimize-autoloader --no-scripts --no-interaction

RUN chown -R www-data:www-data storage bootstrap/cache

RUN echo "DocumentRoot /var/www/html/public" > /etc/apache2/sites-available/000-default.conf && \
    a2enmod rewrite

RUN php artisan key:generate
RUN php artisan config:cache
RUN php artisan route:cache
RUN php artisan view:cache
RUN php artisan jwt:secret --force

EXPOSE 80

CMD ["apache2-foreground"]