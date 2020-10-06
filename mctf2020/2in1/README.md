# Writeup

Для решения данного таска нужно знать:
- Знать что такое phar архив и какие [атаки](https://blog.ripstech.com/2018/new-php-exploitation-technique/) с его помощью можно произвести 
- Какой phar архив имеет File format [7 стр](https://cdn2.hubspot.net/hubfs/3853213/us-18-Thomas-It's-A-PHP-Unserialization-Vulnerability-Jim-But-Not-As-We-....pdf?)

Решение:
- Так как приложение выполняет проверку по формату файла, крафтим файл `.jpeg`, который будет одновременно будет являться как картинкой так и phar архивом: `phpggc --phar-jpeg  ~/Pictures/photo.jpg Laravel/RCE1 system id`
- Загружаем
- После чего делаем запрос на загрузку изображения c `url=phar://app/public/uploads/<имя файла>`
- Находим в env флаг
![RCE](https://gitlab.com/quals-2020/2in1/-/raw/master/2020-10-04_13-18-42.png)

В /src/app/public/uploads/ есть пример изображения.