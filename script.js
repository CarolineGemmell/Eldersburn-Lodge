const menuButton=document.querySelector('.menu-toggle');
const nav=document.querySelector('.nav');
menuButton.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuButton.setAttribute('aria-expanded',open)});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
document.getElementById('year').textContent=new Date().getFullYear();

// Add real booked date ranges here after confirming bookings.
// Format: ['YYYY-MM-DD','YYYY-MM-DD'] (inclusive).
const bookedRanges=[
  ['2026-08-14','2026-08-18'],
  ['2026-09-05','2026-09-11'],
  ['2026-10-23','2026-10-27']
];
const bookedDates=new Set();
for(const [start,end] of bookedRanges){let d=new Date(start+'T12:00:00');const last=new Date(end+'T12:00:00');while(d<=last){bookedDates.add(toISO(d));d.setDate(d.getDate()+1)}}
let viewDate=new Date(); viewDate.setDate(1);
let arrival=null,departure=null;
const calendar=document.getElementById('calendar');
const monthTitle=document.getElementById('monthTitle');
function toISO(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function formatDate(d){return d?new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric'}).format(d):'—'}
function renderCalendar(){
  calendar.innerHTML=''; monthTitle.textContent=new Intl.DateTimeFormat('en-GB',{month:'long',year:'numeric'}).format(viewDate);
  const year=viewDate.getFullYear(),month=viewDate.getMonth();
  const first=new Date(year,month,1); const offset=(first.getDay()+6)%7; const days=new Date(year,month+1,0).getDate();
  for(let i=0;i<offset;i++){const e=document.createElement('span');e.className='calendar-day empty';calendar.appendChild(e)}
  for(let day=1;day<=days;day++){
    const date=new Date(year,month,day,12); const iso=toISO(date); const b=document.createElement('button');
    b.className='calendar-day'; b.textContent=day; b.type='button'; b.dataset.date=iso;
    if(bookedDates.has(iso)){b.classList.add('booked');b.disabled=true;b.title='Unavailable'}
    if(arrival&&toISO(arrival)===iso)b.classList.add('selected');
    if(departure&&toISO(departure)===iso)b.classList.add('selected');
    if(arrival&&departure&&date>arrival&&date<departure)b.classList.add('in-range');
    b.addEventListener('click',()=>selectDate(date)); calendar.appendChild(b)
  }
}
function rangeHasBooking(start,end){let d=new Date(start);d.setHours(12);while(d<=end){if(bookedDates.has(toISO(d)))return true;d.setDate(d.getDate()+1)}return false}
function selectDate(date){
  if(!arrival||departure||date<arrival){arrival=date;departure=null}
  else if(rangeHasBooking(arrival,date)){arrival=date;departure=null}
  else departure=date;
  updateSelection();renderCalendar();
}
function updateSelection(){
  document.getElementById('arrivalText').textContent=formatDate(arrival);document.getElementById('departureText').textContent=formatDate(departure);
  document.getElementById('arrivalInput').value=arrival?toISO(arrival):'';document.getElementById('departureInput').value=departure?toISO(departure):'';
}
document.getElementById('prevMonth').onclick=()=>{viewDate.setMonth(viewDate.getMonth()-1);renderCalendar()};
document.getElementById('nextMonth').onclick=()=>{viewDate.setMonth(viewDate.getMonth()+1);renderCalendar()};
renderCalendar();

document.getElementById('contactForm').addEventListener('submit',e=>{
  e.preventDefault();
  const form=new FormData(e.currentTarget); const status=document.getElementById('formStatus');
  status.textContent='Your form is ready. Add your email/Formspree address in script.js to receive enquiries.';
  // To make this form live, replace the line above with a Formspree submission or your booking platform integration.
  console.log(Object.fromEntries(form.entries()));
});
