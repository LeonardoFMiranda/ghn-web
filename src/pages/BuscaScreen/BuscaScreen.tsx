import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './BuscaScreen.module.css';
import notFoundImg from '../../assets/notFound.png';

const API_URL = 'https://newsapi.org/v2/everything';
const API_KEY = import.meta.env.VITE_API_KEY;

function formatDate(dateStr: string) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

const BuscaScreen: React.FC = () => {
    const { query } = useParams<{ query: string }>();
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!query) return;
        setLoading(true);
        fetch(`${API_URL}?q=${encodeURIComponent(query)}&language=pt&apiKey=${API_KEY}`)
            .then(res => res.json())
            .then(data => {
                const filtered = (data.articles || []).filter(
                    (art: any) => !art.url?.includes('kk.org')
                );
                setArticles(filtered);
            })
            .finally(() => setLoading(false));
    }, [query]);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>
                Resultados para: <span className={styles.highlight}>{query}</span>
            </h2>
            {loading && <p>Carregando...</p>}
            {!loading && articles.length === 0 && (
                <div style={{ textAlign: 'center', margin: '32px 0' }}>
                    <img className={styles.notFoundImage} src={notFoundImg} alt="Macaquinho triste" />
                    <p style={{ color: '#888', marginTop: 16, fontSize: 18 }}>
                        Nenhuma notícia encontrada.<br />O macaquinho está trabalhando triste...
                    </p>
                </div>
            )}
            <ul className={styles.list}>
                {articles.map((article, idx) => (
                    <li key={idx} className={styles.item}>
                        <div className={styles.imageWrap}>
                            {article.urlToImage ? (
                                <img
                                    src={article.urlToImage}
                                    alt={article.title}
                                    className={styles.image}
                                />
                            ) : (
                                <span className={styles.icon}>📰</span>
                            )}
                        </div>
                        <div className={styles.content}>
                            <p
                                onClick={() => {
                                    navigate(`/details/${idx}`, { state: { article } });
                                }}
                                className={styles.link}
                            >
                                {article.title}
                            </p>
                            <div className={styles.meta}>
                                {article.source?.name} &middot; {formatDate(article.publishedAt)}
                            </div>
                            <div className={styles.desc}>
                                {article.description}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BuscaScreen;