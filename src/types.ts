export type TChatMessage = "system" | "my" | "other";
export interface IChatMessageItem {
  type: TChatMessage;
  message: string;
}
