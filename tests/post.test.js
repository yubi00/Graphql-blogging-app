import "@babel/polyfill";
import "cross-fetch/polyfill";
import prisma from "../src/prisma";
import seedDatabase, { userOne, postOne, postTwo } from "./utils/seedDatabase";
import {
  getPosts,
  myPosts,
  updatePost,
  createPost,
  deletePost,
} from "./utils/operations";
import getClient from "./utils/getClient";

const client = getClient();

beforeEach(seedDatabase);

test("should return only published posts", async () => {
  const response = await client.query({ query: getPosts });

  expect(response.data.posts.length).toBe(1);
  expect(response.data.posts[0].published).toBe(true);
});

test("should  fetch posts for authencticated user", async () => {
  const client = getClient(userOne.jwt);

  const { data } = await client.query({ query: myPosts });
  expect(data.myPosts.length).toBe(2);
});

test("should be able to update own post", async () => {
  const variables = {
    id: postOne.post.id,
    data: {
      published: false,
    },
  };
  const client = getClient(userOne.jwt);

  const { data } = await client.mutate({ mutation: updatePost, variables });
  const exists = await prisma.exists.Post({
    id: postOne.post.id,
    published: false,
  });
  expect(data.updatePost.published).toBe(false);
  expect(exists).toBe(true);
});

test("should create a new post", async () => {
  const client = getClient(userOne.jwt);
  const variables = {
    data: {
      title: "nodejs course",
      body: "An essential guide to Nodejs",
      published: true,
    },
  };

  const { data } = await client.mutate({ mutation: createPost, variables });
  const exists = await prisma.exists.Post({
    id: data.createPost.id,
  });
  expect(data.createPost.title).toBe("nodejs course");
  expect(exists).toBe(true);
});

test("should delete a post", async () => {
  const client = getClient(userOne.jwt);
  const variables = {
    id: postTwo.post.id,
  };
  await client.mutate({ mutation: deletePost, variables });
  const exists = await prisma.exists.Post({
    id: postTwo.post.id,
  });
  expect(exists).toBe(false);
});
