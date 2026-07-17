/* ==========================================================================
   LuciHome — Developers Workspace Demo
   Same interaction layer as the Agent Workspace demo: quick-create menu,
   a slide-over detail drawer (here used for unit inventory), and the
   dependency-free SVG chart engine (line, bar, donut) reused across the
   Dashboard, Sales Tracker and Analytics sections.
   ========================================================================== */

let nextId = 1000;
const CHART_COLORS = ['#1A73E8','#12B5CB','#F29900','#D93025','#9334E6','#188038'];

const state = {

  feed: [
    {id:1, icon:'ti-lock', text:'Agent <strong>Sophie Laurent</strong> reserved unit <strong>3D</strong> at Skyline Residences.', time:'24 min ago', read:false},
    {id:2, icon:'ti-signature', text:'Sale contract signed for unit <strong>1B</strong>, Skyline Residences.', time:'1 h ago', read:false},
    {id:3, icon:'ti-calendar-check', text:'Construction milestone reached: <strong>Structure complete</strong> — Herastrau Gardens Phase II.', time:'3 h ago', read:false},
    {id:4, icon:'ti-user-plus', text:'New agent inquiry from <strong>Khalid Al-Farsi</strong> about Riviera Bay Villas.', time:'yesterday, 6:10 PM', read:false},
    {id:5, icon:'ti-file-upload', text:'Updated price list uploaded for <strong>Skyline Residences</strong>.', time:'yesterday, 2:30 PM', read:true},
    {id:6, icon:'ti-building', text:'<strong>Downtown Business Hub</strong> was moved to "Pre-launch" status.', time:'2 days ago', read:true},
  ],

  agenda: [
    {time:'09:00', text:'Foundation inspection — Downtown Business Hub', sub:'On-site · with structural engineer', done:false},
    {time:'11:30', text:'Call with Sophie Laurent — Skyline Residences pricing', sub:'Phone · 20 min', done:false},
    {time:'14:00', text:'Deadline — respond to BRD financing pre-approval request', sub:'Riviera Bay Villas', done:false},
    {time:'16:30', text:'Milestone — Finishing works, Herastrau Gardens Phase II', sub:'Due this Friday', done:true},
  ],

  weekTrend:{
    labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    unitsSold:[2,1,3,2,4,3,5],
    inquiries:[6,8,7,9,11,8,12],
  },

  projects: [
    {id:1, name:'Skyline Residences', location:'Cluj-Napoca, Grigorescu', type:'Residential', units:120, sold:77, status:'active', delivery:'Q4 2027', priceFrom:95000, priceTo:340000, grad:'#1A73E8', desc:'Premium residential complex with park views, underground parking and a landscaped courtyard — 120 units across 6 floors.'},
    {id:2, name:'Herastrau Gardens Phase II', location:'Bucharest, Herastrau', type:'Residential', units:86, sold:35, status:'active', delivery:'Q2 2027', priceFrom:140000, priceTo:410000, grad:'#12B5CB', desc:'Second phase of a luxury lakeside project — 86 units, 3.5% standard agent commission, direct lake access.'},
    {id:3, name:'Riviera Bay Villas', location:'Constanta, Mamaia', type:'Residential', units:42, sold:37, status:'active', delivery:'Q3 2026', priceFrom:220000, priceTo:890000, grad:'#9334E6', desc:'Seaside vacation villas with private pools — ideal for international investor clients, strong rental yield.'},
    {id:4, name:'Downtown Business Hub', location:'Bucharest, Pipera', type:'Mixed-use', units:64, sold:0, status:'prelaunch', delivery:'2028', priceFrom:180000, priceTo:520000, grad:'#F29900', desc:'Mixed-use tower combining residential units with ground-floor retail — waitlist only until permits are finalized.'},
    {id:5, name:'Old Town Lofts', location:'Cluj-Napoca, Old Town', type:'Residential', units:38, sold:38, status:'completed', delivery:'Delivered 2025', priceFrom:98000, priceTo:210000, grad:'#188038', desc:'Fully delivered loft conversion in the historic center — sold out ahead of schedule.'},
  ],
  projectView:'grid',

  units: {
    1: [
      {code:'1A', type:'Studio', status:'available', floor:1, size:38, price:98000},
      {code:'1B', type:'1BR', status:'sold', floor:1, size:54, price:142000},
      {code:'1C', type:'1BR', status:'sold', floor:1, size:54, price:142000},
      {code:'1D', type:'2BR', status:'available', floor:1, size:74, price:189000},
      {code:'2A', type:'Studio', status:'reserved', floor:2, size:38, price:101000},
      {code:'2B', type:'1BR', status:'sold', floor:2, size:54, price:145000},
      {code:'2C', type:'2BR', status:'available', floor:2, size:74, price:192000},
      {code:'2D', type:'2BR', status:'sold', floor:2, size:76, price:196000},
      {code:'3A', type:'1BR', status:'available', floor:3, size:55, price:148000},
      {code:'3B', type:'2BR', status:'reserved', floor:3, size:76, price:199000},
      {code:'3C', type:'2BR', status:'sold', floor:3, size:76, price:199000},
      {code:'3D', type:'3BR', status:'available', floor:3, size:98, price:249000},
      {code:'PH1', type:'Penthouse', status:'available', floor:6, size:158, price:339000},
      {code:'PH2', type:'Penthouse', status:'reserved', floor:6, size:162, price:340000},
    ],
    2: [
      {code:'A01', type:'2BR', status:'sold', floor:1, size:78, price:210000},
      {code:'A02', type:'2BR', status:'available', floor:1, size:78, price:212000},
      {code:'A03', type:'3BR', status:'reserved', floor:1, size:104, price:298000},
      {code:'B01', type:'1BR', status:'sold', floor:2, size:58, price:158000},
      {code:'B02', type:'2BR', status:'available', floor:2, size:80, price:216000},
      {code:'B03', type:'3BR', status:'available', floor:2, size:106, price:302000},
      {code:'C01', type:'Penthouse', status:'sold', floor:5, size:172, price:409000},
      {code:'C02', type:'Penthouse', status:'available', floor:5, size:168, price:398000},
    ],
    3: [
      {code:'V1', type:'Villa', status:'sold', floor:0, size:210, price:890000},
      {code:'V2', type:'Villa', status:'sold', floor:0, size:195, price:840000},
      {code:'V3', type:'Villa', status:'sold', floor:0, size:195, price:845000},
      {code:'V4', type:'Villa', status:'available', floor:0, size:180, price:790000},
      {code:'V5', type:'Villa', status:'reserved', floor:0, size:180, price:795000},
    ],
    4: [
      {code:'R101', type:'Retail', status:'available', floor:1, size:120, price:340000},
      {code:'R102', type:'Retail', status:'available', floor:1, size:95, price:280000},
      {code:'201', type:'1BR', status:'available', floor:2, size:56, price:182000},
      {code:'202', type:'2BR', status:'available', floor:2, size:78, price:238000},
    ],
  },
  currentProjectId:1,
  selectedUnitKey:null,

  unitHistory:[
    {icon:'ti-lock', text:'Sophie Laurent reserved unit 3D at Skyline Residences.', time:'24 min ago'},
    {icon:'ti-signature', text:'Contract signed — unit 1B, Skyline Residences.', time:'1 h ago'},
    {icon:'ti-x', text:'Reservation cancelled — unit 2B, Herastrau Gardens Phase II (hold expired).', time:'yesterday'},
    {icon:'ti-lock', text:'Khalid Al-Farsi reserved unit A03, Herastrau Gardens Phase II.', time:'2 days ago'},
  ],

  agentSales:[
    {name:'Sophie Laurent', market:'Paris, France', units:14, revenue:3120000},
    {name:'Khalid Al-Farsi', market:'Dubai, UAE', units:11, revenue:2860000},
    {name:'Marco Bianchi', market:'Milan, Italy', units:9, revenue:1980000},
    {name:'Laura Fernandez', market:'Barcelona, Spain', units:7, revenue:1540000},
    {name:'Anca Georgescu', market:'Bucharest, Romania', units:6, revenue:1120000},
  ],

  pipeline:[
    {unit:'2A', project:'Skyline Residences', agent:'Sophie Laurent', reserved:'12 hours ago', status:'expiring'},
    {unit:'A03', project:'Herastrau Gardens Phase II', agent:'Khalid Al-Farsi', reserved:'2 days ago', status:'active'},
    {unit:'V5', project:'Riviera Bay Villas', agent:'Anca Georgescu', reserved:'1 day ago', status:'active'},
    {unit:'3B', project:'Skyline Residences', agent:'Marco Bianchi', reserved:'30 hours ago', status:'expiring'},
  ],

  roster:[
    {id:1, name:'Sophie Laurent', market:'Paris, France', status:'active', unitsSold:14, commissionPending:2400},
    {id:2, name:'Khalid Al-Farsi', market:'Dubai, UAE', status:'active', unitsSold:11, commissionPending:1800},
    {id:3, name:'Marco Bianchi', market:'Milan, Italy', status:'active', unitsSold:9, commissionPending:1500},
    {id:4, name:'Laura Fernandez', market:'Barcelona, Spain', status:'active', unitsSold:7, commissionPending:1100},
    {id:5, name:'Anca Georgescu', market:'Bucharest, Romania', status:'active', unitsSold:6, commissionPending:900},
    {id:6, name:'Teodor Marinescu', market:'Cluj-Napoca, Romania', status:'inactive', unitsSold:1, commissionPending:0},
  ],

  candidates:[
    {id:1, name:'Anna Popescu', market:'Bucharest, Romania', lang:'RO / EN', rating:4.7, invited:false},
    {id:2, name:'Fatima Al-Sayed', market:'Dubai, UAE', lang:'AR / EN', rating:4.6, invited:false},
    {id:3, name:'Julien Moreau', market:'Paris, France', lang:'FR / EN', rating:4.8, invited:true},
    {id:4, name:'Elena Rossi', market:'Milan, Italy', lang:'IT / EN', rating:4.5, invited:false},
  ],

  directory:[
    {id:1, name:'Popescu & Vasilescu Architects', type:'Architect', market:'Bucharest, Romania', lang:'RO / EN', rating:4.9, connected:true},
    {id:2, name:'Ionescu & Partners Notary', type:'Notary', market:'Bucharest, Romania', lang:'RO / EN', rating:4.9, connected:true},
    {id:3, name:'Popescu Law Office', type:'Lawyer', market:'Bucharest, Romania', lang:'RO / FR', rating:4.7, connected:false},
    {id:4, name:'BRD Partner Loans', type:'Bank', market:'Romania (national)', lang:'RO / EN', rating:4.5, connected:true},
    {id:5, name:'Studio Lumen Design', type:'Architect', market:'Cluj-Napoca, Romania', lang:'RO / EN', rating:4.6, connected:false},
    {id:6, name:'Dubois Notary', type:'Notary', market:'Paris, France', lang:'FR / EN', rating:4.8, connected:false},
    {id:7, name:'Paris Prestige Immobilier', type:'Agency', market:'Paris, France', lang:'FR / EN', rating:4.8, connected:true},
    {id:8, name:'Dubai Estates Partners', type:'Agency', market:'Dubai, UAE', lang:'AR / EN', rating:4.7, connected:true},
    {id:9, name:'Milano Casa Group', type:'Agency', market:'Milan, Italy', lang:'IT / EN', rating:4.6, connected:false},
  ],

  legalDocs:[
    {name:'Land title deed — Skyline Residences.pdf', project:'Skyline Residences', access:'Notary, Lawyer', verified:true},
    {name:'Building permit — Herastrau Gardens II.pdf', project:'Herastrau Gardens Phase II', access:'Developer only', verified:true},
    {name:'Reservation contract template.docx', project:'All projects', access:'Agents', verified:false},
    {name:'Sale-purchase agreement template.docx', project:'All projects', access:'Notary, Lawyer', verified:true},
  ],
  technicalDocs:[
    {name:'Architectural floor plans — Rev. 4.pdf', project:'Skyline Residences', access:'Developer, Architect', verified:true},
    {name:'MEP layout — Riviera Bay Villas.dwg', project:'Riviera Bay Villas', access:'Developer only', verified:false},
    {name:'Site plan — Downtown Business Hub.pdf', project:'Downtown Business Hub', access:'Developer, Architect', verified:false},
  ],
  salesDocs:[
    {name:'Brochure — Skyline Residences (EN/FR).pdf', project:'Skyline Residences', access:'Agents, Buyers', verified:true},
    {name:'Price list — Herastrau Gardens Phase II.xlsx', project:'Herastrau Gardens Phase II', access:'Agents', verified:true},
    {name:'Fact sheet — Riviera Bay Villas.pdf', project:'Riviera Bay Villas', access:'Agents, Buyers', verified:true},
  ],

  team:[
    {name:'Radu Vasilescu', role:'Sales Director', access:'Full access'},
    {name:'Ioana Petrescu', role:'Project Manager', access:'Projects & documents'},
    {name:'Mihai Dinu', role:'Marketing Manager', access:'Brand, analytics'},
  ],

  buyerOrigin:[
    {label:'Romania', value:38}, {label:'France', value:20}, {label:'UAE', value:16}, {label:'Italy', value:14}, {label:'Other', value:12},
  ],

  integrations:{},
  wizardStep:1,
  uploadedFiles:[],
};

