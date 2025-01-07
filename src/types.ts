export type TChatMessage = "system" | "my" | "other";
export interface IChatMessageItem {
  type: TChatMessage;
  id?: string;
  name?: string;
  message: string;
  time: Date;
  isSameId?: boolean;
  isLastSameMin?: boolean;
}
