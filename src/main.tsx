// 애플리케이션 진입점
// - React 앱을 DOM의 #root에 마운트합니다.
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
