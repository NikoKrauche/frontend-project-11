import onChange from 'on-change';
import * as yup from 'yup';
import render from './view.js';

const validate = (url, exceptions) => {
  const schema = yup.string().min(1).trim().url()
    .notOneOf(exceptions);
  return schema.validate(url);
};

export default () => {
  const state = {
    form: {
      valid: '',
    },
    listSite: [],
    error: '',
  };

  const elements = {
    form: document.querySelector('form.rss-form'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('p.feedback'),
  };

  const watchedState = onChange(state, render(elements, state));
  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { value } = elements.input;
    validate(value, Object.values(watchedState.listSite))
      .then(() => {
        watchedState.form.valid = true;
        watchedState.listSite.push(value);
        watchedState.form.error = validate(elements.form.value, watchedState.listSite);
      })
      .catch((error) => {
        watchedState.form.valid = false;
        watchedState.error = error.message ?? 'defaultError';
      });
  });
};
