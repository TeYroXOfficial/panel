FROM php:8.1-fpm-alpine3.16

COPY ./php.ini /usr/local/etc/php/php.ini

RUN apk add --no-cache bash
RUN docker-php-ext-install pdo_mysql
RUN apk add --no-cache pcre-dev $PHPIZE_DEPS \
        && pecl install redis \
        && docker-php-ext-enable redis.so

WORKDIR /var/www

CMD ["php-fpm"]

EXPOSE 9000