import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './styles/common.scss';
import Bill from './pages/BillPage/BillPage';
import Home from './pages/HomePage/HomePage';
import Store from './pages/StorePage/StorePage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bill" element={<Bill />} />
        <Route path="/store" element={<Store />} />
      </Routes>
    </Router>
  );
}
