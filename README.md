Frontend
1. Node.js + npm - https://nodejs.org/en/download/package-manager
2. Android Studio/SDK - https://developer.android.com/studio
 - Set ANDROID_HOME path - https://www.ibm.com/docs/en/devops-test-ui/11.0.1?topic=prwut-setting-changing-android-home-path-in-windows-operating-systems
3. Open MovieApp folder and run "npm install" in a terminal
4. Chnage the ip address to your ipv4 address for the back end inside movie-list.tsx and [id].tsx
5. Add the api credentials for the Facebook SDK inside of app.json
6. Set up an emulator through Android studio or use a physical device connected with a usb cable
4. Use "npx expo start" for development build
or "npx expo start --no-dev --minify" for production build

Backend
1. Download PHP - https://windows.php.net/download#php-8.3 
- set enivronment variable Path to PHP installation directory
2. Download Composer - https://getcomposer.org/download/
3. Download MySQL - https://www.mysql.com/products/workbench/
4. Edit php.in located in your PHP directory and enable extensions - fileinfo,mysqli,pdo_mysql (depending on database)
5. Open MovieApi folder and run these commands
5. composer install
6. cp .env.example .env
- input MySQL details in .env
8. php artisan key:generate
9. php artisan migrate
10. php artisan serve --host=0.0.0.0 --port=8000
