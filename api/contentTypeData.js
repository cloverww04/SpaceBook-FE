import { clientCredentials } from '../utils/client';

const dbUrl = clientCredentials.databaseURL;

const getAllType = () => new Promise((resolve, reject) => {
  fetch(`${dbUrl}/api/type`, {
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

export default getAllType;
