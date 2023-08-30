const helper = require('./test_helper');
const Blog = require('../models/blogs');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
mongoose.set('bufferTimeoutMS', 20000);

beforeEach(async () => {
  await Blog.deleteMany({});
  for (const blog of helper.initialBlogs) {
    const blogObject = new Blog(blog);
    await blogObject.save();
  }
});

const api = supertest(app);

test('get all the blogs from the list', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test('the blog contains id not _id', async () => {
  const response = await api.get('/api/blogs');
  response.body.map((blog) => expect(blog.id).toBeDefined());
});

test('create a new blog', async () => {
  const newBlog = {
    title: 'How to be a Cunt',
    author: 'Antony Bush',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 10,
  };
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);
  const blogsinDb = await helper.blogsinDb();

  const contents = blogsinDb.map((blog) => ({
    title: blog.title,
    author: blog.author,
    likes: blog.likes,
    url: blog.url
  }));

  expect(blogsinDb).toHaveLength(helper.initialBlogs.length + 1);
  expect(contents).toContainEqual(newBlog);
});

test('likes default to 0', async () => {
  const newBlog = {
    title: 'Hello Like',
    author: 'Mathew',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
  };
  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);
  const blogsinDb = await helper.blogsinDb();

  expect(blogsinDb).toHaveLength(helper.initialBlogs.length + 1);
  expect(response.body.likes).toEqual(0);
});

test('no title or url', async () => {
  const noTitleBlog = {
    author: 'Helper',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
  };

  const noURLBlog = {
    title: 'Life of URLs',
    author: 'AntiBus',
  };

  const emptyBlog = {};

  await api.post('/api/blogs').send(noTitleBlog).expect(400);
  await api.post('/api/blogs').send(noURLBlog).expect(400);
  await api.post('/api/blogs').send(emptyBlog).expect(400);
  const blogsinDb = await helper.blogsinDb();
  expect(blogsinDb).toHaveLength(helper.initialBlogs.length);
});

afterAll(async () => {
  await mongoose.connection.close();
});
