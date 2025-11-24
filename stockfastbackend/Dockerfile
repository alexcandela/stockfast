FROM php:8.4-apache

# Instalar dependencias de sistema y extensiones PHP necesarias
RUN apt-get update && apt-get install -y \
    git unzip libpq-dev libzip-dev zip \
    && docker-php-ext-install pdo_pgsql zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copiar Composer desde la imagen oficial
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copiar todo el proyecto
COPY . .

# Instalar dependencias composer optimizadas
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress

# Crear carpetas y ajustar permisos esenciales para Laravel
RUN mkdir -p storage/framework/{sessions,views,cache} \
    storage/logs \
    bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Configurar Apache: habilitar mod_rewrite
RUN a2enmod rewrite

# Configurar VirtualHost completo con AllowOverride
RUN echo '<VirtualHost *:80>\n\
    ServerName localhost\n\
    DocumentRoot /var/www/html/public\n\
    \n\
    <Directory /var/www/html/public>\n\
        Options Indexes FollowSymLinks\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
    \n\
    ErrorLog ${APACHE_LOG_DIR}/error.log\n\
    CustomLog ${APACHE_LOG_DIR}/access.log combined\n\
</VirtualHost>' > /etc/apache2/sites-available/000-default.conf

# Evitar warning Apache por ServerName indefinido
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Exponer puerto 80 para la app
EXPOSE 80

# Arrancar Apache en primer plano
CMD ["apache2-foreground"]