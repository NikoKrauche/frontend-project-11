export default (data) => {
  const parser = new DOMParser();
  const rawData = parser.parseFromString(data, 'application/xml');
  const error = rawData.querySelector('parsererror');

  if (error) throw new Error('failParsed');

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
