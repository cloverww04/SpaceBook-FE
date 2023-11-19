import { clientCredentials } from '../utils/client';

const dbUrl = clientCredentials.databaseURL;

export const getAllObjects = () => new Promise((resolve, reject) => {
  fetch(`${dbUrl}/api/spaceobjects`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })
    .then(async (res) => {
      let data;
      if (res.ok) {
        data = await res.json();
        resolve(data);
      }
    })
    .catch(reject);
});

export const getSingleObject = (id) => new Promise((resolve, reject) => {
  fetch(`${dbUrl}/api/spaceobject/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })
    .then(async (res) => {
      let data;
      if (res.ok) {
        data = await res.json();
        resolve(data);
      }
    })
    .catch(reject);
});
