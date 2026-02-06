import { getDatabase, ref, onValue, runTransaction } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const payments = [
  { name: "Dana", number: "8787-2848-734", icon: "assets/dana.jpg" },
  { name: "Gopay", number: "8787-2848-734", icon: "assets/gopay.png" },
  { name: "ShopeePay", number: "8787-2848-734", icon: "assets/shopepay.png" },
  { name: "QRIS", number: "Scan QR", icon: "assets/qris.png" }
];

const db = window.database;

let index = 0;

// DOM
const payIcon = document.getElementById("payIcon");
const payName = document.getElementById("payName");
const payNumber = document.getElementById("payNumber");
const copyBtn = document.getElementById("copyBtn");
const copyCountEl = document.getElementById("copyCount");
const socialClickEl = document.getElementById("socialClick");
const qrModal = document.getElementById("qrModal");
const qrBig = document.getElementById("qrBig");

const adsSlide = document.querySelector('.ads-slide');
const adsImages = document.querySelectorAll('.ads-slide img');
let adIndex = 0;

function showNextAd() {
  adIndex = (adIndex + 1) % adsImages.length;
  adsSlide.style.transform = `translateX(${-adIndex * 100}%)`;
}
let adInterval = setInterval(showNextAd, 3000);
const adsContainer = document.querySelector('.ads-container');
adsContainer.addEventListener('mouseenter', () => clearInterval(adInterval));
adsContainer.addEventListener('mouseleave', () => adInterval = setInterval(showNextAd, 3000));

// Realtime count
onValue(ref(db, 'copyCount'), snap => copyCountEl.textContent = snap.val() || 0);
onValue(ref(db, 'socialClick'), snap => socialClickEl.textContent = snap.val() || 0);

// Slider payment
function updateUI() {
  const p = payments[index];
  payIcon.src = p.icon;
  payName.textContent = p.name;
  if (p.name === "QRIS") {
    copyBtn.style.display = "none";
    payNumber.innerHTML = `<span class="qr-hint">Klik QR untuk zoom</span>`;
    payIcon.style.cursor = "pointer";
    payIcon.onclick = () => openQR(p.icon);
  } else {
    copyBtn.style.display = "inline-block";
    payNumber.textContent = p.number;
    payIcon.onclick = null;
  }
}
function nextPay() { index = (index + 1) % payments.length; updateUI(); }
function prevPay() { index = (index - 1 + payments.length) % payments.length; updateUI(); }

// Copy button
copyBtn.onclick = () => {
  navigator.clipboard.writeText(payments[index].number);
  runTransaction(ref(db, 'copyCount'), current => (current||0)+1);
  copyBtn.textContent = "✅ Tersalin";
  setTimeout(()=>copyBtn.textContent="📎 Salin Nomor",1200);
};

// Social click
window.incrementSocial = () => runTransaction(ref(db,'socialClick'), current => (current||0)+1);

// QR Modal
window.openQR = (src) => { qrBig.src = src; qrModal.style.display="flex"; }
window.closeQR = () => qrModal.style.display="none";

// Payment buttons
window.nextPay = nextPay;
window.prevPay = prevPay;

// Init
updateUI();
