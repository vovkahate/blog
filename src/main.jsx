import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.scss';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './hoc/AuthProvider';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </QueryClientProvider>
    </AuthProvider>
);
