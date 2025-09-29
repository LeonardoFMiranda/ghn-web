import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './DetailsScreen.module.css';
import type { Article } from '../../types/news';

const DetailsScreen: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const article = (location.state as { article?: Article })?.article;
  if (!article) {
    return (
      <div className={styles.detailsContainer}>
        <h2 className={styles.detailsTitle}>Detalhes da Notícia</h2>
        <div className={styles.detailsPlaceholder}>
          <p>Nenhuma notícia selecionada.</p>
          <button className={styles.newsLink} onClick={() => navigate('/')}>Voltar</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.detailsContainer}>
      <h2 className={styles.detailsTitle}>{article.title}</h2>
      <div className={styles.detailsMeta}>
        <span className={styles.newsSource}>{article.source.name} </span>
        <span className={styles.newsDate}>{new Date(article.publishedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
      </div>
      {article.urlToImage && (
        <img src={article.urlToImage} alt={article.title} className={styles.detailsImage} />
      )}
      <p className={styles.detailsDescription}>{article.description}</p>
      <p className={styles.detailsContent}>{article.content}</p>
      <div className={styles.detailsActions}>
        <a href={article.url} target="_blank" rel="noopener noreferrer" className={styles.newsLink}>Ver notícia original</a>
        <button className={styles.newsLink} onClick={() => navigate(-1)}>Voltar</button>
      </div>
    </div>
  );
};

export default DetailsScreen;
