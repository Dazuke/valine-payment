const API = "https://api.countapi.xyz";
const NS = "valine";
const PAY = "copy";
const TRX = "trx";

const copyEl = document.getElementById("copy");
const trxEl = document.getElementById("trx");

fetch(`${API}/hit/${NS}/${PAY}`).then(r=>r.json()).then(d=>copyEl.innerText=d.value);
fetch(`${API}/hit/${NS}/${TRX}`).then(r=>r.json()).then(d=>trxEl.innerText=d.value-1);

function copyPay(){
  navigator.clipboard.writeText("087872848734");
  fetch(`${API}/hit/${NS}/${PAY}`).then(r=>r.json()).then(d=>copyEl.innerText=d.value);
}

function countTrx(){
  fetch(`${API}/hit/${NS}/${TRX}`).then(r=>r.json()).then(d=>trxEl.innerText=d.value);
}

let i = 0;
const track = document.getElementById("track");

setInterval(()=>{
  i = (i+1) % 4;
  track.style.transform = `translateX(${-i*100}%)`;
}, 3000);
