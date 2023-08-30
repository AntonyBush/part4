const blogsRouter = require('express').Router();
const Blog = require('../models/blogs');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.get('/:id', async (request, response) => {
  const id = request.params.id;
  const blog = await Blog.findById(id);
  if (blog) response.status(200).json(blog);
  else response.status(404).end();
});

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body);

  const result = await blog.save();
  response.status(201).json(result);
});

blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id;
  await Blog.findByIdAndDelete(id);
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
