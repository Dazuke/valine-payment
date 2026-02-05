/* COUNT API */
const API_NS = "valine-payment";
const COPY_KEY = "copy-count";
const TRX_KEY = "trx-count";

async function loadCount(key, el) {
  const res = await fetch(`https://api.countapi.xyz/get/${API_NS}/${key}`);
  const data = await res.json();
  document.getElementById(el).innerText = data.value || 0;
}

async function hitCount(key, el) {
  const res = await fetch(`https://api.countapi.xyz/hit/${API_NS}/${key}`);
  const data = await res.json();
  document.getElementById(el).innerText = data.value;
}

function copyNumber(number, btn) {
  const txt = btn.innerText;
  navigator.clipboard.writeText(number).then(() => {
    hitCount(COPY_KEY, "copyCount");
    hitCount(TRX_KEY, "trxCount");
    btn.innerText = "✔ Tersalin";
    setTimeout(() => btn.innerText = txt, 1200);
  });
}

/* QRIS */
function openQRIS() {
  document.getElementById("qrisModal").style.display = "flex";
}
function closeQRIS() {
  document.getElementById("qrisModal").style.display = "none";
}

/* SLIDER */
const track = document.getElementById("paymentTrack");
let index = 1;
let startX = 0;
const slideWidth = window.innerWidth;

track.style.transform = `translateX(${-slideWidth * index}px)`;

track.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
});

track.addEventListener("touchend", e => {
  const diff = e.changedTouches[0].clientX - startX;
  if (diff > 50) index--;
  if (diff < -50) index++;
  move();
});

function move() {
  track.style.transition = "transform .45s ease";
  track.style.transform = `translateX(${-slideWidth * index}px)`;
}

track.addEventListener("transitionend", () => {
  const total = track.children.length;
  if (index === 0) {
    track.style.transition = "none";
    index = total - 2;
    track.style.transform = `translateX(${-slideWidth * index}px)`;
  }
  if (index === total - 1) {
    track.style.transition = "none";
    index = 1;
    track.style.transform = `translateX(${-slideWidth * index}px)`;
  }
});

/* INIT */
loadCount(COPY_KEY, "copyCount");
loadCount(TRX_KEY, "trxCount");
