import axios from 'axios';

const getResponse = (url) => {
  const proxyUrl = 'https://allorigins.hexlet.app/get';
  return axios({
    url: proxyUrl,
    params: {
      url,
      disableCache: true,
    },
    timeout: 3000,
  }).then(({ data }) => data.contents)
    .catch(() => {
      throw new Error('networkError');
    });
};

const contentBlock = (element, text) => {
  element.textContent = '';
  const container = document.createElement('div');
  const title = document.createElement('div');
  const h2 = document.createElement('h2');
  const ul = document.createElement('ul');

  container.classList.add('card', 'border-0');
  title.classList.add('card-body');
  h2.classList.add('card-title', 'h4');
  h2.textContent = text;
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  element.append(container);
  container.append(title);
  title.append(h2);
  return { container, ul };
};

export { getResponse, contentBlock };
