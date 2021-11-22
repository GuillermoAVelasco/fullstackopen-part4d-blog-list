const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')


beforeEach( async () => {
    await Blog.deleteMany({})
  
    const blogObjects = helper.initialBlogs
      .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

jest.setTimeout(2000000)
describe('Basics', () => {
  test('blogs are returned as json', async () => {
      await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all Blogs are returned', async () => {
      const response = await api.get('/api/blogs')
      expect(response.body).toHaveLength(helper.initialBlogs.length)
  })
    
  test('the first blog is about HTTP methods', async () => {
      const response = await api.get('/api/blogs')
      expect(response.body[0].title).toBe('HTML is easy')
  })
    
  test('a specific blog is within the returned blogs', async () => {
      const response = await api.get('/api/blogs')
    
      const titles = response.body.map(r => r.title)
      expect(titles).toContain(
        '.NET Futher'
      )
  })
})

describe('Ejercicios 4.8 - 4.12', () => {

  test('check that a variable id is not undefined',async () => {
    const response=await api.get('/api/blogs')
    const blog= response.body[0]
    expect(blog.id).toBeDefined();
  })

  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'async/await simplifies making async calls',
      author:'Bill Clinton',
      url: 'clinton.com',
      user:'619199d14534d4cb9c2b1974',
      likes:5
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFiYzEyMyIsImlkIjoiNjE5YWI2MDJiMWU2MzYzOTA2ZWM4ZmUyIiwiaWF0IjoxNjM3NTg0MDU2fQ.KedCrgHXHfXHzwNCchn1uLi3SOX-r5_UDpkKPJjiFL0`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const contents = blogsAtEnd.map(n => n.title)
    expect(contents).toContain(
      'async/await simplifies making async calls'
    )
  })

  test('check that new blog with Likes undefined default 0',async () => {
    const blog= {
        title: 'Linux or Windows',
        author: 'George Claymore',
        url: 'www.amazon.com'
      }

    const blogSaved = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFiYzEyMyIsImlkIjoiNjE5YWI2MDJiMWU2MzYzOTA2ZWM4ZmUyIiwiaWF0IjoxNjM3NTg0MDU2fQ.KedCrgHXHfXHzwNCchn1uLi3SOX-r5_UDpkKPJjiFL0`)
        .send(blog)
        
    expect(blogSaved.body).toHaveProperty('likes',0);
  })

  test('check that new blog title and url is not undefined',async () => {
    const blog= {
        author: 'Bruce Wayne',
        likes:15,
        user:'619199d14534d4cb9c2b1974'
      }

    const blogSaved = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFiYzEyMyIsImlkIjoiNjE5YWI2MDJiMWU2MzYzOTA2ZWM4ZmUyIiwiaWF0IjoxNjM3NTg0MDU2fQ.KedCrgHXHfXHzwNCchn1uLi3SOX-r5_UDpkKPJjiFL0`)
        .send(blog)
        .expect(400)
  })

  test('4.13 succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFiYzEyMyIsImlkIjoiNjE5YWI2MDJiMWU2MzYzOTA2ZWM4ZmUyIiwiaWF0IjoxNjM3NTg0MDU2fQ.KedCrgHXHfXHzwNCchn1uLi3SOX-r5_UDpkKPJjiFL0`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )

    const contents = blogsAtEnd.map(r => r.title)
    console.log(contents)

    expect(contents).not.toContain(blogToDelete.title)
  })

  test('4.14 Update Blog Likes', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const blog= {
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      user:'619199d14534d4cb9c2b1974',
      likes:15
    }

    const blogUpdate= await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blog)
        .expect(200)

    expect(blogToUpdate.likes).not.toBe(blogUpdate.likes)

    //expect(blogToUpdate.equals(likes)).toBe(blogUpdate.likes)
  })
})

afterAll(() => {
  mongoose.connection.close()
})