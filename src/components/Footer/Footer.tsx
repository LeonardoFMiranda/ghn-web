import React from 'react'

const Footer: React.FC = () => {
    return (
        <footer className="app-footer">
            <span>Feito por LeonardoFMiranda &copy; {new Date().getFullYear()}</span>
        </footer>
    )
}

export default Footer