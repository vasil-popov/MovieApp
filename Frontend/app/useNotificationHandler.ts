import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';

const setUpNotificationHandler = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldShowAlert: true,
      shouldSetBadge: false,
    }),
  });

  const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
    const data = notification.request.content.data;
  });

  const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
    const { movieId, screen } = response.notification.request.content.data;

    if (screen === 'MovieDetails' && movieId) {
      router.push(`/movie-details/${movieId}`);
    }
  });

  return () => {
    Notifications.removeNotificationSubscription(notificationListener);
    Notifications.removeNotificationSubscription(responseListener);
  };
};

export default setUpNotificationHandler;
