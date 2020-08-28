import "@babel/polyfill";
import "cross-fetch/polyfill";
import prisma from "../src/prisma";
import { gql } from "apollo-boost";
import seedDatabase, { userOne } from "./utils/seedDatabase";
import getClient from "./utils/getClient";

const client = getClient();

beforeEach(seedDatabase);

test("should create a new user", async () => {
  const createUser = gql`
    mutation {
      createUser(
        data: {
          name: "yubakhadka"
          email: "samplehelloworld@gmail.com"
          password: "123yubikhadka"
        }
      ) {
        token
        user {
          id
          name
          email
        }
      }
    }
  `;
  const response = await client.mutate({ mutation: createUser });
  const user = await prisma.exists.User({
    id: response.data.createUser.user.id,
  });
  expect(user).toBe(true);
});

test("should expose public author profile", async () => {
  const getUsers = gql`
    query {
      users {
        id
        name
        email
      }
    }
  `;

  const response = await client.query({ query: getUsers });

  expect(response.data.users.length).toBe(1);
  expect(response.data.users[0].email).toBe(null);
  expect(response.data.users[0].name).toBe("yubi khadka");
});

test("should not login with bad credentials", async () => {
  const login = gql`
    mutation {
      loginUser(
        data: {
          email: "helloworladdfaf@gmail.com"
          password: "somethingincorrect"
        }
      ) {
        token
        user {
          id
          name
          email
        }
      }
    }
  `;
  await expect(client.mutate({ mutation: login })).rejects.toThrow();
});

test("should not signup with shorter password", async () => {
  const signup = gql`
    mutation {
      createUser(
        data: {
          name: "buchu"
          email: "buchubuchu@gmail.com"
          password: "buchu"
        }
      ) {
        token
        user {
          name
          email
        }
      }
    }
  `;
  await expect(client.mutate({ mutation: signup })).rejects.toThrow();
});

test("should  fetch user profile if authenticated", async () => {
  const client = getClient(userOne.jwt);
  const getProfile = gql`
    query {
      me {
        id
        name
        email
      }
    }
  `;
  const { data } = await client.query({ query: getProfile });
  expect(data.me.id).toBe(userOne.user.id);
});
