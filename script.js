// 🔥 Firebase Configuration (Replace with your details)
const firebaseConfig = {
    apiKey: "YOUR-API-KEY",
    authDomain: "YOUR-PROJECT.firebaseapp.com",
    projectId: "YOUR-PROJECT-ID",
    storageBucket: "YOUR-PROJECT.appspot.com",
    messagingSenderId: "YOUR-SENDER-ID",
    appId: "YOUR-APP-ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

/* ──────────────── 1️⃣ SIGN UP ──────────────── */
function signUp() {
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    auth.createUserWithEmailAndPassword(email, password)
        .then(() => alert("Signup successful! Please log in."))
        .catch(error => alert(error.message));
}

/* ──────────────── 2️⃣ LOGIN ──────────────── */
function login() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            alert("Login successful!");
            loadEntries();
        })
        .catch(error => alert(error.message));
}

/* ──────────────── 3️⃣ LOGOUT ──────────────── */
function logout() {
    auth.signOut()
        .then(() => {
            alert("Logged out.");
            document.getElementById("entries").innerHTML = "";
        })
        .catch(error => alert(error.message));
}

/* ──────────────── 4️⃣ SAVE DIARY ENTRY ──────────────── */
function saveEntry() {
    const user = auth.currentUser;
    if (!user) {
        alert("You must be logged in to save an entry!");
        return;
    }

    const title = document.getElementById("entry-title").value;
    const content = document.getElementById("entry-content").value;

    if (title.trim() === "" || content.trim() === "") {
        alert("Title and content cannot be empty.");
        return;
    }

    db.collection("diary").add({
        userId: user.uid,
        title: title,
        content: content,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        alert("Entry saved!");
        document.getElementById("entry-title").value = "";
        document.getElementById("entry-content").value = "";
        loadEntries();
    }).catch(error => alert("Error saving entry: " + error.message));
}

/* ──────────────── 5️⃣ LOAD ENTRIES ──────────────── */
function loadEntries() {
    const user = auth.currentUser;
    if (!user) return;

    db.collection("diary").where("userId", "==", user.uid)
        .orderBy("timestamp", "desc")
        .onSnapshot(snapshot => {
            let entriesHtml = "";
            snapshot.forEach(doc => {
                let entry = doc.data();
                entriesHtml += `
                    <div class="entry">
                        <h3>${entry.title}</h3>
                        <p>${entry.content}</p>
                        <button class="btn-danger" onclick="deleteEntry('${doc.id}')">Delete</button>
                    </div>
                `;
            });
            document.getElementById("entries").innerHTML = entriesHtml;
        });
}

/* ──────────────── 6️⃣ DELETE ENTRY ──────────────── */
function deleteEntry(entryId) {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    db.collection("diary").doc(entryId).delete()
        .then(() => {
            alert("Entry deleted.");
            loadEntries();
        })
        .catch(error => alert("Error deleting entry: " + error.message));
}

/* ──────────────── 7️⃣ DETECT LOGIN STATUS ──────────────── */
auth.onAuthStateChanged(user => {
    if (user) {
        document.getElementById("auth-section").classList.add("hidden");
        document.getElementById("diary-section").classList.remove("hidden");
        loadEntries();
    } else {
        document.getElementById("auth-section").classList.remove("hidden");
        document.getElementById("diary-section").classList.add("hidden");
    }
});
