import { useContext } from "react";
import { FavoritesContext } from "./FavoritesContext";

export function useFavoritesContext() {
    const ctx = useContext(FavoritesContext);
    if (!ctx) throw new Error("useFavoritesContext must be used inside <FavoritesProvider>");
    return ctx;
}

