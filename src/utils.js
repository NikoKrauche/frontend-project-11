import axios from 'axios';

export default (url) => {
  const proxyUrl = `https://allorigins.hexlet.app/get?url=${url}`;
  return axios(proxyUrl, {
    disableCache: true,
  }).then((response) => response.data.contents)
    .catch(() => {
      throw new Error('errorResponse');
    });
};
