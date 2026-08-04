
const header = document.querySelector('.site-header');
const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 40);
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();
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

const bookedDates = new Set(Array.isArray(config.bookedDates) ? config.bookedDates : []);
let firstVisibleMonth = new Date();
firstVisibleMonth.setDate(1);
const monthsHost = document.querySelector('#calendar-months');

function isoDate(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function buildMonth(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const title = date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysThisMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const section = document.createElement('section');
  section.className = 'month-card';
  section.innerHTML = `
    <h3>${title}</h3>
    <div class="month-weekdays" aria-hidden="true">
      <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
    </div>
    <div class="month-grid" role="grid" aria-label="${title} availability"></div>`;
  const grid = section.querySelector('.month-grid');
  for (let i = 0; i < firstWeekday; i++) {
    const blank = document.createElement('span');
    blank.className = 'day blank';
    blank.setAttribute('aria-hidden', 'true');
    grid.appendChild(blank);
  }
  for (let day = 1; day <= daysThisMonth; day++) {
    const key = isoDate(year, month, day);
    const current = new Date(year, month, day);
    const isBooked = bookedDates.has(key);
    const isMonday = current.getDay() === 1;
    const isToday = year === today.getFullYear() && month === today.getMonth() && day === today.getDate();
    const cell = document.createElement('span');
    cell.className = 'day';
    cell.textContent = day;
    cell.setAttribute('role', 'gridcell');
    cell.setAttribute('aria-label', `${current.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}, ${isBooked ? 'booked' : 'available'}${isMonday ? ', Monday changeover' : ''}`);
    if (isBooked) cell.classList.add('booked');
    if (isMonday) cell.classList.add('changeover');
    if (isToday) cell.classList.add('today');
    grid.appendChild(cell);
  }
  return section;
}

function renderCalendar() {
  if (!monthsHost) return;
  monthsHost.innerHTML = '';
  const numberOfMonths = window.matchMedia('(max-width: 760px)').matches ? 1 : 2;
  for (let i = 0; i < numberOfMonths; i++) {
    const date = new Date(firstVisibleMonth.getFullYear(), firstVisibleMonth.getMonth() + i, 1);
    monthsHost.appendChild(buildMonth(date));
  }
}

document.querySelector('#prev-month')?.addEventListener('click', () => {
  firstVisibleMonth.setMonth(firstVisibleMonth.getMonth() - 1);
  renderCalendar();
});
document.querySelector('#next-month')?.addEventListener('click', () => {
  firstVisibleMonth.setMonth(firstVisibleMonth.getMonth() + 1);
  renderCalendar();
});
document.querySelector('#today-month')?.addEventListener('click', () => {
  firstVisibleMonth = new Date();
  firstVisibleMonth.setDate(1);
  renderCalendar();
});
window.addEventListener('resize', renderCalendar);
renderCalendar();


