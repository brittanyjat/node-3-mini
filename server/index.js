require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mc = require(`${__dirname}/controllers/messages_controller`);
const session = require('express-session');
const createInitialSession = require(`${__dirname}/middlewares/session.js`);
const filter = require(`${__dirname}/middlewares/filter.js`);


const { SESSION_SECRET } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(express.static(`${__dirname}/../build`));

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 10000 }
}));

app.use((req, res, next) => createInitialSession(req, res, next));

app.use((req, res, next) => {
    console.log(req)
    const { method } = req;
    if (method === 'POST' || method === 'PUT') {
        filter(req, res, next);
    } else {
        next();
    }
});

const messagesBaseUrl = "/api/messages";
app.post(messagesBaseUrl, mc.create);
app.get(messagesBaseUrl, mc.read);
app.put(`${messagesBaseUrl}`, mc.update);
app.delete(`${messagesBaseUrl}`, mc.delete);
app.get("/api/messages/history", mc.history);

const port = 3001;
app.listen(port, () => { console.log(`Server listening on port ${port}.`); });