/*
 * Developed by Inside4ndroid Studios Ltd
 */
document.addEventListener('DOMContentLoaded', function () {

  let isDragging = false;
  let offsetX, offsetY;

  const noDragElement = document.getElementById('noDrag');
  const header = document.querySelector('.header');

  noDragElement.addEventListener('mousedown', (event) => {
    event.preventDefault();
  });

  var currentTime = new Date();
  var hours = currentTime.getHours();
  var minutes = currentTime.getMinutes();
  minutes = minutes < 10 ? '0' + minutes : minutes;

  var timeString = hours + ':' + minutes;
  document.querySelector('.time').textContent = timeString;

  var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var dayOfWeek = daysOfWeek[currentTime.getDay()];

  document.querySelector('.label').textContent = dayOfWeek;

  var day = currentTime.getDate();
  var month = currentTime.getMonth() + 1;
  var year = currentTime.getFullYear();

  day = day < 10 ? '0' + day : day;
  month = month < 10 ? '0' + month : month;

  var dateString = day + '/' + month + '/' + year;
  document.getElementById('date').textContent = dateString;

  header.addEventListener('mousedown', (event) => {
    if (event.button === 0) {
      isDragging = true;
      offsetX = event.clientX;
      offsetY = event.clientY;
    }
  });

  document.addEventListener('mousemove', (event) => {
    if (isDragging) {
      const { screenX, screenY } = event;
      const newX = screenX - offsetX;
      const newY = screenY - offsetY;
      window.moveTo(newX, newY);
    }
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
    }
  });
});