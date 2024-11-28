import { tool } from "ai";
import { getDisplayName } from "next/dist/shared/lib/utils";
import { z } from "zod";

const getUsers = tool({
  description: `When asked for users, this tool will return the users from RÖszTI.`,
  parameters: z.object({}),
  execute: async function ({}) {
    const response = await fetch(`${process.env.ROSZTI_API_URL}/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.ROSZTI_API_KEY}`,
      },
    });

    if (response.status === 401 || response.status === 403) {
      return { error: "Unauthorized" };
    }

    if (!response.ok) {
      return { error: "Something went wrong while fetching users." };
    }

    const data = await response.json();
    return { users: data };
  },
});

const createUser = tool({
  description: "Create a new user in RÖszTI.",
  parameters: z.object({
    userName: z.string(),
    displayName: z.string(),
    email: z.string(),
    password: z
      .string()
      .optional()
      .describe("If not provided, a generate a secure password."),
  }),
  execute: async function ({ userName, email, displayName, password }) {
    if (!password) {
      password = "aa";
    }

    const response = await fetch(
      `${process.env.ROSZTI_API_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.ROSZTI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ displayName, email, userName, password }),
      }
    );

    if (response.status === 401 || response.status === 403) {
      return { error: "Unauthorized" };
    }

    if (!response.ok) {
      return { error: "Something went wrong while fetching semesters." };
    }

    const data = await response.json();
    return { user: data };
  },
});

export const userTools = {
  getUsers,
  createUser,
};
