export const offset = new Date().getTimezoneOffset() * 60000;
export const koreaNewDate = (date?: Date) => {
  return new Date((date === undefined ? Date.now() : date.getTime()) - offset);
};
