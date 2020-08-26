const users = [
    {
        id: 'idone',
        name: 'yubi',
        email: 'yubi@hello.com',
        age: 31
    },
    {
        id: 'idtwo',
        name: 'buchu',
        email: 'buchu@gmail.com',
        age: 30
    }
]

const posts =  [
    {
        id: 'postone',
        title: 'react course',
        body: 'react and react course for the noobs',
        published: false,
        author: 'idone'
    },
    {
        id: 'posttwo',
        title: 'nodejs course',
        body: 'nodejs course for advanced',
        published: true,
        author: 'idone'
    },
    {
        id: 'postthree',
        title: 'graphql course',
        body: 'grphql course for the beginner ',
        published: true,
        author: 'idtwo'
    },
    {
        id: 'postfour',
        title: 'redux course',
        body: 'redux course for the beginner ',
        published: false,
        author: 'idtwo'
    }

]

const comments = [
    {
        id: "comment1",
        text: "great nodejs course that i have been looking for a long time",
        author: 'idone',
        post: 'posttwo'
        
    },
    {
        id: 'comment2',
        text: "Thank you for such a valuable react course",
        author: 'idtwo',
        post: 'postone'
    },
    {
        id: "comment3",
        text: "Great course so far on graphql",
        author: 'idone',
        post: 'postthree'
    },
    {
        id: 'comment5',
        text: "enjoyed throught out the course. Excellent ",
        author: 'idtwo',
        post: 'postthree'
        
    },
    {
        id: "comment4",
        text: "This is one of the best redux course out there",
        author: 'idtwo',
        post: 'postfour'
    }
]

const db = {
    users,
    posts,
    comments
}

export { db as default }