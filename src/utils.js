import axios from 'axios';

export default (url) => {
  const proxyUrl = 'https://allorigins.hexlet.app/get';
  return axios({
    url: proxyUrl,
    params: {
      disableCache: true,
      url,
    },
  }).then((response) => response.data.contents)
    .catch(() => {
      throw new Error('errorResponse');
    });
};
