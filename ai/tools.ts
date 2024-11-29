import { userTools } from "./tools/user.tools";
import { semesterTools } from "./tools/semester.tools";
import { leadTools } from "./tools/lead.tools";

export const tools = {
  ...semesterTools,
  ...userTools,
  ...leadTools,
};
