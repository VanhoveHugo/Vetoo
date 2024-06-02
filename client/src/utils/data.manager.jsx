export const handleType = (type) => {
  switch (type) {
    case "d":
      return "Dog";
    case "c":
      return "Cat";
    case "n":
      return "NAC";
    default:
      return "Unknown";
  }
};

export const handleDate = (date) => {
  if (!date) return null;
  const newDate = new Date(date);
  return newDate.toLocaleDateString();
};
