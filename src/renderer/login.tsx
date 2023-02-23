import {createRoot} from 'react-dom/client';
import Hello from './Hello';

const loginform = document.getElementById('login');
const login = createRoot(loginform)
login.render(<Hello/>)
