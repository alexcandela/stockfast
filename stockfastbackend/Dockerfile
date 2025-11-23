# Usa la imagen oficial de PHP 8.3 con Apache
FROM php:8.3-apache

# Instala dependencias del sistema y extensiones necesarias para Laravel y PostgreSQL
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql pgsql \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Instala Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copia todo el contenido del contexto de build al directorio Apache
COPY ./ /var/www/html

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /var/www/html

# Crea archivo .env copiando el ejemplo para que Artisan funcione
RUN cp .env.example .env

# Instala las dependencias con Composer (optimizando autoload y sin scripts de instalación)
RUN composer install --optimize-autoloader --no-scripts --no-interaction

# Configura permisos para storage y cache para que Apache pueda escribirlos
RUN chown -R www-data:www-data storage bootstrap/cache

# Configura Apache para servir la carpeta public/ de Laravel y habilita módulo rewrite
RUN echo "DocumentRoot /var/www/html/public" > /etc/apache2/sites-available/000-default.conf && \
    a2enmod rewrite

# Genera la key de la aplicación y cachea configuración, rutas y vistas
RUN php artisan key:generate
RUN php artisan config:cache
RUN php artisan route:cache
RUN php artisan view:cache

# Genera clave JWT si usas jwt-auth
RUN php artisan jwt:secret --force

# Ejecuta migraciones en la base de datos
RUN php artisan migrate --force

# Expone el puerto 80 para que el servidor web sea accesible
EXPOSE 80

# Comando para arrancar Apache en primer plano
CMD ["apache2-foreground"]