import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Category from './pages/Category';
import CardDetail from './pages/CardDetail';
import Editor from './pages/Editor';
import About from './pages/About';
import Contact from './pages/Contact';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';


export default function App() {
return (
<BrowserRouter>
<Header />
<main style={{ minHeight: '70vh' }}>
<Routes>
<Route path="/" element={<Home />} />
<Route path="/category/:type" element={<Category />} />
<Route path="/card/:id" element={<CardDetail />} />
<Route path="/editor/:id" element={<Editor />} />
<Route path="/about" element={<About />} />
<Route path="/contact" element={<Contact />} />
</Routes>
</main>
<Footer />
</BrowserRouter>
);
}