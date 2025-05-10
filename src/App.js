import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './pages/signup';
import './App.css';
import { Navbar } from './compenents/navbar';

function App() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
      <Route path="/" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
