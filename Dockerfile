# ---- Etapa 1: Instalar dependencias con Composer ----
FROM composer:2 as builder

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader

COPY . .

# ---- Etapa 2: Preparar el servidor final ----
FROM php:8.0-apache

# ==========================================================
# ===== BLOQUE CORREGIDO: AHORA INSTALA GD Y MYSQLI =====
# ==========================================================
RUN apt-get update && apt-get install -y \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
&& docker-php-ext-configure gd --with-freetype --with-jpeg \
&& docker-php-ext-install -j$(nproc) gd mysqli

# Copiamos todos los archivos del proyecto desde la etapa anterior
COPY --from=builder /app /var/www/html/

# Damos los permisos correctos a la carpeta para que Apache pueda funcionar
RUN chown -R www-data:www-data /var/www/html