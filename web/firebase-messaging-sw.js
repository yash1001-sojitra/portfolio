importScripts("https://www.gstatic.com/firebasejs/8.4.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.4.1/firebase-messaging.js");

/*Update with yours config*/
const firebaseConfig = {
  apiKey: "AIzaSyB5XjQ7r2GOvW-GVGQebRUVtCmQaytXJcc",
  authDomain: "portfolio-f623c.firebaseapp.com",
  projectId: "portfolio-f623c",
  storageBucket: "portfolio-f623c.appspot.com",
  messagingSenderId: "226572521089",
  appId: "1:226572521089:web:8f3a171e1b5c30809fc780",
  measurementId: "G-5Y7KP6XCPC",
};
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
