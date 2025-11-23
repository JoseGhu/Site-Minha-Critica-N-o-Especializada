const API_URL = 'http://localhost:3001/api';

const api = {
  async getPosts() {
    try {
      const res = await fetch(`${API_URL}/posts`);
      if (!res.ok) throw new Error('Erro ao buscar posts');
      return res.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  async login(username, password) {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) throw new Error('Usuário ou senha inválidos');
      return res.json();
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  },

  async createPost(token, data) {
    try {
      const res = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Erro ao criar post');
      return res.json();
    } catch (error) {
      console.error('Create Post Error:', error);
      throw error;
    }
  },

  async updatePost(token, id, data) {
    try {
      const res = await fetch(`${API_URL}/posts/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Erro ao atualizar post');
      return res.json();
    } catch (error) {
      console.error('Update Post Error:', error);
      throw error;
    }
  },

  async deletePost(token, id) {
    try {
      const res = await fetch(`${API_URL}/posts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Erro ao deletar post');
      return res.json();
    } catch (error) {
      console.error('Delete Post Error:', error);
      throw error;
    }
  }
};

export default api;