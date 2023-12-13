import onChange from 'on-change';
import * as yup from 'yup';
import i18n from 'i18next';
import resources from './locales/index.js';
import render from './view.js';

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
  i18n.init({
    lng: 'ru',
    debug: false,
    resources,
  });

  const state = {
    form: {
      valid: true,
    },
    subscriptions: [],
    error: '',
  };

  const elements = {
    form: document.querySelector('form.rss-form'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('p.feedback'),
  };

  const watchedState = onChange(state, render(elements, state, i18n));
  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { value } = elements.input;
    validate(value, Object.values(watchedState.subscriptions))
      .then(() => {
        watchedState.form.valid = true;
        watchedState.subscriptions.push(value);
      })
      .catch((error) => {
        watchedState.error = error.errors;
        watchedState.form.valid = false;
      });
  });
};
