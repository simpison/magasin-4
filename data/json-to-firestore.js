const admin = require('../node_modules/firebase-admin');
const serviceAccount = require("./service-key.json");

const data = require("./workfile.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://magasin4-f856e.firebaseio.com"
});

data && Object.keys(data).forEach(key => {
    const nestedContent = data[key];

    if (typeof nestedContent === "object") {
        var count = 0;
        Object.keys(nestedContent).forEach(docTitle => {
            console.log(docTitle);
            admin.firestore()
                .collection("items")
                .doc(docTitle)
                .set(nestedContent[docTitle])
                .then((res) => {
                    console.log("Document successfully written!");
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
            count++;
        });
    }
});