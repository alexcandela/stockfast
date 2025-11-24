# Etapa 1: Builder con PHP 8.4 y Composer
FROM php:8.4-apache AS builder

# Instala dependencias de sistema y extensiones PHP necesarias para Laravel y PostgreSQL
RUN apt-get update && apt-get install -y --no-install-recommends \
    git unzip libpq-dev libonig-dev libssl-dev libxml2-dev libcurl4-openssl-dev \
    libicu-dev libzip-dev zip \
    && docker-php-ext-install -j$(nproc) \
    pdo_mysql pdo_pgsql pgsql opcache intl zip bcmath soap \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apt-get autoremove -y && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Directorio de trabajo
WORKDIR /var/www/html

# Copia el código y el composer.lock primero (para aprovechar caché)
COPY composer.json composer.lock ./

# Instala dependencias composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    && composer install --no-dev --optimize-autoloader --no-interaction --no-progress --prefer-dist

# Copia el resto del código fuente
COPY . .

# Ajusta permisos para storage y bootstrap/cache
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Etapa 2: Producción con Apache + PHP
FROM php:8.4-apache

# Copia las extensiones y configuraciones del builder
COPY --from=builder /usr/local/lib/php/extensions/ /usr/local/lib/php/extensions/
COPY --from=builder /usr/local/etc/php/conf.d/ /usr/local/etc/php/conf.d/
COPY --from=builder /usr/local/bin/docker-php-ext-* /usr/local/bin/
COPY --from=builder /var/www/html /var/www/html

# Instala librerías necesarias en producción y limpia cache apt
RUN apt-get update && apt-get install -y --no-install-recommends libpq-dev libzip-dev libicu-dev libonig-dev \
    && apt-get autoremove -y && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Define ServerName para eliminar warning de Apache
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Configura Apache: activa mod_rewrite y usa /public como DocumentRoot
RUN a2enmod rewrite \
  && sed -i 's|DocumentRoot /var/www/html|DocumentRoot /var/www/html/public|' /etc/apache2/sites-available/000-default.conf

# Asegura permisos correctos en carpetas críticas de Laravel
RUN chown -R www-data:www-data storage bootstrap/cache \
  && chmod -R 775 storage bootstrap/cache

WORKDIR /var/www/html

# Expone puerto 80 que Railway usará para HTTP
EXPOSE 80

# Comando para aplicar migraciones y arrancar Apache en primer plano
CMD ["apache2-foreground"]
