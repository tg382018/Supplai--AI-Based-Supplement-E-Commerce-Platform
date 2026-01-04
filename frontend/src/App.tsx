import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { Navbar } from './components';
import {
  HomePage,
  ProductsPage,
  LoginPage,
  RegisterPage,
  CartPage,
  AiAdvisorPage,
} from './pages';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/ai-advisor" element={<AiAdvisorPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
