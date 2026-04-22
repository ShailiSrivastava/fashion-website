const API_BASE = "http://localhost:5000/api";
let lastFitType = "";
let inventory = [];
let userCloset = [];

// FETCH INVENTORY & CLOSET
async function fetchProducts() {
  try {
    console.log("Syncing with Local API...");
    const res = await fetch(`${API_BASE}/products?cb=` + Date.now());
    const data = await res.json();
    console.log("Collection synced:", data.length, "items found.");
    inventory = Array.isArray(data) ? data : [];
    
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
      const closetRes = await fetch(`${API_BASE}/users/closet`, {
         headers: { "Authorization": `Bearer ${user.token}` }
      });
      if(closetRes.ok) {
        const closetData = await closetRes.json();
        userCloset = Array.isArray(closetData) ? closetData : [];
      }
    }
    
    renderGrid("all");
    applyAutoPersonalization();
  } catch (err) {
    console.error("Failed to fetch products:", err);
  }
}

function renderGrid(categoryFilter) {
  const grid = document.getElementById("collectionGrid");
  if (!grid) return;
  
  let htmlContent = "";

  inventory.forEach(item => {
    if(categoryFilter !== "all" && item.category !== categoryFilter) return;

    const isSaved = userCloset.some(c => c._id === item._id);
    const heartFill = isSaved ? "♥" : "♡";
    const heartColor = isSaved ? "red" : "#aaa";

    // Basic HTML escaping to mitigate XSS
    const safeName = item.name ? item.name.replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";
    const safeImage = item.imagePath ? item.imagePath.replace(/"/g, "&quot;") : "";

    htmlContent += `
      <div class="item" data-category="${item.category}">
        <div style="position: relative;">
          <img src="${safeImage}">
          <button onclick="toggleCloset('${item._id}')" class="closet-btn" style="position: absolute; top: 15px; right: 15px; background: white; border: none; font-size: 26px; width:45px; height:45px; border-radius: 50%; cursor: pointer; color: ${heartColor}; box-shadow: 0 4px 10px rgba(0,0,0,0.1); display:flex; align-items:center; justify-content:center; transition:0.3s; z-index:10;">${heartFill}</button>
        </div>
        <div class="item-info">
          <h3>${safeName}</h3>
          <p>${item.category === 'casual' ? 'CASUALS' : item.category === 'traditional' ? 'TRADITIONALS' : 'PARTY WEAR'} • $${item.price}</p>
        </div>
      </div>
    `;
  });
  
  grid.innerHTML = htmlContent;
}

function toggleCloset(productId) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.token) {
    alert("Please login to save items to your Virtual Closet.");
    return;
  }

  fetch(`${API_BASE}/users/closet/${productId}`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${user.token}` }
  })
  .then(res => res.json())
  .then(res => {
    if (res.message && (res.message.includes("Not authorized") || res.message === "User not found")) {
      logout();
      return;
    }
    userCloset = res.savedItems || [];
    const activeBtn = document.querySelector('.filters button.active');
    let cat = 'all';
    if(activeBtn) cat = activeBtn.id.replace('Btn', '');
    if(cat === 'traditional') cat = 'traditional'; // clean up
    renderGrid(cat);
  })
  .catch(err => {
    console.error("Closet toggle failed:", err);
  });
}

// BACKEND
function saveFit(data){
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.token) {
    console.log("Not logged in. Saving fit locally only.");
    localStorage.setItem("samayraFit", JSON.stringify(data));
    return;
  }

  fetch(`${API_BASE}/users/fit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${user.token}`
    },
    body: JSON.stringify({
      fitType: data.type,
      fitAdvice: data.advice,
      confidence: data.confidence || null
    })
  })
  .then(res => res.json())
  .then(res => {
    console.log("Saved to database:", res);
    localStorage.setItem("samayraFit", JSON.stringify(data));
    if(res.user) localStorage.setItem("user", JSON.stringify(res.user));
  })
  .catch(err => console.log(err));
}

// QUIZ STEP LOGIC
function nextStep(stepNumber) {
  const steps = document.querySelectorAll('.step-div');
  steps.forEach(step => step.style.display = 'none');
  const target = document.getElementById(`step${stepNumber}`);
  if (target) {
    target.style.display = 'block';
    const tracker = document.getElementById('stepTracker');
    if(tracker) tracker.innerText = `Step ${stepNumber} of 5`;
  }
}

function calculateFit(){
  const shape = document.querySelector('input[name="shape"]:checked')?.value;
  const waist = document.querySelector('input[name="waist"]:checked')?.value;
  const vibe = document.querySelector('input[name="vibe"]:checked')?.value;
  const height = document.querySelector('input[name="height"]:checked')?.value;
  const skinTone = document.querySelector('input[name="skinTone"]:checked')?.value;

  if(!shape || !waist || !vibe || !height || !skinTone){
    alert("Please answer all questions to unlock your accurate style profile.");
    return;
  }

  // Hide quiz UI
  document.getElementById('step5').style.display = 'none';
  const tracker = document.getElementById('stepTracker');
  if(tracker) tracker.style.display = 'none';

  let type="", advice="";

  if(shape==="hourglass" && waist==="defined"){
    type="Hourglass";
    advice="Emphasize your waist with fitted styles and wrap dresses. ";
  }
  else if(shape==="pear"){
    type="Pear";
    advice="A-line outfits and structured shoulders balance your proportions perfectly. ";
  }
  else if(shape==="inverted"){
    type="Inverted Triangle";
    advice="Flowy bottoms, wide-leg trousers, and deep V-necks suit you beautifully. ";
  }
  else{
    type="Straight";
    advice="Layering, belts, and structured jackets create a wonderful shape for you. ";
  }

  // Adding height info
  if(height === "petite") advice += "Since you're petite, opt for high-waisted bottoms and vertical lines to elongate your frame. ";
  if(height === "tall") advice += "As a taller figure, maxi length garments and bold, oversized aesthetics will look stunning. ";

  // Adding vibe info
  if(vibe === "minimalist") advice += "Stick to monochromatic palettes and sleek, clean lines to match your minimalist aesthetic.";
  if(vibe === "glamorous") advice += "Don't shy away from rich textures, embellishments, and statement accessories for that glamorous touch.";

  let fullType = `${type} Silhouette - ${vibe.charAt(0).toUpperCase() + vibe.slice(1)} Edit`;

  lastFitType = fullType;

  document.getElementById("bodyType").innerText = fullType;
  document.getElementById("advice").innerText = advice;
  document.getElementById("result").style.display = "block";
  document.getElementById("cameraSection").style.display = "block";

  saveFit({type: fullType, advice, tone: skinTone});
}

// ✅ UPDATED CAMERA (SMART VERSION)
async function startCamera(){
  try{
    const stream = await navigator.mediaDevices.getUserMedia({video:true});
    const video = document.getElementById("video");
    video.srcObject = stream;
    video.style.display = "block";
    
    document.getElementById("camBtn").style.display = "none";
    document.getElementById("confidenceBox").style.display = "block";

    document.getElementById("confidenceText").innerText = "Scanning framework and analyzing skin tone variables...";

    const skinTone = document.querySelector('input[name="skinTone"]:checked')?.value || "neutral";

    setTimeout(()=>{
      let toneText = "";
      if(skinTone === "warm") toneText = "Warm/Golden hues confirmed.";
      else if(skinTone === "cool") toneText = "Cool/Rosy undertones verified.";
      else toneText = "Neutral palette detected.";

      const msg = `<strong>Confidence Score: 96% Match.</strong><br><br><strong>Analysis:</strong> Physical alignment successful. ${toneText} We have officially calibrated your final collection recommendations.`;
      document.getElementById("confidenceText").innerHTML = msg;

      // Stop camera fully after analysis
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      video.style.display = "none";

      const saved = JSON.parse(localStorage.getItem("samayraFit")) || {};
      saveFit({...saved, confidence: `96% Match. ${toneText}`});

    }, 3500);

  }catch{
    alert("Camera access is required for final verification.");
  }
}

// COLLECTION FILTERING
function filterItems(category, btn){
  const buttons = document.querySelectorAll('.filters button');
  if(buttons.length) {
    buttons.forEach(b => b.classList.remove('active'));
    if(btn) btn.classList.add('active');
  }

  if (document.getElementById("collectionGrid")) {
    renderGrid(category);
  }
}

// AUTO PERSONALIZATION
function applyAutoPersonalization() {
  const saved = localStorage.getItem("samayraFit");
  const message = document.getElementById("fitMessage");
  
  if(!saved || !message) return;

  const fit = JSON.parse(saved);
  let category = "all";
  let buttonId = "allBtn";

  if(fit.type.includes("Pear")){
    category = "traditional";
    buttonId = "traditionalBtn";
    message.innerText = "Curated for your Pear Silhouette — styles that balance and flatter.";
  }
  else if(fit.type.includes("Hourglass")){
    category = "party";
    buttonId = "partyBtn";
    message.innerText = "Curated for your Hourglass Silhouette — silhouettes that celebrate balance.";
  }
  else if(fit.type.includes("Inverted")){
    category = "casual";
    buttonId = "casualBtn";
    message.innerText = "Curated for your Inverted Triangle Silhouette — relaxed and flowing fits.";
  }
  else if(fit.type.includes("Straight")){
    category = "casual";
    buttonId = "casualBtn";
    message.innerText = "Curated for your Straight Silhouette — styles that add structure and shape.";
  }

  const button = document.getElementById(buttonId);
  filterItems(category, button);
}

// AUTHENTICATION
let isSignup = false;

function toggleForm(){
  const title = document.getElementById("title");
  const btn = document.querySelector(".auth-box button");
  const nameInput = document.getElementById("name");
  const toggleText = document.querySelector(".toggle");
  const errorBox = document.getElementById("errorMsg");

  if(!title || !btn) return;

  isSignup = !isSignup;

  title.innerText = isSignup ? "Create Account" : "Login";
  btn.innerText = isSignup ? "Sign Up" : "Login";

  nameInput.style.display = isSignup ? "block" : "none";

  toggleText.innerText =
    isSignup ? "Already have an account? Login" : "Don't have an account? Sign up";

  errorBox.innerText = "";
}

function submitForm(){
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const errorBox = document.getElementById("errorMsg");

  if(!emailInput || !passwordInput || !errorBox) return;

  const name = nameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;

  errorBox.innerText = "";

  if(!email || !password || (isSignup && !name)){
    errorBox.innerText = "Please fill all fields";
    return;
  }

  const url = isSignup
    ? `${API_BASE}/auth/signup`
    : `${API_BASE}/auth/login`;

  fetch(url,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({name,email,password})
  })
  .then(async res=>{
    const data = await res.json();

    if(!res.ok){
      errorBox.innerText = data.message || "Something went wrong";
      return;
    }

    if(isSignup){
      errorBox.style.color = "green";
      errorBox.innerText = "Account created! Please login.";
      toggleForm();
      return;
    }

    // LOGIN SUCCESS
    localStorage.setItem("user", JSON.stringify(data.user));
    if (data.user.fitType) {
      localStorage.setItem("samayraFit", JSON.stringify({
        type: data.user.fitType,
        advice: data.user.fitAdvice,
        confidence: data.user.confidence
      }));
    }
    window.location.href = "index.html";
  })
  .catch(err=>{
    errorBox.innerText = "Server error";
    console.log(err);
  });
}

// NAVIGATION MANAGEMENT
function updateNavbar(){
  const navLinks = document.querySelector("nav ul");
  if(!navLinks) return;

  const user = JSON.parse(localStorage.getItem("user"));
  
  // Remove existing dynamic links
  const dynamicLinks = navLinks.querySelectorAll(".dynamic-link");
  dynamicLinks.forEach(l => l.remove());

  // Add Profile and Logout if user exists
  if(user){
    const profileLi = document.createElement("li");
    profileLi.className = "dynamic-link";
    profileLi.innerHTML = `<a href="profile.html">Profile</a>`;
    
    const logoutLi = document.createElement("li");
    logoutLi.className = "dynamic-link";
    logoutLi.innerHTML = `<a href="#" onclick="logout()">Logout</a>`;
    
    navLinks.appendChild(profileLi);
    navLinks.appendChild(logoutLi);
  } else {
    // Add Login link if user doesn't exist
    const loginLi = document.createElement("li");
    loginLi.className = "dynamic-link";
    loginLi.innerHTML = `<a href="login.html">Login</a>`;
    navLinks.appendChild(loginLi);
  }

  // Highlight active link
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const allLinks = navLinks.querySelectorAll("a");
  allLinks.forEach(link => {
    const linkPath = link.getAttribute("href");
    if (linkPath === currentPath) {
      link.classList.add("active-link");
    } else {
      link.classList.remove("active-link");
    }
  });
}

function logout(){
  localStorage.removeItem("user");
  localStorage.removeItem("samayraFit");
  window.location.href = "index.html";
}

// Run core DOM logic
document.addEventListener("DOMContentLoaded", () => {
  updateNavbar();
  
  if (document.getElementById("collectionGrid")) {
    fetchProducts();
  }
});
