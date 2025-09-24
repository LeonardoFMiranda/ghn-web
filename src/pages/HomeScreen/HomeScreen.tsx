import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HomeScreen.module.css';
import type { Article } from '../../types/news';
import { useFavorites } from '../../context/FavoritesContext';
import { useArticlesCache } from '../../context/ArticlesCacheContext';

const API_URL = 'https://newsapi.org/v2/everything';
const API_KEY = import.meta.env.VITE_API_KEY;
const PAGE_SIZE = 10;
const categories = [
    { label: 'Tudo', value: 'news' },
    { label: 'Tecnologia', value: 'technology' },
    { label: 'Negócios', value: 'business' },
    { label: 'Esportes', value: 'sports' },
    { label: 'Saúde', value: 'health' },
    { label: 'Ciência', value: 'science' },
    { label: 'Entretenimento', value: 'entertainment' },
    { label: 'Favoritos', value: 'favorites' }
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
            if (selectedCategory === 'favorites') {
                const stored = localStorage.getItem('favorites');
                const favArticles = stored ? JSON.parse(stored) as Article[] : [];
                setArticles(favArticles);
                setRawArticles(favArticles);
            } else {
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
                const res = await fetch(`${API_URL}?q=${selectedCategory}&pageSize=${PAGE_SIZE}&page=${currentPage}&apiKey=${API_KEY}`);
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

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value.toLowerCase();
        setIsSearching(!!query);
        if (query === '') {
            setArticles(rawArticles);
        } else {
            const filteredArticles = rawArticles.filter(article =>
                article.title.toLowerCase().includes(query)
            );
            setArticles(filteredArticles);
        }
    };

    const isFavorite = (url: string) => {
        return favorites.some(fav => fav.url === url);
    }

    return (
        <div className={styles.feedContainer}>
            <h2 className={styles.feedTitle}>Descubra as últimas notícias</h2>
            <div className={styles.feedFilters}>
                <div className={styles.feedNavContainer}>
                    <input className={styles.feedSearch} type="text" onChange={handleSearch} placeholder="Buscar..." />
                    <div className={styles.feedCategoryContainer}>
                        {categories.map((cat, idx) => {
                            const isActive = category === cat.value;
                            return (
                                <button
                                    key={idx}
                                    className={isActive ? `${styles.feedCategoryButton} ${styles.activeCategory}` : styles.feedCategoryButton}
                                    onClick={() => setCategory(cat.value)}
                                >
                                    {cat.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
            {error && <div className={styles.newsListPlaceholder}>{error}</div>}
            <div className={styles.newsList}>
                {articles.map((article, idx) => (
                    <div className={styles.newsCard} key={idx}>
                        <div className={styles.newsImageWrap}>
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
                                <img src={article.urlToImage} alt={article.title} className={styles.newsImage} />
                            ) : (
                                <div className={`${styles.newsImage} ${styles.newsImagePlaceholder}`}>📰</div>
                            )}
                        </div>
                        <div className={styles.newsContent}>
                            <h3 className={styles.newsTitle}>{article.title}</h3>
                            <div className={styles.newsMeta}>
                                <span className={styles.newsSource}>{article.source.name}</span>
                                <span className={styles.newsDate}>
                                    {new Date(article.publishedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </span>
                            </div>
                            <p className={styles.newsDescription}>{article.description}</p>
                        </div>
                        <div className={styles.newsActions}>
                            <button
                                className={styles.newsLink}
                                onClick={() => navigate(`/details/${idx}`, { state: { article } })}
                            >
                                Ver detalhes
                            </button>
                        </div>
                    </div>
                ))}
                {loading && <div className={styles.newsListPlaceholder}>Carregando mais notícias...</div>}
            </div>
        </div>
    );
};

export default HomeScreen;
