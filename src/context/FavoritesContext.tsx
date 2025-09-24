import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Article } from '../types/news';
import type { FavoritesContextType } from '../types/favorite';

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Article[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('favorites');
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  const addFavorite = (article: Article) => {
    if (!favorites.find(fav => fav.url === article.url)) {
      const updated = [...favorites, article];
      setFavorites(updated);
      localStorage.setItem('favorites', JSON.stringify(updated));
    }
  };

  const removeFavorite = (url: string) => {
    const updated = favorites.filter(fav => fav.url !== url);
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated)); 
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('Erro no Favorites Context');
  return context;
};
