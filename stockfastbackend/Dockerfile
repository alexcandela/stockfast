# Etapa 1: Builder con PHP 8.4 y Composer
FROM php:8.4-apache AS builder

# Instala dependencias de sistema y extensiones PHP necesarias para Laravel y PostgreSQL
RUN apt-get update && apt-get install -y --no-install-recommends \
    git unzip libpq-dev libzip-dev zip \
    && docker-php-ext-install pdo_pgsql

# Copia Composer desde la imagen oficial
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Directorio de trabajo
WORKDIR /var/www/html

# Copia composer.json y composer.lock para usar cache Docker
COPY composer.json composer.lock ./

# Instalar dependencias composer optimizadas para producción
RUN composer install --no-dev --optimize-autoloader

# Copia el resto del código
COPY . .

# Crear carpetas Laravel necesarias y dar permisos
RUN mkdir -p storage/framework/views storage/framework/cache storage/logs bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Enlazar storage para acceso a archivos públicos
RUN php artisan storage:link

# Etapa 2: Imagen final con Apache
FROM php:8.4-apache

# Copiar dependencias y aplicación desde builder
COPY --from=builder /var/www/html /var/www/html
COPY --from=builder /usr/local/bin/composer /usr/local/bin/composer

# Instalar librerías runtime necesarias
RUN apt-get update && apt-get install -y --no-install-recommends libpq-dev libzip-dev libicu-dev libonig-dev \
    && apt-get autoremove -y && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/*

# Configurar Apache para usar /public como DocumentRoot
RUN a2enmod rewrite \
    && sed -i 's|DocumentRoot /var/www/html|DocumentRoot /var/www/html/public|' /etc/apache2/sites-available/000-default.conf

# Evitar warning Apache con ServerName
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

WORKDIR /var/www/html

# Exponer puerto 80 para Railway
EXPOSE 80

# CMD para arrancar Apache en primer plano
CMD ["apache2-foreground"]