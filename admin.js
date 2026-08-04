const $ = (id) => document.getElementById(id);
const fields = { owner: $('owner'), repo: $('repo'), branch: $('branch'), path: $('path'), token: $('token') };
const statusEl = $('status');
const monthsEl = $('months');
const saveBtn = $('save');
const countEl = $('count');
let selected = new Set();
let fileSha = '';
let fileText = '';
let firstMonth = new Date(); firstMonth.setDate(1);

function setStatus(message, type='') { statusEl.textContent = message; statusEl.className = `status ${type}`; }
function iso(y,m,d){return `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`}
function updateCount(){countEl.textContent=`${selected.size} booked night${selected.size===1?'':'s'} selected`}
function monthCard(date){
  const y=date.getFullYear(),m=date.getMonth();
  const card=document.createElement('section');card.className='month';
  card.innerHTML=`<h3>${date.toLocaleDateString('en-GB',{month:'long',year:'numeric'})}</h3><div class="weekdays"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div><div class="days"></div>`;
  const grid=card.querySelector('.days');
  const offset=(new Date(y,m,1).getDay()+6)%7;
  for(let i=0;i<offset;i++){const b=document.createElement('span');b.className='day blank';grid.appendChild(b)}
  const total=new Date(y,m+1,0).getDate(); const now=new Date();
  for(let d=1;d<=total;d++){
    const key=iso(y,m,d); const button=document.createElement('button');button.type='button';button.className='day';button.textContent=d;button.dataset.date=key;
    if(selected.has(key))button.classList.add('booked');
    if(y===now.getFullYear()&&m===now.getMonth()&&d===now.getDate())button.classList.add('today');
    button.addEventListener('click',()=>{selected.has(key)?selected.delete(key):selected.add(key);button.classList.toggle('booked');updateCount();saveBtn.disabled=!fileSha});
    grid.appendChild(button);
  }
  return card;
}
function render(){monthsEl.innerHTML='';const n=matchMedia('(max-width:760px)').matches?1:2;for(let i=0;i<n;i++)monthsEl.appendChild(monthCard(new Date(firstMonth.getFullYear(),firstMonth.getMonth()+i,1)));updateCount()}
$('prev').onclick=()=>{firstMonth.setMonth(firstMonth.getMonth()-1);render()};
$('next').onclick=()=>{firstMonth.setMonth(firstMonth.getMonth()+1);render()};
$('today').onclick=()=>{firstMonth=new Date();firstMonth.setDate(1);render()};
window.addEventListener('resize',render);

function decodeBase64Unicode(base64){const bytes=Uint8Array.from(atob(base64.replace(/\n/g,'')),c=>c.charCodeAt(0));return new TextDecoder().decode(bytes)}
function encodeBase64Unicode(text){const bytes=new TextEncoder().encode(text);let binary='';bytes.forEach(b=>binary+=String.fromCharCode(b));return btoa(binary)}
function settings(){return Object.fromEntries(Object.entries(fields).map(([k,v])=>[k,v.value.trim()]))}
function apiUrl(){const s=settings();return `https://api.github.com/repos/${encodeURIComponent(s.owner)}/${encodeURIComponent(s.repo)}/contents/${s.path.split('/').map(encodeURIComponent).join('/')}?ref=${encodeURIComponent(s.branch)}`}
function headers(){return {'Accept':'application/vnd.github+json','Authorization':`Bearer ${fields.token.value.trim()}`,'X-GitHub-Api-Version':'2022-11-28'}}

$('load').onclick=async()=>{
  if(!fields.token.value.trim()){setStatus('Paste your GitHub token first','error');return}
  setStatus('Loading current bookings…');
  try{
    const response=await fetch(apiUrl(),{headers:headers()});
    if(!response.ok)throw new Error(`${response.status} ${await response.text()}`);
    const data=await response.json();fileSha=data.sha;fileText=decodeBase64Unicode(data.content);
    const match=fileText.match(/bookedDates\s*:\s*\[([\s\S]*?)\]/);
    if(!match)throw new Error('Could not find bookedDates in site-config.js');
    selected=new Set([...match[1].matchAll(/["'](\d{4}-\d{2}-\d{2})["']/g)].map(m=>m[1]));
    localStorage.setItem('eldersburnAdmin',JSON.stringify({owner:fields.owner.value,repo:fields.repo.value,branch:fields.branch.value,path:fields.path.value,token:fields.token.value}));
    saveBtn.disabled=false;render();setStatus('Bookings loaded. Click dates to change them','success');
  }catch(error){console.error(error);setStatus('Could not load the file. Check the token and repository details','error')}
};

$('save').onclick=async()=>{
  if(!fileSha)return;
  setStatus('Saving and publishing…');saveBtn.disabled=true;
  try{
    const dates=[...selected].sort();
    const replacement=`bookedDates: [\n${dates.map(d=>`    "${d}"`).join(',\n')}\n  ]`;
    const updated=fileText.replace(/bookedDates\s*:\s*\[[\s\S]*?\]/,replacement);
    if(updated===fileText)throw new Error('No bookedDates section was replaced');
    const s=settings();
    const response=await fetch(apiUrl().replace(/\?ref=.*/,''),{method:'PUT',headers:{...headers(),'Content-Type':'application/json'},body:JSON.stringify({message:`Update lodge availability ${new Date().toISOString().slice(0,10)}`,content:encodeBase64Unicode(updated),sha:fileSha,branch:s.branch})});
    if(!response.ok)throw new Error(`${response.status} ${await response.text()}`);
    const data=await response.json();fileSha=data.content.sha;fileText=updated;
    setStatus('Saved. GitHub Pages normally updates within 1–2 minutes','success');
  }catch(error){console.error(error);setStatus('The save failed. Reload current bookings and try again','error')}
  finally{saveBtn.disabled=false}
};

$('forget').onclick=()=>{localStorage.removeItem('eldersburnAdmin');fields.token.value='';setStatus('Saved token removed from this browser','success')};
const saved=JSON.parse(localStorage.getItem('eldersburnAdmin')||'null');if(saved){for(const [k,v] of Object.entries(saved))if(fields[k])fields[k].value=v}
render();
