import onChange from 'on-change';
import * as yup from 'yup';
import i18n from 'i18next';
import { uniqueId } from 'lodash';
import resources from './locales/index.js';
import render from './view.js';
import { getResponse } from './utils.js';
import parser from './parser.js';

const validate = (url, subscriptions) => {
  yup.setLocale({
    mixed: {
      notOneOf: 'alreadyExists',
    },
    string: {
      url: 'notValid',
      min: 'notEmpty',
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
    stateUI: {
      viewedPosts: [],
    },
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
  };

  const watchedState = onChange(state, render(elements, state, i18n));

  const trackingUpdates = (urls) => {
    urls.forEach((url) => {
      getResponse(url)
        .then((content) => {
          const { posts } = parser(content);
          posts
            .filter((post) => !state.posts.find((statePost) => statePost.link === post.link))
            .forEach((post) => { watchedState.posts.push({ id: uniqueId(), ...post }); });
        });
    });
    setTimeout(() => trackingUpdates(state.subscriptions), 5000);
  };

  trackingUpdates(state.subscriptions);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { value } = elements.input;
    validate(value, Object.values(watchedState.subscriptions))
      .then(() => getResponse(value))
      .then((response) => {
        const { title, description, posts } = parser(response);
        posts.forEach((post) => { watchedState.posts.push({ id: uniqueId(), ...post }); });
        watchedState.valid = 'valid';
        watchedState.subscriptions.push(value);
        watchedState.feeds.push({ title, description });
      })
      .catch((error) => {
        watchedState.error = error.message;
        watchedState.valid = 'error';
      });
  });

  elements.posts.addEventListener('click', ({ target }) => {
    if (!target.dataset.id) return;
    watchedState.currentId = target.dataset.id;
    watchedState.stateUI.viewedPosts.push(target.dataset.id);
  });
};
