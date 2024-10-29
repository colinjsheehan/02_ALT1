// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCb25bPqAJp83gYmCJgipABhE7JyZa3oTI",
    authDomain: "alt1-project-be2be.firebaseapp.com",
    databaseURL: "https://alt1-project-be2be-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "alt1-project-be2be",
    storageBucket: "alt1-project-be2be.appspot.com",
    messagingSenderId: "999579572891",
    appId: "1:999579572891:web:120257cc712f601840843e",
    measurementId: "G-TQJWZJ6LM3"
};

// Initialise Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// ThingSpeak Write API Key
const apiKey = "6TPW3LRZ90VX5F1L"; // Replace with your actual Write API Key

// Initialise signUpCount
let signUpCount = 0;

// Fetch initial count from Firebase (if you want persistence)
database.ref("signUpCount").once("value").then(snapshot => {
    signUpCount = snapshot.val() || 0; // Initialise to 0 if null
});

function saveContact() {
    const email = document.getElementById("email").value;
    if (email) {
        // Save email to Firebase
        database.ref("contacts").push({ email: email })
            .then(() => {
                // Increment signUpCount on each successful Firebase save
                signUpCount += 1;
                database.ref("signUpCount").set(signUpCount); // Save updated count to Firebase

                // Prepare ThingSpeak URL
                const additionalData = new Date().toLocaleString();
                const url = `https://api.thingspeak.com/update?api_key=${apiKey}&field1=${signUpCount}&field2=${encodeURIComponent(additionalData)}`;

                // Send count data to ThingSpeak
                return fetch(url);
            })
            .then(response => {
                if (response.ok) {
                    document.getElementById("response").innerText = "Email saved!";
                    document.getElementById("email").value = ""; // Clear the form field
                    console.log("Sign-up count sent to ThingSpeak");
                } else {
                    console.error("Failed to send sign-up count to ThingSpeak");
                }
            })
            .catch(error => {
                console.error("Error:", error);
                document.getElementById("response").innerText = "Failed to save email. Try again.";
            });
    } else {
        document.getElementById("response").innerText = "Please enter a valid email.";
    }
}
