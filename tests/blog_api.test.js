const helper = require('./test_helper');
const Blog = require('../models/blogs');
const User = require('../models/users');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
mongoose.set('bufferTimeoutMS', 20000);

beforeEach(async () => {
  await Blog.deleteMany({});
  const user = User.findOne({username: 'root'});
  for (const blog of helper.initialBlogs) {
    const blogObject = new Blog({
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes,
      user: user._id
    });
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
  const token = await helper.getToken();
  const newBlog = {
    title: 'How to be a Cunt',
    author: 'Antony Bush',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 10,
  };
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);
  const blogsinDb = await helper.blogsinDb();

  const contents = blogsinDb.map((blog) => ({
    title: blog.title,
    author: blog.author,
    likes: blog.likes,
    url: blog.url,
  }));

  expect(blogsinDb).toHaveLength(helper.initialBlogs.length + 1);
  expect(contents).toContainEqual(newBlog);
});

test('create a new blog without a token', async () => {
  const newBlog = {
    title: 'How to be a C',
    author: 'Antony Bush',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 10,
  };
  const result = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/);
  console.log(result.body);
});

test('likes default to 0', async () => {
  const token = await helper.getToken();
  const newBlog = {
    title: 'Hello Like',
    author: 'Mathew',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
  };
  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);
  const blogsinDb = await helper.blogsinDb();

  expect(blogsinDb).toHaveLength(helper.initialBlogs.length + 1);
  expect(response.body.likes).toEqual(0);
});

test('no title or url', async () => {
  const token = await helper.getToken();

  const noTitleBlog = {
    author: 'Helper',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
  };

  const noURLBlog = {
    title: 'Life of URLs',
    author: 'AntiBus',
  };

  const emptyBlog = {};

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(noTitleBlog)
    .expect(400);
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(noURLBlog)
    .expect(400);
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(emptyBlog)
    .expect(400);
  const blogsinDb = await helper.blogsinDb();
  expect(blogsinDb).toHaveLength(helper.initialBlogs.length);
});

// test('deleting a blog', async () => {
//   const token = await helper.getToken();

//   const blogsinDbBefore = await helper.blogsinDb();
//   const blog = blogsinDbBefore[0];
//   console.log(blog);
//   await api
//     .delete(`/api/blogs/${blog.id}`)
//     .set('Authorization', `Bearer ${token}`)
//     .expect(204);

//   const blogsinDbAfter = await helper.blogsinDb();
//   expect(blogsinDbAfter).toHaveLength(helper.initialBlogs.length - 1);
//   expect(blogsinDbAfter).not.toContainEqual(blog);
// });

test('delete from an invalid route', async () => {
  const res = await api.post('/api/login').send({
    username: 'root',
    password: 'root123',
  });
  const invalidId = '123123123';
  await api
    .delete(`/api/blogs/${invalidId}`)
    .set('Authorization', `Bearer ${res.body.token}`)
    .expect(400);
});

test('updating likes in a blog', async () => {
  const blogsinDbBefore = await helper.blogsinDb();
  let updatedNote = blogsinDbBefore[0];
  updatedNote.likes = 100;
  await api.put(`/api/blogs/${updatedNote.id}`).send(updatedNote).expect(200);

  const blogsinDbAfter = await helper.blogsinDb();
  expect(blogsinDbAfter).toContainEqual(updatedNote);
  expect(blogsinDbAfter).toHaveLength(helper.initialBlogs.length);
});

afterAll(async () => {
  await mongoose.connection.close();
});
