import firebase from 'firebase/app';
import 'firebase/auth';
import { clientCredentials } from './client';

const dbUrl = clientCredentials.databaseURL;

const checkUser = (uid) => new Promise((resolve, reject) => {
  fetch(`${dbUrl}/api/checkuser/${uid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })
  .then((resp) => {
    if (resp.status === 404) {
      resolve({ notFound: true });
    }
    else {
      resolve(resp.json());
    }
  })
  .catch(reject);
});


const registerUser = (userInfo) => new Promise((resolve, reject) => {
  fetch(`${dbUrl}/api/user/create`, {
    method: 'POST',
    body: JSON.stringify(userInfo),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })
    .then((resp) => resolve(resp.json()))
    .catch(reject);
});

const signIn = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  console.log('PROVIDER: ', provider);
  firebase.auth().signInWithPopup(provider);
};

const signOut = () => {
  firebase.auth().signOut();
};

export {
  signIn, //
  signOut,
  checkUser,
  registerUser,
};
