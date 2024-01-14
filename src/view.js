import { contentBlock } from './utils.js';

const isViewed = (currentId, { viewedPosts }) => viewedPosts.includes(currentId);

const renderForm = (elements, { error, submittingState }, i18n) => {
  const {
    input, button, feedback, form,
  } = elements;

  switch (submittingState) {
    case 'processing':
      input.disabled = true;
      button.disabled = true;
      feedback.classList.remove('text-danger');
      feedback.classList.remove('text-success');
      feedback.textContent = i18n.t('feedback.processing');
      break;
    case 'finished':
      input.disabled = false;
      button.disabled = false;
      input.classList.remove('is-invalid');
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
      feedback.textContent = i18n.t('feedback.finished');
      form.reset();
      form.focus();
      break;
    case 'failed':
      input.disabled = false;
      button.disabled = false;
      input.classList.add('is-invalid');
      feedback.classList.add('text-danger');
      feedback.classList.remove('text-success');
      feedback.textContent = i18n.t(`errors.${error}`);
      break;
    default:
      throw new Error(`Unknown state: '${submittingState}'`);
  }
};

const renderFeeds = (elements, state, i18n) => {
  const { container, ul } = contentBlock(elements.feeds, i18n.t('feeds'));

  state.feeds.forEach(({ title, description }) => {
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

  container.append(ul);
};

const renderPosts = (elements, { posts, stateUI }, i18n) => {
  const { container, ul } = contentBlock(elements.posts, i18n.t('posts'));
  posts.forEach(({ id, title, link }) => {
    const tagACorrectClass = isViewed(id, stateUI) ? 'fw-normal' : 'fw-bold';
    const li = document.createElement('li');
    const a = document.createElement('a');
    const button = document.createElement('button');

    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    a.href = link;
    a.classList.add(tagACorrectClass);
    a.dataset.id = id;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = title;

    button.type = 'button';
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.dataset.id = id;
    button.dataset.bsToggle = 'modal';
    button.dataset.bsTarget = '#modal';
    button.textContent = i18n.t('button');

    ul.append(li);
    li.append(a);
    li.append(button);
    return ul;
  });

  container.append(ul);
};

const renderModal = ({ posts, stateUI }) => {
  const { lastViewedPostId } = stateUI;
  const modalTitle = document.querySelector('h5.modal-title');
  const modalDescription = document.querySelector('div.modal-body');
  const modalLink = document.querySelector('a.full-article');
  const { title, description, link } = posts.find((post) => post.id === lastViewedPostId);

  modalTitle.textContent = title;
  modalDescription.textContent = description;
  modalLink.href = link;
};

export default (elements, state, i18n) => (path) => {
  switch (path) {
    case 'form.error':
    case 'form.submittingState': renderForm(elements, state.form, i18n);
      break;
    case 'feeds': renderFeeds(elements, state, i18n);
      break;
    case 'stateUI.viewedPosts':
    case 'posts': renderPosts(elements, state, i18n);
      break;
    case 'stateUI.lastViewedPostId': renderModal(state);
      break;
    default:
      break;
  }
};
