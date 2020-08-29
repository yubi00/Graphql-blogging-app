import "@babel/polyfill";
import "cross-fetch/polyfill";
import prisma from "../src/prisma";
import seedDatabase, {
  userOne,
  userTwo,
  commentOne,
  postOne,
} from "./utils/seedDatabase";
import getClient from "./utils/getClient";
import { deleteComment, subscribeToComments } from "./utils/operations";

const client = getClient();

beforeEach(seedDatabase);

test("should delete own comment", async () => {
  const client = getClient(userTwo.jwt);

  const variables = {
    id: commentOne.comment.id,
  };

  await client.mutate({ mutation: deleteComment, variables });
  const exists = await prisma.exists.Comment({ id: commentOne.comment.id });
  expect(exists).toBe(false);
});

test("should not delete other users comment", async () => {
  const client = getClient(userOne.jwt);

  const variables = {
    id: commentOne.comment.id,
  };

  await expect(
    client.mutate({
      mutation: deleteComment,
      variables,
    })
  ).rejects.toThrow();
});

test("should subscribe to comment for a post", async (done) => {
  const variables = {
    postId: postOne.post.id,
  };

  client.subscribe({ query: subscribeToComments, variables }).subscribe({
    next(response) {
      expect(response.data.comment.mutation).toBe("DELETED");
      done();
    },
  });

  await prisma.mutation.deleteComment({
    where: {
      id: commentOne.comment.id,
    },
  });
});
