import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './DetailsScreen.module.css';
import type { Article } from '../../types/news';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
        <a href={article.url} target="_blank" rel="noopener noreferrer" className={styles.newsLink}><OpenInNewIcon sx={{ fontSize: 20 }} /> Ver notícia original</a>
        <button className={styles.detailsBackButton} onClick={() => navigate(-1)}><ArrowBackIcon sx={{ fontSize: 20 }} /> Voltar</button>
      </div>
    </div>
  );
};

export default DetailsScreen;
