function showTime() {
  var el = document.getElementById('currentTime');
  if (el) el.innerHTML = new Date().toUTCString();
}
showTime();
setInterval(function () {
  showTime();
}, 1000);