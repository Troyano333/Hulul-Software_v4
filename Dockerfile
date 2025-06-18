# ---- Etapa 1: Instalar dependencias con Composer ----
# Usamos una imagen oficial de Composer para instalar todo de forma limpia
FROM composer:2 as builder

# Creamos un directorio de trabajo
WORKDIR /app

# Copiamos los archivos de Composer primero para aprovechar el caché
COPY composer.json composer.lock ./

# Instalamos las dependencias
RUN composer install --no-dev --optimize-autoloader

# Copiamos el resto de los archivos del proyecto
COPY . .

# ---- Etapa 2: Preparar el servidor final ----
# Usamos una imagen oficial de PHP con el servidor Apache
FROM php:8.0-apache

# Copiamos todos los archivos de nuestro proyecto (con la carpeta 'vendor' ya creada) desde la etapa anterior
COPY --from=builder /app /var/www/html/

# Habilitamos la extensión GD para poder generar los códigos QR
RUN docker-php-ext-install gd

# Damos los permisos correctos a la carpeta para que Apache pueda funcionar
RUN chown -R www-data:www-data /var/www/html