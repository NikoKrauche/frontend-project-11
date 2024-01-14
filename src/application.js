import onChange from 'on-change';
import * as yup from 'yup';
import i18n from 'i18next';
import { uniqueId } from 'lodash';
import resources from './locales/index.js';
import render from './view.js';
import { getResponse } from './utils.js';
import parser from './parser.js';

yup.setLocale({
  mixed: {
    notOneOf: 'alreadyExists',
  },
  string: {
    url: 'notValid',
    min: 'notEmpty',
  },
});

const validate = (url, subscriptions) => {
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
    stateUI: {
      viewedPosts: [],
      lastViewedPostId: null,
    },
    form: {
      submittingState: 'filling',
      error: null,
    },
    feeds: [],
    posts: [],
    subscriptions: [],
  };

  const elements = {
    form: document.querySelector('form.rss-form'),
    input: document.querySelector('#url-input'),
    button: document.querySelector('button[type="submit"]'),
    feedback: document.querySelector('p.feedback'),
    feeds: document.querySelector('div.feeds'),
    posts: document.querySelector('div.posts'),
  };

  const watchedState = onChange(state, render(elements, state, i18n));

  i18n.init({
    lng: state.language,
    debug: false,
    resources,
  }).then(() => {
    const trackingUpdates = (urls) => {
      if (urls.length > 0) {
        const promises = urls.map((url) => getResponse(url));
        const promise = Promise.all(promises);

        promise.then((contents) => {
          contents.forEach((content) => {
            const { posts } = parser(content);
            posts
              .filter((post) => !state.posts
                .find((statePost) => statePost.link === post.link))
              .forEach((post) => { watchedState.posts.push({ id: uniqueId(), ...post }); });
          });
        });
      }
      setTimeout(() => trackingUpdates(state.subscriptions), 5000);
    };

    trackingUpdates(state.subscriptions);

    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      watchedState.form.submittingState = 'processing';
      const { value } = elements.input;
      validate(value, Object.values(watchedState.subscriptions))
        .then(() => getResponse(value))
        .then((response) => {
          const { title, description, posts } = parser(response);
          watchedState.form.submittingState = 'finished';
          posts.forEach((post) => { watchedState.posts.push({ id: uniqueId(), ...post }); });
          watchedState.subscriptions.push(value);
          watchedState.feeds.push({ title, description });
        })
        .catch((error) => {
          watchedState.form.submittingState = 'failed';
          watchedState.form.error = error.message;
        });
    });

    elements.posts.addEventListener('click', ({ target }) => {
      if (!target.dataset.id) return;
      watchedState.stateUI.lastViewedPostId = target.dataset.id;
      watchedState.stateUI.viewedPosts.push(target.dataset.id);
    });
  });
};
