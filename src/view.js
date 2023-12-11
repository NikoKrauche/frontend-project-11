const renderForm = (elements, value, watchedState) => {
  switch (value) {
    case true:
      elements.input.classList.remove('is-invalid');
      elements.feedback.classList.remove('text-danger');
      elements.feedback.classList.add('text-success');
      elements.feedback.textContent = 'RSS успешно загружен';
      elements.form.reset();
      elements.form.focus();
      watchedState.form.valid = '';
      console.log(watchedState.listSite);
      break;
    case false:
      elements.input.classList.add('is-invalid');
      elements.feedback.classList.add('text-danger');
      elements.feedback.classList.remove('text-success');
      elements.feedback.textContent = 'Ссылка должна быть валидным URL';
      watchedState.form.valid = '';
      break;
    default:
      throw new Error(`Incorrect key status: '${value}'`);
  }
};

export default (elements, watchedState) => (path, value) => {
  switch (path) {
    case 'form.valid': renderForm(elements, value, watchedState);
      break;
    case '': null;
      break;
    default:
      break;
  }
};
