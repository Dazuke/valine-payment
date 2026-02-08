import { ref, onValue, runTransaction } from
"https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

let db;

const waitForDB = setInterval(() => {
  if (window.database) {
    db = window.database;
    initCounters();
    clearInterval(waitForDB);
  }
}, 100);

const payments = [
  { name:"Dana", number:"8787-2748-734", icon:"assets/dana.jpg" },
  { name:"Gopay", number:"8787-2748-734", icon:"assets/gopay.png" },
  { name:"ShopeePay", number:"8787-2748-734", icon:"assets/shopepay.png" },
  { name:"QRIS", number:"", icon:"assets/qris.png" }
];

let index = 0;

const payIcon = document.getElementById("payIcon");
const payName = document.getElementById("payName");
const payNumber = document.getElementById("payNumber");
const copyBtn = document.getElementById("copyBtn");
const qrisBox = document.getElementById("qrisBox");

const copyCountEl = document.getElementById("copyCount");
const socialClickEl = document.getElementById("socialClick");

function initCounters() {
  onValue(ref(db,"copyCount"), s => {
    copyCountEl.textContent = s.val() || 0;
  });

  onValue(ref(db,"socialClick"), s => {
    socialClickEl.textContent = s.val() || 0;
  });
}
function updateUI(){
  const p = payments[index];
  payIcon.src = p.icon;
  payName.textContent = p.name;

  if(p.name==="QRIS"){
    copyBtn.style.display="none";
    payNumber.textContent="Masukkan nominal lalu buat QR";
    qrisBox.style.display="flex";
  } else {
    copyBtn.style.display="inline-block";
    payNumber.textContent=p.number;
    qrisBox.style.display="none";
  }
}

copyBtn.onclick=()=>{
  navigator.clipboard.writeText(payments[index].number);
  runTransaction(ref(db,"copyCount"),v=>(v||0)+1);
};

window.incrementSocial=()=>{
  runTransaction(ref(db,"socialClick"),v=>(v||0)+1);
};

window.nextPay=()=>{
  index=(index+1)%payments.length;
  updateUI();
};

window.prevPay=()=>{
  index=(index-1+payments.length)%payments.length;
  updateUI();
};
const qrisInput = document.getElementById("qrisAmount");

qrisInput.addEventListener("input", () => {
  let value = qrisInput.value.replace(/\D/g, "");
  if (!value) {
    qrisInput.value = "";
    return;
  }
  qrisInput.value = Number(value).toLocaleString("id-ID");
});

window.generateQrisFrontend = () => {
  const raw = qrisInput.value.replace(/\./g, "");
  const amount = parseInt(raw);

  if (!amount || amount < 1000) {
    alert("Nominal minimal Rp1.000");
    return;
  }

  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=QRIS|VALINE|${amount}`;
  openQR(qr);
};

window.openQR=(src)=>{
  document.getElementById("qrBig").src=src;
  document.getElementById("qrModal").style.display="flex";
};

window.closeQR=()=>{
  document.getElementById("qrModal").style.display="none";
};

// ===== ADS SLIDER =====
const adsSlide = document.querySelector(".ads-slide");
const adsImages = document.querySelectorAll(".ads-slide img");

let adIndex = 0;
const totalAds = adsImages.length;

function moveAds() {
  adIndex++;
  adsSlide.style.transition = "transform 0.6s ease-in-out";
  adsSlide.style.transform = `translateX(${-adIndex * 100}%)`;

  // Kalau sudah di clone terakhir, reset tanpa animasi
  if (adIndex === totalAds - 1) {
    setTimeout(() => {
      adsSlide.style.transition = "none";
      adIndex = 0;
      adsSlide.style.transform = "translateX(0)";
    }, 600);
  }
}

// Autoplay
let adsInterval = setInterval(moveAds, 3000);

const adsContainer = document.querySelector(".ads-container");

adsContainer.addEventListener("mouseenter", () => {
  clearInterval(adsInterval);
});

adsContainer.addEventListener("mouseleave", () => {
  adsInterval = setInterval(moveAds, 3000);
});

.ads-container {
  overflow:hidden;
}

.ads-slide {
  display:flex;
  width:400%;
}

.ads-slide img {
  width:100%;
  flex-shrink:0;
}

updateUI();
