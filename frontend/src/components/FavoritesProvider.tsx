import { FavoritesContext } from "../hooks/FavoritesContext";
import useFavorites from "../hooks/useFavorites";


export default function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const favorites = useFavorites();

  return (
    <FavoritesContext.Provider value={favorites}>
      {children}
    </FavoritesContext.Provider>
  );
}
