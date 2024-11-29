import { userTools } from "./tools/user.tools";
import { semesterTools } from "./tools/semester.tools";
import { leadTools } from "./tools/lead.tools";
import { openRosztiTools } from "./tools/open-roszti.tools";

export const tools = {
  ...semesterTools,
  ...userTools,
  ...leadTools,
  ...openRosztiTools,
};
