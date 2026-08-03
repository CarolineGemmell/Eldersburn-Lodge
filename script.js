const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');
menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.14 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

document.querySelector('#year').textContent = new Date().getFullYear();

const lightbox = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('#lightbox-image');
document.querySelectorAll('.gallery-item').forEach(button => {
  button.addEventListener('click', () => {
    lightboxImage.src = button.dataset.image;
    lightbox.showModal();
  });
});
document.querySelector('#close-lightbox').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });

// Add confirmed bookings here later in YYYY-MM-DD format.
const bookedDates = new Set([
  "2026-08-07",
  "2026-08-08",
  "2026-08-09",
  "2026-08-10",
  "2026-08-14",
  "2026-08-15",
  "2026-08-16",
  "2026-08-17",
]);

let visibleMonth = new Date();
visibleMonth.setDate(1);
const title = document.querySelector('#calendar-title');
const grid = document.querySelector('#calendar-grid');

function isoDate(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
function renderCalendar() {
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
    let displayDay, cellYear = year, cellMonth = month;
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
    cell.textContent = displayDay;
    cell.setAttribute('role', 'gridcell');
    cell.setAttribute('aria-label', `${key}${bookedDates.has(key) ? ', booked' : ', available'}`);
    if (bookedDates.has(key)) cell.classList.add('booked');
    if (cellYear === today.getFullYear() && cellMonth === today.getMonth() && displayDay === today.getDate()) cell.classList.add('today');
    grid.appendChild(cell);
  }
}
document.querySelector('#prev-month').addEventListener('click', () => { visibleMonth.setMonth(visibleMonth.getMonth() - 1); renderCalendar(); });
document.querySelector('#next-month').addEventListener('click', () => { visibleMonth.setMonth(visibleMonth.getMonth() + 1); renderCalendar(); });
renderCalendar();

document.querySelector('#enquiry-form').addEventListener('submit', event => {
  event.preventDefault();
  document.querySelector('#form-status').textContent = 'The form is designed and ready. We will connect email delivery in the next step.';
});
