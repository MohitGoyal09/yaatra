import { PrismaClient } from "../app/generated/prisma";

const prisma = new PrismaClient();

async function seedSocialData() {
  console.log("🌱 Seeding social media data...");

  // Create sample users if they don't exist
  const users = await Promise.all([
    prisma.user.upsert({
      where: { phone_number: "demo1@yaat.com" },
      update: {},
      create: {
        phone_number: "demo1@yaat.com",
        name: "Priya Sharma",
        language_preference: "Hindi",
        totalPunyaPoints: 150,
      },
    }),
    prisma.user.upsert({
      where: { phone_number: "demo2@yaat.com" },
      update: {},
      create: {
        phone_number: "demo2@yaat.com",
        name: "Rajesh Kumar",
        language_preference: "English",
        totalPunyaPoints: 200,
      },
    }),
    prisma.user.upsert({
      where: { phone_number: "demo3@yaat.com" },
      update: {},
      create: {
        phone_number: "demo3@yaat.com",
        name: "Sunita Patel",
        language_preference: "Gujarati",
        totalPunyaPoints: 175,
      },
    }),
  ]);

  // Create sample posts
  const samplePosts = [
    {
      content: `🎉 Just completed my first seva at the local temple! 

Cleaned the premises and helped organize the community kitchen. The feeling of serving others is truly divine. 

Every small act of seva brings us closer to our dharma. Let's keep the spirit of service alive! 🙏`,
      post_type: "seva",
      hashtags: ["Seva", "Temple", "Community", "Dharma", "Service"],
      userId: users[0].id,
    },
    {
      content: `🏆 Reached 100 hours of seva service! 

This milestone means so much to me. From helping at community events to supporting local families, every hour has been a blessing.

Thank you to everyone who has been part of this journey. Together we can make Ujjain even more beautiful! ✨`,
      post_type: "achievement",
      hashtags: ["Milestone", "100Hours", "Seva", "Ujjain", "Community"],
      userId: users[1].id,
    },
    {
      content: `📅 Community cleaning drive this weekend!

Join us on Saturday morning at 7 AM near the ghats. We'll be cleaning the area and planting some new trees.

Bring your friends and family - seva is more fun when we do it together! 🌱`,
      post_type: "event",
      hashtags: [
        "CleaningDrive",
        "Community",
        "Weekend",
        "Environment",
        "Together",
      ],
      userId: users[2].id,
    },
    {
      content: `💝 Donated to the local school's library fund today.

Education is the foundation of a strong community. Every child deserves access to good books and learning resources.

If you can, please consider supporting local educational initiatives. Knowledge is the greatest seva we can offer! 📚`,
      post_type: "general",
      hashtags: ["Donation", "Education", "School", "Library", "Children"],
      userId: users[0].id,
    },
    {
      content: `🙏 Found a lost child near the temple today and helped reunite them with their family.

The relief on the parents' faces was priceless. Sometimes seva comes in unexpected ways.

Always stay alert and ready to help others. You never know when you might be someone's guardian angel! 👼`,
      post_type: "seva",
      hashtags: ["FoundChild", "Help", "Family", "Temple", "GuardianAngel"],
      userId: users[1].id,
    },
    {
      content: `🌅 Morning seva at the ghats is always special.

Watching the sunrise while serving others creates a perfect start to the day. The peaceful atmosphere and the gratitude of people make it all worthwhile.

If you haven't tried morning seva yet, I highly recommend it! ☀️`,
      post_type: "seva",
      hashtags: ["MorningSeva", "Ghats", "Sunrise", "Peace", "Gratitude"],
      userId: users[2].id,
    },
  ];

  // Create posts
  for (const postData of samplePosts) {
    await prisma.socialPost.create({
      data: postData,
    });
  }

  // Create some sample likes and comments
  const posts = await prisma.socialPost.findMany();

  // Add some likes
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const likers = users.filter((_, index) => index !== i % users.length);

    for (const liker of likers) {
      await prisma.postLike.create({
        data: {
          postId: post.id,
          userId: liker.id,
        },
      });
    }
  }

  // Add some comments
  const comments = [
    "Amazing work! Keep it up! 🙏",
    "This is so inspiring! Thank you for sharing.",
    "I'll definitely join next time!",
    "Your seva is making a real difference!",
    "Blessed to have people like you in our community!",
    "This motivates me to do more seva!",
  ];

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const commenter = users[i % users.length];

    await prisma.postComment.create({
      data: {
        postId: post.id,
        userId: commenter.id,
        content: comments[i % comments.length],
      },
    });
  }

  console.log("✅ Social media data seeded successfully!");
  console.log(
    `📊 Created ${users.length} users, ${posts.length} posts, and various interactions`
  );
}

seedSocialData()
  .catch((e) => {
    console.error("❌ Error seeding social data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
