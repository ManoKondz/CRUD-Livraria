// Importar dependências
const express = require('express');
const app = express();
const PORT = 3000;

// Configurar middleware para JSON
app.use(express.json());

// Base de dados simulada (em memória)
let livros = [
    { id: 1, titulo: 'O Pequeno Príncipe', autor: 'Antoine de Saint-Exupéry', editora: 'Editora A', ano: 1943, quant: 3, preco: 25.0 },
    { id: 2, titulo: '1984', autor: 'George Orwell', editora: 'Editora B', ano: 1949, quant: 5, preco: 30.0 },
    { id: 3, titulo: 'Dom Quixote', autor: 'Miguel de Cervantes', editora: 'Editora C', ano: 1605, quant: 2, preco: 50.0 },
    { id: 4, titulo: 'A Revolução dos Bichos', autor: 'George Orwell', editora: 'Editora B', ano: 1945, quant: 0, preco: 20.0 },
    { id: 5, titulo: 'O Hobbit', autor: 'J.R.R. Tolkien', editora: 'Editora D', ano: 1937, quant: 4, preco: 45.0 },
];

// Operações CRUD básicas

// Criar um livro
app.post('/livros', (req, res) => {
    // Criar um novo livro com ID incremental
    const novoLivro = { id: livros.length + 1, ...req.body };
    livros.push(novoLivro); // Adicionar o livro à lista
    res.status(201).json(novoLivro); // Retornar o livro criado
});

// Ler todos os livros
app.get('/livros', (req, res) => {
    res.json(livros); // Retornar todos os livros
});

// Ler um livro por ID
app.get('/livros/:id', (req, res) => {
    // Procurar o livro pelo ID fornecido
    const livro = livros.find(l => l.id === parseInt(req.params.id));
    if (!livro) return res.status(404).json({ erro: 'Livro não encontrado' }); // Retornar erro se não encontrado
    res.json(livro); // Retornar o livro encontrado
});

// Atualizar um livro por ID
app.put('/livros/:id', (req, res) => {
    // Procurar o livro pelo ID fornecido
    const livro = livros.find(l => l.id === parseInt(req.params.id));
    if (!livro) return res.status(404).json({ erro: 'Livro não encontrado' }); // Retornar erro se não encontrado
    Object.assign(livro, req.body); // Atualizar os dados do livro
    res.json(livro); // Retornar o livro atualizado
});

// Excluir um livro por ID
app.delete('/livros/:id', (req, res) => {
    // Procurar o índice do livro pelo ID fornecido
    const index = livros.findIndex(l => l.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ erro: 'Livro não encontrado' }); // Retornar erro se não encontrado
    livros.splice(index, 1); // Remover o livro da lista
    res.status(204).send(); // Retornar sucesso sem conteúdo
});

// Buscar livros por editora
app.get('/livros/editora/:editora', (req, res) => {
    // Filtrar livros pela editora fornecida (case insensitive)
    const resultado = livros.filter(l => l.editora.toLowerCase() === req.params.editora.toLowerCase());
    res.json(resultado); // Retornar os livros encontrados
});

// Buscar livro por palavra-chave no título
app.get('/livros/titulo/:palavra', (req, res) => {
    // Filtrar livros que contenham a palavra no título (case insensitive)
    const resultado = livros.filter(l => l.titulo.toLowerCase().includes(req.params.palavra.toLowerCase()));
    res.json(resultado); // Retornar os livros encontrados
});

// Buscar livros acima de um preço
app.get('/livros/preco/acima/:preco', (req, res) => {
    const preco = parseFloat(req.params.preco); // Converter o preço para número
    const resultado = livros.filter(l => l.preco > preco); // Filtrar livros com preço acima do fornecido
    res.json(resultado); // Retornar os livros encontrados
});

// Buscar livros abaixo de um preço
app.get('/livros/preco/abaixo/:preco', (req, res) => {
    const preco = parseFloat(req.params.preco); // Converter o preço para número
    const resultado = livros.filter(l => l.preco < preco); // Filtrar livros com preço abaixo do fornecido
    res.json(resultado); // Retornar os livros encontrados
});

// Buscar livros mais recentes
app.get('/livros/recentes', (req, res) => {
    // Encontrar o ano mais recente
    const maxAno = Math.max(...livros.map(l => l.ano));
    const resultado = livros.filter(l => l.ano === maxAno); // Filtrar livros do ano mais recente
    res.json(resultado); // Retornar os livros encontrados
});

// Buscar livros mais antigos
app.get('/livros/antigos', (req, res) => {
    // Encontrar o ano mais antigo
    const minAno = Math.min(...livros.map(l => l.ano));
    const resultado = livros.filter(l => l.ano === minAno); // Filtrar livros do ano mais antigo
    res.json(resultado); // Retornar os livros encontrados
});

// Buscar livros sem estoque
app.get('/livros/sem-estoque', (req, res) => {
    const resultado = livros.filter(l => l.quant === 0); // Filtrar livros sem quantidade disponível
    res.json(resultado); // Retornar os livros encontrados
});

// Tratamento para endpoints inexistentes
app.use((req, res) => {
    res.status(404).json({ erro: 'Endpoint não encontrado' }); // Retornar erro para rotas inválidas
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`); // Log do servidor iniciado
});
