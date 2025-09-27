import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HomeScreen.module.css';
import type { Article } from '../../types/news';
import { useFavorites } from '../../context/FavoritesContext';
import { useArticlesCache } from '../../context/ArticlesCacheContext';
import notFoundImg from '../../assets/notFound.png';

const API_URL = 'https://newsapi.org/v2/everything';
const API_KEY = import.meta.env.VITE_API_KEY;
const PAGE_SIZE = 10;
const categories = [
    { label: 'Tudo', value: 'news' },
];

const HomeScreen: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [rawArticles, setRawArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [isSearching, setIsSearching] = useState(false);
    const [category, setCategory] = useState(categories[0].value);
    const { favorites, addFavorite, removeFavorite } = useFavorites();
    const { cache, setCache } = useArticlesCache();
    const navigate = useNavigate();

    const fetchArticles = async (currentPage: number, selectedCategory: string) => {
        setLoading(true);
        try {
            if (cache[selectedCategory]?.[currentPage]) {
                const cachedArticles = cache[selectedCategory][currentPage];
                if (currentPage === 1) {
                    setArticles(cachedArticles);
                    setRawArticles(cachedArticles);
                } else {
                    setArticles(prev => [...prev, ...cachedArticles]);
                    setRawArticles(prev => [...prev, ...cachedArticles]);
                }
                setLoading(false);
                return;
            }
            const res = await fetch(`${API_URL}?q=${selectedCategory}&pageSize=${PAGE_SIZE}&page=${currentPage}&language=pt&apiKey=${API_KEY}`);

            const data = await res.json();
            const newArticles = data.articles || [];
            setCache(prev => ({
                ...prev,
                [selectedCategory]: {
                    ...(prev[selectedCategory] || {}),
                    [currentPage]: newArticles,
                }
            }));
            if (currentPage === 1) {
                setArticles(newArticles);
                setRawArticles(newArticles);
            } else {
                setArticles(prev => [...prev, ...newArticles]);
                setRawArticles(prev => [...prev, ...newArticles]);
            }
        } catch (err) {
            setError('Erro ao buscar notícias.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles(page, category);
    }, [page, category]);

    useEffect(() => {
        setPage(1);
    }, [category]);

    useEffect(() => {
        const handleScroll = () => {
            if (
                isSearching || loading
            ) return;
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2) {
                setPage(prev => prev + 1);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading, isSearching]);

    // const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const query = event.target.value.toLowerCase();
    //     setIsSearching(!!query);
    //     if (query === '') {
    //         setArticles(rawArticles);
    //     } else {
    //         const filteredArticles = rawArticles.filter(article =>
    //             article.title.toLowerCase().includes(query)
    //         );
    //         setArticles(filteredArticles);
    //     }
    // };

    const isFavorite = (url: string) => {
        return favorites.some(fav => fav.url === url);
    }

    return (
        <div className={styles.feedContainer}>
            {(error && category !== 'favorites') ? (
                <div className={styles.newsListPlaceholder}>
                    <div style={{ textAlign: 'center', margin: '32px 0' }}>
                        <img className={styles.notFoundImage} src={notFoundImg} alt="Macaquinho triste" />
                        <p style={{ color: '#888', marginTop: 16, fontSize: 18 }}>
                            Nenhuma notícia encontrada.<br />O macaquinho está trabalhando triste...
                        </p>
                    </div>
                </div>
            ) : (
                <>
                    <div className={styles.mainNewsGrid}>
                        {articles[0] && (
                            <div
                                className={styles.mainNewsCard}
                                style={{ gridRow: '1 / span 2', gridColumn: '1 / 2' }}
                                onClick={() => navigate(`/details/0`, { state: { article: articles[0] } })}
                            >
                                <button
                                    className={isFavorite(articles[0].url) ? styles.favStarActive : styles.favStar}
                                    onClick={e => {
                                        e.stopPropagation();
                                        if (isFavorite(articles[0].url)) {
                                            removeFavorite(articles[0].url);
                                        } else {
                                            addFavorite(articles[0]);
                                        }
                                    }}
                                >
                                    {isFavorite(articles[0].url) ? '★' : '☆'}
                                </button>
                                {articles[0].urlToImage ? (
                                    <img src={articles[0].urlToImage} alt={articles[0].title} className={styles.mainNewsImage} />
                                ) : (
                                    <div className={`${styles.mainNewsImage} ${styles.newsImagePlaceholder}`}>📰</div>
                                )}
                                <div className={styles.mainNewsContent}>
                                    <h3 className={styles.mainNewsTitle}>{articles[0].title}</h3>
                                    <div className={styles.mainNewsMeta}>
                                        <span className={styles.mainNewsSource}>{articles[0].source.name}</span>
                                        <span className={styles.mainNewsDate}>
                                            {new Date(articles[0].publishedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>
                                    {articles[0].description && (
                                        <p className={styles.mainNewsDescription}>{articles[0].description}</p>
                                    )}
                                </div>
                            </div>
                        )}
                        {articles.slice(1, 3).map((article, idx) => (
                            <div
                                className={styles.mainNewsCard}
                                style={{ gridRow: `${idx + 1} / span 1`, gridColumn: '2 / 3' }}
                                key={idx + 1}
                                onClick={() => navigate(`/details/${idx + 1}`, { state: { article } })}
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
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={styles.newsList}>
                        {articles.slice(3).map((article, idx) => (
                            <div className={styles.newsListItem} key={idx + 3}>
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
                                            onClick={() => navigate(`/details/${idx + 3}`, { state: { article } })}
                                        >
                                            Ver detalhes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {loading && <div className={styles.newsListPlaceholder}>Carregando mais notícias...</div>}
                    </div>
                </>
            )}
        </div>
    );
};

export default HomeScreen;
