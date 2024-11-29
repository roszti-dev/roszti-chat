import { tool } from "ai";
import { z } from "zod";

export const listSemesters = tool({
  description: `Use this tool to get a list of semesters from RÖszTI. Return in the following format:
  in one line semester year and term separated by space`,
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

export const getEventsForSemester = tool({
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

export const semesterTools = {
  listSemesters,
  getEventsForSemester,
};
