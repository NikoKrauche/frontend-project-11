const contentBlock = (element, textContent) => {
  element.textContent = '';
  const conteiner = document.createElement('div');
  const conteinerTitle = document.createElement('div');
  const h2 = document.createElement('h2');
  const ul = document.createElement('ul');

  conteiner.classList.add('card', 'border-0');
  conteinerTitle.classList.add('card-body');
  h2.classList.add('card-title', 'h4');
  h2.textContent = textContent;
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  element.append(conteiner);
  conteiner.append(conteinerTitle);
  conteinerTitle.append(h2);
  return { conteiner, ul };
};

const renderForm = (elements, state, i18n) => {
  const { input, feedback, form } = elements;
  const { error, valid } = state;
  switch (valid) {
    case 'valid':
      input.classList.remove('is-invalid');
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
      feedback.textContent = i18n.t('feedback.valid');
      form.reset();
      form.focus();
      break;
    case 'error':
      input.classList.add('is-invalid');
      feedback.classList.add('text-danger');
      feedback.classList.remove('text-success');
      feedback.textContent = i18n.t(`errors.${error}`);
      console.log(state.error);
      break;
    default:
      throw new Error(`Incorrect key status: '${valid}'`);
  }
};

const renderFeeds = (elements, state, i18n) => {
  const { conteiner, ul } = contentBlock(elements.feeds, i18n.t('feeds'));

  state.feeds.forEach((feed) => {
    const { title, description } = feed;
    const li = document.createElement('li');
    const h3 = document.createElement('h3');
    const p = document.createElement('p');

    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    h3.classList.add('h6', 'm-0');
    h3.textContent = title;
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = description;

    ul.append(li);
    li.append(h3);
    li.append(p);
  });

  conteiner.append(ul);
};

const renderPosts = (elements, state, i18n) => {
  const { conteiner, ul } = contentBlock(elements.posts, i18n.t('posts'));
  state.posts.forEach((post) => {
    const { id, title, link } = post;
    const li = document.createElement('li');
    const a = document.createElement('a');
    const button = document.createElement('button');

    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'lign-items-start', 'border-0', 'border-end-0');
    a.href = link;
    a.classList.add('fw-bold');
    a.dataset.id = id;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = title;

    button.type = 'button';
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.dataset.id = id;
    button.dataset.bsToggle = 'modal';
    button.dataset.bsTarget = '#modal';
    button.textContent = 'Просмотр';

    ul.append(li);
    li.append(a);
    li.append(button);
    return ul;
  });

  conteiner.append(ul);
};

const renderModal = ({ posts, currentId }) => {
  const modalTitle = document.querySelector('h5.modal-title');
  const modalDescription = document.querySelector('div.modal-body');
  const modalLink = document.querySelector('a.full-article');
  const { title, description, link } = posts.find((post) => post.id !== currentId);

  modalTitle.textContent = title;
  modalDescription.textContent = description;
  modalLink.href = link;
};

export default (elements, state, i18n) => (path) => {
  switch (path) {
    case 'valid': renderForm(elements, state, i18n);
      break;
    case 'feeds':
      renderFeeds(elements, state, i18n);
      break;
    case 'posts': renderPosts(elements, state, i18n);
      break;
    case 'currentId': renderModal(state);
      break;
    default:
      break;
  }
};
