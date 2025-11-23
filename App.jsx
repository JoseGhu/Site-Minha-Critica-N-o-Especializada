import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import PostDetail from './components/PostDetail/PostDetail';
import Home from './pages/Home/Home';
import Contato from './pages/Contato/Contato';
import AdminPanel from './pages/Admin/AdminPanel';
import { api } from './services/api';
import './App.css';

// Exportação padrão CORRETA
export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedPost, setSelectedPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => { 
    loadPosts(); 
  }, []);

  useEffect(() => { 
    if (!selectedPost && currentPage !== 'contato' && !showAdmin) { 
      loadPosts(); 
    } 
  }, [currentPage, selectedPost, showAdmin]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Carregando posts do MySQL...');
      const data = await api.getPosts();
      console.log(`✅ ${data.length} posts carregados do MySQL!`);
      setPosts(data);
    } catch (err) {
      console.error('❌ Erro ao carregar posts do MySQL:', err);
      setError('Erro ao conectar com o servidor. Usando dados locais.');
      const localPosts = localStorage.getItem('minha-critica-posts');
      if (localPosts) { 
        setPosts(JSON.parse(localPosts)); 
      } else { 
        setPosts([]); 
      }
    } finally { 
      setLoading(false); 
    }
  };

  const filteredPosts = currentPage === 'home' 
    ? posts 
    : posts.filter(post => post.category === currentPage);

  // ADMIN PANEL (SECRETO - acesso via clique duplo no logo)
  if (showAdmin) {
    return (
      <AdminPanel 
        onClose={() => { 
          setShowAdmin(false); 
          loadPosts(); 
        }} 
        onPostChange={loadPosts} 
      />
    );
  }

  // POST INDIVIDUAL
  if (selectedPost) {
    return (
      <div className="app">
        <Header 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
          onLogoDoubleClick={() => setShowAdmin(true)} 
        />
        <main className="main-content">
          <PostDetail 
            post={selectedPost} 
            onBack={() => setSelectedPost(null)} 
          />
        </main>
        <Footer />
      </div>
    );
  }

  // LOADING
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-icon">🎬</div>
        <h2 className="loading-text">Carregando posts...</h2>
      </div>
    );
  }

  // PÁGINA PRINCIPAL
  return (
    <div className="app">
      <Header 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        onLogoDoubleClick={() => setShowAdmin(true)} 
      />
      
      <main className="main-content">
        {currentPage === 'contato' ? (
          <Contato />
        ) : (
          <Home 
            currentPage={currentPage}
            filteredPosts={filteredPosts}
            error={error}
            onPostClick={setSelectedPost}
            onReload={loadPosts}
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
}