/* ---------------------------------------------------------------------- */
/* NAVIGATION                                                              */
/* ---------------------------------------------------------------------- */
function showSection(id){
  document.querySelectorAll('.module-section').forEach(s=>s.classList.remove('visible'));
  document.querySelectorAll('.nav-item').forEach(t=>t.classList.remove('active'));
  const sec = document.getElementById('section-'+id);
  if(sec) sec.classList.add('visible');
  const nav = document.querySelector('.nav-item[data-section="'+id+'"]');
  if(nav) nav.classList.add('active');
  document.getElementById('sidebar').classList.remove('open');
  closeUnitDrawer();
  window.scrollTo({top:0, behavior:'smooth'});
}

function switchTab(group, tabId){
  document.querySelectorAll('.tab-btn').forEach(b=>{
    if(b.dataset.tab && b.dataset.tab.indexOf(group+'-')===0){
      b.classList.toggle('active', b.dataset.tab===tabId);
    }
  });
  document.querySelectorAll('.tab-panel').forEach(p=>{
    if(p.id.indexOf(group+'-')===0){
      p.classList.toggle('visible', p.id===tabId);
    }
  });
}

document.getElementById('hamburgerBtn').addEventListener('click', ()=>{
  document.getElementById('sidebar').classList.toggle('open');
});

