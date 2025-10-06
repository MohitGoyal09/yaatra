import { NextRequest, NextResponse } from "next/server";

// Share templates for different achievement types
const SHARE_TEMPLATES = {
  found_person: {
    title: "Found Someone! 🎉",
    template: `🎉 I just helped find a missing person through Yaat! 

Every small act of seva makes a difference. 
Together we can build a stronger community.

#Seva #Dharma #Community #YaatApp #FoundSomeone`,
    hashtags: ["#Seva", "#Dharma", "#Community", "#YaatApp", "#FoundSomeone"],
  },
  leaderboard: {
    title: "Leaderboard Achievement! 🏆",
    template: `🏆 Made it to the top 10 in Yaat's seva leaderboard!

Grateful for the opportunity to serve our community.
Let's keep spreading kindness together.

#Seva #Leaderboard #Community #YaatApp #Top10`,
    hashtags: ["#Seva", "#Leaderboard", "#Community", "#YaatApp", "#Top10"],
  },
  event: {
    title: "Event Completed! 📅",
    template: `📅 Just completed a community cleaning event through Yaat!

Small actions, big impact. 
Join me in making our community better.

#Seva #CommunityService #YaatApp #CleaningDrive`,
    hashtags: ["#Seva", "#CommunityService", "#YaatApp", "#CleaningDrive"],
  },
  task: {
    title: "Task Completed! 🧹",
    template: `🧹 Just completed a seva task through Yaat!

Every small action counts towards building a better community.
Let's keep the seva spirit alive!

#Seva #Community #YaatApp #TaskCompleted`,
    hashtags: ["#Seva", "#Community", "#YaatApp", "#TaskCompleted"],
  },
  donation: {
    title: "Donation Made! 💝",
    template: `💝 Just made a donation through Yaat!

Supporting our community one step at a time.
Together we can make a real difference.

#Seva #Donation #Community #YaatApp #GivingBack`,
    hashtags: ["#Seva", "#Donation", "#Community", "#YaatApp", "#GivingBack"],
  },
  milestone: {
    title: "Milestone Reached! 🎯",
    template: `🎯 Just reached a seva milestone through Yaat!

{hours} hours of service and counting.
Every moment of seva brings us closer together.

#Seva #Milestone #Community #YaatApp #Service`,
    hashtags: ["#Seva", "#Milestone", "#Community", "#YaatApp", "#Service"],
  },
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const userName = searchParams.get("userName") || "Friend";
    const hours = searchParams.get("hours") || "100";

    if (type && SHARE_TEMPLATES[type as keyof typeof SHARE_TEMPLATES]) {
      const template = SHARE_TEMPLATES[type as keyof typeof SHARE_TEMPLATES];
      let content = template.template;

      // Replace placeholders
      content = content.replace("{userName}", userName);
      content = content.replace("{hours}", hours);

      return NextResponse.json({
        success: true,
        template: {
          ...template,
          content,
        },
      });
    }

    // Return all templates if no specific type requested
    return NextResponse.json({
      success: true,
      templates: SHARE_TEMPLATES,
    });
  } catch (error) {
    console.error("Error fetching share templates:", error);
    return NextResponse.json(
      { error: "Failed to fetch share templates" },
      { status: 500 }
    );
  }
}
