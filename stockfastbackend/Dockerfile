FROM php:8.3-apache

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    zip \
    libzip-dev \
    pkg-config \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql pgsql zip bcmath fileinfo \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY ./ /var/www/html

WORKDIR /var/www/html

RUN cp .env.example .env

RUN composer install --optimize-autoloader --no-scripts --no-interaction

RUN chown -R www-data:www-data storage bootstrap/cache
RUN chmod -R 775 storage bootstrap/cache

RUN echo "DocumentRoot /var/www/html/public" > /etc/apache2/sites-available/000-default.conf
RUN a2enmod rewrite

EXPOSE 80

CMD sh -c "\
  php artisan migrate --force || true && \
  php artisan config:clear && \
  php artisan cache:clear && \
  php artisan route:clear && \
  php artisan view:clear && \
  php artisan key:generate && \
  php artisan jwt:secret --force && \
  apache2-foreground"