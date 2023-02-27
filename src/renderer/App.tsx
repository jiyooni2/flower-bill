import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/reset.scss';
import './styles/global.scss';
import { RecoilRoot } from 'recoil';
import BillPage from './pages/BillPage/BillPage';
import HomePage from './pages/HomePage/HomePage';
import StorePage from './pages/StorePage/StorePage';
import UserPage from './pages/UserPage/UserPage';
import Layout from './components/Layout/Layout';
import ROUTES from './constants/routes';
import CategoryPage from './pages/CategoryPage/CategoryPage';
import BusinessPage from './pages/BusinessPage/BusinessPage';

export default function App() {
  return (
    <RecoilRoot>
      <Router>
        <Layout>
          <Routes>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.BILL} element={<BillPage />} />
            <Route path={ROUTES.STORE} element={<StorePage />} />
            <Route path={ROUTES.USER} element={<UserPage />} />
            <Route path={ROUTES.SELLER} element={<BusinessPage />} />
            <Route path={ROUTES.CATEGORY} element={<CategoryPage />} />
          </Routes>
        </Layout>
      </Router>
    </RecoilRoot>
  );
}
