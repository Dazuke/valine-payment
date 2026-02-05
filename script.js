const payments = [
  { name: "Dana", number: "087872848734", icon: "assets/dana.jpg" },
  { name: "Gopay", number: "087872848734", icon: "assets/gopay.png" },
  { name: "ShopeePay", number: "087872848734", icon: "assets/shopepay.png" },
  { name: "QRIS", number: "Scan QR", icon: "assets/gopay.png" }
];

const copyBtn = document.getElementById("copyBtn");
const copyCountEl = document.getElementById("copyCount");
const trxCountEl = document.getElementById("trxCount");

let index = 0;
let copyCount = localStorage.getItem("copy") || 0;
let trxCount = localStorage.getItem("trx") || 0;

updateUI();

function updateUI() {
  const p = payments[index];
  payIcon.src = p.icon;
  payName.textContent = p.name;
  payNumber.textContent = p.number;

  // QR mode
  if (p.name === "QRIS") {
    copyBtn.style.display = "none";
    payNumber.innerHTML = `
      <span class="qr-hint">Klik QR untuk zoom</span>
    `;
    payIcon.style.cursor = "pointer";
    payIcon.onclick = () => openQR(p.icon);
  } else {
    copyBtn.style.display = "inline-block";
    payIcon.onclick = null;
  }

  copyCountEl();
}
function openQR(src) {
  qrBig.src = src;
  qrModal.style.display = "flex";
}

function closeQR() {
  qrModal.style.display = "none";
}

function nextPay() {
  index = (index + 1) % payments.length;
  updateUI();
}

function prevPay() {
  index = (index - 1 + payments.length) % payments.length;
  updateUI();
}


// Listen realtime database
database.ref("copyCount").on("value", snap => {
  copyCountEl.textContent = snap.val() || 0;
});

database.ref("trxCount").on("value", snap => {
  trxCountEl.textContent = snap.val() || 0;
});

// Update database saat tombol salin diklik
copyBtn.onclick = () => {
  navigator.clipboard.writeText(payments[index].number);
  database.ref("copyCount").transaction(current => (current || 0) + 1);
  database.ref("trxCount").transaction(current => (current || 0) + 1);
  
  copyBtn.textContent = "✅ Tersalin";
  setTimeout(() => copyBtn.textContent = "📎 Salin Nomor", 1200);
};

function copyCountEl() {
  document.getElementById("copyCount").textContent = copyCount;
  document.getElementById("trxCount").textContent = trxCount;
}
