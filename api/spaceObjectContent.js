import { clientCredentials } from '../utils/client';

const dbUrl = clientCredentials.databaseURL;

export const createSpaceObjectContent = (contentId, soId) => new Promise((resolve, reject) => {
  fetch(`${dbUrl}/api/spaceobjectcontent/create/${contentId}/${soId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ contentId, soId }),
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

export const updateSpaceObjectContent = (contentId, soId) => new Promise((resolve, reject) => {
  fetch(`${dbUrl}/api/spaceobjectcontent/update/${contentId}/${soId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ contentId, soId }),
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
