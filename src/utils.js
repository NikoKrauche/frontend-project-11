import axios from 'axios';

const getResponse = (url) => {
  const proxyUrl = 'https://allorigins.hexlet.app/get';
  return axios({
    url: proxyUrl,
    params: {
      url,
      disableCache: true,
    },
  }).then(({ data, status }) => {
    if (status !== 200) throw new Error('networkError');
    if (data.contents.includes('<rss version="2.0">') !== true) throw new Error('notRSS');

    return data.contents;
  });
};

const contentBlock = (element, text) => {
  element.textContent = '';
  const conteiner = document.createElement('div');
  const conteinerTitle = document.createElement('div');
  const h2 = document.createElement('h2');
  const ul = document.createElement('ul');

  conteiner.classList.add('card', 'border-0');
  conteinerTitle.classList.add('card-body');
  h2.classList.add('card-title', 'h4');
  h2.textContent = text;
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  element.append(conteiner);
  conteiner.append(conteinerTitle);
  conteinerTitle.append(h2);
  return { conteiner, ul };
};

export { getResponse, contentBlock };
