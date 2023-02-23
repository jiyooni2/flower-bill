// App 실행시 --> LoginPage로
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import ROUTES from './constants/routes';
import Layout from './components/Layout/Layout';
import LoginPage from './pages/LoginPage/LoginPage';


export default function Hello() {
  return (
    <RecoilRoot>
      <Router>
        <Layout>
          <Routes>
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          </Routes>
        </Layout>
      </Router>
    </RecoilRoot>
  );
}
