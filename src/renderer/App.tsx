import {
  MemoryRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import Bill from './screens/Bill';
import routes from './routes';

const Hello = () => {
  const navigate = useNavigate();

  const onClick = () => {
    navigate(routes.bill);
  };

  return (
    <div>
      <div className="Hello">
        <img width="200" alt="icon" src={icon} />
      </div>
      <h1>electron-react-boilerplate</h1>
      <div className="Hello">
        <a
          href="https://electron-react-boilerplate.js.org/"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="books">
              📚
            </span>
            Read our docs
          </button>
        </a>
        <button type="button" onClick={() => navigate(routes.bill)}>
          <span role="img" aria-label="folded hands">
            🙏
          </span>
          Donate
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
        <Route path="/bill" element={<Bill />} />
      </Routes>
    </Router>
  );
}
