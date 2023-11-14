import { clientCredentials } from '../utils/client';

const dbUrl = clientCredentials.databaseURL;

export const getAllContent = () => new Promise((resolve, reject) => {
  fetch(`${dbUrl}/api/spacecontent`, {
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

export const getSingleContent = (id) => new Promise((resolve, reject) => {
  fetch(`${dbUrl}/api/spacecontent/${id}`, {
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
