const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { getPrices, updateApp } = require('./js/firebase_Functions');
const { searchByNumber, searchByMail, sendToScript } = require('./js/sheets_Functions');

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

app.post('/api/update', async (req, res) => {
    const { dataApp } = req.body;

    if (!dataApp || !dataApp.idProduct) {
        return res.status(400).json({ error: 'Datos incompletos o malformados' });
    }

    try {
        const data = await updateApp(dataApp);

        if (data === true) {
            const timestamp = new Date().toISOString();
            console.log(`App => ${dataApp.idProduct} actualizada => ${timestamp}`);
            res.json({ success: true });
        } else {
            res.status(500).json({ error: 'No se pudo actualizar' });
        }
    } catch (error) {
        console.error('Error al actualizar:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

app.post('/api/send-data', async (req, res) => {
    console.log('Cuerpo recibido:', req.body);
    const data = req.body; // Recibe todos los datos del frontend
    console.log(data)
    try {
        const result = await sendToScript(data); // Envía a la función externa
        const timestamp = new Date().toISOString();
        console.log(`Datos enviados => ${data.phone} | ${timestamp}`); // Muestra algo útil del envío

        res.json(result); // Devuelve la respuesta del script al frontend
    } catch (error) {
        console.error('Error al enviar datos al script:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

app.post('/api/update-data', async (req, res) => {

    const { updateData } = req.body;

    if (!updateData || !updateData.id) {
        return res.status(400).json({ error: 'Datos incompletos o malformados' });
    }

    console.log('Cuerpo recibido:', req.body);

    
    console.log(updateData)
    try {
        const result = await sendToScript(updateData); // Envía a la función externa
        const timestamp = new Date().toISOString();
        console.log(`Datos enviados => ${updateData.phone} | ${timestamp}`); // Muestra algo útil del envío

        res.json(result); // Devuelve la respuesta del script al frontend
    } catch (error) {
        console.error('Error al enviar datos al script:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

app.listen(PORT, () => {
    const url = process.env.RAILWAY_STATIC_URL
        ? `https://${process.env.RAILWAY_STATIC_URL}`
        : `http://localhost:${PORT}`;

    console.log(`Servidor corriendo en ${url}`);
});