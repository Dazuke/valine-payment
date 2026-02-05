// Data payment
const payments = [
  { name: "Dana", number: "8787-2848-734", icon: "assets/dana.jpg" },
  { name: "Gopay", number: "8787-2848-734", icon: "assets/gopay.png" },
  { name: "ShopeePay", number: "8787-2848-734", icon: "assets/shope.png" },
  { name: "QRIS", number: "Scan QR", icon: "assets/whatsapp-group.png" }
];

let index = 0;

// DOM
const payIcon = document.getElementById("payIcon");
const payName = document.getElementById("payName");
const payNumber = document.getElementById("payNumber");
const copyBtn = document.getElementById("copyBtn");
const copyCountEl = document.getElementById("copyCount");
const trxCountEl = document.getElementById("trxCount");
const qrModal = document.getElementById("qrModal");
const qrBig = document.getElementById("qrBig");

// Firebase database module
import { getDatabase, ref, onValue, runTransaction } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";
const database = getDatabase();

// Realtime count
onValue(ref(database, 'copyCount'), snap => {
  copyCountEl.textContent = snap.val() || 0;
});
onValue(ref(database, 'trxCount'), snap => {
  trxCountEl.textContent = snap.val() || 0;
});

// Slider functions
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

function nextPay() {
  index = (index + 1) % payments.length;
  updateUI();
}
function prevPay() {
  index = (index - 1 + payments.length) % payments.length;
  updateUI();
}

// Copy button click
copyBtn.onclick = () => {
  navigator.clipboard.writeText(payments[index].number);
  // increment copyCount
  runTransaction(ref(database, 'copyCount'), current => (current || 0) + 1);
  // increment trxCount
  runTransaction(ref(database, 'trxCount'), current => (current || 0) + 1);

  copyBtn.textContent = "✅ Tersalin";
  setTimeout(() => copyBtn.textContent = "📎 Salin Nomor", 1200);
};

// QR Modal
function openQR(src) {
  qrBig.src = src;
  qrModal.style.display = "flex";
}
function closeQR() {
  qrModal.style.display = "none";
}

window.nextPay = nextPay;
window.prevPay = prevPay;

// Initialize
updateUI();
