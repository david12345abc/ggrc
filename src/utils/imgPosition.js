export const getImgPosition = (item) => {
  const pos = item?.extra_data?.img_pos;
  if (!pos) return undefined;
  return `${pos.x}% ${pos.y}%`;
};