/* ---------------------------------------------------------------------- */
/* QUICK CREATE MENU (Drive-style "+ New")                                 */
/* ---------------------------------------------------------------------- */
function toggleQuickCreate(e){
  e.stopPropagation();
  document.getElementById('quickCreateMenu').classList.toggle('open');
}
function closeQuickCreate(){
  document.getElementById('quickCreateMenu').classList.remove('open');
}
document.addEventListener('click', closeQuickCreate);

/* ---------------------------------------------------------------------- */
/* DROPDOWNS                                                               */
/* ---------------------------------------------------------------------- */
function closeAllDropdowns(){
  document.querySelectorAll('.dropdown-panel').forEach(p=>p.classList.remove('open'));
}
document.getElementById('notifBtn').addEventListener('click', e=>{
  e.stopPropagation();
  const willOpen = !document.getElementById('notifPanel').classList.contains('open');
  closeAllDropdowns();
  if(willOpen) document.getElementById('notifPanel').classList.add('open');
});
document.getElementById('msgBtn').addEventListener('click', e=>{
  e.stopPropagation();
  const panel = document.getElementById('msgDropdown').querySelector('.dropdown-panel');
  const willOpen = !panel.classList.contains('open');
  closeAllDropdowns();
  if(willOpen) panel.classList.add('open');
});
document.getElementById('avatarBtn').addEventListener('click', e=>{
  e.stopPropagation();
  const willOpen = !document.getElementById('avatarPanel').classList.contains('open');
  closeAllDropdowns();
  if(willOpen) document.getElementById('avatarPanel').classList.add('open');
});
document.addEventListener('click', closeAllDropdowns);

function logoutDemo(){
  closeAllDropdowns();
  toast('info', 'Demo', 'This is a demonstration — real logout will be active at the August 30, 2026 launch.');
}

/* ---------------------------------------------------------------------- */
/* TOASTS                                                                  */
/* ---------------------------------------------------------------------- */
function toast(type, title, msg){
  const stack = document.getElementById('toastStack');
  const el = document.createElement('div');
  const iconMap = {success:'ti-circle-check', info:'ti-info-circle', warning:'ti-alert-triangle', danger:'ti-alert-circle'};
  el.className = 'toast ' + (type==='success'?'success':type==='warning'?'warning':type==='danger'?'danger':'');
  el.innerHTML = `<i class="ti ${iconMap[type]||'ti-info-circle'}"></i><div><strong style="display:block;margin-bottom:2px">${title}</strong>${msg}</div>`;
  stack.appendChild(el);
  setTimeout(()=>{ el.classList.add('hide'); setTimeout(()=>el.remove(), 200); }, 4200);
}

