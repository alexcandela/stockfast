# Usa la imagen oficial de PHP 8.3 con Apache
FROM php:8.3-apache

# Instala dependencias y extensiones necesarias para Laravel y PostgreSQL
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql pgsql \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Instala Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copia todo el código al directorio Apache
COPY ./ /var/www/html

# Establece el directorio de trabajo
WORKDIR /var/www/html

# Copia archivo .env de ejemplo si no existe (opcional)
RUN cp .env.example .env

# Instala dependencias PHP con Composer
RUN composer install --optimize-autoloader --no-scripts --no-interaction

# Configura permisos para storage y cache para que Apache pueda escribir logs y caché
RUN chown -R www-data:www-data storage bootstrap/cache
RUN chmod -R 775 storage bootstrap/cache

# Configura Apache para servir desde la carpeta public y habilita mod_rewrite
RUN echo "DocumentRoot /var/www/html/public" > /etc/apache2/sites-available/000-default.conf && \
    a2enmod rewrite

# Copia el script entrypoint y dale permisos para ejecución
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expone puerto 80
EXPOSE 80

# Usar entrypoint para comandos Artisan en runtime y luego ejecutar Apache
CMD ["/entrypoint.sh"]