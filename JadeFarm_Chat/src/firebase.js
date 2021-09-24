import firebase from "firebase/app";
import "firebase/auth";

export const auth = firebase.initializeApp({
    apiKey: "AIzaSyApsipWR6mW2SAu2rZgLDqmGWf0ZyFQXtA",
    authDomain: "junite-9d060.firebaseapp.com",
    projectId: "junite-9d060",
    storageBucket: "junite-9d060.appspot.com",
    messagingSenderId: "91615567696",
    appId: "1:91615567696:web:b510a0c44e048142135655"

}).auth();