import { createContext, useContext } from "react";

export const MyListContext = createContext(null);

export function useMyList() {
  const context = useContext(MyListContext);
  if (!context) {
    throw new Error("useMyList must be used within MyListProvider");
  }
  return context;
}
