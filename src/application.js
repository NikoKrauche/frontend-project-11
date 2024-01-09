import onChange from 'on-change';
import * as yup from 'yup';
import i18n from 'i18next';
import uniqueId from 'lodash/uniqueId.js';
import resources from './locales/index.js';
import render from './view.js';
import getResponse from './utils.js';
import parser from './parser.js';

const validate = (url, subscriptions) => {
  yup.setLocale({
    mixed: {
      notOneOf: 'alreadyExists',
    },
    string: {
      url: 'notValid',
      min: 'notValid',
    },
  });

  const schema = yup
    .string()
    .min(1)
    .trim()
    .url()
    .notOneOf(subscriptions);
  return schema.validate(url);
};

export default () => {
  const state = {
    language: 'ru',
    valid: '',
    feeds: [],
    posts: [],
    subscriptions: [],
    error: '',
    currentId: '',
  };

  i18n.init({
    lng: state.language,
    debug: false,
    resources,
  });

  const elements = {
    form: document.querySelector('form.rss-form'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('p.feedback'),
    feeds: document.querySelector('div.feeds'),
    posts: document.querySelector('div.posts'),
    postsBtn: document.querySelector('button[data-bs-target="#modal"]'),
  };

  const watchedState = onChange(state, render(elements, state, i18n));

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { value } = elements.input;
    validate(value, Object.values(watchedState.subscriptions))
      .then(() => getResponse(value))
      .then((response) => {
        watchedState.valid = 'valid';
        watchedState.subscriptions.push(value);
        const { title, description, posts } = parser(response);
        watchedState.feeds.push({ title, description });
        posts.forEach((post) => { watchedState.posts.push({ id: uniqueId(), ...post }); });
      })
      .catch((error) => {
        watchedState.error = error.errors;
        watchedState.valid = 'error';
      });
  });

  elements.posts.addEventListener('click', ({ target }) => {
    if (!target.dataset.id) return;
    watchedState.currentId = target.dataset.id;
  });
};
