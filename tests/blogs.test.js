const listHelper = require('../utils/list_helper')

jest.setTimeout(2000000)

describe('total likes',()=>{
    test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
    })

    test('of empty list is zero', () => {
        const blogs = []
        expect(listHelper.totalLikes(blogs)).toBe(0)
    })
        
    test('when list has only on blog equals the likes of that', () => {        
        const blogs = [{title:'Uno',author:'Yo',url:'prueba.com',likes:10},{title:'Uno',author:'Yo',url:'prueba.com',likes:5}]

        expect(listHelper.totalLikes(blogs)).toBe(15)
    })
})

describe('favorite blog',()=>{
    test('blog with more likes', () => {
        const blogs = [{title:'Uno',author:'Yo',url:'prueba.com',likes:10},{title:'Uno',author:'Yo',url:'prueba.com',likes:5}]

        expect(listHelper.favoriteBlog(blogs)).toEqual(10)
    })
})

