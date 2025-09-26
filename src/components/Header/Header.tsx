import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './Header.module.css'

const Header: React.FC = () => {
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && search.trim()) {
            setSearch('');
            navigate(`/busca/${encodeURIComponent(search.trim())}`);
        }
    };

    return (
        <header className={styles.header}>
            <nav className={styles.navBar}>
                <Link to="/" className={styles.navLogo}>📰 NewsWave</Link>
                <div className={styles.searchContainer}>
                    <button className={styles.navSearchButton} tabIndex={-1} aria-label="Buscar">
                        <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                            <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="2"/>
                            <line x1="14.2" y1="14.2" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
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
            </nav>
        </header>
    )
}

export default Header