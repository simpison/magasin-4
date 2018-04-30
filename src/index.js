import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import * as firebase from 'firebase';
import { BrowserRouter } from 'react-router-dom';

const config = {
    apiKey: "AIzaSyA7R4uUui3lXfWZXh_RySDaItOo2IH5Zl8",
    authDomain: "magasin4-f856e.firebaseapp.com",
    databaseURL: "https://magasin4-f856e.firebaseio.com",
    //projectId: "magasin4-f856e",
    storageBucket: "magasin4-f856e.appspot.com",
    //messagingSenderId: "220190684120"
  };

firebase.initializeApp(config);



ReactDOM.render((
	<BrowserRouter>
		<App />
	</BrowserRouter>
	), document.getElementById('root'));
registerServiceWorker();
