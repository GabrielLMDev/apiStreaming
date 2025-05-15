const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { getPrices } = require('./js/firebase_Functions');
const { searchByNumber, searchByMail } = require('./js/sheets_Functions');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

app.get('/api/prices', async (req, res) => {
    const data = await getPrices();
    if (data.length > 0) {
        res.json(data)
    } else {
        res.json('Sin datos')
    }
})

app.post('/api/search/number', async (req, res) => {
    const { number } = req.body; // Extrae el número del cuerpo de la petición
    try {
        const data = await searchByNumber(number); // Pasa el número a la función

        if (data && data.length > 0) {
            const timestamp = new Date().toISOString();
            console.log(`Busqueda para => ${number} hecha => ${timestamp}`)
            res.json(data);
        } else {
            res.json('Sin datos');
        }
    } catch (error) {
        console.error('Error al buscar por número:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
})

app.post('/api/search/mail', async (req, res) => {
    const { mail } = req.body; // Extrae el mail del cuerpo de la petición
    try {
        const data = await searchByMail(mail); // Pasa el mail a la función

        if (data && data.length > 0) {
            const timestamp = new Date().toISOString();
            console.log(`Busqueda para => ${mail} hecha => ${timestamp}`)
            res.json(data);
        } else {
            res.json('Sin datos');
        }
    } catch (error) {
        console.error('Error al buscar por número:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
})

app.listen(PORT, () => {
    const url = process.env.RAILWAY_STATIC_URL
        ? `https://${process.env.RAILWAY_STATIC_URL}`
        : `http://localhost:${PORT}`;

    console.log(`Servidor corriendo en ${url}`);
});