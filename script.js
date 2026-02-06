const qrImg = document.getElementById('qris-img');
const modal = document.getElementById('qrModal');
const modalImg = document.getElementById('modal-img');
const adsSlide = document.querySelector('.ads-slide');
const adsImages = document.querySelectorAll('.ads-slide img');
const paymentSlide = document.querySelector('.payment-slide');
const paymentCards = document.querySelectorAll('.payment-card');

// === Ads auto-slide ===

let adIndex = 0;

function showNextAd() {
  adIndex++;
  if(adIndex >= adsImages.length) adIndex = 0;
  adsSlide.style.transform = `translateX(${-adIndex * 100}%)`;
}

let adInterval = setInterval(showNextAd, 3000);

const adsContainer = document.querySelector('.ads-container.no-glass');
adsContainer.addEventListener('mouseenter', () => clearInterval(adInterval));
adsContainer.addEventListener('mouseleave', () => adInterval = setInterval(showNextAd, 3000));

// === Payment slider auto-slide (optional) ===

let paymentIndex = 0;

function updatePaymentPosition() {
  const offset = -paymentIndex * 140; // 120px + 2*10px margin
  paymentSlide.style.transform = `translateX(${offset}px)`;
}

function nextPayment() {
  paymentIndex++;
  if(paymentIndex >= paymentCards.length) paymentIndex = 0;
  updatePaymentPosition();
}

function prevPayment() {
  paymentIndex--;
  if(paymentIndex < 0) paymentIndex = paymentCards.length - 1;
  updatePaymentPosition();
}

// Salin nomor
function copyNumber(number) {
  navigator.clipboard.writeText(number)
    .then(() => {
      alert('Nomor berhasil disalin: ' + number);
      incrementCopy(); // update Firebase
    });
}
// qriss zooom
qrImg.onclick = () => {
  modal.style.display = "flex";
  modalImg.src = qrImg.src;
};

function closeModal() {
  modal.style.display = "none";
}
