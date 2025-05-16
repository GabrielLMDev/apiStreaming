const { initializeApp } = require("firebase/app");
const { firebaseConfig } = require("./config_firebase");
const { getFirestore, getDocs, collection, query, orderBy, where, doc, setDoc, updateDoc } = require("firebase/firestore");

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

async function updateApp(dataApp) {
    console.log(dataApp)
    const appRef = doc(db, "apps", dataApp.idProduct);
    try {
        await updateDoc(appRef, {
            "name": dataApp.name,
            "group": dataApp.group,
            "price": dataApp.price,
            "available": dataApp.available,
            "reseller": dataApp.reseller,
            "src": dataApp.src,
            "tag": dataApp.tag,
            "id": dataApp.id
        });
        return true;
    } catch (error) {
        console.error('Error al actualizar en Firestore:', error);
        return false;
    }
}


module.exports = { getPrices, updateApp };

/*
    await setDoc(doc(db, "apps", data.idProduct), {
        name: data.name,
        group: data.group,
        price: data.price,
        available: data.available,
        reseller: data.reseller,
        src: data.src,
        tag: data.tag,
        id: data.id
    });
*/