/* ---------------------------------------------------------------------- */
/* MODALS                                                                  */
/* ---------------------------------------------------------------------- */
function openModal(id){
  document.getElementById(id).classList.add('open');
  if(id==='modal-add-project') resetWizard();
  if(id==='modal-add-unit') populateUnitProjectSelect();
  if(id==='modal-invite-agent'){ populateInviteProjectSelect(); renderInviteCandidates(); }
}
function closeModal(id){ document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('.modal-overlay').forEach(ov=>{
  ov.addEventListener('click', e=>{ if(e.target===ov) ov.classList.remove('open'); });
});

/* ---------------------------------------------------------------------- */
/* CHART ENGINE — dependency-free inline SVG                               */
/* ---------------------------------------------------------------------- */
function renderLineChart(containerId, series, labels){
  const w=600, h=220, padL=34, padR=16, padT=16, padB=26;
  const maxLen = Math.max(...series.map(s=>s.values.length));
  const stepX = maxLen>1 ? (w-padL-padR)/(maxLen-1) : 0;
  let svg = `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">`;
  for(let i=0;i<=3;i++){
    const y = padT + i*(h-padT-padB)/3;
    svg += `<line x1="${padL}" y1="${y}" x2="${w-padR}" y2="${y}" stroke="#DADCE0" stroke-width="1"/>`;
  }
  series.forEach(s=>{
    const max = Math.max(...s.values, 1);
    const pts = s.values.map((v,i)=>[padL+i*stepX, h-padB-(v/max)*(h-padT-padB)]);
    const linePath = pts.map((p,i)=>(i===0?'M':'L')+p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ');
    const areaPath = linePath+` L${pts[pts.length-1][0].toFixed(1)},${h-padB} L${pts[0][0].toFixed(1)},${h-padB} Z`;
    svg += `<path d="${areaPath}" fill="${s.color}" opacity="0.10"></path>`;
    svg += `<path d="${linePath}" fill="none" stroke="${s.color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>`;
    pts.forEach(p=>{ svg += `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3.5" fill="${s.color}" stroke="#fff" stroke-width="1.5"></circle>`; });
  });
  if(labels){
    labels.forEach((lab,i)=>{
      const x = padL+i*stepX;
      svg += `<text x="${x}" y="${h-6}" text-anchor="middle" font-size="11" font-family="Roboto" fill="#80868B">${lab}</text>`;
    });
  }
  svg += `</svg>`;
  const legend = series.map(s=>`<div class="chart-legend-item"><span class="chart-legend-dot" style="background:${s.color}"></span>${s.name}</div>`).join('');
  document.getElementById(containerId).innerHTML = svg + `<div class="chart-legend">${legend}</div>`;
}

function renderBarChart(containerId, items, opts){
  opts = opts||{};
  const w=560, barH=26, gap=14, leftPad=opts.leftPad||150, rightPad=48;
  const max = opts.maxValue || Math.max(...items.map(i=>i.value), 1);
  const h = items.length*(barH+gap)+gap;
  let svg = `<svg viewBox="0 0 ${w} ${h}">`;
  items.forEach((item,i)=>{
    const y = gap + i*(barH+gap);
    const barMaxW = w-leftPad-rightPad;
    const barW = Math.max(3, (item.value/max)*barMaxW);
    const color = item.color || '#1A73E8';
    svg += `<text x="${leftPad-10}" y="${y+barH/2+4}" text-anchor="end" font-size="12" font-family="Roboto" fill="#5F6368">${item.label}</text>`;
    svg += `<rect x="${leftPad}" y="${y}" width="${barMaxW}" height="${barH}" rx="5" fill="#F1F3F4"></rect>`;
    svg += `<rect class="chart-bar" x="${leftPad}" y="${y}" width="${barW}" height="${barH}" rx="5" fill="${color}"></rect>`;
    svg += `<text x="${leftPad+barW+8}" y="${y+barH/2+4}" font-size="12" font-family="Roboto" font-weight="500" fill="#202124">${item.value}${opts.suffix||''}</text>`;
  });
  svg += `</svg>`;
  document.getElementById(containerId).innerHTML = svg;
}

function renderDonutChart(containerId, segments){
  const total = segments.reduce((a,s)=>a+s.value,0) || 1;
  const size=180, r=64, cx=90, cy=90, strokeW=24;
  let offset=0;
  let svg = `<svg viewBox="0 0 ${size} ${size}" style="max-width:200px;margin:0 auto">`;
  segments.forEach((seg,i)=>{
    const frac = seg.value/total;
    const circumference = 2*Math.PI*r;
    const dash = frac*circumference;
    const color = seg.color || CHART_COLORS[i%CHART_COLORS.length];
    svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="${strokeW}" stroke-dasharray="${dash.toFixed(1)} ${(circumference-dash).toFixed(1)}" stroke-dashoffset="${(-offset).toFixed(1)}" transform="rotate(-90 ${cx} ${cy})"></circle>`;
    offset += dash;
  });
  svg += `<text x="${cx}" y="${cy-2}" text-anchor="middle" font-size="24" font-weight="700" font-family="Roboto" fill="#202124">${total}</text>`;
  svg += `<text x="${cx}" y="${cy+18}" text-anchor="middle" font-size="10.5" font-family="Roboto" fill="#80868B">total</text>`;
  svg += `</svg>`;
  const legend = segments.map((s,i)=>`<div class="chart-legend-item"><span class="chart-legend-dot" style="background:${s.color||CHART_COLORS[i%CHART_COLORS.length]}"></span>${s.label} · ${s.value}</div>`).join('');
  document.getElementById(containerId).innerHTML = svg + `<div class="chart-legend">${legend}</div>`;
}

function allUnits(){
  return Object.values(state.units).flat();
}

function renderDashboardCharts(){
  renderLineChart('dashTrendChart', [
    {name:'Units sold', color:'#1A73E8', values:state.weekTrend.unitsSold},
    {name:'Agent inquiries (÷2 scale)', color:'#12B5CB', values:state.weekTrend.inquiries.map(v=>Math.round(v/2))},
  ], state.weekTrend.labels);

  const units = allUnits();
  const segs = [
    {label:'Available', value:units.filter(u=>u.status==='available').length, color:'#188038'},
    {label:'Reserved', value:units.filter(u=>u.status==='reserved').length, color:'#F29900'},
    {label:'Sold', value:units.filter(u=>u.status==='sold').length, color:'#1A73E8'},
  ];
  renderDonutChart('dashFunnelDonut', segs);
}

/* ---------------------------------------------------------------------- */
/* DASHBOARD — feed & agenda                                               */
/* ---------------------------------------------------------------------- */
function renderFeed(){
  const list = document.getElementById('feedList');
  list.innerHTML = state.feed.map(f=>`
    <div class="feed-item ${f.read?'':'unread'}" onclick="markFeedRead(${f.id})">
      <div class="fi-icon"><i class="ti ${f.icon}"></i></div>
      <div class="fi-text"><p>${f.text}</p><span>${f.time}</span></div>
    </div>`).join('');
  updateNotifCount();
}
function markFeedRead(id){
  const item = state.feed.find(f=>f.id===id);
  if(item) item.read = true;
  renderFeed();
}
function markAllFeedRead(){
  state.feed.forEach(f=>f.read=true);
  renderFeed();
  toast('success','Updated','All activity has been marked as read.');
}
function updateNotifCount(){
  const unread = state.feed.filter(f=>!f.read).length;
  document.getElementById('notifCount').textContent = unread;
  document.getElementById('notifCount').style.display = unread>0 ? 'flex' : 'none';
  const notifHeader = document.querySelector('#notifPanel .dropdown-header');
  if(notifHeader) notifHeader.innerHTML = `<strong>Notifications</strong>${unread} unread`;
  renderNotifList();
}
function renderNotifList(){
  const list = document.getElementById('notifList');
  list.innerHTML = state.feed.slice(0,5).map(f=>`
    <div class="notif-item ${f.read?'':'unread'}" onclick="markFeedRead(${f.id});showSection('dashboard')">
      <div class="notif-icon"><i class="ti ${f.icon}"></i></div>
      <div class="notif-text"><p>${f.text}</p><span>${f.time}</span></div>
    </div>`).join('');
}
document.getElementById('markAllReadBtn').addEventListener('click', markAllFeedRead);

function renderAgenda(){
  const list = document.getElementById('agendaList');
  list.innerHTML = state.agenda.map((a,i)=>`
    <div class="agenda-item ${a.done?'done':''}">
      <div class="agenda-time">${a.time}</div>
      <div class="agenda-text"><p>${a.text}</p><span>${a.sub}</span></div>
      <input type="checkbox" ${a.done?'checked':''} onchange="toggleAgenda(${i})" style="accent-color:var(--accent);width:16px;height:16px;cursor:pointer">
    </div>`).join('');
}
function toggleAgenda(i){
  state.agenda[i].done = !state.agenda[i].done;
  renderAgenda();
}

/* ---------------------------------------------------------------------- */
/* PROJECTS                                                                */
/* ---------------------------------------------------------------------- */
const projectStatusLabel = {prelaunch:'Pre-launch', active:'Active', soldout:'Sold out', completed:'Completed'};
const projectStatusBadge = {prelaunch:'badge-pending', active:'badge-active', soldout:'badge-info', completed:'badge-sold'};
const projectTypeIcon = {'Residential':'ti-building-skyscraper','Mixed-use':'ti-building','Commercial':'ti-building-store'};

function renderProjects(){
  const q = (document.getElementById('projectSearch').value||'').toLowerCase();
  const statusFilter = document.getElementById('projectStatusFilter').value;
  const sort = document.getElementById('projectSort').value;

  let list = state.projects.filter(p=>{
    const matchQ = p.name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q);
    const matchS = statusFilter==='all' || p.status===statusFilter;
    return matchQ && matchS;
  });
  if(sort==='sold') list.sort((a,b)=>(b.sold/b.units)-(a.sold/a.units));
  if(sort==='units') list.sort((a,b)=>b.units-a.units);
  if(sort==='delivery') list.sort((a,b)=>a.id-b.id);

  const grid = document.getElementById('projectsGrid');
  if(list.length===0){
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><i class="ti ti-building-off"></i>No projects match the current filters.</div>`;
    return;
  }

  grid.innerHTML = list.map(p=>{
    const pct = Math.round((p.sold/p.units)*100);
    const revenue = Math.round((p.sold*(p.priceFrom+p.priceTo)/2));
    return `
    <div class="card hoverable">
      <div class="project-photo" style="background:${p.grad}">
        <i class="ti ${projectTypeIcon[p.type]||'ti-building'}"></i>
        <span class="badge ${projectStatusBadge[p.status]} ph-badge">${projectStatusLabel[p.status]}</span>
        <span class="ph-views"><i class="ti ti-home-2"></i>${p.units} units</span>
      </div>
      <p class="mt" style="font-size:15px">${p.name}</p>
      <p class="ms"><i class="ti ti-map-pin" style="font-size:13px"></i> ${p.location} · ${p.type}</p>
      <div style="margin:12px 0">
        <div class="bar-row" style="margin-bottom:0">
          <span class="bar-label" style="width:auto;flex:0 0 auto">${pct}% sold</span>
          <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
          <span class="bar-value" style="width:auto">${p.sold}/${p.units}</span>
        </div>
      </div>
      <p class="ms">Delivery: ${p.delivery} · Revenue to date ~€${revenue.toLocaleString('en-US')}</p>
      <div class="listing-actions" style="margin-top:12px">
        <button class="btn-secondary btn-sm" style="flex:1" onclick="viewProject(${p.id})"><i class="ti ti-eye"></i>View details</button>
        <button class="btn-primary btn-sm" style="flex:1" onclick="showSection('inventory');document.getElementById('inventoryProjectSelect').value=${p.id};renderInventory()"><i class="ti ti-layout-grid"></i>Inventory</button>
      </div>
    </div>`;
  }).join('');
}
function viewProject(id){
  const p = state.projects.find(x=>x.id===id);
  if(!p) return;
  toast('info', p.name, p.desc);
}

/* ---------------------------------------------------------------------- */
/* ADD PROJECT WIZARD                                                     */
/* ---------------------------------------------------------------------- */
const wizardTotal = 5;
function resetWizard(){
  state.wizardStep = 1;
  state.uploadedFiles = [];
  document.getElementById('uploadedFilesList').innerHTML = '';
  ['wizardStep1','wizardStep2','wizardStep3','wizardStep4','wizardStep5'].forEach((id,i)=>{
    document.getElementById(id).style.display = i===0 ? 'block' : 'none';
  });
  document.getElementById('wizardBackBtn').style.display='none';
  document.getElementById('wizardNextBtn').textContent='Continue';
  renderWizardDots();
}
function renderWizardDots(){
  const dots = document.getElementById('wizardDots');
  dots.innerHTML = '';
  for(let i=1;i<=wizardTotal;i++){
    const d = document.createElement('div');
    d.className = 'wdot' + (i===state.wizardStep?' active':i<state.wizardStep?' done':'');
    dots.appendChild(d);
  }
}
function selectPaymentPlan(el){
  el.parentElement.querySelectorAll('.pill').forEach(p=>p.classList.remove('on'));
  el.classList.add('on');
}
function wizardNav(dir){
  if(dir>0 && state.wizardStep===1){
    if(!document.getElementById('wName').value.trim() || !document.getElementById('wUnits').value){
      toast('warning','Required fields','Please fill in the project name and total units before continuing.');
      return;
    }
  }
  if(dir>0 && state.wizardStep===2){
    if(!document.getElementById('wCity').value.trim()){
      toast('warning','Missing location','Please fill in the project city.');
      return;
    }
  }
  if(dir>0 && state.wizardStep===4){
    if(!document.getElementById('wPriceFrom').value){
      toast('warning','Missing price','Please enter the starting price for the project.');
      return;
    }
  }
  if(dir>0 && state.wizardStep===wizardTotal){
    publishProject();
    return;
  }
  document.getElementById('wizardStep'+state.wizardStep).style.display='none';
  state.wizardStep += dir;
  document.getElementById('wizardStep'+state.wizardStep).style.display='block';
  document.getElementById('wizardBackBtn').style.display = state.wizardStep>1 ? 'inline-flex' : 'none';
  document.getElementById('wizardNextBtn').textContent = state.wizardStep===wizardTotal ? 'Set to Active' : 'Continue';
  renderWizardDots();
}
function simulateUpload(){
  const n = state.uploadedFiles.length + 1;
  const name = `render-${n}.jpg`;
  state.uploadedFiles.push(name);
  document.getElementById('uploadedFilesList').innerHTML = state.uploadedFiles.map(f=>`
    <div class="flex-between" style="padding:8px 0;border-bottom:1px solid var(--border)">
      <span style="font-size:12.5px;color:var(--text-secondary)"><i class="ti ti-photo" style="margin-right:8px;color:var(--accent)"></i>${f}</span>
      <span class="badge badge-active">Uploaded</span>
    </div>`).join('');
}
function wizardGenerateDesc(){
  const type = (document.getElementById('wType').value||'Residential').toLowerCase();
  const city = (document.getElementById('wCity').value || document.getElementById('wZone').value || 'a prime location');
  const units = document.getElementById('wUnits').value || '80';
  const plan = document.querySelector('#wTags .pill.on');
  const planText = plan ? plan.textContent : '30/70';
  document.getElementById('wDesc').value = `A new ${type} development in ${city}, comprising ${units} units delivered to a premium finish standard. Flexible ${planText} payment plan available, with dedicated support for international buyers and authorized selling agents.`;
  toast('success','Description generated','The AI description has been added — feel free to edit it.');
}
function publishProject(){
  const name = document.getElementById('wName').value.trim();
  const units = Number(document.getElementById('wUnits').value)||0;
  const p = {
    id: nextId++,
    name,
    location: document.getElementById('wCity').value.trim() + (document.getElementById('wZone').value ? ', '+document.getElementById('wZone').value : ''),
    type: document.getElementById('wType').value,
    units,
    sold: 0,
    status:'prelaunch',
    delivery: document.getElementById('wDelivery').value || 'TBD',
    priceFrom: Number(document.getElementById('wPriceFrom').value)||0,
    priceTo: Number(document.getElementById('wPriceTo').value)||0,
    grad:'#1A73E8',
    desc: document.getElementById('wDesc').value || 'New development — description pending.',
  };
  state.projects.unshift(p);
  state.units[p.id] = [];
  closeModal('modal-add-project');
  showSection('projects');
  document.getElementById('projectStatusFilter').value='all';
  document.getElementById('projectSearch').value='';
  renderProjects();
  populateProjectSelects();
  updateSidebarCounts();
  toast('success','Project created', `"${p.name}" has been created and is ready for unit inventory setup.`);
}

/* ---------------------------------------------------------------------- */
/* UNIT INVENTORY + DETAIL DRAWER                                          */
/* ---------------------------------------------------------------------- */
function populateProjectSelects(){
  const opts = state.projects.map(p=>`<option value="${p.id}">${p.name}</option>`).join('');
  const inv = document.getElementById('inventoryProjectSelect');
  const prevInv = inv.value;
  inv.innerHTML = opts;
  if(prevInv && state.projects.some(p=>String(p.id)===prevInv)) inv.value = prevInv;
}
function populateUnitProjectSelect(){
  document.getElementById('uProject').innerHTML = state.projects.map(p=>`<option value="${p.id}">${p.name}</option>`).join('');
}
function populateInviteProjectSelect(){
  document.getElementById('inviteProject').innerHTML = state.projects.map(p=>`<option value="${p.id}">${p.name}</option>`).join('');
}

function renderInventory(){
  const projectId = Number(document.getElementById('inventoryProjectSelect').value) || state.currentProjectId;
  state.currentProjectId = projectId;
  const units = state.units[projectId] || [];

  const available = units.filter(u=>u.status==='available').length;
  const reserved = units.filter(u=>u.status==='reserved').length;
  const sold = units.filter(u=>u.status==='sold').length;
  document.getElementById('inventoryStats').innerHTML = `
    <div class="stat-card"><div class="value">${units.length}</div><div class="label">Total units</div></div>
    <div class="stat-card"><div class="value">${available}</div><div class="label">Available</div></div>
    <div class="stat-card"><div class="value">${reserved}</div><div class="label">Reserved</div></div>
    <div class="stat-card"><div class="value">${sold}</div><div class="label">Sold</div></div>
  `;

  const grid = document.getElementById('unitGrid');
  if(units.length===0){
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><i class="ti ti-layout-grid-off"></i>No units configured for this project yet.</div>`;
    return;
  }
  grid.innerHTML = units.map(u=>`
    <div class="unit-cell ${u.status}" onclick="openUnitDetail(${projectId},'${u.code}')">${u.code}<span>${u.type}</span></div>
  `).join('');

  renderUnitHistory();
}
function renderUnitHistory(){
  document.getElementById('unitHistoryList').innerHTML = state.unitHistory.map(h=>`
    <div class="feed-item" style="border:none;padding:8px 0"><div class="fi-icon"><i class="ti ${h.icon}"></i></div><div class="fi-text"><p>${h.text}</p><span>${h.time}</span></div></div>
  `).join('');
}
function exportInventory(){
  const projectId = state.currentProjectId;
  const project = state.projects.find(p=>p.id===projectId);
  const units = state.units[projectId] || [];
  const lines = [
    `LuciHome — Availability export`,
    `Project: ${project ? project.name : ''}`,
    `Generated: ${new Date().toLocaleDateString('en-US')}`,
    '',
    'Unit,Type,Floor,Size (m2),Price (EUR),Status',
    ...units.map(u=>`${u.code},${u.type},${u.floor},${u.size},${u.price},${u.status}`),
  ];
  downloadFile('lucihome-availability.csv', lines.join('\n'));
  toast('success','Availability exported','The file lucihome-availability.csv has been downloaded.');
}

const unitStatusLabel = {available:'Available', reserved:'Reserved (locked)', sold:'Sold'};
function openUnitDetail(projectId, code){
  const units = state.units[projectId] || [];
  const u = units.find(x=>x.code===code);
  if(!u) return;
  state.selectedUnitKey = projectId+'::'+code;
  const project = state.projects.find(p=>p.id===projectId);
  document.getElementById('udName').textContent = `Unit ${u.code} — ${project ? project.name : ''}`;
  document.getElementById('udBody').innerHTML = `
    <div class="pill-row" style="margin-bottom:16px">
      <span class="badge badge-info">${u.type}</span>
      <span class="badge badge-neutral">Floor ${u.floor}</span>
      <span class="badge badge-neutral">${u.size} m²</span>
    </div>
    <div class="field"><label class="field-label">Price (€)</label><input class="input" id="udPrice" type="number" value="${u.price}"></div>
    <div class="field"><label class="field-label">Status</label>
      <select class="select" id="udStatus">
        <option value="available" ${u.status==='available'?'selected':''}>Available</option>
        <option value="reserved" ${u.status==='reserved'?'selected':''}>Reserved (locked)</option>
        <option value="sold" ${u.status==='sold'?'selected':''}>Sold</option>
      </select>
    </div>
    <p class="section-label" style="margin-top:20px">Reservation history</p>
    <div class="feed-item" style="border:none;padding:8px 0"><div class="fi-icon"><i class="ti ti-clock"></i></div><div class="fi-text"><p>Current status: ${unitStatusLabel[u.status]}</p><span>Updated recently</span></div></div>
  `;
  document.getElementById('unitDrawer').classList.add('open');
  document.getElementById('unitDrawerBackdrop').classList.add('open');
}
function closeUnitDrawer(){
  document.getElementById('unitDrawer').classList.remove('open');
  document.getElementById('unitDrawerBackdrop').classList.remove('open');
  state.selectedUnitKey = null;
}
function saveUnitDetail(){
  if(!state.selectedUnitKey) { closeUnitDrawer(); return; }
  const [projectId, code] = state.selectedUnitKey.split('::');
  const units = state.units[projectId] || state.units[Number(projectId)];
  const u = units.find(x=>x.code===code);
  if(u){
    const newStatus = document.getElementById('udStatus').value;
    const priceEl = document.getElementById('udPrice');
    if(priceEl) u.price = Number(priceEl.value)||u.price;
    if(u.status !== newStatus){
      state.unitHistory.unshift({icon: newStatus==='sold'?'ti-signature':newStatus==='reserved'?'ti-lock':'ti-lock-open', text:`Unit ${u.code} status changed to "${unitStatusLabel[newStatus]}".`, time:'just now'});
      u.status = newStatus;
    }
    renderInventory();
    renderDashboardCharts();
  }
  closeUnitDrawer();
  toast('success','Saved','Unit details have been updated.');
}
function addUnit(){
  const projectId = Number(document.getElementById('uProject').value);
  const code = document.getElementById('uCode').value.trim();
  if(!code){ toast('warning','Missing unit code','Please enter a unit code.'); return; }
  if(!state.units[projectId]) state.units[projectId] = [];
  state.units[projectId].push({
    code,
    type: document.getElementById('uType').value,
    status:'available',
    floor: Number(document.getElementById('uFloor').value)||0,
    size: Number(document.getElementById('uSize').value)||0,
    price: Number(document.getElementById('uPrice').value)||0,
  });
  const project = state.projects.find(p=>p.id===projectId);
  if(project) project.units++;
  closeModal('modal-add-unit');
  showSection('inventory');
  document.getElementById('inventoryProjectSelect').value = projectId;
  renderInventory();
  toast('success','Unit added', `Unit ${code} has been added to the inventory.`);
}

/* ---------------------------------------------------------------------- */
/* SALES TRACKER                                                           */
/* ---------------------------------------------------------------------- */
function renderSalesCharts(){
  renderLineChart('velocityChart', [
    {name:'Units sold', color:'#1A73E8', values:[3,4,3,5,6,5,7]},
    {name:'Target pace', color:'#80868B', values:[4,4,4,4,4,4,4]},
  ], ['W1','W2','W3','W4','W5','W6','W7']);

  renderDonutChart('salesBuyerOriginChart', state.buyerOrigin.map((b,i)=>({label:b.label, value:b.value, color:CHART_COLORS[i%CHART_COLORS.length]})));

  const units = allUnits();
  const types = ['Studio','1BR','2BR','3BR','Penthouse','Villa','Retail'];
  const progress = types.map(t=>{
    const ofType = units.filter(u=>u.type===t);
    return {type:t, total:ofType.length, sold:ofType.filter(u=>u.status==='sold').length};
  }).filter(t=>t.total>0);
  document.getElementById('unitTypeProgress').innerHTML = progress.map(t=>{
    const pct = Math.round((t.sold/t.total)*100);
    return `<div class="bar-row">
      <span class="bar-label">${t.type}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
      <span class="bar-value">${t.sold}/${t.total}</span>
    </div>`;
  }).join('');

  document.getElementById('agentSalesBody').innerHTML = state.agentSales.map(a=>`
    <tr><td class="strong">${a.name}</td><td>${a.market}</td><td>${a.units}</td><td>€${a.revenue.toLocaleString('en-US')}</td></tr>
  `).join('');

  const pipelineBadge = {expiring:'badge-pending', active:'badge-info'};
  const pipelineLabel = {expiring:'Expiring soon', active:'On hold'};
  document.getElementById('pipelineBody').innerHTML = state.pipeline.map((r,i)=>`
    <tr><td class="strong">${r.unit}</td><td>${r.project}</td><td>${r.agent}</td><td>${r.reserved}</td>
    <td><span class="badge ${pipelineBadge[r.status]}">${pipelineLabel[r.status]}</span></td>
    <td><button class="btn-ghost btn-sm" onclick="toast('info','Reminder sent','A follow-up reminder has been sent to ${r.agent.replace(/'/g,"")}.')">Remind agent</button></td></tr>
  `).join('');
}
function exportSalesReport(){
  const lines = [
    'LuciHome — Sales Report',
    'Company: Meridian Developments',
    'Generated: ' + new Date().toLocaleDateString('en-US'),
    '',
    'Active projects: ' + state.projects.filter(p=>p.status==='active').length,
    'Total units sold: ' + allUnits().filter(u=>u.status==='sold').length,
    '',
    'Sales by agent:',
    ...state.agentSales.map(a=>`  - ${a.name} (${a.market}): ${a.units} units, €${a.revenue.toLocaleString('en-US')}`),
  ];
  downloadFile('lucihome-sales-report.txt', lines.join('\n'));
  toast('success','Report exported','The file lucihome-sales-report.txt has been downloaded.');
}

/* ---------------------------------------------------------------------- */
/* DOCUMENTS                                                               */
/* ---------------------------------------------------------------------- */
function docRow(d){
  return `<div class="feed-item" style="border:none;padding:10px 0">
    <div class="fi-icon"><i class="ti ti-file-text"></i></div>
    <div class="fi-text" style="flex:1"><p>${d.name}${d.verified?' <span class="badge badge-active" style="margin-left:6px"><i class="ti ti-check"></i>Verified</span>':''}</p><span>${d.project} · Access: ${d.access}</span></div>
    <button class="btn-ghost btn-sm" onclick="toast('info','E-signature','A signature request has been sent to all parties.')"><i class="ti ti-signature"></i>Request signature</button>
  </div>`;
}
function renderDocuments(){
  document.getElementById('legalDocsList').innerHTML = `<div class="card">${state.legalDocs.map(docRow).join('')}</div>`;
  document.getElementById('technicalDocsList').innerHTML = `<div class="card">${state.technicalDocs.map(docRow).join('')}</div>`;
  document.getElementById('salesDocsList').innerHTML = `<div class="card">${state.salesDocs.map(docRow).join('')}</div>`;
}
function simulateDocUpload(){
  const n = state.salesDocs.length + 1;
  state.salesDocs.unshift({name:`updated-materials-${n}.pdf`, project:'All projects', access:'Agents', verified:false});
  renderDocuments();
  switchTab('documents','documents-sales');
  toast('success','Document uploaded','The document has been added and distributed to authorized agents.');
}

/* ---------------------------------------------------------------------- */
/* AGENT NETWORK                                                           */
/* ---------------------------------------------------------------------- */
function renderRoster(){
  document.getElementById('rosterCount').textContent = state.roster.length;
  document.getElementById('rosterActiveCount').textContent = state.roster.filter(a=>a.status==='active').length;
  document.getElementById('rosterBody').innerHTML = state.roster.map(a=>`
    <tr>
      <td class="strong">${a.name}</td>
      <td>${a.market}</td>
      <td><span class="badge ${a.status==='active'?'badge-active':'badge-neutral'}">${a.status==='active'?'Active':'Inactive'}</span></td>
      <td>${a.unitsSold}</td>
      <td>€${a.commissionPending.toLocaleString('en-US')} pending</td>
      <td><button class="btn-ghost btn-sm" onclick="toggleRosterStatus(${a.id})">${a.status==='active'?'Remove':'Re-invite'}</button></td>
    </tr>
  `).join('');

  const top = [...state.roster].sort((a,b)=>b.unitsSold-a.unitsSold).slice(0,5)
    .map((a,i)=>({label:a.name, value:a.unitsSold, color:CHART_COLORS[i%CHART_COLORS.length]}));
  renderBarChart('leaderboardList', top, {leftPad:150});
}
function toggleRosterStatus(id){
  const a = state.roster.find(x=>x.id===id);
  a.status = a.status==='active' ? 'inactive' : 'active';
  renderRoster();
  toast(a.status==='active'?'success':'info', a.status==='active'?'Agent re-invited':'Agent removed', `${a.name} is now ${a.status==='active'?'authorized to sell again':'no longer authorized to sell'}.`);
}
function renderInviteCandidates(){
  const q = (document.getElementById('inviteSearch').value||'').toLowerCase();
  const list = state.candidates.filter(c=>c.name.toLowerCase().includes(q) || c.market.toLowerCase().includes(q));
  document.getElementById('inviteCandidatesList').innerHTML = list.map(c=>`
    <div class="card pro-card" style="margin-bottom:10px">
      <div class="pro-head"><div class="avatar-circle">${c.name.split(' ').map(w=>w[0]).slice(0,2).join('')}</div><div><p class="n">${c.name}</p><p class="r">${c.market} · ${c.lang}</p></div></div>
      <p class="stars">★★★★★ <span style="color:var(--text-muted);font-size:11px">${c.rating}</span></p>
      <button class="btn-${c.invited?'secondary':'primary'} btn-sm btn-block" onclick="inviteCandidate(${c.id})" ${c.invited?'disabled':''}>${c.invited?'Invitation sent ✓':'Invite to sell'}</button>
    </div>`).join('') || '<div class="empty-state"><i class="ti ti-users"></i>No agents found.</div>';
}
function inviteCandidate(id){
  const c = state.candidates.find(x=>x.id===id);
  c.invited = true;
  renderInviteCandidates();
  toast('success','Invitation sent', `${c.name} has been invited to sell the selected project.`);
}
function sendBroadcast(){
  const msg = document.getElementById('broadcastMsg').value.trim();
  if(!msg){ toast('warning','Empty message','Please write a message before sending.'); return; }
  const audience = document.getElementById('broadcastAudience').value;
  closeModal('modal-broadcast');
  document.getElementById('broadcastMsg').value='';
  toast('success','Broadcast sent', `Your message was sent to ${audience.toLowerCase()}.`);
}

/* ---------------------------------------------------------------------- */
/* PROFESSIONAL NETWORK                                                    */
/* ---------------------------------------------------------------------- */
function renderDirectory(){
  const q = (document.getElementById('dirSearch').value||'').toLowerCase();
  const type = document.getElementById('dirType').value;
  const list = state.directory.filter(p=>p.name.toLowerCase().includes(q) && (type==='all'||p.type===type));
  document.getElementById('directoryGrid').innerHTML = list.map(p=>`
    <div class="card pro-card">
      <div class="pro-head"><div class="avatar-circle">${p.name.split(' ').map(w=>w[0]).slice(0,2).join('')}</div><div><p class="n">${p.name}</p><p class="r">${p.type} · ${p.market}</p></div></div>
      <p class="ms">${p.lang}</p>
      <p class="stars">★★★★★ <span style="color:var(--text-muted);font-size:11px">${p.rating}</span></p>
      <button class="btn-${p.connected?'secondary':'primary'} btn-sm btn-block" onclick="toggleConnect(${p.id})">${p.connected?'Connected ✓':'Connect'}</button>
    </div>`).join('') || '<div class="empty-state" style="grid-column:1/-1"><i class="ti ti-users"></i>No professionals found.</div>';
  renderMyNetwork();
  renderAgencies();
  renderPreferred();
}
function toggleConnect(id){
  const p = state.directory.find(x=>x.id===id);
  p.connected = !p.connected;
  renderDirectory();
  toast(p.connected?'success':'info', p.connected?'Connected':'Connection removed', p.connected? `You are now connected with ${p.name}.` : `You have disconnected from ${p.name}.`);
}
function renderMyNetwork(){
  const grid = document.getElementById('myNetworkGrid');
  const connected = state.directory.filter(p=>p.connected);
  grid.innerHTML = connected.map(p=>`
    <div class="card pro-card">
      <div class="pro-head"><div class="avatar-circle">${p.name.split(' ').map(w=>w[0]).slice(0,2).join('')}</div><div><p class="n">${p.name}</p><p class="r">${p.type} · ${p.market}</p></div></div>
      <button class="btn-secondary btn-sm btn-block" onclick="toast('info','Message','Opening the message thread with ${p.name.replace(/'/g,"")}.')"><i class="ti ti-message-dots"></i>Send message</button>
    </div>`).join('') || '<div class="empty-state" style="grid-column:1/-1"><i class="ti ti-users"></i>You are not connected with any professionals yet.</div>';
}
function renderAgencies(){
  const agencies = state.directory.filter(p=>p.type==='Agency');
  document.getElementById('agencyGrid').innerHTML = agencies.map(a=>`
    <div class="card">
      <i class="ti ti-building mi"></i>
      <p class="mt">${a.name}</p>
      <p class="ms">${a.market} · ${a.lang}</p>
      <p class="ms" style="margin-top:6px">Bring their entire agent roster on board as potential sellers for your projects.</p>
      <button class="btn-${a.connected?'secondary':'primary'} btn-sm" style="margin-top:12px" onclick="toggleConnect(${a.id})">${a.connected?'Partnered ✓':'Propose partnership'}</button>
    </div>`).join('');
}
function renderPreferred(){
  const preferred = state.directory.filter(p=>p.connected);
  document.getElementById('preferredGrid').innerHTML = preferred.map(p=>`
    <div class="card pro-card">
      <div class="pro-head"><div class="avatar-circle">${p.name.split(' ').map(w=>w[0]).slice(0,2).join('')}</div><div><p class="n">${p.name}</p><p class="r">${p.type} · ${p.market}</p></div></div>
      <button class="btn-secondary btn-sm btn-block"><i class="ti ti-star-filled"></i>Preferred partner</button>
    </div>`).join('') || '<div class="empty-state" style="grid-column:1/-1"><i class="ti ti-star"></i>Connect with professionals to build your preferred partners list.</div>';
}

/* ---------------------------------------------------------------------- */
/* BRAND & PROFILE                                                         */
/* ---------------------------------------------------------------------- */
let profileEditing = false;
function toggleProfileEdit(){
  profileEditing = !profileEditing;
  document.getElementById('profBio').contentEditable = profileEditing;
  document.getElementById('profBio').style.outline = profileEditing ? '1px dashed var(--border-strong)' : 'none';
  document.getElementById('profBio').style.padding = profileEditing ? '8px' : '0';
  document.getElementById('profEditFields').querySelectorAll('input').forEach(i=>i.disabled = !profileEditing);
  const btn = document.getElementById('editProfileBtn');
  btn.innerHTML = profileEditing ? '<i class="ti ti-check"></i>Save changes' : '<i class="ti ti-edit"></i>Edit profile';
  if(!profileEditing) toast('success','Profile updated','Your changes have been saved.');
}

/* ---------------------------------------------------------------------- */
/* ANALYTICS                                                               */
/* ---------------------------------------------------------------------- */
function renderAnalyticsCharts(){
  const perProject = state.projects.filter(p=>p.status!=='completed').map((p,i)=>({label:p.name, value:p.sold, color:CHART_COLORS[i%CHART_COLORS.length]}));
  renderBarChart('salesPerfChart', perProject, {leftPad:180});

  const units = allUnits();
  const types = ['Studio','1BR','2BR','3BR','Penthouse','Villa','Retail'];
  const typePerf = types.map((t,i)=>({label:t, value:units.filter(u=>u.type===t && u.status==='sold').length, color:CHART_COLORS[i%CHART_COLORS.length]})).filter(t=>t.value>0 || units.some(u=>u.type===t.label));
  renderBarChart('unitTypePerfChart', typePerf.filter(t=>units.some(u=>u.type===t.label)), {leftPad:130});

  renderDonutChart('analyticsOriginChart', state.buyerOrigin.map((b,i)=>({label:b.label, value:b.value, color:CHART_COLORS[i%CHART_COLORS.length]})));

  const topAgents = [...state.agentSales].sort((a,b)=>b.units-a.units).map((a,i)=>({label:a.name, value:a.units, color:CHART_COLORS[i%CHART_COLORS.length]}));
  renderBarChart('agentPerfChart', topAgents, {leftPad:150});
}
function exportReport(){
  const lines = [
    'LuciHome — Developer Performance Report',
    'Company: Meridian Developments',
    'Generated: ' + new Date().toLocaleDateString('en-US'),
    '',
    'Active projects: ' + state.projects.filter(p=>p.status==='active').length,
    'Total units: ' + allUnits().length,
    'Units sold: ' + allUnits().filter(u=>u.status==='sold').length,
    'Revenue collected: €48,200,000',
    'Commissions pending: €9,400',
    'Revenue projected (pipeline): €6,100,000',
    '',
    'Top selling agents:',
    ...[...state.agentSales].sort((a,b)=>b.units-a.units).slice(0,5).map(a=>`  - ${a.name} (${a.market}): ${a.units} units`),
  ];
  downloadFile('lucihome-developer-report.txt', lines.join('\n'));
  toast('success','Report exported','The file lucihome-developer-report.txt has been downloaded.');
}
function exportAccountData(){
  const data = {
    developer:{company:'Meridian Developments', email:'sales@meridiandevelopments.ro'},
    projects: state.projects,
    units: state.units,
    roster: state.roster,
  };
  downloadFile('lucihome-account-data.json', JSON.stringify(data, null, 2));
  toast('success','Export complete','Your account data has been downloaded as JSON.');
}
function downloadFile(filename, content){
  const blob = new Blob([content], {type:'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ---------------------------------------------------------------------- */
/* SETTINGS                                                                */
/* ---------------------------------------------------------------------- */
function renderTeam(){
  document.getElementById('teamBody').innerHTML = state.team.map(t=>`
    <tr><td class="strong">${t.name}</td><td>${t.role}</td><td>${t.access}</td>
    <td><button class="btn-ghost btn-sm" onclick="toast('info','Team','Role editing will be available at launch (demo).')">Edit</button></td></tr>
  `).join('');
}
function toggleIntegration(btn){
  const connected = btn.classList.toggle('connected');
  btn.innerHTML = connected ? 'Connected <i class="ti ti-check"></i>' : 'Connect';
  toast(connected?'success':'info', connected?'Integration active':'Integration disabled', `${btn.dataset.name} is now ${connected?'connected':'disconnected'}.`);
}
function confirmDeleteAccount(){
  const val = document.getElementById('deleteConfirmInput').value.trim().toUpperCase();
  if(val !== 'DELETE'){
    toast('warning','Confirmation required','Type exactly "DELETE" to confirm.');
    return;
  }
  closeModal('modal-delete-account');
  toast('info','Demo','On a real account this would permanently delete it. This is only a demonstration.');
  document.getElementById('deleteConfirmInput').value='';
}

/* ---------------------------------------------------------------------- */
/* SIDEBAR COUNTS                                                          */
/* ---------------------------------------------------------------------- */
function updateSidebarCounts(){
  const activeProjects = state.projects.filter(p=>p.status==='active'||p.status==='prelaunch').length;
  document.querySelector('.nav-item[data-section="projects"] .nbadge').textContent = activeProjects;
  document.querySelector('.nav-item[data-section="agents"] .nbadge').textContent = state.roster.filter(a=>a.status==='active').length;
}

/* ---------------------------------------------------------------------- */
/* INIT                                                                    */
/* ---------------------------------------------------------------------- */
function init(){
  renderFeed();
  renderAgenda();
  renderDashboardCharts();
  populateProjectSelects();
  renderProjects();
  document.getElementById('inventoryProjectSelect').value = state.currentProjectId;
  renderInventory();
  renderSalesCharts();
  renderDocuments();
  renderRoster();
  renderDirectory();
  renderAnalyticsCharts();
  renderTeam();
  updateSidebarCounts();

  document.getElementById('globalSearch').addEventListener('keydown', e=>{
    if(e.key==='Enter' && e.target.value.trim()){
      showSection('projects');
      document.getElementById('projectSearch').value = e.target.value;
      renderProjects();
      toast('info','Search','Projects have been filtered based on your search.');
    }
  });
}
document.addEventListener('DOMContentLoaded', init);
