import { createContext } from "react";
import type useFavorites from "./useFavorites";

export const FavoritesContext = createContext<ReturnType<typeof useFavorites> | null>(null);
