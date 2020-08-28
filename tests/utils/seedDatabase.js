import prisma from '../../src/prisma'
import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs";

const userOne = {
    input: {
        name: "yubi khadka",
        email: "yubikhadka@gmail.com",
        password: bcrypt.hashSync('buchukhadka')
    },
    user: undefined,
    jwt: undefined
}

const postOne = {
    input: {
        title: "Graphql course",
        body: "Everything you need to know about grphql",
        published: true,
    },
    post: undefined
}

const postTwo = {
    input: {
        title: "Prisma course",
        body: "A complete guide to Prisma",
        published: false,
    },
    post: undefined
}

const seedDatabase = async () => {
    jest.setTimeout(50000)
    await prisma.mutation.deleteManyPosts()
    await prisma.mutation.deleteManyUsers()
    userOne.user = await prisma.mutation.createUser({
        data: userOne.input
    })
    userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET)

    postOne.post = await prisma.mutation.createPost({
        data: {
            ...postOne.input,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    })

    postTwo.post = await prisma.mutation.createPost({
        data: {
            ...postTwo.input,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    })

}

export { seedDatabase as default, userOne, postOne, postTwo }