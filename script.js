const CONFIG = {
  // Replace this with the email address that should receive enquiries.
  contactEmail: "",

  // Add real booked stays here. Both dates are shown as unavailable.
  // Format: ["YYYY-MM-DD", "YYYY-MM-DD"]
  bookedRanges: [
    ["2026-08-14", "2026-08-18"],
    ["2026-09-05", "2026-09-11"],
    ["2026-10-23", "2026-10-27"]
  ]
};

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

document.getElementById('year').textContent = new Date().getFullYear();
window.addEventListener('scroll', () => document.querySelector('.site-header').classList.toggle('scrolled', window.scrollY > 20));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
document.querySelectorAll('.photo').forEach(button => button.addEventListener('click', () => {
  lightboxImage.src = button.dataset.full;
  lightboxImage.alt = button.querySelector('img').alt;
  lightbox.showModal();
}));
document.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', event => {
  if (event.target === lightbox) lightbox.close();
});

function toISO(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
function parseISO(value) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day, 12);
}
function formatDate(date) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}

const bookedDates = new Set();
for (const [start, end] of CONFIG.bookedRanges) {
  const current = parseISO(start);
  const last = parseISO(end);
  while (current <= last) {
    bookedDates.add(toISO(current));
    current.setDate(current.getDate() + 1);
  }
}

let viewDate = new Date();
viewDate.setDate(1);
let arrival = null;
let departure = null;
const calendar = document.getElementById('calendar');
const monthTitle = document.getElementById('monthTitle');

function rangeHasBooking(start, end) {
  const current = new Date(start);
  current.setHours(12, 0, 0, 0);
  while (current <= end) {
    if (bookedDates.has(toISO(current))) return true;
    current.setDate(current.getDate() + 1);
  }
  return false;
}

function renderCalendar() {
  calendar.innerHTML = '';
  monthTitle.textContent = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(viewDate);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let index = 0; index < offset; index += 1) {
    const empty = document.createElement('span');
    empty.className = 'calendar-day empty';
    calendar.appendChild(empty);
  }

  for (let day = 1; day <= days; day += 1) {
    const date = new Date(year, month, day, 12);
    const iso = toISO(date);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'calendar-day';
    button.textContent = String(day);
    button.setAttribute('aria-label', formatDate(date));

    if (date < today) {
      button.classList.add('past');
      button.disabled = true;
    }
    if (bookedDates.has(iso)) {
      button.classList.add('booked');
      button.disabled = true;
      button.title = 'Unavailable';
    }
    if (arrival && toISO(arrival) === iso) button.classList.add('selected');
    if (departure && toISO(departure) === iso) button.classList.add('selected');
    if (arrival && departure && date > arrival && date < departure) button.classList.add('in-range');
    button.addEventListener('click', () => selectDate(date));
    calendar.appendChild(button);
  }
}

function selectDate(date) {
  if (!arrival || departure || date < arrival) {
    arrival = date;
    departure = null;
  } else if (rangeHasBooking(arrival, date)) {
    arrival = date;
    departure = null;
  } else {
    departure = date;
  }
  updateDateDisplay();
  renderCalendar();
}

function updateDateDisplay() {
  document.getElementById('arrivalText').textContent = arrival ? formatDate(arrival) : 'Not selected';
  document.getElementById('departureText').textContent = departure ? formatDate(departure) : 'Not selected';
  document.getElementById('arrivalInput').value = arrival ? toISO(arrival) : '';
  document.getElementById('departureInput').value = departure ? toISO(departure) : '';
}

document.getElementById('prevMonth').addEventListener('click', () => {
  viewDate.setMonth(viewDate.getMonth() - 1);
  renderCalendar();
});
document.getElementById('nextMonth').addEventListener('click', () => {
  viewDate.setMonth(viewDate.getMonth() + 1);
  renderCalendar();
});
renderCalendar();

const form = document.getElementById('contactForm');
form.addEventListener('submit', event => {
  event.preventDefault();
  const status = document.getElementById('formStatus');
  if (!form.reportValidity()) return;

  if (!CONFIG.contactEmail) {
    status.textContent = 'The form is ready, but the contact email still needs to be added in script.js.';
    return;
  }

  const data = new FormData(form);
  const name = `${data.get('firstName')} ${data.get('lastName')}`.trim();
  const subject = encodeURIComponent(`Eldersburn Lodge enquiry from ${name}`);
  const body = encodeURIComponent(
`Name: ${name}
Email: ${data.get('email')}
Telephone: ${data.get('phone') || 'Not provided'}
Arrival: ${data.get('arrival') || 'Not selected'}
Departure: ${data.get('departure') || 'Not selected'}
Guests: ${data.get('guests')}

Message:
${data.get('message') || 'No additional message'}`
  );
  window.location.href = `mailto:${CONFIG.contactEmail}?subject=${subject}&body=${body}`;
  status.textContent = 'Your email application should now open with the enquiry completed.';
});
