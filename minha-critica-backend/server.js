// ==========================================
// IMPORTS - Importar bibliotecas
// ==========================================
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// ==========================================
// CONFIGURAÇÕES INICIAIS
// ==========================================
const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'secret_padrao_mude_isso';

// ==========================================
// MIDDLEWARES
// ==========================================

// CORS configurado para aceitar o frontend
app.use(cors({
  origin: function(origin, callback) {
    console.log('🌐 CORS - Origin recebido:', origin);
    
    // Lista de origens permitidas
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://site-minha-critica-n-o-especializada-production.up.railway.app',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    // Permite requisições sem origin (Postman, curl, etc)
    if (!origin) {
      console.log('✅ CORS - Permitindo requisição sem origin');
      return callback(null, true);
    }
    
    // Verifica se a origin está na lista permitida
    if (allowedOrigins.includes(origin)) {
      console.log('✅ CORS - Origin permitida:', origin);
      return callback(null, true);
    }
    
    // Em desenvolvimento, permite tudo
    if (process.env.NODE_ENV !== 'production') {
      console.log('✅ CORS - Modo desenvolvimento, permitindo:', origin);
      return callback(null, true);
    }
    
    console.log('❌ CORS - Origin bloqueada:', origin);
    callback(new Error('CORS policy: Origin não permitida'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ==========================================
// CONFIGURAÇÃO DO BANCO DE DADOS
// ==========================================
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '', // String vazia para sem senha
  database: process.env.DB_NAME || 'minha_critica',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Log de configuração (sem mostrar senha em produção)
console.log('📊 Configuração do Banco de Dados:');
console.log(`   Host: ${dbConfig.host}`);
console.log(`   User: ${dbConfig.user}`);
console.log(`   Database: ${dbConfig.database}`);
console.log(`   Port: ${dbConfig.port}`);
console.log(`   Password: ${dbConfig.password ? '***configurada***' : '(sem senha)'}`);

let pool;

// ==========================================
// FUNÇÃO: Inicializar Banco de Dados
// ==========================================
async function initDB() {
  try {
    console.log('🔄 Tentando conectar ao MySQL...');
    
    // Criar pool de conexões
    pool = mysql.createPool(dbConfig);
    
    // Testar conexão
    const connection = await pool.getConnection();
    console.log('✅ Conectado ao MySQL com sucesso!');
    connection.release();
    
    // Criar database se não existir (apenas em desenvolvimento)
    if (process.env.NODE_ENV !== 'production') {
      const tempConnection = await mysql.createConnection({
        host: dbConfig.host,
        user: dbConfig.user,
        password: dbConfig.password,
        port: dbConfig.port
      });
      
      await tempConnection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
      console.log(`✅ Database '${dbConfig.database}' verificada/criada`);
      await tempConnection.end();
    }
    
    // Criar tabelas
    await createTables();
  } catch (error) {
    console.error('❌ Erro ao conectar MySQL:', error.message);
    console.error('\n🔍 Verifique:');
    console.error('1. MySQL está rodando?');
    console.error('2. As credenciais estão corretas?');
    console.error('3. O banco de dados existe (em produção)?');
    console.error('4. A porta está correta?');
    console.error('\n💡 Dica: Execute "mysql -u root" para testar a conexão');
    
    if (process.env.NODE_ENV === 'production') {
      console.error('\n⚠️ PRODUÇÃO: Não foi possível conectar ao banco!');
      process.exit(1);
    } else {
      console.error('\n⚠️ DESENVOLVIMENTO: Continuando sem banco (algumas funcionalidades não funcionarão)');
    }
  }
}

// ==========================================
// FUNÇÃO: Criar Tabelas
// ==========================================
async function createTables() {
  const connection = await pool.getConnection();
  
  try {
    console.log('🔨 Criando/verificando tabelas...');
    
    // Tabela de posts
    await connection.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL,
        type VARCHAR(50) NOT NULL,
        image TEXT,
        excerpt TEXT NOT NULL,
        rating DECIMAL(2,1),
        date DATE NOT NULL,
        readTime VARCHAR(20),
        fullContent TEXT,
        highlights JSON,
        lowlights JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category),
        INDEX idx_date (date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    
    // Tabela de admins
    await connection.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    
    // Criar admin padrão
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await connection.query(`
      INSERT INTO admins (username, password, email) 
      VALUES ('admin', ?, 'admin@minhacritica.com')
      ON DUPLICATE KEY UPDATE username=username;
    `, [hashedPassword]);
    
    console.log('✅ Tabelas criadas/verificadas com sucesso!');
    console.log('👤 Usuário padrão: admin / admin123');
  } catch (error) {
    console.error('❌ Erro ao criar tabelas:', error.message);
    throw error;
  } finally {
    connection.release();
  }
}

// ==========================================
// MIDDLEWARE: Autenticação
// ==========================================
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
}

// ==========================================
// ROTAS: Autenticação
// ==========================================

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const [users] = await pool.query(
      'SELECT * FROM admins WHERE username = ?',
      [username]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Usuário ou senha inválidos' });
    }
    
    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Usuário ou senha inválidos' });
    }
    
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

// Verificar token
app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// ==========================================
// ROTAS: Posts (PÚBLICAS)
// ==========================================

// Listar posts
app.get('/api/posts', async (req, res) => {
  try {
    const { category, limit = 100, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM posts';
    let params = [];
    
    if (category && category !== 'home') {
      query += ' WHERE category = ?';
      params.push(category);
    }
    
    query += ' ORDER BY date DESC, id DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const [posts] = await pool.query(query, params);
    
    const formattedPosts = posts.map(post => ({
      ...post,
      highlights: post.highlights ? JSON.parse(post.highlights) : undefined,
      lowlights: post.lowlights ? JSON.parse(post.lowlights) : undefined
    }));
    
    res.json(formattedPosts);
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    res.status(500).json({ error: 'Erro ao buscar posts' });
  }
});

// Buscar post por ID
app.get('/api/posts/:id', async (req, res) => {
  try {
    const [posts] = await pool.query(
      'SELECT * FROM posts WHERE id = ?',
      [req.params.id]
    );
    
    if (posts.length === 0) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }
    
    const post = {
      ...posts[0],
      highlights: posts[0].highlights ? JSON.parse(posts[0].highlights) : undefined,
      lowlights: posts[0].lowlights ? JSON.parse(posts[0].lowlights) : undefined
    };
    
    res.json(post);
  } catch (error) {
    console.error('Erro ao buscar post:', error);
    res.status(500).json({ error: 'Erro ao buscar post' });
  }
});

// ==========================================
// ROTAS: Posts (ADMIN - PROTEGIDAS)
// ==========================================

// Criar post
app.post('/api/posts', authenticateToken, async (req, res) => {
  try {
    const {
      title, category, type, image, excerpt,
      rating, date, readTime, fullContent,
      highlights, lowlights
    } = req.body;
    
    const [result] = await pool.query(
      `INSERT INTO posts 
       (title, category, type, image, excerpt, rating, date, readTime, fullContent, highlights, lowlights) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title, category, type, image, excerpt,
        rating || null, date, readTime, fullContent,
        highlights ? JSON.stringify(highlights) : null,
        lowlights ? JSON.stringify(lowlights) : null
      ]
    );
    
    const [newPost] = await pool.query('SELECT * FROM posts WHERE id = ?', [result.insertId]);
    
    res.status(201).json({
      message: 'Post criado com sucesso!',
      post: {
        ...newPost[0],
        highlights: newPost[0].highlights ? JSON.parse(newPost[0].highlights) : undefined,
        lowlights: newPost[0].lowlights ? JSON.parse(newPost[0].lowlights) : undefined
      }
    });
  } catch (error) {
    console.error('Erro ao criar post:', error);
    res.status(500).json({ error: 'Erro ao criar post' });
  }
});

// Atualizar post
app.put('/api/posts/:id', authenticateToken, async (req, res) => {
  try {
    const {
      title, category, type, image, excerpt,
      rating, date, readTime, fullContent,
      highlights, lowlights
    } = req.body;
    
    await pool.query(
      `UPDATE posts 
       SET title=?, category=?, type=?, image=?, excerpt=?, rating=?, 
           date=?, readTime=?, fullContent=?, highlights=?, lowlights=?
       WHERE id=?`,
      [
        title, category, type, image, excerpt,
        rating || null, date, readTime, fullContent,
        highlights ? JSON.stringify(highlights) : null,
        lowlights ? JSON.stringify(lowlights) : null,
        req.params.id
      ]
    );
    
    const [updatedPost] = await pool.query('SELECT * FROM posts WHERE id = ?', [req.params.id]);
    
    res.json({
      message: 'Post atualizado com sucesso!',
      post: {
        ...updatedPost[0],
        highlights: updatedPost[0].highlights ? JSON.parse(updatedPost[0].highlights) : undefined,
        lowlights: updatedPost[0].lowlights ? JSON.parse(updatedPost[0].lowlights) : undefined
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar post:', error);
    res.status(500).json({ error: 'Erro ao atualizar post' });
  }
});

// Deletar post
app.delete('/api/posts/:id', authenticateToken, async (req, res) => {
  try {
    await pool.query('DELETE FROM posts WHERE id = ?', [req.params.id]);
    res.json({ message: 'Post deletado com sucesso!' });
  } catch (error) {
    console.error('Erro ao deletar post:', error);
    res.status(500).json({ error: 'Erro ao deletar post' });
  }
});

// Estatísticas
app.get('/api/stats', authenticateToken, async (req, res) => {
  try {
    const [totalPosts] = await pool.query('SELECT COUNT(*) as total FROM posts');
    const [byCategory] = await pool.query(
      'SELECT category, COUNT(*) as count FROM posts GROUP BY category'
    );
    const [avgRating] = await pool.query(
      'SELECT AVG(rating) as average FROM posts WHERE rating IS NOT NULL'
    );
    
    res.json({
      totalPosts: totalPosts[0].total,
      byCategory,
      averageRating: avgRating[0].average ? parseFloat(avgRating[0].average).toFixed(1) : 0
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

// ==========================================
// ROTA: Health Check
// ==========================================
app.get('/api/health', async (req, res) => {
  let dbStatus = 'disconnected';
  
  try {
    await pool.query('SELECT 1');
    dbStatus = 'connected';
  } catch (error) {
    console.error('Health check - DB error:', error.message);
  }
  
  res.json({ 
    status: 'ok', 
    message: 'Backend Minha Crítica funcionando!',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================
async function startServer() {
  await initDB();
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📡 API: http://localhost:${PORT}/api`);
    console.log(`💚 Health: http://localhost:${PORT}/api/health`);
    console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`${'='.repeat(50)}\n`);
    console.log('Para parar o servidor: Ctrl + C\n');
  });
}

startServer();

// ==========================================
// TRATAMENTO DE ERROS
// ==========================================
process.on('unhandledRejection', (error) => {
  console.error('❌ Erro não tratado:', error);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Exceção não capturada:', error);
  process.exit(1);
});