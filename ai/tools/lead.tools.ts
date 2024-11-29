import { tool } from "ai";
import { z } from "zod";

export const getLeadsBySalesExec = tool({
  description: `This tool retrieves leads by sales exec name. Capitalize the sales exec name with firstname lastname and displays it in a clear, structured format. Return the list in the following format:
  ### Company Name
  - Address
  - Email
  - Phone
  - Status
  - A link which's name is "To the Tool" and the URL is https://msg-sf-dev.salesfunnel-dev.rio.cloud/customers/(ID)
  `,
  parameters: z.object({
    salesExec: z.string(),
  }),
  execute: async function ({ salesExec }) {
    const response = await fetch(
      `${process.env.MAN_API_URL}/api/leads?sales_exec=${salesExec}&per_page=10`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.MAN_API_KEY}`,
        },
      }
    );

    if (response.status === 401 || response.status === 403) {
      return { error: "Unauthorized" };
    }

    if (!response.ok) {
      return {
        error: `Something went wrong while fetching leads.`,
      };
    }

    const data = await response.json();
    return {
      leads: data.leads.map(
        (lead: { _id: string; companyProfile: unknown }) => ({
          id: lead._id,
          companyProfile: lead.companyProfile,
        })
      ),
    };
  },
});

export const leadTools = {
  getLeadsBySalesExec,
};
