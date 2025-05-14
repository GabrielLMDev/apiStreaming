const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { getPrices } = require('./js/firebase_Functions');

app.use(cors());
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/prices', async (req, res) => {
    const data = await getPrices();
    if (data.length > 0) {
        res.json(data)
    } else {
        res.json('Sin datos')
    }
})
app.listen(PORT, () => {
    const url = process.env.RAILWAY_STATIC_URL
        ? `https://${process.env.RAILWAY_STATIC_URL}`
        : `http://localhost:${PORT}`;

    console.log(`Servidor corriendo en ${url}`);
});