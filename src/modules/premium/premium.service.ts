import { prisma } from "../../lib/prisma"

// for get premium post for subscribed users
const GetPremiumContent = async () => {
  const posts = await prisma.post.findMany({
    where: {
      isPremium: true,
    },
  });

  return posts;
};

export const premiumContentService = {
  GetPremiumContent,
};