// Funções utilitárias
export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };
  
  export const validatePost = (post) => {
    const required = ['title', 'excerpt', 'type'];
    return required.every(field => post[field] && post[field].trim());
  };
  
  export const getPostCategory = (post) => {
    return post.category || 'críticas';
  };