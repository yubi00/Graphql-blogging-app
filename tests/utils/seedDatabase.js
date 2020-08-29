import prisma from "../../src/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userOne = {
  input: {
    name: "yubi khadka",
    email: "yubikhadka@gmail.com",
    password: bcrypt.hashSync("buchukhadka"),
  },
  user: undefined,
  jwt: undefined,
};

const userTwo = {
  input: {
    name: "Buchu khadka",
    email: "buchukhadka@gmail.com",
    password: bcrypt.hashSync("yubikhadka"),
  },
  user: undefined,
  jwt: undefined,
};

const postOne = {
  input: {
    title: "Graphql course",
    body: "Everything you need to know about grphql",
    published: true,
  },
  post: undefined,
};

const postTwo = {
  input: {
    title: "Prisma course",
    body: "A complete guide to Prisma",
    published: false,
  },
  post: undefined,
};

const commentOne = {
  input: {
    text: "Such a great course",
  },
  comment: undefined,
};

const commentTwo = {
  input: {
    text: "This course provides all the concepts that i have been looking for",
  },
  comment: undefined,
};

const seedDatabase = async () => {
  jest.setTimeout(50000);
  await prisma.mutation.deleteManyComments();
  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyUsers();
  userOne.user = await prisma.mutation.createUser({
    data: userOne.input,
  });
  userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET);

  userTwo.user = await prisma.mutation.createUser({
    data: userTwo.input,
  });
  userTwo.jwt = jwt.sign({ userId: userTwo.user.id }, process.env.JWT_SECRET);

  postOne.post = await prisma.mutation.createPost({
    data: {
      ...postOne.input,
      author: {
        connect: {
          id: userOne.user.id,
        },
      },
    },
  });

  postTwo.post = await prisma.mutation.createPost({
    data: {
      ...postTwo.input,
      author: {
        connect: {
          id: userOne.user.id,
        },
      },
    },
  });

  commentOne.comment = await prisma.mutation.createComment({
    data: {
      ...commentOne.input,
      post: {
        connect: {
          id: postOne.post.id,
        },
      },
      author: {
        connect: {
          id: userTwo.user.id,
        },
      },
    },
  });

  commentTwo.comment = await prisma.mutation.createComment({
    data: {
      ...commentTwo.input,
      post: {
        connect: {
          id: postOne.post.id,
        },
      },
      author: {
        connect: {
          id: userOne.user.id,
        },
      },
    },
  });
};

export {
  seedDatabase as default,
  userOne,
  userTwo,
  postOne,
  postTwo,
  commentOne,
  commentTwo,
};
