FROM php:8.3-apache

# Instalar dependencias del sistema y extensiones PHP necesarias
RUN apt-get update && apt-get install -y libpq-dev unzip git zip libzip-dev \
    && docker-php-ext-install pdo pdo_pgsql pgsql zip

# Configurar Apache para escuchar en el puerto 80
RUN sed -i "s/Listen 80/Listen 80/" /etc/apache2/ports.conf \
    && sed -i "s/<VirtualHost \*:80>/<VirtualHost *:80>/" /etc/apache2/sites-available/000-default.conf \
    && a2enmod rewrite

# Copiar Composer desde la imagen oficial para instalar dependencias PHP
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Establecer directorio de trabajo
WORKDIR /var/www/html

# Copiar código fuente al contenedor
COPY . .

# Ajustar permisos para almacenamiento y caché de Laravel
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Instalar dependencias PHP con Composer (optimizado para producción)
RUN composer install --optimize-autoloader --no-interaction

# Exponer puerto 80 para recibir tráfico
EXPOSE 80

# Comando para arrancar Apache en primer plano
CMD ["apache2-foreground"]