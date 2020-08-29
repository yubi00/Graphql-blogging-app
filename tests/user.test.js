import "@babel/polyfill";
import "cross-fetch/polyfill";
import prisma from "../src/prisma";
import seedDatabase, { userOne } from "./utils/seedDatabase";
import getClient from "./utils/getClient";
import { createUser, getUsers, getProfile, login } from "./utils/operations";

const client = getClient();

beforeEach(seedDatabase);

test("should create a new user", async () => {
  const variables = {
    data: {
      name: "yubikhadka",
      email: "yubrajkhadka00@gmail.com",
      password: "buchukhadka",
    },
  };

  const response = await client.mutate({
    mutation: createUser,
    variables,
  });

  const user = await prisma.exists.User({
    id: response.data.createUser.user.id,
  });
  expect(user).toBe(true);
});

test("should expose public author profile", async () => {
  const response = await client.query({ query: getUsers });

  expect(response.data.users.length).toBe(2);
  expect(response.data.users[0].email).toBe(null);
  expect(response.data.users[0].name).toBe("yubi khadka");
});

test("should not login with bad credentials", async () => {
  const variables = {
    data: {
      email: "yubikhadka@gmail.com",
      password: "incorrectsomething",
    },
  };
  await expect(
    client.mutate({
      mutation: login,
      variables,
    })
  ).rejects.toThrow();
});

test("should not signup with shorter password", async () => {
  const variables = {
    data: {
      name: "buchu",
      email: "buchubuchu@gmail.com",
      password: "buchu",
    },
  };
  await expect(
    client.mutate({
      mutation: createUser,
      variables,
    })
  ).rejects.toThrow();
});

test("should  fetch user profile if authenticated", async () => {
  const client = getClient(userOne.jwt);

  const { data } = await client.query({ query: getProfile });
  expect(data.me.id).toBe(userOne.user.id);
});
