import { type ClassValue, clsx } from "clsx";
import React from "react";
import { useLocation } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { ConditionQuery, QueryOptionAPI } from "./filter_type";
import dayjs from "dayjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const delay = (timeToWait: number) =>
  new Promise((resolve) => setTimeout(resolve, timeToWait));

export const groupBy = (arr: any[], property: string) => {
  const groups: any[] = [];

  arr.forEach((value: any) => {
    if (value?.Parent === null) {
      groups.push({ ...value, Children: [] });
    } else {
      const parentIndex: number = groups.findIndex(
        (p) => p?.Id?.toLowerCase() === value[property]?.toLowerCase()
      );

      if (parentIndex >= 0) {
        groups[parentIndex]["Children"] = [
          ...groups[parentIndex]["Children"],
          value,
        ];
      }
    }
  });

  return groups;
};

export const getQueryString = (data: any): string => {
  let query = "$filter=";
  for (const key in data) {
    if (data[key] !== "" && data[key]) {
      query += `contains(${key}, '${data[key]}') and`;
    }
  }

  if (query === "$filter=") return "";

  return query.substring(0, query.length - 3);
};

export const useQueryURL = () => {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
};

// Function to get a cookie by name
export function getCookie(name: string) {
  // Split the cookie string into individual cookies
  const cookies = document.cookie.split(";");
  // Iterate through the cookies to find the one with the specified name
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();

    // Check if the cookie starts with the specified name
    if (cookie.startsWith(name + "=")) {
      // Return the value of the cookie
      return cookie.substring(name.length + 1);
    }
  }

  // Return null if the cookie is not found
  return undefined;
}

export function useQueryParams() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export const queryOptionParser = (query: QueryOptionAPI) => {
  const queryString: string[] = [];

  for (const [key, value] of Object.entries(query)) {
    if (value === "" || value === undefined || value === null) continue;
    queryString.push(`$${key}=${value}`);
  }
  return queryString.join("&");
};

export const conditionString = (key: string, value: string) => {
  if (!value || value === "") return;

  const field = key.split("_$")?.at(0);

  if (key.split("_$").at(-1)?.includes("number")) {
    return `${field} eq ${value}`;
  }

  const conStr = key.split("_$").at(-1)?.split("_").at(0);

  switch (conStr as ConditionQuery) {
    case "contains":
    case "endswith":
    case "startswith":
    case "substringof":
      return `${conStr}(${field}, '${value}')`;
    default:
      return `${field} ${conStr} '${value}'`;
  }
};

export const chunkArray = (data: any[], chunkSize: number) => {
  if (data.length === 0) return [];

  const arr: any[] = [];
  for (let index = 0; index < data.length; index += chunkSize) {
    const chunk = data.slice(index, index + chunkSize);
    arr.push(chunk);
  }
  return arr;
};

export const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;

  return function (...args: any) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

export const displayTextDate = (date: string | undefined | null) => {
  if (!date || date === "") return "";

  return dayjs(date).format("DD.MMM.YYYY");
};
