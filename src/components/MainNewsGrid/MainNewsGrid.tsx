import React from 'react';
import styles from './MainNewsGrid.module.css';
import type { Article } from '../../types/news';
import { useNavigate } from 'react-router-dom';

interface MainNewsGridProps {
  articles: Article[];
  isFavorite: (url: string) => boolean;
  addFavorite: (article: Article) => void;
  removeFavorite: (url: string) => void;
}

const MainNewsGrid: React.FC<MainNewsGridProps> = ({
  articles,
  isFavorite,
  addFavorite,
  removeFavorite,
}) => {
  const navigate = useNavigate();

  return (
    <div className={styles.mainNewsGrid}>
      {articles.map((article, idx) => (
        <div
          className={styles.mainNewsCard}
          key={idx}
          onClick={() => navigate(`/details/main-${idx}`, { state: { article } })}
        >
          <button
            className={isFavorite(article.url) ? styles.favStarActive : styles.favStar}
            onClick={e => {
              e.stopPropagation();
              if (isFavorite(article.url)) {
                removeFavorite(article.url);
              } else {
                addFavorite(article);
              }
            }}
          >
            {isFavorite(article.url) ? '★' : '☆'}
          </button>
          {article.urlToImage ? (
            <img src={article.urlToImage} alt={article.title} className={styles.mainNewsImage} />
          ) : (
            <div className={`${styles.mainNewsImage} ${styles.newsImagePlaceholder}`}>📰</div>
          )}
          <div className={styles.mainNewsContent}>
            <h3 className={styles.mainNewsTitle}>{article.title}</h3>
            <div className={styles.mainNewsMeta}>
              <span className={styles.mainNewsSource}>{article.source.name}</span>
              <span className={styles.mainNewsDate}>
                {new Date(article.publishedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>
            {idx === 0 && article.description && (
              <p className={styles.mainNewsDescription}>{article.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MainNewsGrid;