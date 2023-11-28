import { clientCredentials } from '../utils/client';

const dbUrl = clientCredentials.databaseURL;

export const createComment = (id, commentData) => new Promise((resolve, reject) => {
  fetch(`${dbUrl}/api/comment/create/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(commentData),
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

export const getComments = (id) => new Promise((resolve, reject) => {
  fetch(`${dbUrl}/api/comment/${id}`, {
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

export const updateComments = (id, payload) => new Promise((resolve, reject) => {
  fetch(`${dbUrl}/api/comment/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
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

export const deleteComment = (id) => new Promise((resolve, reject) => {
  fetch(`${dbUrl}/api/comment/remove/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })
    .then(async (res) => {
      let data;
      if (res.ok) {
        resolve(data);
      }
    })
    .catch(reject);
});
