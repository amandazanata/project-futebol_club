// IMPORTA E INICIA PACOTE EXPRESS
const express = require('express');

const app = express();

const apiCredentials = require('./middlewares/apiCredentials'); // middleware assíncrono

const teams = [
    { id: 1, nome: 'São Paulo Futebol Clube', sigla: 'SPF' },
    { id: 2, nome: 'Sociedade Esportiva Palmeiras', sigla: 'PAL' },
];

app.use(apiCredentials); // afeta as rotas que vem abaixo da sua definição
app.use(express.json());

// Arquitetura REST
app.get('/teams', (_req, res) => res.json(teams));

let nextId = 3;

app.get('/teams/:id', (req, res) => { // Endpoint do tipo GET com a rota /teams/:id
    const id = Number(req.params.id); // Recebe como string, então faz um parse Number para normalizar o número
    const team = teams.find((t) => t.id === id);
    if (team) {
        res.json(team);
    } else {
        res.sendStatus(404); // sendStatus função nativa do express
    }
});

const validateTeam = (req, res, next) => {
    const requiredProperties = ['nome', 'sigla'];
    if (requiredProperties.every((property) => property in req.body)) {
      next(); // Chama o próximo middleware
    } else {
      res.sendStatus(400); // Ou já responde avisando que deu errado
    }
};

app.post('/teams', validateTeam, (req, res) => {
    const team = { id: nextId, ...req.body };
    teams.push(team);
    nextId += 1;
    res.status(201).json(team);
});

app.put('/teams/:id', validateTeam, (req, res) => {
    const id = Number(req.params.id);
    const team = teams.find((t) => t.id === id);
    if (team) {
        const index = teams.indexOf(team);
        const updated = { id, ...req.body };
        teams.splice(index, 1, updated);
        res.status(201).json(updated);
    } else {
        res.sendStatus(400);
    }
});

app.delete('/teams/:id', (req, res) => {
    const id = Number(req.params.id);
    const team = teams.find((t) => t.id === id);
    if (team) {
        const index = teams.indexOf(team);
        teams.splice(index, 1);
    } else {
        res.sendStatus(204);
    }
});

module.exports = app;