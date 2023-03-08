import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/reset.scss';
import './styles/global.scss';
import { RecoilRoot } from 'recoil';
import BillPage from './pages/BillPage/BillPage';
import HomePage from './pages/HomePage/HomePage';
import StorePage from './pages/StorePage/StorePage';
import Layout from './components/Layout/Layout';
import ROUTES from './constants/routes';
import CategoryPage from './pages/CategoryPage/CategoryPage';
import BusinessPage from './pages/BusinessPage/BusinessPage';
import ProductsPage from './pages/ProductsPage/ProductsPage';
import BillsPage from './pages/BillsPage/BillsPage';
import DetailBillPage from './pages/BillsPage/DetailPage/DetailBillPage';

export default function App() {
  return (
    <RecoilRoot>
      <Router>
        <Layout>
          <Routes>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.BILL} element={<BillPage />} />
            <Route path={ROUTES.BILLS} element={<BillsPage />} />
            <Route path={ROUTES.DETAIL} element={<DetailBillPage />} />
            <Route path={ROUTES.STORE} element={<StorePage />} />
            <Route path={ROUTES.PRODUCTS} element={<ProductsPage />} />
            <Route path={ROUTES.SELLER} element={<BusinessPage />} />
            <Route path={ROUTES.CATEGORY} element={<CategoryPage />} />
          </Routes>
        </Layout>
      </Router>
    </RecoilRoot>
  );
}
