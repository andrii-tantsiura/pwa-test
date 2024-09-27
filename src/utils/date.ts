export const isEventEarlierThan = (
  eventDate: Date,
  daysAgo: number
): boolean => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - daysAgo);

  return currentDate.getTime() >= eventDate.getTime();
};
