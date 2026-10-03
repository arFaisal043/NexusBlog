import { ReactionType } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const toggleReaction = async (postId: string, userId: string, type: ReactionType) => {
  // Check if post exists
  const post = await prisma.post.findUniqueOrThrow({ where: { id: postId } });

  // If the post is premium, ensure the user is an active premium user
  if (post.isPremium) {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });
    if (subscription?.status !== "ACTIVE") {
      throw new Error("Only active premium users can react to premium posts.");
    }
  }

  const existingReaction = await prisma.reaction.findUnique({
    where: {
      postId_userId: {
        postId,
        userId,
      },
    },
  });

  if (existingReaction) {
    if (existingReaction.type === type) {
      // Toggle off
      await prisma.reaction.delete({
        where: { id: existingReaction.id },
      });
      
      return { message: "Reaction removed", action: "removed" };
    } 
    else {
      // Update reaction type
      const updatedReaction = await prisma.reaction.update({
        where: { id: existingReaction.id },
        data: { type },
      });
      
      return { message: "Reaction updated", action: "updated", data: updatedReaction };
    }
  } 
  else {
    // Create new reaction
    const newReaction = await prisma.reaction.create({
      data: {
        postId,
        userId,
        type,
      },
    });
    
    return { message: "Reaction added", action: "added", data: newReaction };
  }
};

export const reactionService = {
  toggleReaction,
};
