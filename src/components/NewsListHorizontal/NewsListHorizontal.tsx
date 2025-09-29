import React from 'react';
import styles from './NewsListHorizontal.module.css';
import type { Article } from '../../types/news';
import { useNavigate } from 'react-router-dom';

interface NewsListHorizontalProps {
  articles: Article[];
  isFavorite: (url: string) => boolean;
  addFavorite: (article: Article) => void;
  removeFavorite: (url: string) => void;
  startIndex?: number; 
}

const NewsListHorizontal: React.FC<NewsListHorizontalProps> = ({
  articles,
  isFavorite,
  addFavorite,
  removeFavorite,
  startIndex = 0,
}) => {
  const navigate = useNavigate();

  return (
    <div className={styles.newsList}>
      {articles.map((article, idx) => (
        <div className={styles.newsListItem} key={idx + startIndex}>
          <div className={styles.newsListImageWrap}>
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
              <img src={article.urlToImage} alt={article.title} className={styles.newsListImage} />
            ) : (
              <div className={`${styles.newsListImage} ${styles.newsImagePlaceholder}`}>📰</div>
            )}
          </div>
          <div className={styles.newsListContent}>
            <h3 className={styles.newsTitle}>{article.title}</h3>
            <div className={styles.newsMeta}>
              <span className={styles.newsSource}>{article.source.name}</span>
              <span className={styles.newsDate}>
                {new Date(article.publishedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <p className={styles.newsDescription}>{article.description}</p>
            <div className={styles.newsActions}>
              <button
                className={styles.newsLink}
                onClick={() => navigate(`/details/${idx + startIndex}`, { state: { article } })}
              >
                Ver detalhes
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsListHorizontal;