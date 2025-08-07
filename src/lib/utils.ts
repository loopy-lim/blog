import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const publicUrlRemover = (url: string) => {
  if (url.startsWith("/public/")) {
    return url.replace("/public/", "/");
  }
  if (url.startsWith("public/")) {
    return url.replace("public/", "/");
  }
  return url;
};
