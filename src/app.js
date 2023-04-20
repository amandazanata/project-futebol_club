// IMPORTA E INICIA PACOTE EXPRESS
const express = require('express');

const app = express();

const teams = [
    { id: 1, nome: 'São Paulo Futebol Clube', sigla: 'SPF' },
    { id: 2, nome: 'Sociedade Esportiva Palmeiras', sigla: 'PAL' },
];

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
    const requiredProperties = ['nome', 'sigla'];
    if (requiredProperties.every((property) => property in req.body)) {
        const team = { id: nextId, ...req.body };
        teams.push(team);
        nextId += 1;
        res.status(201).json(team);
    } else {
        res.sendStatus(400);
    }
});

app.put('/teams/:id', validateTeam, (req, res) => {
    const id = Number(req.params.id);
    const requiredProperties = ['nome', 'sigla'];
    const team = teams.find((t) => t.id === id);
    if (team && requiredProperties.every((property) => property in req.body)) {
        const index = teams.indexOf(team);
        const updated = { id, ...req.body };
        teams.splice(index, 1, updated);
        res.status(201).json(updated);
    } else {
        res.sendStatus(400);
    }
});

app.delete('/teams/:id', validateTeam, (req, res) => {
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