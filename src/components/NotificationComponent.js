// NotificationComponent.js
import React, { useEffect } from 'react';
import guide from './../guide.png';
//import * as serviceWorker from './../serviceWorker';
var permission = Notification.permission;
var registration = navigator.serviceWorker.registration;
export const NotificationComponent = () => {
  useEffect(() => {
    // Ask for permission to send notifications
    subscribe()
    document.getElementById('closeModal').addEventListener('click', () => {
      const modal = document.getElementById('permissionModal');
      modal.classList.add('fade-out');
      setTimeout(() => {
        modal.style.display = 'none';
        modal.classList.remove('fade-out');
      }, 500);
    });
  }, []);

  const subscribe = async () => {
    try {
      if (!('serviceWorker' in navigator)) {
        throw new Error("No support for service worker!")
    }

    if (!('Notification' in window)) {
        throw new Error("No support for notification API");
    }

    if (!('PushManager' in window)) {
        throw new Error("No support for Push API")
    }
      if(registration === undefined || registration === null){
        registration = await navigator.serviceWorker.register('./../service-worker.js');//serviceWorker.register();
        console.log('Service Worker registered!');
      }else {
        console.log('Service Worker already registered!');
      }
      permission = await Notification.requestPermission();
      console.log('Permission:', permission);
      if (permission === 'denied') {
        document.getElementById('permissionModal').style.display = 'block';
        setTimeout(() => {
          const modal = document.getElementById('permissionModal');
          modal.classList.add('fade-out');
          setTimeout(() => {
            modal.style.display = 'none';
            modal.classList.remove('fade-out');
          }, 500);
          //document.getElementById('permissionModal').style.display = 'none'
        },6000);
        //alert('You have denied the notification permission earlier. Please enable it manually from your browser settings.');
        //return;
      }
     
      // Send subscription to your server
      // ...
    } catch (error) {
      console.error('Error subscribing:', error);
    }
  };

  return (
    <div>
      <button onClick={subscribe}>Subscribe to notifications</button>
      <div id="permissionModal"  style={{display: 'none', top: '50%', position: 'fixed', left: '50%', transform: 'translate(-50%, -70%)', zIndex: '999',  padding: '20px', border: '1px solid #222',backgroundColor: 'rgba(255, 255, 255, 1)' }}>
      <p>You have denied the notification permission earlier.<br/> Please enable it manually from your browser settings.</p>
      <img src={guide} alt="Notification Permission Denied" height={200} width={350} />
      <br/>
      <br/>
      <button id="closeModal">Close</button>
    </div>
    </div>
  );
};
