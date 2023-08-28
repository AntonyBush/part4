let _ = require('lodash');

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  if (blogs.length !== 0)
    return blogs.reduce((total, curr) => total + curr.likes, 0);
  else return 0;
};

const favoriteBlog = (blogs) => {
  if (blogs.length !== 0) {
    const favBlog = blogs.reduce(
      (prev, curr) => (prev.likes > curr.likes ? prev : curr),
      0
    );
    return {
      title: favBlog.title,
      author: favBlog.author,
      likes: favBlog.likes,
    };
  } else return {};
};

const mostBlogs = (blogs) => {
  return _(blogs)
    .groupBy('author')
    .map((g, key) => {
      return {
        author: key,
        blogs: g.length,
      };
    })
    .maxBy('blogs');
};

const mostLikes = (blogs) => {
  return _(blogs)
    .groupBy('author')
    .map((items, key) => {
      return { author: key, likes: _.sumBy(items, 'likes') };
    })
    .maxBy('likes');
};
module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
