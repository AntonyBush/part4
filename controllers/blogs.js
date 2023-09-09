const blogsRouter = require('express').Router();
const Blog = require('../models/blogs');
const jwt = require('jsonwebtoken');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.get('/:id', async (request, response) => {
  const id = request.params.id;
  const blog = await Blog.findById(id);
  if (blog) response.status(200).json(blog);
  else response.status(404).end();
});

blogsRouter.post('/', async (request, response) => {
  const body = request.body;

  const user = request.user;
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  });

  const result = await blog.save();
  user.blogs = user.blogs.concat(result._id);
  await user.save();
  response.status(201).json(result);
});

blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id;
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken)
    return response.status(401).json({ error: 'invalid token' });
  const blog = await Blog.findById(id);
  if (blog.user.toString() !== decodedToken.id.toString())
    return response
      .status(403)
      .json({ error: 'You are trying to delete another users blog' });
  response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
  const id = request.params.id;
  const { likes } = request.body;
  const updatedNote = await Blog.findByIdAndUpdate(
    id,
    { likes },
    { new: true, runValidators: true, context: 'query' }
  );
  response.json(updatedNote);
});

module.exports = blogsRouter;
