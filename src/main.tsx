
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Get the initial theme preference
const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Apply theme class to document element before render
const initialTheme = getInitialTheme();
document.documentElement.classList.add(initialTheme);

createRoot(document.getElementById("root")!).render(<App />);
