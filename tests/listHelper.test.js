const listHelper = require('../utils/list_helper');
const helper = require('./test_helper');

test('dummy returns one', () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

describe('total likes', () => {
  test('when list has only one blog, equals the likes of that', () => {
    expect(listHelper.totalLikes(helper.listWithOneBlog)).toBe(5);
  });

  test('when the list has more than one of blogs', () => {
    expect(listHelper.totalLikes(helper.initialBlogs)).toBe(36);
  });

  test('when the list is empty, the total likes is zero', () =>
    expect(listHelper.totalLikes([])).toBe(0));
});

describe('most favorite', () => {
  test('when the list had only one blog, the favorite is itself', () => {
    expect(listHelper.favoriteBlog(helper.listWithOneBlog)).toEqual({
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5,
    });
  });

  test('when the list has more than one blog', () => {
    expect(listHelper.favoriteBlog(helper.initialBlogs)).toEqual({
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    });
  });

  test('when the list is empty, the object is empty', () => {
    expect(listHelper.favoriteBlog([])).toEqual({});
  });
});

describe('most blogs by an author', () => {
  test('for a single blog', () => {
    expect(listHelper.mostBlogs(helper.listWithOneBlog)).toEqual({
      author: 'Edsger W. Dijkstra',
      blogs: 1,
    });
  });

  test('for a list of blogs', () => {
    expect(listHelper.mostBlogs(helper.initialBlogs)).toEqual({
      author: 'Robert C. Martin',
      blogs: 3,
    });
  });
});

describe('most likes', () => {
  test('when the list contains only one blog, the blog itself', () => {
    expect(listHelper.mostLikes(helper.listWithOneBlog)).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 5,
    });
  });

  test('when the list contains more than 1 blogs', () => {
    expect(listHelper.mostLikes(helper.initialBlogs)).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17,
    });
  });
});
