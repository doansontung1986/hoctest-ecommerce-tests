export const formatPrice = (value: number): string => {
  const withSeparator = String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${withSeparator} $`;
};
