const API_URL = 'http://localhost:3001/api';

const api = {
  async getPosts() {
    const res = await fetch(`${API_URL}/posts`);
    if (!res.ok) throw new Error('Erro ao buscar posts');
    return res.json();
  },

  async login(username, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) throw new Error('Usuário ou senha inválidos');
    return res.json();
  },

  async createPost(token, data) {
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
  },

  async updatePost(token, id, data) {
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
  },

  async deletePost(token, id) {
    const res = await fetch(`${API_URL}/posts/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Erro ao deletar post');
    return res.json();
  }
};

export default api;