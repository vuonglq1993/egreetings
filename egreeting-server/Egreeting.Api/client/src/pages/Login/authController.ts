import type{ MouseEvent } from "react";

// Bật chế độ Register
export const handleRegisterToggle = (
  e: MouseEvent<HTMLButtonElement>,
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>
): void => {
  e.preventDefault();
  setIsActive(true);
};

// Bật chế độ Login
export const handleLoginToggle = (
  e: MouseEvent<HTMLButtonElement>,
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>
): void => {
  e.preventDefault();
  setIsActive(false);
};