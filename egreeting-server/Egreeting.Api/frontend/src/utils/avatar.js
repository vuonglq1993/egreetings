// src/utils/avatar.js
export const generateRandomAvatar = (seed, size = 120) => {
  // Sử dụng cùng một logic cho cả Profile và Header
  const name = typeof seed === 'string' ? seed : 'User';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=FFD700&color=000&size=${size}&bold=true&rounded=true`;
};

export const getStableAvatar = (user) => {
  // Tạo avatar ổn định dựa trên user ID hoặc email
  const seed = user?.id ? `user${user.id}` : user?.email || user?.fullName || 'User';
  return generateRandomAvatar(seed, 120);
};

export const getStableAvatarSmall = (user) => {
  // Avatar nhỏ cho Header
  const seed = user?.id ? `user${user.id}` : user?.email || user?.fullName || 'User';
  return generateRandomAvatar(seed, 36);
};