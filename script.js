const payments = [
  { name: "Dana", number: "087872848734", icon: "assets/dana.jpg" },
  { name: "Gopay", number: "087872848734", icon: "assets/gopay.png" },
  { name: "ShopeePay", number: "087872848734", icon: "assets/shope.png" },
  { name: "QRIS", number: "Scan QR", icon: "assets/qris.png" }
];

let index = 0;
let copyCount = localStorage.getItem("copy") || 0;
let trxCount = localStorage.getItem("trx") || 0;

updateUI();

function updateUI() {
  const p = payments[index];
  payIcon.src = p.icon;
  payName.textContent = p.name;
  payNumber.textContent = p.number;
  copyCountEl();
}

function nextPay() {
  index = (index + 1) % payments.length;
  updateUI();
}

function prevPay() {
  index = (index - 1 + payments.length) % payments.length;
  updateUI();
}

copyBtn.onclick = () => {
  navigator.clipboard.writeText(payments[index].number);
  copyCount++;
  trxCount++;
  localStorage.setItem("copy", copyCount);
  localStorage.setItem("trx", trxCount);
  copyCountEl();
  copyBtn.textContent = "✅ Tersalin";
  setTimeout(() => copyBtn.textContent = "📎 Salin Nomor", 1200);
};

function copyCountEl() {
  document.getElementById("copyCount").textContent = copyCount;
  document.getElementById("trxCount").textContent = trxCount;
}
