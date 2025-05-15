const { getPrices } = require('./js/firebase_Functions');
const { searchByNumber } = require('./js/sheets_Functions');
const { initializeApp } = require("firebase/app");
const { firebaseConfig } = require("./js/config_firebase");
const { getFirestore, getDocs, collection, query, orderBy, where, addDoc } = require("firebase/firestore");

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

(async () => {
    const resultado = await searchByNumber(5538495677);

    if (resultado.length > 0) {
        console.log('✅ Datos encontrados:', resultado);
    } else {
        console.log('❌ No se encontró información para ese número. =>');
    }
})();