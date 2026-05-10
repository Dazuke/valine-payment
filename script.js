import { ref, onValue, runTransaction, set } from
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
  {
    name:"Dana",
    number:"087872748734",
    icon:"assets/dana.jpg",
    color:"#00AEEF"
  },
  {
    name:"Gopay",
    number:"087872748734",
    icon:"assets/gopay.png",
    color:"#00AED6"
  },
  {
    name:"ShopeePay",
    number:"087872748734",
    icon:"assets/shopepay.png",
    color:"#EE4D2D"
  },
  {
    name:"QRIS",
    number:"Scan QRIS",
    icon:"assets/qris.png",
    color:"#8B5CF6"
  }
];

let payIndex = 0;

const payIcon = document.getElementById("payIcon");
const payName = document.getElementById("payName");
const payNumber = document.getElementById("payNumber");
const copyBtn = document.getElementById("copyBtn");
const paymentCard = document.querySelector(".payment");

function updatePaymentUI() {

  const p = payments[payIndex];

  payIcon.src = p.icon;
  payName.textContent = p.name;
  payNumber.textContent = p.number;

  paymentCard.style.border = `1px solid ${p.color}55`;
  paymentCard.style.boxShadow = `0 0 25px ${p.color}33`;

  if (p.name === "QRIS") {

    copyBtn.innerHTML = "📷 Lihat QRIS";

    copyBtn.onclick = () => {
      openQR("assets/qris.png");
    };

  } else {

    copyBtn.innerHTML = "📎 Salin Nomor";

    copyBtn.onclick = async () => {

      await navigator.clipboard.writeText(p.number);

      copyBtn.innerHTML = "✅ Tersalin";

      setTimeout(() => {
        copyBtn.innerHTML = "📎 Salin Nomor";
      }, 1500);

      runTransaction(ref(db,"copyCount"), v => (v||0)+1);

    };
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

window.openQR = src => {
  document.getElementById("qrBig").src = src;
  document.getElementById("qrModal").style.display = "flex";
};

window.closeQR = () => {
  document.getElementById("qrModal").style.display = "none";
};

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

window.createInvoice = async () => {

  const amount = document.getElementById("amountInput").value;

  if (!amount || amount < 1000) {
    alert("Minimal Rp1000");
    return;
  }

  const invoice = "INV-" + Math.floor(Math.random()*999999);

  const invoiceBox = document.getElementById("invoiceResult");

  invoiceBox.style.display = "block";

  invoiceBox.innerHTML = `

  <b>Invoice:</b> ${invoice}<br><br>
  <b>Nominal:</b> Rp${Number(amount).toLocaleString('id-ID')}<br><br>
  <b>Status:</b> <span id="paymentStatus">PROCESSING...</span><br><br>
  <b>Expired:</b> <span id="countdown">15:00</span><br><br>
  <button onclick="openQR('assets/qris.png')">📷 Buka QRIS</button>

  `;

  const ting = document.getElementById("tingSound");
  ting.play();

  await set(ref(db, "transactions/" + invoice), {
    amount: amount,
    method: payments[payIndex].name,
    status: "PENDING",
    createdAt: Date.now()
  });

  fakeProcess(invoice);
  startCountdown();
};

async function fakeProcess(invoice) {

  const status = document.getElementById("paymentStatus");

  status.innerHTML = "Menghubungkan Gateway...";

  setTimeout(() => {
    status.innerHTML = "Memvalidasi Pembayaran...";
  }, 2500);

  setTimeout(() => {
    status.innerHTML = "Mengirim Callback...";
  }, 5000);

  setTimeout(async () => {

    status.innerHTML = "✅ BERHASIL";

    await set(ref(db, "transactions/" + invoice + "/status"), "PAID");

  }, 8000);
}

function startCountdown() {

  let time = 900;

  const countdown = document.getElementById("countdown");

  const timer = setInterval(() => {

    const min = Math.floor(time / 60);
    const sec = time % 60;

    countdown.innerHTML = `${min}:${sec < 10 ? '0'+sec : sec}`;

    time--;

    if (time < 0) {
      clearInterval(timer);
      countdown.innerHTML = "EXPIRED";
    }

  }, 1000);
}

const adsSlide = document.querySelector(".ads-slide");
const adsImages = document.querySelectorAll(".ads-slide img");
const dotsContainer = document.getElementById("adsDots");

let adIndex = 0;
const totalAds = adsImages.length;

dotsContainer.innerHTML = "";

for (let i=0;i<totalAds;i++) {
  const dot = document.createElement("span");
  if (i===0) dot.classList.add("active");
  dotsContainer.appendChild(dot);
}

const dots = dotsContainer.querySelectorAll("span");

function updateDots() {
  dots.forEach(d => d.classList.remove("active"));
  dots[adIndex]?.classList.add("active");
}

function moveAds() {
  adIndex = (adIndex + 1) % totalAds;
  adsSlide.style.transform = `translateX(-${adIndex*100}%)`;
  updateDots();
}

setInterval(moveAds, 3000);

const fakePayments = [
  "Someone paid Rp10.000 via Dana",
  "Someone paid Rp25.000 via QRIS",
  "Someone paid Rp50.000 via ShopeePay",
  "Someone paid Rp100.000 via Gopay"
];

setInterval(() => {

  const live = document.getElementById("livePayment");

  live.innerHTML = fakePayments[Math.floor(Math.random()*fakePayments.length)];

}, 5000);

updatePaymentUI();
