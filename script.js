// === Ads auto-slide ===
const adsSlide = document.querySelector('.ads-slide');
const adsImages = document.querySelectorAll('.ads-slide img');
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
const paymentSlide = document.querySelector('.payment-slide');
const paymentImages = document.querySelectorAll('.payment-slide img');
let paymentIndex = 0;

function showNextPayment() {
  paymentIndex++;
  if(paymentIndex >= paymentImages.length) paymentIndex = 0;
  paymentSlide.style.transform = `translateX(${-paymentIndex * 100}%)`;
}
setInterval(showNextPayment, 3000);
