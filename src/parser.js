export default (data) => {
  const parse = new DOMParser();
  const rawData = parse.parseFromString(data, 'application/xml');
  const parseError = rawData.querySelector('parsererror');

  if (parseError) {
    const error = new Error(parseError.textContent);
    error.name = 'parseError';
    throw error;
  }

  const title = rawData.querySelector('title').textContent;
  const description = rawData.querySelector('description').textContent;
  const posts = Array.from(
    rawData.querySelectorAll('item'),
    (item) => ({
      title: item.querySelector('title').textContent,
      description: item.querySelector('description').textContent,
      link: item.querySelector('link').textContent,
    }),
  );

  return { title, description, posts };
};
