import React, { useEffect, useState } from 'react';
import styles from './HomeScreen.module.css';
import type { Article } from '../../types/news';
import { useFavorites } from '../../context/FavoritesContext';
import { useArticlesCache } from '../../context/ArticlesCacheContext';
import notFoundImg from '../../assets/notFound.png';
import NewsListHorizontal from '../../components/NewsListHorizontal/NewsListHorizontal';
import MainNewsGrid from '../../components/MainNewsGrid/MainNewsGrid';

const API_URL = 'https://newsapi.org/v2/everything';
const API_KEY = import.meta.env.VITE_API_KEY;
const PAGE_SIZE = 10;
const categories = [
    { label: 'Tudo', value: 'notícias' },
];

const MAIN_SEARCHES = [
    "trump",
    "brasil",
    "onu"
];

const HomeScreen: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [firstLoad, setFirstLoad] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [isSearching] = useState(false);
    const [category] = useState(categories[0].value);
    const [mainArticles, setMainArticles] = useState<Article[]>([]);
    const [mainSearchType] = useState(() => Math.floor(Math.random() * 3));
    const { favorites, addFavorite, removeFavorite } = useFavorites();
    const { cache, setCache } = useArticlesCache();

    const fetchArticles = async (currentPage: number, selectedCategory: string) => {
        setLoading(true);
        try {
            if (cache[selectedCategory]?.[currentPage]) {
                const cachedArticles = cache[selectedCategory][currentPage];
                if (currentPage === 1) {
                    setArticles(cachedArticles);
                } else {
                    setArticles(prev => [...prev, ...cachedArticles]);
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
            } else {
                setArticles(prev => [...prev, ...newArticles]);
            }
        } catch (err) {
            setError('Erro ao buscar notícias.');
        } finally {
            setLoading(false);
            setFirstLoad(false);
        }
    };

    useEffect(() => {
        const fetchMainArticles = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_URL}?q=${MAIN_SEARCHES[mainSearchType]}&pageSize=3&language=pt&apiKey=${API_KEY}`);
                const data = await res.json();
                setMainArticles(data.articles || []);
            } catch {
                setMainArticles([]);
            } finally {
                setLoading(false);
            }
        };
        fetchMainArticles();
    }, [mainSearchType]);

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

    const isFavorite = (url: string) => {
        return favorites.some(fav => fav.url === url);
    }


    if (loading && firstLoad) {
        return (
            <div className='spinner'>
                <div className='spinnerCircle'></div>
            </div>
        );
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
                    <MainNewsGrid
                        articles={mainArticles}
                        isFavorite={isFavorite}
                        addFavorite={addFavorite}
                        removeFavorite={removeFavorite}
                    />
                    <NewsListHorizontal
                        articles={articles.slice(3)}
                        isFavorite={isFavorite}
                        addFavorite={addFavorite}
                        removeFavorite={removeFavorite}
                        startIndex={3}
                    />
                </>
            )}
            {loading && (
                <div className='spinner' style={{ marginTop: 32, marginBottom: 32 }}>
                    <div className='spinnerCircle'></div>
                </div>
            )}
        </div>
    );
};

export default HomeScreen;
