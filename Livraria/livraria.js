const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/livraria', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado ao MongoDB'))
    .catch(err => console.log('Erro de conexão com MongoDB: ', err));

const Livro = mongoose.model('Livro', new mongoose.Schema({
    titulo: String,
    autor: String,
    editora: String,
    ano: Number,
    quant: Number,
    preco: Number
}));

app.post('/livros', async (req, res) => {
    try {
        const livro = new Livro(req.body);
        await livro.save();
        res.status(201).json(livro);
    } catch (error) {
        res.status(400).json({ mensagem: 'Erro ao criar livro', erro: error });
    }
});

app.get('/livros', async (req, res) => {
    try {
        const livros = await Livro.find();
        res.json(livros);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao buscar livros', erro: error });
    }
});

app.get('/livros/:id', async (req, res) => {
    try {
        const livro = await Livro.findById(req.params.id);
        if (!livro) {
            return res.status(404).json({ mensagem: 'Livro não encontrado' });
        }
        res.json(livro);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao buscar livro', erro: error });
    }
});

app.put('/livros/:id', async (req, res) => {
    try {
        const livro = await Livro.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!livro) {
            return res.status(404).json({ mensagem: 'Livro não encontrado' });
        }
        res.json(livro);
    } catch (error) {
        res.status(400).json({ mensagem: 'Erro ao atualizar livro', erro: error });
    }
});

app.delete('/livros/:id', async (req, res) => {
    try {
        const livro = await Livro.findByIdAndDelete(req.params.id);
        if (!livro) {
            return res.status(404).json({ mensagem: 'Livro não encontrado' });
        }
        res.status(204).json();
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao deletar livro', erro: error });
    }
});

app.get('/livros/editora/:editora', async (req, res) => {
    try {
        const livros = await Livro.find({ editora: req.params.editora });
        res.json(livros);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao buscar livros pela editora', erro: error });
    }
});

app.get('/livros/palavra/:palavra', async (req, res) => {
    try {
        const livros = await Livro.find({ titulo: new RegExp(req.params.palavra, 'i') });
        res.json(livros);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao buscar livros por título', erro: error });
    }
});

app.get('/livros/acima/:preco', async (req, res) => {
    try {
        const livros = await Livro.find({ preco: { $gt: req.params.preco } });
        res.json(livros);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao buscar livros acima do preço', erro: error });
    }
});

app.get('/livros/abaixo/:preco', async (req, res) => {
    try {
        const livros = await Livro.find({ preco: { $lt: req.params.preco } });
        res.json(livros);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao buscar livros abaixo do preço', erro: error });
    }
});

app.get('/livros/recentes', async (req, res) => {
    try {
        const livros = await Livro.find().sort({ ano: -1 }).limit(5);
        res.json(livros);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao buscar livros mais recentes', erro: error });
    }
});

app.get('/livros/antigos', async (req, res) => {
    try {
        const livros = await Livro.find().sort({ ano: 1 }).limit(5);
        res.json(livros);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao buscar livros mais antigos', erro: error });
    }
});

app.get('/livros/semestoque', async (req, res) => {
    try {
        const livros = await Livro.find({ quant: 0 });
        res.json(livros);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao buscar livros sem estoque', erro: error });
    }
});

app.use((req, res) => {
    res.status(404).json({ mensagem: 'Endpoint não encontrado' });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});