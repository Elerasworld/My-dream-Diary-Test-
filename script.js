// Connect to Supabase
const SUPABASE_URL = "https://cxcdqcpfwwkparpurodg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiO
    iJzdXBhYmFzZSIsInJlZiI6ImN4Y2RxY3Bmd3drcGFycHVyb2RnIiwicm9sZSI6ImFub24
    iLCJpYXQiOjE3NDA1MzcyMDAsImV4cCI6MjA1NjExMzIwMH0.PtE9eg7Z20YL_pgHli-FbAaz
        WxUIVaydkSHuomeFz1E";

const supabase = supabase.createClient(https://cxcdqcpfwwkparpurodg.supabase.co
                                       , eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJl
                                       ZiI6ImN4Y2RxY3Bmd3drcGFycHVyb2RnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1MzcyMDAsI
                                       mV4cCI6MjA1NjExMzIwMH0.PtE9eg7Z20YL_pgHli-FbAazWxUIVaydkSHuomeFz1E);

// Step 2: User Registration
async function registerUser(username, password) {
    const { user, error } = await supabase.auth.signUp({
        email: username,
        password: password
    });

    if (error) {
        console.error("Registration Error:", error.message);
        alert(error.message);
    } else {
        console.log("User Registered:", user);
        alert("Registration successful! Please log in.");
    }
}

// Step 3: User Login
async function loginUser(username, password) {
    const { user, error } = await supabase.auth.signInWithPassword({
        email: username,
        password: password
    });

    if (error) {
        console.error("Login Error:", error.message);
        alert(error.message);
    } else {
        console.log("User Logged In:", user);
        alert("Login successful!");
        loadDiaryEntries();
    }
}

// Step 4: Save Diary Entry
async function saveDiaryEntry(title, content) {
    const user = supabase.auth.user();
    if (!user) {
        alert("You must be logged in to save entries!");
        return;
    }

    const { data, error } = await supabase
        .from("diary_entries")
        .insert([{ user_id: user.id, title: title, content: content }]);

    if (error) {
        console.error("Error saving diary entry:", error.message);
        alert(error.message);
    } else {
        console.log("Diary Entry Saved:", data);
        alert("Diary entry saved successfully!");
        loadDiaryEntries();
    }
}

// Step 5: Fetch Diary Entries
async function loadDiaryEntries() {
    const user = supabase.auth.user();
    if (!user) {
        alert("Please log in to view your diary entries!");
        return;
    }

    const { data, error } = await supabase
        .from("diary_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching diary entries:", error.message);
    } else {
        console.log("Diary Entries:", data);
        displayDiaryEntries(data);
    }
}

// Step 6: Display Diary Entries on Page
function displayDiaryEntries(entries) {
    const diaryContainer = document.getElementById("diary-entries");
    diaryContainer.innerHTML = "";

    entries.forEach(entry => {
        const entryDiv = document.createElement("div");
        entryDiv.classList.add("diary-entry");
        entryDiv.innerHTML = `
            <h3>${entry.title}</h3>
            <p>${entry.content}</p>
            <small>Created: ${new Date(entry.created_at).toLocaleString()}</small>
        `;
        diaryContainer.appendChild(entryDiv);
    });
}

// Step 7: User Logout
async function logoutUser() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error("Logout Error:", error.message);
        alert(error.message);
    } else {
        console.log("User Logged Out");
        alert("You have been logged out.");
    }
}
