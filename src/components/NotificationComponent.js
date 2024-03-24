// NotificationComponent.js
import React, { useEffect } from 'react';
//import * as serviceWorker from './../serviceWorker';
export const NotificationComponent = () => {
  useEffect(() => {
    // Ask for permission to send notifications
    
  }, []);

  const subscribe = async () => {
    try {
      await Notification.requestPermission();
      if (!('serviceWorker' in navigator)) {
        throw new Error("No support for service worker!")
    }

    if (!('Notification' in window)) {
        throw new Error("No support for notification API");
    }

    if (!('PushManager' in window)) {
        throw new Error("No support for Push API")
    }
      
      const registration = await navigator.serviceWorker.register('./../service-worker.js');//serviceWorker.register();
      console.log('Service Worker registered!');
      // Send subscription to your server
      // ...
    } catch (error) {
      console.error('Error subscribing:', error);
    }
  };

  return (
    <div>
      <button onClick={subscribe}>Subscribe to Notifications</button>
    </div>
  );
};
