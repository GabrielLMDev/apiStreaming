const dotenv = require('dotenv');
dotenv.config();

async function searchByNumber(data) {
    const numberInput = parseInt(data, 10);
    try {
        const response = await fetch(process.env.SHEETS_URL_API);
        const text = await response.text();

        // Limpia el texto para convertirlo en JSON válido
        const json = JSON.parse(text.substr(47).slice(0, -2));

        // Extrae los datos
        const rows = json.table.rows;

        // Filtra los datos por el número telefónico ingresado
        const filteredData = rows
            .map(row => ({
                id: row.c[0]?.v || '',
                numero: row.c[1]?.v || '',
                cuenta: row.c[2]?.v || '',
                correo: row.c[3]?.v || '',
                perfil: row.c[4]?.v || '',
                pin: row.c[5]?.v || '',
                proveedor: row.c[6]?.v || '',
                fechaInicio: row.c[7]?.v || '',
                fechaTermino: row.c[8]?.v || '',
                importe: row.c[9]?.v || '',
                password: row.c[10]?.v || ''
            }))
            .filter(row => row.numero === numberInput); // Filtra por número telefónico


        if (filteredData.length > 0) {
            return filteredData;
        } else {
            console.error('Sin datos');
            return '';
        }
    } catch (error) {
        console.error('Error al obtener los datos de Google Sheets:', error);
        return 'Error al obtener los datos de Google Sheets:', error;
    }
}

async function searchByMail(data) {
    const mailInput = data;
    try {
        const response = await fetch(process.env.SHEETS_URL_API);
        const text = await response.text();

        // Limpia el texto para convertirlo en JSON válido
        const json = JSON.parse(text.substr(47).slice(0, -2));

        // Extrae los datos
        const rows = json.table.rows;

        // Filtra los datos por el número telefónico ingresado
        const filteredData = rows
            .map(row => ({
                id: row.c[0]?.v || '',
                numero: row.c[1]?.v || '',
                cuenta: row.c[2]?.v || '',
                correo: row.c[3]?.v || '',
                perfil: row.c[4]?.v || '',
                pin: row.c[5]?.v || '',
                proveedor: row.c[6]?.v || '',
                fechaInicio: row.c[7]?.v || '',
                fechaTermino: row.c[8]?.v || '',
                importe: row.c[9]?.v || '',
                password: row.c[10]?.v || ''
            }))
            .filter(row => row.correo === mailInput); // Filtra por número telefónico


        if (filteredData.length > 0) {
            return filteredData;
        } else {
            console.error('Sin datos');
            return '';
        }
    } catch (error) {
        console.error('Error al obtener los datos de Google Sheets:', error);
        return 'Error al obtener los datos de Google Sheets:', error;
    }
}

async function sendToScript(data) {
    console.log('sendToScript => ' + data.phone);
    const response = await fetch(process.env.SCRIPT_SHEETS_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const text = await response.text();

    try {
        // Intenta parsear a JSON
        const json = JSON.parse(text);
        return json;
    } catch (error) {
        // Si no se puede parsear, devuelve el HTML como error
        console.error('Respuesta inesperada del script:', text);
        throw new Error('El script devolvió una respuesta no válida (HTML). Revisa los permisos o URL.');
    }
}


module.exports = { searchByNumber, searchByMail, sendToScript };