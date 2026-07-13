/* ==========================================================================
   LuciHome — Agent Workspace Demo
   Rebuilt interaction layer: Gmail-style quick-create menu, a slide-over
   contact detail drawer (replacing the old contact modal), and a small
   dependency-free SVG chart engine (line, bar, donut) used across the
   Dashboard and Analytics sections.
   ========================================================================== */

let nextId = 1000;
const CHART_COLORS = ['#1A73E8','#12B5CB','#F29900','#D93025','#9334E6','#188038'];

const state = {

  feed: [
    {id:1, icon:'ti-user-plus', text:'<strong>Michael Turner</strong> became a new lead from the "Herastrau Apartment" listing.', time:'18 min ago', read:false},
    {id:2, icon:'ti-eye', text:'The <strong>"Cluj-Napoca Penthouse"</strong> listing passed 300 views.', time:'1 h ago', read:false},
    {id:3, icon:'ti-signature', text:'<strong>Elena Marsh</strong> signed the listing mandate.', time:'3 h ago', read:false},
    {id:4, icon:'ti-arrows-exchange', text:'New referral received from <strong>Dubai Estates Partners</strong>.', time:'yesterday, 5:40 PM', read:false},
    {id:5, icon:'ti-message-dots', text:'<strong>Anna Popescu</strong> replied to your message about the viewing.', time:'yesterday, 11:05 AM', read:true},
    {id:6, icon:'ti-home-2', text:'The <strong>"Old Town Studio"</strong> listing was marked as sold.', time:'2 days ago', read:true},
  ],

  agenda: [
    {time:'09:00', text:'Call with Michael Turner — budget clarification', sub:'Phone · 15 min', done:false},
    {time:'11:30', text:'Viewing — Herastrau Apartment', sub:'With the Rhodes family', done:false},
    {time:'14:00', text:'Deadline — submit documents to notary', sub:'Pipera Villa transaction', done:false},
    {time:'16:30', text:'Follow-up — Anna Popescu', sub:'Sent Tuesday, awaiting reply', done:true},
  ],

  weekTrend:{
    labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    views:[140,165,150,190,210,175,230],
    leads:[1,2,1,3,2,1,3],
  },

  listings: [
    {id:1, title:'3-bedroom apartment with park view', city:'Herastrau, Bucharest', type:'Apartment', price:245000, beds:3, baths:2, size:98, status:'active', views:412, lastBoost:'4 days ago', tags:['Park view','Furnished'], grad:'#1A73E8'},
    {id:2, title:'Penthouse with panoramic terrace', city:'Zorilor, Cluj-Napoca', type:'Penthouse', price:398000, beds:4, baths:3, size:165, status:'active', views:318, lastBoost:'9 days ago', tags:['Terrace','Parking'], grad:'#12B5CB'},
    {id:3, title:'Villa with garden and pool', city:'Pipera, Bucharest', type:'House / Villa', price:520000, beds:5, baths:4, size:280, status:'offer', views:241, lastBoost:'15 days ago', tags:['Pool','Pet friendly'], grad:'#9334E6'},
    {id:4, title:'Modern studio, historic center', city:'Old Town, Bucharest', type:'Studio', price:600, beds:1, baths:1, size:42, status:'sold', views:168, lastBoost:'30 days ago', tags:['Furnished'], grad:'#80868B'},
    {id:5, title:'4-bedroom house in a quiet area', city:'Grigorescu, Cluj-Napoca', type:'House / Villa', price:310000, beds:4, baths:2, size:140, status:'draft', views:0, lastBoost:'—', tags:['Parking'], grad:'#80868B'},
    {id:6, title:'2-bedroom apartment, fully renovated', city:'Zorilor, Cluj-Napoca', type:'Apartment', price:172000, beds:2, baths:1, size:64, status:'active', views:96, lastBoost:'1 day ago', tags:['Furnished','Park view'], grad:'#188038'},
  ],
  listingView:'grid',

  contacts: [
    {id:1, name:'Michael Turner', initials:'MT', budget:220000, type:'Buyer', stage:'contacted', notes:'Looking for a 3-bedroom in the Herastrau area, moving in 2 months.', activity:[{d:'Jul 8','t':'Lead came in from the Herastrau listing'},{d:'Jul 9','t':'First call — interested, will follow up with questions'}], reminder:'Call back Friday'},
    {id:2, name:'Elena Marsh', initials:'EM', budget:340000, type:'Seller', stage:'offer', notes:'Selling the Herastrau apartment, already has an interested buyer.', activity:[{d:'Jul 2','t':'Signed the sale mandate'},{d:'Jul 10','t':'Offer received from Michael T.'}], reminder:'Send contract Friday'},
    {id:3, name:'Robert Constantin', initials:'RC', budget:180000, type:'Investor', stage:'new', notes:'Interested in long-term rental properties.', activity:[{d:'Jul 11','t':'New lead from the contact form'}], reminder:null},
    {id:4, name:'Anna Popescu', initials:'AP', budget:150000, type:'Renter', stage:'viewing', notes:'Looking for a studio or one-bedroom downtown, flexible budget.', activity:[{d:'Jul 5','t':'Contacted by phone'},{d:'Jul 9','t':'Viewing scheduled for July 14'}], reminder:'Confirm Monday viewing'},
    {id:5, name:'Bogdan Ellis', initials:'BE', budget:410000, type:'Buyer', stage:'closed', notes:'Transaction completed — the Pipera villa.', activity:[{d:'Jun 20','t':'Offer accepted'},{d:'Jun 30','t':'Transaction closed successfully'}], reminder:null},
    {id:6, name:'Corina Vale', initials:'CV', budget:265000, type:'Buyer', stage:'new', notes:'Asked for more details about the Cluj penthouse.', activity:[{d:'Jul 10','t':'Message received via the platform'}], reminder:'Reply with extra details'},
  ],
  stages: [
    {id:'new', label:'New Lead'},
    {id:'contacted', label:'Contacted'},
    {id:'viewing', label:'Viewing Scheduled'},
    {id:'offer', label:'Offer Made'},
    {id:'closed', label:'Closed'},
  ],

  transactions: [
    {id:1, property:'3-bedroom apartment, Herastrau', buyer:'Michael Turner', seller:'Elena Marsh', stage:2, commission:7350, commissionStatus:'Pending',
      docs:['Sale mandate.pdf','Land registry extract.pdf'], checklist:[{t:'Property title verification', done:true},{t:'Bank appraisal', done:true},{t:'Sign preliminary contract', done:false},{t:'File with notary', done:false}]},
    {id:2, property:'Pipera Villa', buyer:'Bogdan Ellis', seller:'Constantin Popa', stage:4, commission:12300, commissionStatus:'Pending',
      docs:['Sale-purchase contract.pdf','Energy certificate.pdf','Land registry extract.pdf'], checklist:[{t:'Property title verification', done:true},{t:'Bank appraisal', done:true},{t:'Sign preliminary contract', done:true},{t:'File with notary', done:true},{t:'Property handover', done:false}]},
    {id:3, property:'Cluj-Napoca Penthouse', buyer:'Anna Popescu', seller:'Robert Constantin', stage:1, commission:5400, commissionStatus:'Projected',
      docs:['Signed offer.pdf'], checklist:[{t:'Property title verification', done:false},{t:'Bank appraisal', done:false},{t:'Sign preliminary contract', done:false}]},
  ],
  archivedTx:[
    {id:99, property:'Old Town Studio', buyer:'Teodora Barbu', seller:'Vlad Marin', commission:2100, closedOn:'June 28, 2026'}
  ],
  txStages:['Offer','Accepted','Due Diligence','Contract','Closing','Completed'],
  currentTxId:1,
  archiveVisible:false,

  sentReferrals:[
    {id:1, client:'Corina Vale', market:'Paris, France', agent:'Sophie Laurent — Paris Prestige Immobilier', pct:22, status:'pending'},
    {id:2, client:'Bogdan Ellis (past client)', market:'Dubai, UAE', agent:'Khalid Al-Farsi — Dubai Estates Partners', pct:20, status:'closed'},
  ],
  receivedReferrals:[
    {id:1, client:'Marc Dubois (French client)', market:'Bucharest, Romania', agent:'Sophie Laurent — Paris', pct:22, status:'pending', budget:280000, notes:'Looking for a 2-3 bedroom apartment, available to visit in August.'},
    {id:2, client:'Fatima Al-Sayed', market:'Bucharest, Romania', agent:'Khalid Al-Farsi — Dubai', pct:20, status:'pending', budget:450000, notes:'Investor, interested in premium properties with rental yield.'},
  ],
  partners:[
    {id:1, name:'Sophie Laurent', agency:'Paris Prestige Immobilier', market:'Paris, France', lang:'FR / EN', rating:4.9, preferred:true},
    {id:2, name:'Khalid Al-Farsi', agency:'Dubai Estates Partners', market:'Dubai, UAE', lang:'AR / EN', rating:4.8, preferred:true},
    {id:3, name:'Marco Bianchi', agency:'Milano Casa Group', market:'Milan, Italy', lang:'IT / EN', rating:4.7, preferred:false},
    {id:4, name:'Laura Fernandez', agency:'Barcelona Home Partners', market:'Barcelona, Spain', lang:'ES / EN', rating:4.6, preferred:false},
  ],

  directory:[
    {id:1, name:'Sophie Laurent', type:'Agent', market:'Paris, France', lang:'FR / EN', rating:4.9, connected:true},
    {id:2, name:'Khalid Al-Farsi', type:'Agent', market:'Dubai, UAE', lang:'AR / EN', rating:4.8, connected:true},
    {id:3, name:'Ionescu & Partners Notary', type:'Notary', market:'Bucharest, Romania', lang:'RO / EN', rating:4.9, connected:false},
    {id:4, name:'Popescu Law Office', type:'Lawyer', market:'Bucharest, Romania', lang:'RO / FR', rating:4.7, connected:false},
    {id:5, name:'Skyline Development', type:'Developer', market:'Cluj-Napoca, Romania', lang:'RO / EN', rating:4.6, connected:false},
    {id:6, name:'BRD Partner Loans', type:'Bank', market:'Romania (national)', lang:'RO / EN', rating:4.5, connected:false},
    {id:7, name:'Marco Bianchi', type:'Agent', market:'Milan, Italy', lang:'IT / EN', rating:4.7, connected:true},
    {id:8, name:'Laura Fernandez', type:'Agent', market:'Barcelona, Spain', lang:'ES / EN', rating:4.6, connected:true},
    {id:9, name:'Dubois Notary', type:'Notary', market:'Paris, France', lang:'FR / EN', rating:4.8, connected:false},
  ],

  devProjects:[
    {id:1, name:'Skyline Residences', location:'Cluj-Napoca, Grigorescu', desc:'Premium residential complex, 120 units — the developer is looking for authorized selling agents in the local market.', applied:false},
    {id:2, name:'Herastrau Gardens Phase II', location:'Bucharest, Herastrau', desc:'Second phase of a luxury lakeside project — 3.5% sales commission.', applied:false},
    {id:3, name:'Riviera Bay Villas', location:'Constanta, Mamaia', desc:'Seaside vacation villas, ideal for international investor clients.', applied:true},
  ],

  marketGroups:[
    {id:1, name:'Dubai Agents', members:342, joined:false, desc:'A network of active agents in the Dubai market — sharing listings and leads.'},
    {id:2, name:'Paris Luxury', members:198, joined:true, desc:'A group dedicated to luxury properties in Paris and Île-de-France.'},
    {id:3, name:'Cluj Investors', members:126, joined:false, desc:'Investors and agents focused on rental yields in Cluj-Napoca.'},
    {id:4, name:'Bucharest Rentals', members:271, joined:false, desc:'A community focused exclusively on the Bucharest rental market.'},
  ],

  buyerOrigin:[
    {label:'Romania', value:42}, {label:'France', value:24}, {label:'UAE', value:18}, {label:'Germany', value:10}, {label:'Other', value:6},
  ],
  timeOnMarket:{mine:38, platform:51},

  integrations:{},
  wizardStep:1,
  uploadedFiles:[],
  selectedContactId:null,
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
  closeContactDrawer();
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
  if(id==='modal-add-listing') resetWizard();
  if(id==='modal-send-referral') populateReferralClients();
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

function renderDashboardCharts(){
  renderLineChart('dashTrendChart', [
    {name:'Listing views', color:'#1A73E8', values:state.weekTrend.views},
    {name:'New leads (×20 scale)', color:'#12B5CB', values:state.weekTrend.leads.map(v=>v*20)},
  ], state.weekTrend.labels);

  const segs = state.stages.map((s,i)=>({
    label:s.label,
    value: state.contacts.filter(c=>c.stage===s.id).length,
    color: CHART_COLORS[i%CHART_COLORS.length],
  }));
  renderDonutChart('dashFunnelDonut', segs);
}

function renderAnalyticsCharts(){
  const top = [...state.listings].sort((a,b)=>b.views-a.views).slice(0,5)
    .map((l,i)=>({label:l.title.length>22?l.title.slice(0,22)+'…':l.title, value:l.views, color:CHART_COLORS[i%CHART_COLORS.length]}));
  renderBarChart('listingViewsChart', top, {leftPad:170});

  renderBarChart('leadFunnelChart', [
    {label:'New lead', value:24, color:CHART_COLORS[0]},
    {label:'Contacted', value:18, color:CHART_COLORS[0]},
    {label:'Viewing scheduled', value:11, color:CHART_COLORS[0]},
    {label:'Offer made', value:6, color:CHART_COLORS[0]},
    {label:'Closed', value:3, color:CHART_COLORS[0]},
  ], {leftPad:150});

  renderDonutChart('buyerOriginChart', state.buyerOrigin.map((b,i)=>({label:b.label, value:b.value, color:CHART_COLORS[i%CHART_COLORS.length]})));

  renderBarChart('timeOnMarketChart', [
    {label:'Your portfolio', value:state.timeOnMarket.mine, color:CHART_COLORS[5], suffix:'d'},
    {label:'Platform average', value:state.timeOnMarket.platform, color:'#80868B', suffix:'d'},
  ], {leftPad:120, maxValue:60});
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
/* LISTINGS                                                                */
/* ---------------------------------------------------------------------- */
const statusLabel = {draft:'Draft', active:'Active', offer:'Under offer', sold:'Sold / Rented'};
const statusBadge = {draft:'badge-neutral', active:'badge-active', offer:'badge-pending', sold:'badge-sold'};
const typeIcon = {'Apartment':'ti-building-skyscraper','House / Villa':'ti-home','Penthouse':'ti-building-castle','Studio':'ti-home-2','Land':'ti-map-2'};

function renderListings(){
  const q = (document.getElementById('listingSearch').value||'').toLowerCase();
  const statusFilter = document.getElementById('listingStatusFilter').value;
  const sort = document.getElementById('listingSort').value;

  let list = state.listings.filter(l=>{
    const matchQ = l.title.toLowerCase().includes(q) || l.city.toLowerCase().includes(q);
    const matchS = statusFilter==='all' || l.status===statusFilter;
    return matchQ && matchS;
  });
  if(sort==='views') list.sort((a,b)=>b.views-a.views);
  if(sort==='price') list.sort((a,b)=>b.price-a.price);
  if(sort==='date') list.sort((a,b)=>b.id-a.id);

  const grid = document.getElementById('listingsGrid');
  grid.className = state.listingView==='grid' ? 'grid grid-3' : 'grid grid-2';

  if(list.length===0){
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><i class="ti ti-home-off"></i>No listings match the current filters.</div>`;
    return;
  }

  grid.innerHTML = list.map(l=>`
    <div class="card listing-card hoverable">
      <div class="listing-photo" style="background:${l.grad}">
        <i class="ti ${typeIcon[l.type]||'ti-home'}"></i>
        <span class="badge ${statusBadge[l.status]} ph-badge">${statusLabel[l.status]}</span>
        <span class="ph-views"><i class="ti ti-eye"></i>${l.views}</span>
      </div>
      <div class="listing-body">
        <p class="listing-price">${l.status==='sold' && l.price<1000 ? '€'+l.price+'/mo' : '€'+l.price.toLocaleString('en-US')}</p>
        <p class="listing-addr"><i class="ti ti-map-pin" style="font-size:13px"></i>${l.city}</p>
        <div class="listing-specs">
          <span><i class="ti ti-bed"></i>${l.beds}</span>
          <span><i class="ti ti-bath"></i>${l.baths}</span>
          <span><i class="ti ti-ruler-2"></i>${l.size} m²</span>
        </div>
        <div class="listing-actions">
          <button class="btn-secondary btn-sm" style="flex:1" onclick="editListingDemo(${l.id})"><i class="ti ti-edit"></i>Edit</button>
          <button class="btn-primary btn-sm" style="flex:1" onclick="boostListing(${l.id})"><i class="ti ti-rocket"></i>Boost</button>
        </div>
      </div>
    </div>`).join('');
}
function setListingView(v){
  state.listingView = v;
  document.getElementById('gridViewBtn').style.borderColor = v==='grid' ? 'var(--accent)' : '';
  document.getElementById('listViewBtn').style.borderColor = v==='list' ? 'var(--accent)' : '';
  renderListings();
}
function editListingDemo(id){
  toast('info','Edit listing', 'In the live version, the full edit form for this listing opens here.');
}
function boostListing(id){
  const l = state.listings.find(x=>x.id===id);
  if(!l) return;
  l.lastBoost = 'a few seconds ago';
  toast('success','Listing boosted', `"${l.title}" has been re-boosted to the top of search results.`);
}

/* ---------------------------------------------------------------------- */
/* LISTING WIZARD                                                         */
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
function wizardNav(dir){
  if(dir>0 && state.wizardStep===1){
    if(!document.getElementById('wTitle').value.trim() || !document.getElementById('wSize').value){
      toast('warning','Required fields','Please fill in the listing title and size before continuing.');
      return;
    }
  }
  if(dir>0 && state.wizardStep===2){
    if(!document.getElementById('wCity').value.trim()){
      toast('warning','Missing location','Please fill in the property city.');
      return;
    }
  }
  if(dir>0 && state.wizardStep===4){
    if(!document.getElementById('wPrice').value){
      toast('warning','Missing price','Please enter the property price.');
      return;
    }
  }
  if(dir>0 && state.wizardStep===wizardTotal){
    publishListing();
    return;
  }
  document.getElementById('wizardStep'+state.wizardStep).style.display='none';
  state.wizardStep += dir;
  document.getElementById('wizardStep'+state.wizardStep).style.display='block';
  document.getElementById('wizardBackBtn').style.display = state.wizardStep>1 ? 'inline-flex' : 'none';
  document.getElementById('wizardNextBtn').textContent = state.wizardStep===wizardTotal ? 'Publish listing' : 'Continue';
  renderWizardDots();
}
function simulateUpload(){
  const n = state.uploadedFiles.length + 1;
  const name = `photo-${n}.jpg`;
  state.uploadedFiles.push(name);
  document.getElementById('uploadedFilesList').innerHTML = state.uploadedFiles.map(f=>`
    <div class="flex-between" style="padding:8px 0;border-bottom:1px solid var(--border)">
      <span style="font-size:12.5px;color:var(--text-secondary)"><i class="ti ti-photo" style="margin-right:8px;color:var(--accent)"></i>${f}</span>
      <span class="badge badge-active">Uploaded</span>
    </div>`).join('');
}
function wizardGenerateDesc(){
  const type = document.getElementById('wType').value;
  const city = (document.getElementById('wCity').value || document.getElementById('wZone').value || 'central area');
  const beds = document.getElementById('wBeds').value || '2';
  const tags = Array.from(document.getElementById('wTags').querySelectorAll('.pill.on')).map(p=>p.textContent);
  document.getElementById('wDesc').value = buildDescription(type, city, beds, tags.join(', ') || 'quality finishes');
  toast('success','Description generated','The AI description has been added — feel free to edit it.');
}
function publishListing(){
  const l = {
    id: nextId++,
    title: document.getElementById('wTitle').value.trim(),
    city: document.getElementById('wCity').value.trim() + (document.getElementById('wZone').value ? ', '+document.getElementById('wZone').value : ''),
    type: document.getElementById('wType').value,
    price: Number(document.getElementById('wPrice').value)||0,
    beds: Number(document.getElementById('wBeds').value)||0,
    baths: 1,
    size: Number(document.getElementById('wSize').value)||0,
    status:'active',
    views:0,
    lastBoost:'—',
    tags: Array.from(document.getElementById('wTags').querySelectorAll('.pill.on')).map(p=>p.textContent),
    grad:'#1A73E8',
  };
  state.listings.unshift(l);
  closeModal('modal-add-listing');
  showSection('listings');
  document.getElementById('listingStatusFilter').value='all';
  document.getElementById('listingSearch').value='';
  renderListings();
  updateSidebarCounts();
  toast('success','Listing published', `"${l.title}" is now live on LuciHome.`);
}

/* ---------------------------------------------------------------------- */
/* CRM — KANBAN + CONTACT DETAIL DRAWER                                    */
/* ---------------------------------------------------------------------- */
function renderKanban(){
  const q = (document.getElementById('crmSearch').value||'').toLowerCase();
  const board = document.getElementById('kanbanBoard');
  board.innerHTML = state.stages.map(stage=>{
    const cards = state.contacts.filter(c=>c.stage===stage.id && (c.name.toLowerCase().includes(q) || c.type.toLowerCase().includes(q)));
    return `
    <div class="kcol" data-stage="${stage.id}" ondragover="event.preventDefault();this.classList.add('dragover')" ondragleave="this.classList.remove('dragover')" ondrop="dropCard(event,'${stage.id}')">
      <div class="kcol-head"><span>${stage.label}</span><span class="kcol-count">${cards.length}</span></div>
      ${cards.map(c=>`
        <div class="kcard ${state.selectedContactId===c.id?'selected':''}" draggable="true" ondragstart="dragCard(event,${c.id})" ondragend="this.classList.remove('dragging')" onclick="openContactDetail(${c.id})">
          <p class="kname"><span class="kavatar">${c.initials}</span>${c.name}</p>
          <p class="kmeta">€${c.budget.toLocaleString('en-US')}${c.reminder ? ' · ⏰ '+c.reminder : ''}</p>
          <div class="ktags"><span class="pill">${c.type}</span></div>
        </div>`).join('') || '<p style="font-size:11.5px;color:var(--text-muted);padding:8px 6px">No clients here yet.</p>'}
    </div>`;
  }).join('');
}
let draggedId = null;
function dragCard(e, id){ draggedId = id; e.target.classList.add('dragging'); e.dataTransfer.effectAllowed='move'; }
function dropCard(e, stageId){
  e.preventDefault();
  e.currentTarget.classList.remove('dragover');
  const contact = state.contacts.find(c=>c.id===draggedId);
  if(contact){
    const oldStageLabel = state.stages.find(s=>s.id===contact.stage).label;
    contact.stage = stageId;
    renderKanban();
    updateSidebarCounts();
    const newLabel = state.stages.find(s=>s.id===stageId).label;
    if(oldStageLabel !== newLabel) toast('success','Client moved', `${contact.name} is now in the "${newLabel}" stage.`);
  }
}
function openContactDetail(id){
  const c = state.contacts.find(x=>x.id===id);
  if(!c) return;
  state.selectedContactId = id;
  renderKanban();
  document.getElementById('cdName').textContent = c.name;
  document.getElementById('cdBody').innerHTML = `
    <div class="pill-row" style="margin-bottom:16px">
      <span class="badge badge-info">${c.type}</span>
      <span class="badge badge-neutral">€${c.budget.toLocaleString('en-US')} budget</span>
      <span class="badge badge-active">${state.stages.find(s=>s.id===c.stage).label}</span>
    </div>
    <div class="field"><label class="field-label">Notes</label><textarea class="textarea" id="cdNotes">${c.notes}</textarea></div>
    <div class="field"><label class="field-label">Follow-up reminder</label><input class="input" id="cdReminder" value="${c.reminder||''}" placeholder="e.g. Call back Thursday"></div>
    <p class="section-label" style="margin-top:20px">Activity history</p>
    ${c.activity.map(a=>`<div class="feed-item" style="border:none;padding:8px 0"><div class="fi-icon"><i class="ti ti-clock"></i></div><div class="fi-text"><p>${a.t}</p><span>${a.d}</span></div></div>`).join('')}
  `;
  document.getElementById('contactDrawer').classList.add('open');
  document.getElementById('contactDrawerBackdrop').classList.add('open');
}
function closeContactDrawer(){
  document.getElementById('contactDrawer').classList.remove('open');
  document.getElementById('contactDrawerBackdrop').classList.remove('open');
  if(state.selectedContactId!==null){
    state.selectedContactId = null;
    if(document.getElementById('kanbanBoard')) renderKanban();
  }
}
function saveContactDetail(){
  const c = state.contacts.find(x=>x.id===state.selectedContactId);
  if(c){
    const notesEl = document.getElementById('cdNotes');
    const remEl = document.getElementById('cdReminder');
    if(notesEl) c.notes = notesEl.value;
    if(remEl) c.reminder = remEl.value || null;
    renderKanban();
    renderLeadScores();
  }
  closeContactDrawer();
  toast('success','Saved','Client notes have been updated.');
}
function addContact(){
  const name = document.getElementById('cName').value.trim();
  if(!name){ toast('warning','Missing name','Please enter the contact\'s full name.'); return; }
  const initials = name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
  state.contacts.push({
    id: nextId++, name, initials,
    budget: Number(document.getElementById('cBudget').value)||0,
    type: document.getElementById('cType').value,
    stage:'new',
    notes: document.getElementById('cNotes').value || 'No notes yet.',
    activity:[{d:'today', t:'Contact added manually to CRM'}],
    reminder:null,
  });
  ['cName','cEmail','cPhone','cBudget','cNotes'].forEach(id=>document.getElementById(id).value='');
  closeModal('modal-add-contact');
  showSection('crm');
  renderKanban();
  updateSidebarCounts();
  toast('success','Contact added', `${name} has been added to the "New Lead" stage.`);
}

/* ---------------------------------------------------------------------- */
/* TRANSACTIONS                                                            */
/* ---------------------------------------------------------------------- */
function renderTx(){
  const list = document.getElementById('txList');
  list.innerHTML = state.transactions.map(t=>`
    <div class="list-row ${state.currentTxId===t.id?'selected':''}" onclick="openDealRoom(${t.id})">
      <div class="fi-icon"><i class="ti ti-file-invoice"></i></div>
      <div style="min-width:0;flex:1">
        <p class="lr-title">${t.property}</p>
        <p class="lr-sub">${t.buyer} → ${t.seller}</p>
      </div>
      <span class="badge badge-info">${state.txStages[t.stage]}</span>
    </div>`).join('');

  const arch = document.getElementById('txArchive');
  arch.innerHTML = `<div class="section-label">Closed transactions</div><div class="grid grid-3">` +
    state.archivedTx.map(t=>`
    <div class="card">
      <i class="ti ti-archive mi"></i>
      <p class="mt">${t.property}</p>
      <p class="ms">Buyer: ${t.buyer}<br>Seller: ${t.seller}</p>
      <p class="ms" style="margin-top:6px">Commission earned: <strong style="color:var(--text-primary)">€${t.commission.toLocaleString('en-US')}</strong></p>
      <span class="badge badge-sold" style="margin-top:8px">Completed — ${t.closedOn}</span>
    </div>`).join('') + `</div>`;

  if(state.currentTxId) openDealRoom(state.currentTxId, true);
}
function toggleArchive(){
  state.archiveVisible = !state.archiveVisible;
  document.getElementById('txArchive').style.display = state.archiveVisible ? 'block' : 'none';
  document.getElementById('archiveBtnLabel').textContent = state.archiveVisible ? 'Hide archive' : 'Closed transactions archive';
}
function openDealRoom(id, silent){
  state.currentTxId = id;
  const t = state.transactions.find(x=>x.id===id);
  if(!t) return;
  if(!silent) renderTx();
  const room = document.getElementById('dealRoom');
  room.innerHTML = `
    <div class="flex-between" style="margin-bottom:6px">
      <p class="mt" style="font-size:16px">${t.property}</p>
      <button class="btn-primary btn-sm" onclick="advanceStage(${t.id})" ${t.stage>=state.txStages.length-1?'disabled':''}>
        <i class="ti ti-arrow-right"></i>Advance stage
      </button>
    </div>
    <div class="stepper">
      ${state.txStages.map((s,i)=>`
        <div class="step ${i<t.stage?'done':i===t.stage?'current':''}">
          <div class="sline"></div>
          <div class="sdot">${i<t.stage?'<i class=\"ti ti-check\"></i>':(i+1)}</div>
          <div class="slabel">${s}</div>
        </div>`).join('')}
    </div>
    <div class="grid grid-12">
      <div class="span-8">
        <p class="section-label" style="margin-top:0">Document vault</p>
        <div id="txDocsList">${t.docs.map(d=>`<div class="flex-between" style="padding:8px 0;border-bottom:1px solid var(--border)"><span style="font-size:12.5px"><i class="ti ti-file-text" style="margin-right:8px;color:var(--accent)"></i>${d}</span><button class="btn-ghost btn-sm" onclick="toast('info','E-signature','A signature request has been sent to all parties.')"><i class="ti ti-signature"></i>Request signature</button></div>`).join('')}</div>
        <button class="btn-secondary btn-sm" style="margin-top:10px" onclick="uploadTxDoc(${t.id})"><i class="ti ti-upload"></i>Upload document</button>

        <p class="section-label">Closing checklist</p>
        <div id="txChecklist">${t.checklist.map((c,i)=>`
          <div class="chk-row ${c.done?'done':''}">
            <input type="checkbox" id="chk-${t.id}-${i}" ${c.done?'checked':''} onchange="toggleChecklist(${t.id},${i})">
            <label for="chk-${t.id}-${i}">${c.t}</label>
          </div>`).join('')}</div>
      </div>
      <div class="span-4">
        <div class="mini-stat" style="margin-bottom:10px"><p class="v">€${t.commission.toLocaleString('en-US')}</p><p class="l">Commission — ${t.commissionStatus}</p></div>
        <div class="alert alert-warning"><i class="ti ti-bell"></i>Deadline approaching for filing documents with the notary.</div>
        <p class="section-label" style="margin-top:0">Multi-party access</p>
        <div class="pill-row">
          <span class="pill on">Agent (you)</span><span class="pill on">Buyer</span><span class="pill on">Seller</span>
          <span class="pill clickable" onclick="toast('success','Invitation sent','The notary has been invited into the deal room.')">+ Invite notary</span>
          <span class="pill clickable" onclick="toast('success','Invitation sent','The lawyer has been invited into the deal room.')">+ Invite lawyer</span>
        </div>
      </div>
    </div>
  `;
}
function advanceStage(id){
  const t = state.transactions.find(x=>x.id===id);
  if(!t || t.stage>=state.txStages.length-1) return;
  t.stage++;
  openDealRoom(id);
  toast('success','Stage advanced', `"${t.property}" is now in the "${state.txStages[t.stage]}" stage.`);
  if(t.stage===state.txStages.length-1){
    toast('info','Almost there','Last step remaining: mark the transaction as completed from the archive.');
  }
}
function toggleChecklist(txId, idx){
  const t = state.transactions.find(x=>x.id===txId);
  t.checklist[idx].done = !t.checklist[idx].done;
  openDealRoom(txId);
}
function uploadTxDoc(txId){
  const t = state.transactions.find(x=>x.id===txId);
  t.docs.push(`additional-document-${t.docs.length+1}.pdf`);
  openDealRoom(txId);
  toast('success','Document uploaded','The document has been added to the transaction vault.');
}

/* ---------------------------------------------------------------------- */
/* REFERRALS                                                               */
/* ---------------------------------------------------------------------- */
function populateReferralClients(){
  const sel = document.getElementById('rClient');
  sel.innerHTML = state.contacts.map(c=>`<option value="${c.id}">${c.name} (${c.type})</option>`).join('');
}
function renderReferrals(){
  document.getElementById('refSentCount').textContent = state.sentReferrals.length;
  document.getElementById('refReceivedCount').textContent = state.receivedReferrals.length;
  const inProgress = [...state.sentReferrals, ...state.receivedReferrals].filter(r=>r.status==='accepted' || r.status==='pending').length;
  document.getElementById('refProgressCount').textContent = inProgress;
  document.getElementById('refClosedCount').textContent = [...state.sentReferrals, ...state.receivedReferrals].filter(r=>r.status==='closed').length;

  const statusMap = {pending:['badge-pending','Pending'], accepted:['badge-info','Accepted'], declined:['badge-danger','Declined'], closed:['badge-sold','Closed']};

  document.getElementById('sentReferralsList').innerHTML = state.sentReferrals.map(r=>`
    <div class="card">
      <div class="flex-between"><p class="mt">${r.client}</p><span class="badge ${statusMap[r.status][0]}">${statusMap[r.status][1]}</span></div>
      <p class="ms">Market: ${r.market}<br>Partner agent: ${r.agent}<br>Agreed commission: ${r.pct}%</p>
    </div>`).join('') || '<div class="empty-state"><i class="ti ti-send-off"></i>You haven\'t sent any referrals yet.</div>';

  document.getElementById('receivedReferralsList').innerHTML = state.receivedReferrals.map(r=>`
    <div class="card">
      <div class="flex-between"><p class="mt">${r.client}</p><span class="badge ${statusMap[r.status][0]}">${statusMap[r.status][1]}</span></div>
      <p class="ms">From: ${r.agent}<br>Client budget: €${r.budget.toLocaleString('en-US')}<br>${r.notes}</p>
      ${r.status==='pending' ? `<div class="listing-actions" style="margin-top:10px">
        <button class="btn-secondary btn-sm" style="flex:1" onclick="declineReferral(${r.id})">Decline</button>
        <button class="btn-primary btn-sm" style="flex:1" onclick="acceptReferral(${r.id})">Accept</button>
      </div>` : ''}
    </div>`).join('') || '<div class="empty-state"><i class="ti ti-inbox"></i>You haven\'t received any referrals yet.</div>';

  document.getElementById('partnersList').innerHTML = state.partners.map(p=>`
    <div class="card pro-card">
      <div class="pro-head">
        <div class="avatar-circle">${p.name.split(' ').map(w=>w[0]).slice(0,2).join('')}</div>
        <div><p class="n">${p.name}</p><p class="r">${p.agency}</p></div>
      </div>
      <p class="ms">${p.market} · ${p.lang}</p>
      <p class="stars">★★★★★ <span style="color:var(--text-muted);font-size:11px">${p.rating}</span></p>
      <button class="btn-secondary btn-sm btn-block" onclick="togglePreferred(${p.id})"><i class="ti ${p.preferred?'ti-star-filled':'ti-star'}"></i>${p.preferred?'Preferred partner':'Add to preferred'}</button>
    </div>`).join('');
}
function acceptReferral(id){
  const r = state.receivedReferrals.find(x=>x.id===id);
  r.status='accepted';
  state.contacts.push({id:nextId++, name:r.client, initials:r.client.split(' ').map(w=>w[0]).slice(0,2).join(''), budget:r.budget, type:'Buyer', stage:'new', notes:'Client sourced from an international referral: '+r.notes, activity:[{d:'today', t:'Referral accepted and added to CRM'}], reminder:'First contact within 48h'});
  renderReferrals();
  renderKanban();
  updateSidebarCounts();
  toast('success','Referral accepted', `${r.client} has been automatically added to your CRM.`);
}
function declineReferral(id){
  const r = state.receivedReferrals.find(x=>x.id===id);
  r.status='declined';
  renderReferrals();
  toast('info','Referral declined','The referring agent has been notified.');
}
function togglePreferred(id){
  const p = state.partners.find(x=>x.id===id);
  p.preferred = !p.preferred;
  renderReferrals();
}
function sendReferral(){
  const clientId = Number(document.getElementById('rClient').value);
  const client = state.contacts.find(c=>c.id===clientId);
  state.sentReferrals.unshift({
    id: nextId++,
    client: client ? client.name : 'Selected client',
    market: document.getElementById('rMarket').value,
    agent: document.getElementById('rAgent').value || 'LuciHome partner agent',
    pct: Number(document.getElementById('rPct').value),
    status:'pending',
  });
  closeModal('modal-send-referral');
  showSection('referrals');
  switchTab('referrals','referrals-sent');
  document.querySelector('.tab-btn[data-tab="referrals-sent"]').classList.add('active');
  renderReferrals();
  toast('success','Referral sent', 'The partner agent has been notified and will respond soon.');
}

/* ---------------------------------------------------------------------- */
/* AI TOOLS                                                                */
/* ---------------------------------------------------------------------- */
function buildDescription(type, city, beds, features){
  const openers = [
    `Introducing a ${type.toLowerCase()} located in ${city}, ideal for those seeking comfort and elegance.`,
    `Discover this remarkable ${type.toLowerCase()} in ${city}, designed for a relaxed and refined lifestyle.`,
  ];
  const opener = openers[Math.floor(Math.random()*openers.length)];
  return `${opener} The space offers ${beds} generous rooms, natural light throughout the day, and an efficient layout designed for families or busy professionals.

Highlights include: ${features}. The area offers easy access to public transport, shops, schools, and parks, making it one of the most sought-after in ${city.split(',')[0]}.

The property is available for immediate viewing — contact me to schedule a visit or for more details on financing and the purchase process.`;
}
function generateDescription(){
  const loading = document.getElementById('descLoading');
  const output = document.getElementById('descOutput');
  loading.style.display='block';
  output.style.display='none';
  setTimeout(()=>{
    const type = document.getElementById('descType').value;
    const city = document.getElementById('descCity').value || 'central area';
    const beds = document.getElementById('descBeds').value || '2';
    const features = document.getElementById('descFeatures').value || 'quality finishes';
    output.value = buildDescription(type, city, beds, features);
    loading.style.display='none';
    output.style.display='block';
    toast('success','Description generated','Feel free to edit the text before publishing.');
  }, 900);
}
function copyText(id){
  const el = document.getElementById(id);
  el.select();
  try{ document.execCommand('copy'); }catch(e){}
  if(navigator.clipboard){ navigator.clipboard.writeText(el.value).catch(()=>{}); }
  toast('success','Copied','The text has been copied to your clipboard.');
}

function generateValuation(){
  const size = Number(document.getElementById('valSize').value)||70;
  const beds = Number(document.getElementById('valBeds').value)||2;
  const condition = document.getElementById('valCondition').value;
  const city = document.getElementById('valCity').value || 'the selected area';
  let base = 1900;
  if(condition.includes('New')) base = 2300;
  if(condition.includes('renovation')) base = 1500;
  const mid = Math.round(size*base/1000)*1000 + beds*4000;
  const low = Math.round(mid*0.92/1000)*1000;
  const high = Math.round(mid*1.08/1000)*1000;
  document.getElementById('valResultCard').innerHTML = `
    <p class="mt">Estimate result</p>
    <p class="stat-card value" style="font-size:30px;margin:6px 0">€${low.toLocaleString('en-US')} – €${high.toLocaleString('en-US')}</p>
    <p class="ms" style="margin-bottom:14px">~78% confidence range, based on ${size} m² in ${city} and "${condition}" condition.</p>
    <p class="section-label" style="margin-top:0">Comparable properties</p>
    <div class="feed-item" style="border:none;padding:6px 0"><div class="fi-icon"><i class="ti ti-home"></i></div><div class="fi-text"><p>Similar apartment, same area — €${(mid-6000).toLocaleString('en-US')}</p><span>Sold 3 weeks ago</span></div></div>
    <div class="feed-item" style="border:none;padding:6px 0"><div class="fi-icon"><i class="ti ti-home"></i></div><div class="fi-text"><p>Comparable property — €${(mid+9000).toLocaleString('en-US')}</p><span>Active for 12 days</span></div></div>
    <div class="feed-item" style="border:none;padding:6px 0"><div class="fi-icon"><i class="ti ti-home"></i></div><div class="fi-text"><p>Comparable property — €${(mid-2000).toLocaleString('en-US')}</p><span>Sold 6 weeks ago</span></div></div>
  `;
  toast('success','Estimate generated','The valuation has been calculated based on the data you entered.');
}

const translations = {
  ro: "Apartament luminos cu 3 camere, vedere la parc, complet renovat, disponibil pentru vizionare în acest weekend.",
  fr: "Appartement lumineux de 3 chambres avec vue sur le parc, entièrement rénové, disponible pour une visite ce week-end.",
  de: "Helle 3-Zimmer-Wohnung mit Parkblick, komplett renoviert, diese Woche zur Besichtigung verfügbar.",
  es: "Luminoso apartamento de 3 habitaciones con vistas al parque, totalmente renovado, disponible para visitas este fin de semana.",
  ar: "شقة مضيئة من 3 غرف مع إطلالة على الحديقة، تم تجديدها بالكامل، متاحة للمعاينة نهاية هذا الأسبوع.",
};
function generateTranslation(){
  const lang = document.getElementById('translateLang').value;
  const input = document.getElementById('translateInput').value.trim();
  const defaultText = "Bright 3-bedroom apartment with park views, fully renovated, available for viewing this weekend.";
  const output = document.getElementById('translateOutput');
  if(input === defaultText){
    output.value = translations[lang];
  } else {
    output.value = `[Demo] Simulated translation into the selected language — in a live environment, the text above would be fully and accurately translated by the LuciHome AI model:\n\n"${input}"`;
  }
  toast('success','Text translated','The translation has been generated.');
}

function computeLeadScore(c){
  let score = 5;
  if(c.stage==='offer') score += 3;
  if(c.stage==='viewing') score += 2;
  if(c.stage==='contacted') score += 1;
  if(c.budget>300000) score += 1;
  if(c.reminder) score += 1;
  return Math.min(10, score);
}
function renderLeadScores(){
  const body = document.getElementById('leadScoreBody');
  const rows = state.contacts.filter(c=>c.stage!=='closed').map(c=>{
    const score = computeLeadScore(c);
    const color = score>=8 ? '#188038' : score>=5 ? '#F29900' : '#D93025';
    return `<tr>
      <td class="strong">${c.name}</td>
      <td>€${c.budget.toLocaleString('en-US')}</td>
      <td>${state.stages.find(s=>s.id===c.stage).label}</td>
      <td><span class="score-bar"><span class="score-fill" style="width:${score*10}%;background:${color}"></span></span>${score}/10</td>
      <td><button class="btn-ghost btn-sm" onclick="showSection('crm');openContactDetail(${c.id})">Open</button></td>
    </tr>`;
  }).sort().reverse().join('');
  body.innerHTML = rows;
}

const homyAnswers = [
  {keys:['french','france','300k','300,000'], a:'Based on LuciHome data, French buyers under €300,000 show the strongest interest in Bucharest (Herastrau and Pipera areas) and Cluj-Napoca — average conversion time is 34 days.'},
  {keys:['underperform','weak','my listings'], a:'"4-bedroom house, Grigorescu" is still in draft and hasn\'t generated any views — publish it to appear in search results. "Old Town Studio" has already sold, so it can be archived.'},
  {keys:['commission','referral'], a:'The standard referral commission on LuciHome is between 20% and 25% of the receiving agent\'s commission — configurable per referral, agreed in writing on the platform.'},
];
function homyReply(question){
  const q = question.toLowerCase();
  const match = homyAnswers.find(a=>a.keys.some(k=>q.includes(k)));
  return match ? match.a : 'Good question! Based on your portfolio data, I\'d recommend checking the Analytics section for detailed figures, or give me a few more details so I can help you more precisely.';
}
function appendChat(role, text){
  const box = document.getElementById('homyChat');
  const el = document.createElement('div');
  el.className = 'chat-msg ' + role;
  el.textContent = text;
  box.appendChild(el);
  box.scrollTop = box.scrollHeight;
}
function askHomy(){
  const input = document.getElementById('homyInput');
  const q = input.value.trim();
  if(!q) return;
  appendChat('user', q);
  input.value='';
  setTimeout(()=>appendChat('bot', homyReply(q)), 500);
}
function askHomyPreset(btn){
  document.getElementById('homyInput').value = btn.textContent;
  askHomy();
}

/* ---------------------------------------------------------------------- */
/* NETWORK                                                                 */
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
function renderDevProjects(){
  document.getElementById('devProjectsGrid').innerHTML = state.devProjects.map(d=>`
    <div class="card">
      <i class="ti ti-building mi"></i>
      <p class="mt">${d.name}</p>
      <p class="ms">${d.location}</p>
      <p class="ms" style="margin-top:6px">${d.desc}</p>
      <button class="btn-${d.applied?'secondary':'primary'} btn-sm" style="margin-top:12px" onclick="applyProject(${d.id})" ${d.applied?'disabled':''}>${d.applied?'Application sent ✓':'Apply as authorized agent'}</button>
    </div>`).join('');
}
function applyProject(id){
  const d = state.devProjects.find(x=>x.id===id);
  d.applied = true;
  renderDevProjects();
  toast('success','Application sent', `You've applied for "${d.name}" — the developer will respond soon.`);
}
function renderMarketGroups(){
  document.getElementById('marketGroupsGrid').innerHTML = state.marketGroups.map(g=>`
    <div class="card">
      <i class="ti ti-world mi"></i>
      <p class="mt">${g.name}</p>
      <p class="ms">${g.members} members</p>
      <p class="ms" style="margin-top:6px">${g.desc}</p>
      <button class="btn-${g.joined?'secondary':'primary'} btn-sm" style="margin-top:12px" onclick="toggleGroup(${g.id})">${g.joined?'Member ✓':'Join'}</button>
    </div>`).join('');
}
function toggleGroup(id){
  const g = state.marketGroups.find(x=>x.id===id);
  g.joined = !g.joined;
  if(g.joined) g.members++; else g.members--;
  renderMarketGroups();
}

/* ---------------------------------------------------------------------- */
/* PROFILE                                                                 */
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
/* ANALYTICS — export                                                      */
/* ---------------------------------------------------------------------- */
function exportReport(){
  const lines = [
    'LuciHome — Agent Performance Report',
    'Agent: Alexandra Ionescu',
    'Generated: ' + new Date().toLocaleDateString('en-US'),
    '',
    'Active listings: ' + state.listings.filter(l=>l.status==='active').length,
    'Active clients: ' + state.contacts.filter(c=>c.stage!=='closed').length,
    'Open transactions: ' + state.transactions.length,
    'Commission earned: €14,200',
    'Commission pending: €6,800',
    'Commission projected: €27,400',
    '',
    'Top listings by views:',
    ...state.listings.sort((a,b)=>b.views-a.views).slice(0,5).map(l=>`  - ${l.title} (${l.views} views)`),
  ];
  downloadFile('lucihome-report.txt', lines.join('\n'));
  toast('success','Report exported','The file lucihome-report.txt has been downloaded.');
}
function exportAccountData(){
  const data = {
    agent:{name:'Alexandra Ionescu', email:'office@lucihome.com'},
    listings: state.listings,
    contacts: state.contacts,
    transactions: state.transactions,
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
  const activeListings = state.listings.filter(l=>l.status==='active'||l.status==='offer').length;
  const activeLeads = state.contacts.filter(c=>c.stage!=='closed').length;
  document.querySelector('.nav-item[data-section="listings"] .nbadge').textContent = activeListings;
  document.querySelector('.nav-item[data-section="crm"] .nbadge').textContent = activeLeads;
  document.querySelector('.nav-item[data-section="transactions"] .nbadge').textContent = state.transactions.length;
}

/* ---------------------------------------------------------------------- */
/* INIT                                                                    */
/* ---------------------------------------------------------------------- */
function init(){
  renderFeed();
  renderAgenda();
  renderDashboardCharts();
  renderListings();
  renderKanban();
  renderTx();
  renderReferrals();
  renderLeadScores();
  renderDirectory();
  renderDevProjects();
  renderMarketGroups();
  renderAnalyticsCharts();
  updateSidebarCounts();
  appendChat('bot', "Hi, Alexandra! I'm Homy, your AI assistant. Ask me anything about the market, your clients, or your listings.");

  document.getElementById('globalSearch').addEventListener('keydown', e=>{
    if(e.key==='Enter' && e.target.value.trim()){
      showSection('listings');
      document.getElementById('listingSearch').value = e.target.value;
      renderListings();
      toast('info','Search','Listings have been filtered based on your search.');
    }
  });
}
document.addEventListener('DOMContentLoaded', init);
