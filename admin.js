// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBXXaWWoFqn6MpH6IWSm6CGaqUJzAmzbzA",
    authDomain: "dopamine-quiz.firebaseapp.com",
    projectId: "dopamine-quiz",
    storageBucket: "dopamine-quiz.firebasestorage.app",
    messagingSenderId: "822531459966",
    appId: "1:822531459966:web:8e7d2385090e997eb1c12f"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Check if Admin is Logged In
auth.onAuthStateChanged(user => {
    if (user) {
        const userRef = db.collection("users").doc(user.uid);
        userRef.get().then(doc => {
            if (doc.exists && doc.data().role === "admin") {
                document.getElementById("adminName").innerText = doc.data().name;
                document.getElementById("adminPoints").innerText = `Points: ${doc.data().points || 0}`;
            } else {
                alert("Access Denied: Admins only!");
                window.location.href = "index.html";
            }
        });
    } else {
        window.location.href = "login.html";
    }
});

// Logout Function
document.getElementById("logoutBtn").addEventListener("click", () => {
    auth.signOut().then(() => {
        window.location.href = "login.html";
    });
});

// Add Question Function
document.getElementById("addQuestionForm").addEventListener("submit", (e) => {
    e.preventDefault();
    
    const question = document.getElementById("questionInput").value;
    const options = [
        document.getElementById("option1").value,
        document.getElementById("option2").value,
        document.getElementById("option3").value,
        document.getElementById("option4").value
    ];
    const correctOption = document.querySelector('input[name="correctOption"]:checked').value;

    if (question && options.every(opt => opt !== "") && correctOption) {
        auth.onAuthStateChanged(user => {
            if (user) {
                const userRef = db.collection("users").doc(user.uid);

                // Add Question to Firestore
                db.collection("questions").add({
                    question,
                    options,
                    correctOption,
                    addedBy: user.uid,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                }).then(() => {
                    // Update Admin Points
                    userRef.update({
                        points: firebase.firestore.FieldValue.increment(1)
                    }).then(() => {
                        alert("Question added successfully! +1 Point");
                        document.getElementById("addQuestionForm").reset();
                        userRef.get().then(doc => {
                            document.getElementById("adminPoints").innerText = `Points: ${doc.data().points}`;
                        });
                    });
                });
            }
        });
    } else {
        alert("Please fill in all fields and select the correct option.");
    }
});
