const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');
menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

document.querySelector('#year').textContent = new Date().getFullYear();

const galleryButtons = [...document.querySelectorAll('.gallery-item')];
const lightbox = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('#lightbox-image');
let activePhoto = 0;

function showPhoto(index) {
  activePhoto = (index + galleryButtons.length) % galleryButtons.length;
  const button = galleryButtons[activePhoto];
  lightboxImage.src = button.dataset.image;
  lightboxImage.alt = button.querySelector('img')?.alt || 'Expanded lodge photograph';
}

galleryButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    showPhoto(index);
    lightbox.showModal();
  });
});
document.querySelector('#close-lightbox')?.addEventListener('click', () => lightbox.close());
document.querySelector('#prev-photo')?.addEventListener('click', () => showPhoto(activePhoto - 1));
document.querySelector('#next-photo')?.addEventListener('click', () => showPhoto(activePhoto + 1));
lightbox?.addEventListener('click', event => {
  if (event.target === lightbox) lightbox.close();
});
document.addEventListener('keydown', event => {
  if (!lightbox?.open) return;
  if (event.key === 'ArrowLeft') showPhoto(activePhoto - 1);
  if (event.key === 'ArrowRight') showPhoto(activePhoto + 1);
});

const config = window.ELDERSBURN_CONFIG || {};

function renderPrices() {
  const priceGrid = document.querySelector('#price-grid');
  const priceNotes = document.querySelector('#price-notes');
  const prices = Array.isArray(config.prices) ? config.prices : [];
  priceGrid.innerHTML = prices.map((item, index) => `
    <article class="price-card ${index === 1 ? 'featured' : ''}">
      ${index === 1 ? '<span class="price-badge">Popular</span>' : ''}
      <p class="price-season">${item.season}</p>
      <p class="price-dates">${item.dates}</p>
      <dl>${(item.stays || []).map(stay => `<div><dt>${stay.label}</dt><dd>${stay.price}</dd></div>`).join('')}</dl>
      <a class="price-link" href="#contact">Enquire About a Stay →</a>
    </article>
  `).join('');
  const notes = Array.isArray(config.priceNotes) ? config.priceNotes : [];
  priceNotes.innerHTML = notes.length
    ? `<strong>Please Note</strong><ul>${notes.map(note => `<li>${note}</li>`).join('')}</ul>`
    : '';
}
renderPrices();

const outlookUrl = (config.outlookCalendarEmbedUrl || '').trim();
const outlookWrap = document.querySelector('#outlook-calendar-wrap');
const manualWrap = document.querySelector('#manual-calendar-wrap');
if (outlookUrl) {
  const outlookFrame = document.querySelector('#outlook-calendar');
  const outlookLink = document.querySelector('#open-outlook-calendar');
  outlookFrame.src = outlookUrl;
  outlookLink.href = outlookUrl;
  outlookWrap.hidden = false;
  manualWrap.hidden = true;
}

const bookedDates = new Set(Array.isArray(config.bookedDates) ? config.bookedDates : []);
let visibleMonth = new Date();
visibleMonth.setDate(1);
const title = document.querySelector('#calendar-title');
const grid = document.querySelector('#calendar-grid');

function isoDate(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
function renderCalendar() {
  if (!grid || outlookUrl) return;
  grid.innerHTML = '';
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  title.textContent = visibleMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysThisMonth = new Date(year, month + 1, 0).getDate();
  const daysPrevMonth = new Date(year, month, 0).getDate();
  const today = new Date();
  for (let i = 0; i < 42; i++) {
    const cell = document.createElement('div');
    cell.className = 'calendar-day';
    let displayDay;
    let cellYear = year;
    let cellMonth = month;
    if (i < firstWeekday) {
      displayDay = daysPrevMonth - firstWeekday + i + 1;
      cellMonth--;
      if (cellMonth < 0) { cellMonth = 11; cellYear--; }
      cell.classList.add('muted');
    } else if (i >= firstWeekday + daysThisMonth) {
      displayDay = i - firstWeekday - daysThisMonth + 1;
      cellMonth++;
      if (cellMonth > 11) { cellMonth = 0; cellYear++; }
      cell.classList.add('muted');
    } else {
      displayDay = i - firstWeekday + 1;
    }
    const key = isoDate(cellYear, cellMonth, displayDay);
    const date = new Date(cellYear, cellMonth, displayDay);
    cell.textContent = displayDay;
    cell.setAttribute('role', 'gridcell');
    cell.setAttribute('aria-label', `${key}${bookedDates.has(key) ? ', booked' : ', available'}`);
    if (bookedDates.has(key)) cell.classList.add('booked');
    if (date.getDay() === 1) cell.classList.add('changeover');
    if (cellYear === today.getFullYear() && cellMonth === today.getMonth() && displayDay === today.getDate()) cell.classList.add('today');
    grid.appendChild(cell);
  }
}
document.querySelector('#prev-month')?.addEventListener('click', () => {
  visibleMonth.setMonth(visibleMonth.getMonth() - 1);
  renderCalendar();
});
document.querySelector('#next-month')?.addEventListener('click', () => {
  visibleMonth.setMonth(visibleMonth.getMonth() + 1);
  renderCalendar();
});
renderCalendar();

const enquiryForm = document.querySelector('#enquiry-form');
enquiryForm?.addEventListener('submit', event => {
  event.preventDefault();
  document.querySelector('#form-status').textContent = 'The form is ready. Email delivery will be connected to your Hotmail address in the next step';
});
