import nicon from './noticon.jpg'
import gif from './notiimage.webp'
/* eslint-disable no-restricted-globals */
/* eslint-disable no-unused-expressions */
/* global self */
/* global clients */
// eslint-disable-next-line no-restricted-globals
self.__WB_MANIFEST;


const urlBase64ToUint8Array = base64String => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
}

const saveSubscription = async (subscription) => {
    console.log("Saving subscription")
    const response = await fetch('/api/save-subscription', {
        method: 'post',
        headers: { 'Content-type': "application/json" },
        body: JSON.stringify(subscription)
    }).catch(err => console.log(err));

    return response.json()
}

self.addEventListener("install", async (e) => {
    console.log("SW Installed")
    self.skipWaiting()
})


self.addEventListener("activate", async (e) => {
    console.log("SW ACtivated")
    self.registration.update().then((reg) => {
        if(reg) {
            console.log("SW Active")
        }else{
            console.log("SW Not Active")
            reg.unregister().then(() => {
                console.log("SW Unregistered")
                //navigator.serviceWorker.register('./service-worker.js')
                reg.update();
            }).catch(err => console.log(err))
        }

    })
     const subscription = await self.registration.pushManager.subscribe({
         userVisibleOnly: true,
         applicationServerKey: urlBase64ToUint8Array("BGQnf5Xe5PXvLwVLjoQpeO6WKdTB9oYs2E-DQEstSaXXTD0RExIrP1YUA3W2fGf9Un0Re3Rx_SIhUdJ3uJudxS4")
     })
    console.log("Subscription: ", subscription)
    const response = await saveSubscription(subscription)
    console.log(response)
})

self.addEventListener("push", e => {
    console.log("SW recieved Push",e)
    var data = e.data.json()
    try{
    self.registration.showNotification(data.title, { body: data.body, icon: nicon, image: gif, badge: nicon,  actions: [{ action: 'https://dmoipl.azurewebsites.net/', title: 'Open' }] })
    }catch(err){
        console.log("Error while SHow Notification",err)
    }
})

self.addEventListener('notificationclick', function(event) {
    console.log('On notification click: ', event.notification.tag);
    event.notification.close();
    event.waitUntil(
       // window.open('https://dmoipl.azurewebsites.net/')
      clients.openWindow('https://dmoipl.azurewebsites.net/')
    );
  });