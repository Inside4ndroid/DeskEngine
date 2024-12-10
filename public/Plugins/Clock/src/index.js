/*
 * Developed by Inside4ndroid Studios Ltd
 */
document.addEventListener('DOMContentLoaded', async () => {

  let isDragging = false;
  let offsetX, offsetY;

  const noDragElement = document.getElementById('noDrag');
  const header = document.querySelector('.header');

  noDragElement.addEventListener('mousedown', (event) => {
    event.preventDefault();
  });

  var timeString = await window.api.getClockInfo('getCurrentTime');
  document.querySelector('.time').textContent = timeString;

  var dayOfWeek = await window.api.getClockInfo('getToday');

  document.querySelector('.label').textContent = dayOfWeek;

  var alldata = await window.api.getClockInfo('getAllDateInfo');
  var day = alldata.getDate();
  var month = alldata.getMonth() + 1;
  var year = alldata.getFullYear();

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