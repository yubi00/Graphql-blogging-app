import "@babel/polyfill";
import "cross-fetch/polyfill";
import prisma from "../src/prisma";
import { gql } from "apollo-boost";
import seedDatabase, { userOne, postOne, postTwo } from "./utils/seedDatabase";
import getClient from "./utils/getClient";

const client = getClient();

beforeEach(seedDatabase);

test("should return only published posts", async () => {
  const getPosts = gql`
    query {
      posts {
        id
        title
        body
        published
      }
    }
  `;
  const response = await client.query({ query: getPosts });

  expect(response.data.posts.length).toBe(1);
  expect(response.data.posts[0].published).toBe(true);
});

test("should  fetch posts for authencticated user", async () => {
  const client = getClient(userOne.jwt);
  const getPosts = gql`
    query {
      myPosts {
        id
        title
        body
        published
      }
    }
  `;
  const { data } = await client.query({ query: getPosts });
  expect(data.myPosts.length).toBe(2);
});

test("should be able to update own post", async () => {
  const client = getClient(userOne.jwt);
  const updatePost = gql`
        mutation {
            updatePost(
                id: "${postOne.post.id}",
                data: {
                    published: false
                }
            ){
                id 
                title 
                body 
                published
            }
        }
    `;
  const { data } = await client.mutate({ mutation: updatePost });
  const exists = await prisma.exists.Post({
    id: postOne.post.id,
    published: false,
  });
  expect(data.updatePost.published).toBe(false);
  expect(exists).toBe(true);
});

test("should create a new post", async () => {
  const client = getClient(userOne.jwt);
  const createPost = gql`
    mutation {
      createPost(
        data: {
          title: "nodejs course"
          body: "An essential guide to Nodejs"
          published: true
        }
      ) {
        id
        title
        body
        published
      }
    }
  `;
  const { data } = await client.mutate({ mutation: createPost });
  const exists = await prisma.exists.Post({
    id: data.createPost.id,
  });
  expect(data.createPost.title).toBe("nodejs course");
  expect(exists).toBe(true);
});

test("should delete a post", async () => {
  const client = getClient(userOne.jwt);
  const deletePost = gql`
        mutation {
            deletePost( 
                id: "${postTwo.post.id}" 
            ){
                id
                title
            }
        }
    `;
  await client.mutate({ mutation: deletePost });
  const exists = await prisma.exists.Post({
    id: postTwo.post.id,
  });
  expect(exists).toBe(false);
});
