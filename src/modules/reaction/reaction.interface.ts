import { ReactionType } from "../../../generated/prisma/enums";

export interface IToggleReactionPayload {
  type: ReactionType;
}
