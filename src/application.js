import onChange from 'on-change';
import * as yup from 'yup';
import i18n from 'i18next';
import { uniqueId } from 'lodash';
import resources from './locales/index.js';
import render from './view.js';
import getResponse from './getResponse.js';
import parse from './parser.js';

const validate = (url, urls) => {
  const schema = yup
    .string()
    .min(1)
    .trim()
    .url()
    .notOneOf(urls);
  return schema.validate(url);
};

const trackingUpdates = (state, watchedState) => {
  const urls = state.feeds.map(({ link }) => link);
  const promises = urls.map((url) => getResponse(url));
  const promise = Promise.all(promises);

  promise.then((contents) => {
    contents.forEach((content) => {
      const { posts } = parse(content);
      posts
        .filter((post) => !state.posts
          .find((statePost) => statePost.link === post.link))
        .forEach((post) => { watchedState.posts.push({ id: uniqueId(), ...post }); });
    });
  });
  setTimeout(() => trackingUpdates(state, watchedState), 5000);
};

export default () => {
  yup.setLocale({
    mixed: {
      notOneOf: 'alreadyExists',
    },
    string: {
      url: 'notValid',
      min: 'notEmpty',
    },
  });

  const state = {
    language: 'ru',
    stateUI: {
      viewedPosts: [],
      currentViewedPostId: null,
    },
    form: {
      validationState: null,
      submittingState: 'filling',
    },
    feeds: [],
    posts: [],
    error: {
      type: null,
      data: null,
    },
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
    trackingUpdates(state, watchedState);

    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const { value } = elements.input;
      watchedState.form.submittingState = 'processing';
      validate(value, state.feeds.map(({ link }) => link))
        .then(() => {
          watchedState.form.validationState = true;
          watchedState.form.submittingState = 'waitingResponse';
          return getResponse(value);
        })
        .then((response) => {
          const { title, description, posts } = parse(response);
          watchedState.form.submittingState = 'finished';
          posts.map((post) => watchedState.posts.push({ id: uniqueId(), ...post }));
          watchedState.feeds.push({ title, description, link: value });
        })
        .catch((error) => {
          switch (error.name) {
            case 'ValidationError':
              watchedState.error.type = error.message;
              watchedState.error.data = error;
              watchedState.form.validationState = false;
              break;
            case 'AxiosError':
              watchedState.error.type = 'networkError';
              watchedState.error.data = error;
              break;
            case 'parseError':
              watchedState.error.type = 'notRSS';
              watchedState.error.data = error;
              break;
            default: throw error;
          }
          watchedState.form.submittingState = 'failed';
        });
    });

    elements.posts.addEventListener('click', ({ target }) => {
      if (!target.dataset.id) return;
      watchedState.stateUI.currentViewedPostId = target.dataset.id;
      watchedState.stateUI.viewedPosts.push(target.dataset.id);
    });
  });
};
