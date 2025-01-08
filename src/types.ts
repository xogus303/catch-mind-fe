export type TChatMessage = "system" | "my" | "other";
export interface IChatMessageItem {
  type: TChatMessage;
  id?: string;
  name?: string;
  message: string;
  time: Date;
  isFirstSameMin?: boolean;
  isLastSameMin?: boolean;
}
export interface IUserListItem {
  id: string;
  name: string;
  answer: string;
}
