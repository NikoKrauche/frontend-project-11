import axios from 'axios';

export default (url) => {
  const proxyUrl = 'https://allorigins.hexlet.app/get';
  return axios({
    url: proxyUrl,
    params: {
      url,
      disableCache: true,
    },
    timeout: 5000,
  }).then(({ data }) => data.contents);
};
