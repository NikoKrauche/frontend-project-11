const renderForm = (elements, value, state, i18n) => {
  switch (value) {
    case true:
      elements.input.classList.remove('is-invalid');
      elements.feedback.classList.remove('text-danger');
      elements.feedback.classList.add('text-success');
      elements.feedback.textContent = i18n.t('feedback.valid');
      elements.form.reset();
      elements.form.focus();
      break;
    case false:
      elements.input.classList.add('is-invalid');
      elements.feedback.classList.add('text-danger');
      elements.feedback.classList.remove('text-success');
      elements.feedback.textContent = i18n.t(`errors.${state.error}`);
      break;
    default:
      throw new Error(`Incorrect key status: '${value}'`);
  }
};

export default (elements, state, i18n) => (path, value) => {
  switch (path) {
    case 'form.valid': renderForm(elements, value, state, i18n);
      break;
    default:
      break;
  }
};
