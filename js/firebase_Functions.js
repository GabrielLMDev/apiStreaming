const { initializeApp } = require("firebase/app");
const { firebaseConfig } = require("./config_firebase");
const { getFirestore, getDocs, collection, query, orderBy, where } = require("firebase/firestore");

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getPrices() {
    pricesList = [];
    const q = query(collection(db, "apps"), orderBy("group"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        pricesList.push({
            id: doc.id,
            name: doc.data().name,
            price: doc.data().price,
            available: doc.data().available,
            group: doc.data().group,
            reseller: doc.data().reseller,
            src: doc.data().src,
            tag: doc.data().tag,
        });
    });
    return (pricesList)
}
module.exports = { getPrices };