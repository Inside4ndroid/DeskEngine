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

  // Get and set cpu manufacturer using api
  try {
    const manufacturer = await window.api.getCPUInfo('manufacturer');
    document.getElementById('manufacturer').textContent = manufacturer;
  } catch (error) {
    console.error('Error fetching CPU Info:', error);
    document.getElementById('manufacturer').textContent = 'error';
  }

  // Get and set cpu brand using api
  try {
    const brand = await window.api.getCPUInfo('brand');
    document.getElementById('brand').textContent = brand;
  } catch (error) {
    console.error('Error fetching CPU Info:', error);
    document.getElementById('brand').textContent = 'error';
  }

  // Get and set total cpu logical cores using api
  try {
    const cpuCores = await window.api.getCPUInfo('cores');
    document.getElementById('cpu-cores').textContent = cpuCores;
  } catch (error) {
    console.error('Error fetching CPU Info:', error);
    document.getElementById('cpu-cores').textContent = 'error';
  }

  // Get and set total cpu usage every 1 second(s)
  async function updateToatlCPUUsage() {
    try {
      const cpuUsage = await window.api.getCPUInfo('total_usage');
      document.getElementById('cpu-usage').textContent = `${cpuUsage}%`;
    } catch (error) {
      console.error('Error fetching CPU Info:', error);
      document.getElementById('cpu-usage').textContent = 'error';
    }

  }

  setInterval(updateToatlCPUUsage, 1000);
});