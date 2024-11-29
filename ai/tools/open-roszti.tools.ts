import { tool } from "ai";
import { cookies } from "next/headers";
import { z } from "zod";

export const getOpenRosztiPoints = tool({
  description: `Use this tool to get the users OpenRÖszTI points. This tool also returns a list of attended events and a status, so if the user asks for those  use this tool.
    Elért pontszám event is the number of points
    Státusz event is the status of the user
    Részvételek száma event is the number of attended events
    Szavazati jog / Aktivitás event is the voting rights of the user or the activity of the user
    `,
  parameters: z.object({}),
  execute: async function ({}) {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token");

    const response = await fetch(
      `${process.env.OLD_ROSZTI_API_URL}/open-roszti`,
      {
        method: "POST",
        body: JSON.stringify({
          engine: "v2",
          range: "2024-2025 ősz",
        }),
        headers: {
          Authorization: `Bearer ${token?.value}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 401 || response.status === 403) {
      return { error: "Unauthorized" };
    }

    if (!response.ok) {
      return {
        error: `Something went wrong while fetching OpenRoszti points.`,
      };
    }

    const data = await response.json();
    console.log(data);

    return { openRosztiData: data };
  },
});

export const openRosztiTools = {
  getOpenRosztiPoints,
};
