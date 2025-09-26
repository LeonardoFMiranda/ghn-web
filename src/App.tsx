import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomeScreen from './pages/HomeScreen/HomeScreen';
import DetailsScreen from './pages/DetailsScreen/DetailsScreen';
import BuscaScreen from './pages/BuscaScreen/BuscaScreen';
import './App.css';
import { FavoritesProvider } from './context/FavoritesContext';
import { ArticlesCacheProvider } from './context/ArticlesCacheContext';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';

function App() {
  return (
    <ArticlesCacheProvider>
      <FavoritesProvider>
        <Router>
          <div className="app-bg">
            <Header/>
            <main className="main-content">
              <Routes>
                <Route path="/" element={<HomeScreen />} />
                <Route path="/details/:id" element={<DetailsScreen />} />
                <Route path="/busca/:query" element={<BuscaScreen />} />
              </Routes>
            </main>
            <Footer/>
          </div>
        </Router>
      </FavoritesProvider>
    </ArticlesCacheProvider>
  );
}

export default App;
