export const founderDescriptor = "Legal Professional • Global Mobility Strategist";

export const founderStory = [
  "Mercy Allison is a Nigerian legal professional and global mobility strategist with experience in U.S. legal immigration support, professional documentation, profile assessment, and client advisory.",
  "Since 2023, she has helped professionals across fields ranging from healthcare and engineering secure global opportunities, including U.S. skilled-worker and employment-based immigration pathways, fellowships, grants, conferences, and other international opportunities.",
  "Her work focuses on helping professionals understand the strengths of their profiles, identify and develop evidence of their achievements, and present their expertise and experience effectively for the opportunities they seek.",
].join("\n\n");

export const founderIntro = founderStory.split("\n\n")[0];

export const louisBio = "The operations anchor: bringing structure to daily work, keeping details aligned and helping every engagement move forward smoothly.";

export const needsLouisBio = (bio: string) =>
  !bio.trim() || bio.startsWith("Louis keeps the day-to-day work at Provisa organised and moving forward.");