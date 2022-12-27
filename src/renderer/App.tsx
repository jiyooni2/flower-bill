import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './styles/common.scss';
import { RecoilRoot } from 'recoil';
import BillPage from './pages/BillPage/BillPage';
import HomePage from './pages/HomePage/HomePage';
import StorePage from './pages/StorePage/StorePage';

export default function App() {
  return (
    <RecoilRoot>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/bill" element={<BillPage />} />
          <Route path="/store" element={<StorePage />} />
        </Routes>
      </Router>
    </RecoilRoot>
  );
}
