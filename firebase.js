import { initializeApp }
from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";

import { getDatabase }
from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const firebaseConfig = {

  apiKey: "AIzaSyC98TkQYLipSzloE_St46XA4O1rv2rzT20",
    authDomain: "valine-b06ad.firebaseapp.com",
    databaseURL: "https://valine-b06ad-default-rtdb.firebaseio.com",
    projectId: "valine-b06ad",
    storageBucket: "valine-b06ad.appspot.com",
    messagingSenderId: "188820674947",
    appId: "1:188820674947:web:450cdc461e7ced7d04beb6",
    measurementId: "G-01TR04E4YT"
  };

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
