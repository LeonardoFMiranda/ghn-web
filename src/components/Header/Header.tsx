import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './Header.module.css'

const menuCategories = [
    { label: 'Tecnologia', value: 'tecnologia' },
    { label: 'Negócios', value: 'negócios' },
    { label: 'Esportes', value: 'esportes' },
    { label: 'Saúde', value: 'saúde' },
    { label: 'Ciência', value: 'ciência' },
    { label: 'Entretenimento', value: 'entretenimento' },
    { label: 'Viagens', value: 'viagens' },
    { label: 'Gastronomia', value: 'gastronomia' },
    { label: 'Educação', value: 'education' },
    { label: 'Programação', value: 'programação' },
    { label: 'Investimentos', value: 'investimentos' },
    { label: 'Sustentabilidade', value: 'sustentabilidade' },
    { label: 'Lifestyle', value: 'lifestyle' },
    { label: 'Favoritos', value: 'favoritos' }
];

const categories = [
    { label: 'Tecnologia', value: 'tecnologia' },
    { label: 'Negócios', value: 'negócios' },
    { label: 'Esportes', value: 'esportes' },
    { label: 'Saúde', value: 'saúde' },
    { label: 'Ciência', value: 'ciência' },
    { label: 'Favoritos', value: 'favoritos' }
];

const Header: React.FC = () => {
    const [search, setSearch] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const [category, setCategory] = useState(categories[0].value);

    useEffect(() => {
        if (sidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [sidebarOpen]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && search.trim()) {
            setSearch('');
            navigate(`/busca/${encodeURIComponent(search.trim())}`);
        }
    };


    return (
        <header className={styles.header}>
            <nav className={styles.navBar}>

                <span onClick={() => setSidebarOpen(true)} className={styles.menuIcon}>
                    <span />
                    <span />
                    <span />
                </span>
                <Link to="/" className={styles.navLogo}>GHN</Link>


                <ul className={styles.headerCategories}>
                    {categories.map((cat, idx) => {
                        const isActive = category === cat.value;
                        return (
                            <Link
                                to={`/busca/${cat.value}`}
                                key={idx}
                                className={isActive ? `${styles.headerCategoryButton} ${styles.activeCategory}` : styles.headerCategoryButton}
                                onClick={() => setCategory(cat.value)}
                            >
                                {cat.label}
                            </Link>
                        );
                    })}
                </ul>
                <div className={styles.searchContainer}>
                    <button className={styles.navSearchButton} tabIndex={-1} aria-label="Buscar">
                        <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                            <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="2" />
                            <line x1="14.2" y1="14.2" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                    <input
                        className={styles.navSearchInput}
                        type="text"
                        placeholder="Busca detalhada..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>

                {sidebarOpen && (
                    <>
                        <div className={styles.sidebarOverlay} onClick={() => setSidebarOpen(false)} />
                        <aside className={styles.sidebar}>
                            <button className={styles.closeSidebar} onClick={() => setSidebarOpen(false)} aria-label="Fechar menu">×</button>
                            <ul className={styles.sidebarList}>
                                {menuCategories.map(cat => (
                                    <li key={cat.value}>
                                        <Link
                                            to={`/busca/${cat.value}`}
                                            className={`${styles.sidebarLink} ${styles[cat.value]}`}
                                            onClick={() => setSidebarOpen(false)}
                                        >
                                            {cat.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </aside>
                    </>
                )}
            </nav>
        </header>
    )
}

export default Header