import { tool as createTool } from "ai";
import { z } from "zod";
import { userTools } from "./tools/user.tools";

export const listSemesters = createTool({
  description: `Use this tool to get a list of semesters from RÖszTI.
  .`,
  parameters: z.object({}),
  execute: async function ({}) {
    const response = await fetch(`${process.env.ROSZTI_API_URL}/semesters`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.ROSZTI_API_KEY}`,
      },
    });

    if (response.status === 401 || response.status === 403) {
      return { error: "Unauthorized" };
    }

    if (!response.ok) {
      return { error: "Something went wrong while fetching semesters." };
    }

    const data = await response.json();
    return { semesters: data };
  },
});

export const getEventsForSemester = createTool({
  description: `When asked for events, this tool will return the events for the semester.`,
  parameters: z.object({
    id: z.string(),
  }),
  execute: async function ({ id }) {
    const response = await fetch(
      `${process.env.ROSZTI_API_URL}/events/semester/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.ROSZTI_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch events");
    }

    const data = await response.json();
    return { events: data };
  },
});

export const getUsers = createTool({
  description: `When asked for users, this tool will return the users from RÖszTI.`,
  parameters: z.object({}),
  execute: async function ({}) {
    const response = await fetch(`${process.env.ROSZTI_API_URL}/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.ROSZTI_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const data = await response.json();
    return { users: data };
  },
});

export const tools = {
  listSemesters,
  getEventsForSemester,
  ...userTools,
};
