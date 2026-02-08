import { ref, onValue, runTransaction } from
"https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

/* ================= DATABASE ================= */
let db;
const waitForDB = setInterval(() => {
  if (window.database) {
    db = window.database;
    initCounters();
    clearInterval(waitForDB);
  }
}, 100);

/* ================= PAYMENT ================= */
const payments = [
  { name:"Dana", number:"8787-2748-734", icon:"assets/dana.jpg" },
  { name:"Gopay", number:"8787-2748-734", icon:"assets/gopay.png" },
  { name:"ShopeePay", number:"8787-2748-734", icon:"assets/shopepay.png" },
  { name:"QRIS", number:"", icon:"assets/qris.png" }
];

let payIndex = 0;

const payIcon   = document.getElementById("payIcon");
const payName   = document.getElementById("payName");
const payNumber = document.getElementById("payNumber");
const copyBtn   = document.getElementById("copyBtn");
const qrisBox   = document.getElementById("qrisBox");

function updatePaymentUI() {
  const p = payments[payIndex];
  payIcon.src = p.icon;
  payName.textContent = p.name;

  if (p.name === "QRIS") {
    copyBtn.style.display = "none";
    payNumber.textContent = "Masukkan nominal lalu buat QR";
    qrisBox.style.display = "flex";
  } else {
    copyBtn.style.display = "inline-block";
    payNumber.textContent = p.number;
    qrisBox.style.display = "none";
  }
}

window.nextPay = () => {
  payIndex = (payIndex + 1) % payments.length;
  updatePaymentUI();
};

window.prevPay = () => {
  payIndex = (payIndex - 1 + payments.length) % payments.length;
  updatePaymentUI();
};

copyBtn.onclick = () => {
  navigator.clipboard.writeText(payments[payIndex].number);
  runTransaction(ref(db,"copyCount"), v => (v||0)+1);
};

/* ===== Swipe payment HP ===== */
const payBox = document.querySelector(".payment");
let startX = 0;

payBox?.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
});

payBox?.addEventListener("touchend", e => {
  const diff = e.changedTouches[0].clientX - startX;
  if (diff > 50) prevPay();
  if (diff < -50) nextPay();
});

/* ================= QRIS ================= */
const qrisInput = document.getElementById("qrisAmount");

qrisInput?.addEventListener("input", () => {
  const raw = qrisInput.value.replace(/\D/g,"");
  qrisInput.value = raw ? Number(raw).toLocaleString("id-ID") : "";
});

window.generateQrisFrontend = () => {
  const amount = parseInt(qrisInput.value.replace(/\./g,""));
  if (!amount || amount < 1000) {
    alert("Nominal minimal Rp1.000");
    return;
  }
  openQR(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=QRIS|VALINE|${amount}`);
};

window.openQR = src => {
  document.getElementById("qrBig").src = src;
  document.getElementById("qrModal").style.display = "flex";
};

window.closeQR = () => {
  document.getElementById("qrModal").style.display = "none";
};

/* ================= COUNTERS ================= */
function initCounters() {
  onValue(ref(db,"copyCount"), s => {
    document.getElementById("copyCount").textContent = s.val() || 0;
  });
  onValue(ref(db,"socialClick"), s => {
    document.getElementById("socialClick").textContent = s.val() || 0;
  });
}

window.incrementSocial = () => {
  runTransaction(ref(db,"socialClick"), v => (v||0)+1);
};

/* ================= ADS SLIDER ================= */
const adsContainer = document.querySelector(".ads-container");
const adsSlide = document.querySelector(".ads-slide");
const adsImages = document.querySelectorAll(".ads-slide img");
const dotsContainer = document.getElementById("adsDots");

let adIndex = 0;
const totalAds = adsImages.length;

/* dots */
dotsContainer.innerHTML = "";
for (let i=0;i<totalAds;i++){
  const dot=document.createElement("span");
  if(i===0)dot.classList.add("active");
  dotsContainer.appendChild(dot);
}
const dots=dotsContainer.querySelectorAll("span");

function updateDots(){
  dots.forEach(d=>d.classList.remove("active"));
  dots[adIndex]?.classList.add("active");
}

function moveAds(){
  adIndex=(adIndex+1)%totalAds;
  adsSlide.style.transform=`translateX(-${adIndex*100}%)`;
  updateDots();
}

let adsInterval=setInterval(moveAds,3000);

adsContainer?.addEventListener("mouseenter",()=>clearInterval(adsInterval));
adsContainer?.addEventListener("mouseleave",()=>{
  adsInterval=setInterval(moveAds,3000);
});

/* ================= INIT ================= */
updatePaymentUI();
