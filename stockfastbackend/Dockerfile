# Stage 1: Build environment and Composer dependencies
FROM php:8.4-apache AS builder

# Instalar dependencias del sistema y PHP necesarias para Laravel y PostgreSQL
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    unzip \
    libpq-dev \
    libonig-dev \
    libssl-dev \
    libxml2-dev \
    libcurl4-openssl-dev \
    libicu-dev \
    libzip-dev \
    zip \
    && docker-php-ext-install -j$(nproc) \
    pdo_mysql \
    pdo_pgsql \
    pgsql \
    opcache \
    intl \
    zip \
    bcmath \
    soap \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apt-get autoremove -y && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Copiar la aplicación completa para que Composer pueda ejecutar scripts post-install
WORKDIR /var/www/html
COPY . .

# Instalar Composer y dependencias sin dev para producción
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    && composer install --no-dev --optimize-autoloader --no-interaction --no-progress --prefer-dist

# Ajustar permisos para las carpetas de storage y bootstrap/cache
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Stage 2: Producción con Apache + PHP
FROM php:8.4-apache

# Copiar extensiones y configuraciones desde la etapa build
COPY --from=builder /usr/local/lib/php/extensions/ /usr/local/lib/php/extensions/
COPY --from=builder /usr/local/etc/php/conf.d/ /usr/local/etc/php/conf.d/
COPY --from=builder /usr/local/bin/docker-php-ext-* /usr/local/bin/
COPY --from=builder /var/www/html /var/www/html

# Instalar librerías de tiempo de ejecución para PostgreSQL y limpiar cache apt
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev libzip-dev libicu-dev libonig-dev \
    && apt-get autoremove -y && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Configurar Apache: activar mod_rewrite y ajustar DocumentRoot a /public
RUN a2enmod rewrite \
    && sed -i 's|DocumentRoot /var/www/html|DocumentRoot /var/www/html/public|' /etc/apache2/sites-available/000-default.conf

# Ajustar permisos para almacenamiento y cache
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

WORKDIR /var/www/html

# Exponer puerto 80 para Railway
EXPOSE 80

# Comando para aplicar migraciones y arrancar Apache en primer plano
CMD /bin/sh -c "php artisan migrate --force && apache2-foreground"