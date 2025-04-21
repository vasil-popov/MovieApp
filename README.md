Frontend
1. Node.js + npm - https://nodejs.org/en/download/package-manager
2. Android Studio/SDK - https://developer.android.com/studio
 - Set ANDROID_HOME path - https://www.ibm.com/docs/en/devops-test-ui/11.0.1?topic=prwut-setting-changing-android-home-path-in-windows-operating-systems
3. Open Frontend folder and run "npm install" in a terminal
4. Change the ip address to your ipv4 address for the back end 
5. Add the api credentials for the Facebook SDK inside of app.json
6. Set up an emulator through Android studio or use a physical device connected with a usb cable
4. Use "npx expo start" for development build
or "npx expo start --no-dev --minify" for production build

Backend
1. Download JDK 24
2. Download Maven
3. Download MySQL - https://dev.mysql.com/downloads/
4. Open Backend folder and run mvn spring-boot:run



How to send push notification
1. Open the Expo Push Notification Tool - https://expo.dev/notifications
2. Get the Expo Push Token from the database (should look something like this "ExponentPushToken[xxxxxxxxxxxxxx]")
3. Enter a recipient(Push token), title and message
4. (Optional) Enter a data payload if you want the notification to redirect to a specific movies' details page. The format is {"movieId": "2","screen": "MovieDetails"} change only the movieId




