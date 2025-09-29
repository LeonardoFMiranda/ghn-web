import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './BuscaScreen.module.css';
import notFoundImg from '../../assets/notFound.png';
import type { Article } from '../../types/news';
import MainNewsGrid from '../../components/MainNewsGrid/MainNewsGrid';
import NewsListHorizontal from '../../components/NewsListHorizontal/NewsListHorizontal';
import { useFavorites } from '../../context/FavoritesContext';

const API_URL = 'https://newsapi.org/v2/everything';
const API_KEY = import.meta.env.VITE_API_KEY;
const PAGE_SIZE = 10;

const BuscaScreen: React.FC = () => {
    const { query } = useParams<{ query: string }>();
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [firstLoad, setFirstLoad] = useState(true);
    const { favorites, addFavorite, removeFavorite } = useFavorites();
    const [isSearching] = useState(false);
    const [page, setPage] = useState(1);

    const isFavorite = (url: string) => {
        return favorites.some(fav => fav.url === url);
    }

    const fetchArticles = (currentPage: number, query: string) => {
        setLoading(true);
        if (query === 'favoritos') {
            const stored = localStorage.getItem('favorites');
            const favArticles = stored ? JSON.parse(stored) as Article[] : [];
            setArticles(favArticles);
            setLoading(false);
        } else {
            fetch(`${API_URL}?q=${encodeURIComponent(query)}&language=pt&apiKey=${API_KEY}&pageSize=${PAGE_SIZE}&page=${currentPage}`)
                .then(res => res.json())
                .then(data => {
                    const filtered = (data.articles || []).filter(
                        (art: any) => !art.url?.includes('kk.org')
                    );
                    setArticles(prevArticles => [...prevArticles, ...filtered]);
                })
                .finally(() => {
                    setLoading(false);
                    setFirstLoad(false);
                });
        }
    };

    useEffect(() => {
        if (!query) return;
        setArticles([]);
        setPage(1);
        setLoading(true);
        setFirstLoad(true);
        fetchArticles(1, query);
    }, [query]);

    useEffect(() => {
        if (!query || page === 1) return;
        fetchArticles(page, query);
    }, [page]);

    const mainArticles = articles.slice(0, 3);
    const listArticles = articles.slice(3);


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

    if (loading && firstLoad) {
        return (
            <div className='spinner'>
                <div className='spinnerCircle'></div>
            </div>
        );
    }

    return (
        <div className={styles.container}>

            {!loading && articles.length === 0 ? (
                <div style={{ textAlign: 'center', margin: '32px 0' }}>
                    <img className={styles.notFoundImage} src={notFoundImg} alt="Macaquinho triste" />
                    <p style={{ color: '#888', marginTop: 16, fontSize: 18 }}>
                        Nenhuma notícia encontrada.<br />O macaquinho está trabalhando triste...
                    </p>
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
                        articles={listArticles}
                        isFavorite={isFavorite}
                        addFavorite={addFavorite}
                        removeFavorite={removeFavorite}
                        startIndex={3}
                    />
                </>
            )}
        </div>
    );
};

export default BuscaScreen;