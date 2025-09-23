import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomeScreen from './pages/HomeScreen/HomeScreen';
import DetailsScreen from './pages/DetailsScreen/DetailsScreen';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-bg">
        <header className="app-header">
          <nav className="nav-bar">
            <Link to="/" className="nav-logo">📰 NewsWave</Link>
          </nav>
        </header>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/details/:id" element={<DetailsScreen />} />
          </Routes>
        </main>
        <footer className="app-footer">
          <span>Feito por LeonardoFMiranda &copy; {new Date().getFullYear()}</span>
        </footer>
      </div>
    </Router>
  );
}

export default App;
