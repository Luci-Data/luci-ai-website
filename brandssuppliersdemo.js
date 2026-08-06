/* ==========================================================================
   LuciHome — Brand & Supplier Workspace Demo
   Interaction layer: Gmail-style quick-create menu, a slide-over quote
   request detail drawer, and a small dependency-free SVG chart engine
   (line, bar, donut) used across the Dashboard and Analytics sections.
   ========================================================================== */

let nextId = 1000;
const CHART_COLORS = ['#1A73E8','#12B5CB','#F29900','#D93025','#9334E6','#188038'];

const state = {

  feed: [
    {id:1, icon:'ti-file-plus', text:'<strong>Nordic Retail Group</strong> submitted a new quote request for the "Kario Modular Sofa".', time:'18 min ago', read:false},
    {id:2, icon:'ti-eye', text:'The <strong>"Aria Pendant Light"</strong> product passed 300 views.', time:'1 h ago', read:false},
    {id:3, icon:'ti-signature', text:'<strong>Marchetti Home Stores</strong> confirmed the spring restock order.', time:'3 h ago', read:false},
    {id:4, icon:'ti-arrows-exchange', text:'New referral received from <strong>Atelier Nord</strong>.', time:'yesterday, 5:40 PM', read:false},
    {id:5, icon:'ti-message-dots', text:'<strong>Urban Nest Design Studio</strong> replied to your message about the Kario collection.', time:'yesterday, 11:05 AM', read:true},
    {id:6, icon:'ti-package', text:'The <strong>"Nova Dining Table"</strong> was marked as discontinued.', time:'2 days ago', read:true},
  ],

  agenda: [
    {time:'09:00', text:'Call with Nordic Retail Group — lead time clarification', sub:'Phone · 15 min', done:false},
    {time:'11:30', text:'Sample review — Terra Outdoor Lounge Set', sub:'With Casa Bella Hospitality', done:false},
    {time:'14:00', text:'Deadline — send revised quote', sub:'Vantage Distributors order', done:false},
    {time:'16:30', text:'Follow-up — Urban Nest Design Studio', sub:'Sent Tuesday, awaiting reply', done:true},
  ],

  weekTrend:{
    labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    views:[140,165,150,190,210,175,230],
    leads:[1,2,1,3,2,1,3],
  },

  products: [
    {id:1, title:'Kario Modular Sofa', category:'Living Room', sku:'LMR-SOF-014', price:890, moq:4, leadTime:28, country:'Romania', status:'active', views:412, lastPromoted:'4 days ago', tags:['Bestseller','In stock'], grad:'#1A73E8'},
    {id:2, title:'Aria Pendant Light', category:'Lighting', sku:'LGT-PND-007', price:145, moq:10, leadTime:18, country:'Romania', status:'active', views:318, lastPromoted:'9 days ago', tags:['Dimmable','Brass finish'], grad:'#12B5CB'},
    {id:3, title:'Terra Outdoor Lounge Set', category:'Outdoor', sku:'OUT-LNG-002', price:1240, moq:2, leadTime:35, country:'Romania', status:'limited', views:241, lastPromoted:'15 days ago', tags:['Weatherproof','Modular'], grad:'#9334E6'},
    {id:4, title:'Nova Dining Table', category:'Dining', sku:'DIN-TBL-021', price:680, moq:6, leadTime:30, country:'Romania', status:'discontinued', views:168, lastPromoted:'30 days ago', tags:['Solid oak'], grad:'#80868B'},
    {id:5, title:'Wisp Table Lamp', category:'Kids & Nursery', sku:'KID-LMP-009', price:58, moq:20, leadTime:14, country:'Romania', status:'draft', views:0, lastPromoted:'—', tags:['Nightlight mode'], grad:'#80868B'},
    {id:6, title:'Elba Lounge Chair', category:'Living Room', sku:'LMR-CHR-033', price:410, moq:4, leadTime:21, country:'Romania', status:'active', views:96, lastPromoted:'1 day ago', tags:['Boucle','Swivel base'], grad:'#188038'},
  ],
  productView:'grid',

  collections: [
    {id:1, name:'Living Room Collection', count:18, status:'published', grad:'#1A73E8', desc:'Sofas, armchairs, and coffee tables built for everyday comfort.'},
    {id:2, name:'Lighting Collection', count:24, status:'published', grad:'#12B5CB', desc:'Pendants, floor lamps, and wall sconces across every finish.'},
    {id:3, name:'Outdoor Collection', count:9, status:'draft', grad:'#9334E6', desc:'Weatherproof lounge and dining sets for terraces and gardens.'},
    {id:4, name:'Dining Collection', count:12, status:'published', grad:'#F29900', desc:'Tables, chairs, and sideboards in solid wood and veneer.'},
    {id:5, name:'Kids & Nursery Collection', count:6, status:'draft', grad:'#188038', desc:'Soft-form furniture and lighting designed for children\'s rooms.'},
  ],

  contacts: [
    {id:1, name:'Nordic Retail Group', initials:'NR', budget:18400, type:'Retailer', stage:'reviewing', notes:'Interested in restocking the Kario collection for 6 store locations.', activity:[{d:'Jul 8','t':'Quote request came in from the Kario Sofa listing'},{d:'Jul 9','t':'First call — interested, requested a volume discount'}], reminder:'Call back Friday'},
    {id:2, name:'Casa Bella Hospitality', budget:42000, initials:'CB', type:'Hospitality', stage:'negotiation', notes:'Ordering furniture for a 40-room refurbishment.', activity:[{d:'Jul 2','t':'Signed the initial project brief'},{d:'Jul 10','t':'Requested a revised quote with expedited shipping'}], reminder:'Send revised quote Friday'},
    {id:3, name:'Urban Nest Design Studio', initials:'UN', budget:9600, type:'Interior Designer', stage:'new', notes:'Interested in the Kario collection for a residential client project.', activity:[{d:'Jul 11','t':'New inquiry from the contact form'}], reminder:null},
    {id:4, name:'Vantage Distributors', initials:'VD', budget:65000, type:'Distributor', stage:'quoted', notes:'Evaluating Loomora as a new supplier for their regional catalog.', activity:[{d:'Jul 5','t':'Contacted by phone'},{d:'Jul 9','t':'Quote sent for the Winter catalog order'}], reminder:'Confirm quote validity'},
    {id:5, name:'Marchetti Home Stores', initials:'MH', budget:27500, type:'Retailer', stage:'confirmed', notes:'Order confirmed for spring restock — completed.', activity:[{d:'Jun 20','t':'Quote accepted'},{d:'Jun 30','t':'Order confirmed and moved to fulfillment'}], reminder:null},
    {id:6, name:'GreenLeaf Contract Furnishing', initials:'GC', budget:15200, type:'Contractor', stage:'new', notes:'Sourcing furniture for a co-working space fit-out.', activity:[{d:'Jul 10','t':'Message received via the platform'}], reminder:'Reply with catalog PDF'},
  ],
  stages: [
    {id:'new', label:'New Request'},
    {id:'reviewing', label:'Under Review'},
    {id:'quoted', label:'Quoted'},
    {id:'negotiation', label:'Negotiation'},
    {id:'confirmed', label:'Confirmed'},
  ],

  transactions: [
    {id:1, property:'Q3 Restock Order', buyer:'Nordic Retail Group', seller:'Loomora Furnishings', stage:1, commission:18400, commissionStatus:'Pending',
      docs:['Purchase order.pdf','Production schedule.pdf'], checklist:[{t:'Deposit received', done:true},{t:'Production started', done:true},{t:'Quality check scheduled', done:false},{t:'Shipping booked', done:false}]},
    {id:2, property:'40-Room Refurbishment', buyer:'Casa Bella Hospitality', seller:'Loomora Furnishings', stage:3, commission:42000, commissionStatus:'Pending',
      docs:['Sales contract.pdf','Packing list.pdf','Certificate of origin.pdf'], checklist:[{t:'Deposit received', done:true},{t:'Production complete', done:true},{t:'Quality check passed', done:true},{t:'Shipping booked', done:true},{t:'Installation confirmed', done:false}]},
    {id:3, property:'Winter Catalog Order', buyer:'Vantage Distributors', seller:'Loomora Furnishings', stage:0, commission:65000, commissionStatus:'Projected',
      docs:['Signed PO.pdf'], checklist:[{t:'Deposit received', done:false},{t:'Production started', done:false},{t:'Quality check scheduled', done:false},{t:'Shipping booked', done:false}]},
  ],
  archivedTx:[
    {id:99, property:'Spring Restock Order', buyer:'Marchetti Home Stores', seller:'Loomora Furnishings', commission:27500, closedOn:'June 28, 2026'}
  ],
  txStages:['Order Confirmed','Production','Quality Check','Shipping','Delivered','Installed'],
  currentTxId:1,
  archiveVisible:false,

  sentReferrals:[
    {id:1, client:'Urban Nest Design Studio', market:'Paris, France', agent:'Atelier Nord — Paris Design Supply', pct:22, status:'pending'},
    {id:2, client:'Marchetti Home Stores (past client)', market:'Dubai, UAE', agent:'Vantage Distributors — Dubai', pct:20, status:'closed'},
  ],
  receivedReferrals:[
    {id:1, client:'Marc Dubois Home (French retailer)', market:'Bucharest, Romania', agent:'Atelier Nord — Paris', pct:22, status:'pending', budget:28000, notes:'Looking for a modular sofa range, available to place a trial order in August.'},
    {id:2, client:'Al-Sayed Interiors', market:'Bucharest, Romania', agent:'Dubai partner network', pct:20, status:'pending', budget:45000, notes:'Boutique hotel group, interested in premium outdoor furniture with volume pricing.'},
  ],

  directory:[
    {id:1, name:'Atelier Nord', type:'Retailer', market:'Paris, France', lang:'FR / EN', rating:4.9, connected:true},
    {id:2, name:'Vantage Distributors', type:'Distributor', market:'Dubai, UAE', lang:'AR / EN', rating:4.8, connected:true},
    {id:3, name:'Urban Nest Design Studio', type:'Interior Designer', market:'Bucharest, Romania', lang:'RO / EN', rating:4.7, connected:false},
    {id:4, name:'GreenLeaf Contract Furnishing', type:'Contractor', market:'Bucharest, Romania', lang:'RO / EN', rating:4.6, connected:false},
    {id:5, name:'Skyline Freight Solutions', type:'Freight Forwarder', market:'Constanta, Romania', lang:'RO / EN', rating:4.5, connected:false},
    {id:6, name:'Marchetti Home Stores', type:'Retailer', market:'Milan, Italy', lang:'IT / EN', rating:4.7, connected:true},
    {id:7, name:'Nordic Retail Group', type:'Retailer', market:'Oslo, Norway', lang:'NO / EN', rating:4.8, connected:true},
    {id:8, name:'Iberia Home Distribution', type:'Distributor', market:'Barcelona, Spain', lang:'ES / EN', rating:4.6, connected:false},
    {id:9, name:'Bright Line Interiors', type:'Interior Designer', market:'Cluj-Napoca, Romania', lang:'RO / EN', rating:4.6, connected:false},
  ],

  devProjects:[
    {id:1, name:'Premium Dealer Program', location:'Nationwide, Romania', desc:'Exclusive pricing and marketing support for authorized Loomora dealers.', applied:false},
    {id:2, name:'Hospitality Supply Partner Network', location:'EU-wide', desc:'A dedicated program for hospitality groups sourcing furniture at scale — priority production slots.', applied:false},
    {id:3, name:'Sustainable Sourcing Certification', location:'Global', desc:'Certify your supply chain against Loomora sustainability standards for a marketing badge.', applied:true},
  ],

  marketGroups:[
    {id:1, name:'Nordic Trade Circle', members:342, joined:false, desc:'A network of active retailers and distributors in the Nordic market.'},
    {id:2, name:'Paris Design Network', members:198, joined:true, desc:'A group dedicated to premium furniture buyers in Paris and Île-de-France.'},
    {id:3, name:'GCC Hospitality Buyers', members:126, joined:false, desc:'Hospitality groups and procurement teams focused on the Gulf market.'},
    {id:4, name:'Bucharest Trade Partners', members:271, joined:false, desc:'A community focused on the Bucharest retail and contract furnishing market.'},
  ],

  buyerOrigin:[
    {label:'Retailers', value:42}, {label:'Distributors', value:24}, {label:'Designers', value:18}, {label:'Hospitality', value:10}, {label:'Other', value:6},
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
  if(id==='modal-add-product') resetWizard();
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
    {name:'Product views', color:'#1A73E8', values:state.weekTrend.views},
    {name:'New quote requests (×20 scale)', color:'#12B5CB', values:state.weekTrend.leads.map(v=>v*20)},
  ], state.weekTrend.labels);

  const segs = state.stages.map((s,i)=>({
    label:s.label,
    value: state.contacts.filter(c=>c.stage===s.id).length,
    color: CHART_COLORS[i%CHART_COLORS.length],
  }));
  renderDonutChart('dashFunnelDonut', segs);
}

function renderAnalyticsCharts(){
  const top = [...state.products].sort((a,b)=>b.views-a.views).slice(0,5)
    .map((p,i)=>({label:p.title.length>22?p.title.slice(0,22)+'…':p.title, value:p.views, color:CHART_COLORS[i%CHART_COLORS.length]}));
  renderBarChart('listingViewsChart', top, {leftPad:170});

  renderBarChart('leadFunnelChart', [
    {label:'New request', value:24, color:CHART_COLORS[0]},
    {label:'Under review', value:18, color:CHART_COLORS[0]},
    {label:'Quoted', value:11, color:CHART_COLORS[0]},
    {label:'Negotiation', value:6, color:CHART_COLORS[0]},
    {label:'Confirmed', value:3, color:CHART_COLORS[0]},
  ], {leftPad:150});

  renderDonutChart('buyerOriginChart', state.buyerOrigin.map((b,i)=>({label:b.label, value:b.value, color:CHART_COLORS[i%CHART_COLORS.length]})));

  renderBarChart('timeOnMarketChart', [
    {label:'Your fulfillment', value:state.timeOnMarket.mine, color:CHART_COLORS[5], suffix:'d'},
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
/* CATALOG — collections                                                   */
/* ---------------------------------------------------------------------- */
const collectionStatusLabel = {draft:'Draft', published:'Published'};
const collectionStatusBadge = {draft:'badge-neutral', published:'badge-active'};

function renderCollections(){
  const q = (document.getElementById('collectionSearch').value||'').toLowerCase();
  const statusFilter = document.getElementById('collectionStatusFilter').value;
  const list = state.collections.filter(c=>{
    const matchQ = c.name.toLowerCase().includes(q);
    const matchS = statusFilter==='all' || c.status===statusFilter;
    return matchQ && matchS;
  });
  const grid = document.getElementById('collectionsGrid');
  if(list.length===0){
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><i class="ti ti-category-off"></i>No collections match the current filters.</div>`;
    return;
  }
  grid.innerHTML = list.map(c=>`
    <div class="card listing-card hoverable">
      <div class="listing-photo" style="background:${c.grad}">
        <i class="ti ti-category-2"></i>
        <span class="badge ${collectionStatusBadge[c.status]} ph-badge">${collectionStatusLabel[c.status]}</span>
      </div>
      <div class="listing-body">
        <p class="listing-price">${c.count} products</p>
        <p class="listing-addr" style="-webkit-line-clamp:2">${c.desc}</p>
        <div class="listing-actions">
          <button class="btn-secondary btn-sm" style="flex:1" onclick="showSection('products')"><i class="ti ti-package"></i>View products</button>
          <button class="btn-primary btn-sm" style="flex:1" onclick="toggleCollectionStatus(${c.id})"><i class="ti ti-rocket"></i>${c.status==='draft'?'Publish':'Unpublish'}</button>
        </div>
      </div>
    </div>`).join('');
}
function toggleCollectionStatus(id){
  const c = state.collections.find(x=>x.id===id);
  c.status = c.status==='draft' ? 'published' : 'draft';
  renderCollections();
  toast('success', c.status==='published'?'Collection published':'Collection unpublished', `"${c.name}" is now ${c.status}.`);
}
function addCollection(){
  const name = document.getElementById('colName').value.trim();
  if(!name){ toast('warning','Missing name','Please enter a collection name.'); return; }
  state.collections.unshift({
    id: nextId++, name, count:0,
    status: document.getElementById('colStatus').value,
    grad: CHART_COLORS[Math.floor(Math.random()*CHART_COLORS.length)],
    desc: document.getElementById('colDesc').value || 'No description yet.',
  });
  ['colName','colDesc'].forEach(id=>document.getElementById(id).value='');
  closeModal('modal-add-collection');
  showSection('catalog');
  renderCollections();
  toast('success','Collection added', `"${name}" has been added to your catalog.`);
}

/* ---------------------------------------------------------------------- */
/* PRODUCTS                                                                */
/* ---------------------------------------------------------------------- */
const statusLabel = {draft:'Draft', active:'Active', limited:'Limited stock', discontinued:'Discontinued'};
const statusBadge = {draft:'badge-neutral', active:'badge-active', limited:'badge-pending', discontinued:'badge-sold'};
const typeIcon = {'Living Room':'ti-sofa','Lighting':'ti-bulb','Outdoor':'ti-sun','Dining':'ti-tools-kitchen-2','Kids & Nursery':'ti-baby-carriage'};

function renderProducts(){
  const q = (document.getElementById('productSearch').value||'').toLowerCase();
  const statusFilter = document.getElementById('productStatusFilter').value;
  const sort = document.getElementById('productSort').value;

  let list = state.products.filter(p=>{
    const matchQ = p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    const matchS = statusFilter==='all' || p.status===statusFilter;
    return matchQ && matchS;
  });
  if(sort==='views') list.sort((a,b)=>b.views-a.views);
  if(sort==='price') list.sort((a,b)=>b.price-a.price);
  if(sort==='date') list.sort((a,b)=>b.id-a.id);

  const grid = document.getElementById('productsGrid');
  grid.className = state.productView==='grid' ? 'grid grid-3' : 'grid grid-2';

  if(list.length===0){
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><i class="ti ti-package-off"></i>No products match the current filters.</div>`;
    return;
  }

  grid.innerHTML = list.map(p=>`
    <div class="card listing-card hoverable">
      <div class="listing-photo" style="background:${p.grad}">
        <i class="ti ${typeIcon[p.category]||'ti-package'}"></i>
        <span class="badge ${statusBadge[p.status]} ph-badge">${statusLabel[p.status]}</span>
        <span class="ph-views"><i class="ti ti-eye"></i>${p.views}</span>
      </div>
      <div class="listing-body">
        <p class="listing-price">€${p.price.toLocaleString('en-US')} <span style="font-size:11.5px;color:var(--text-muted);font-weight:400">/ unit</span></p>
        <p class="listing-addr"><i class="ti ti-category-2" style="font-size:13px"></i>${p.category}</p>
        <div class="listing-specs">
          <span><i class="ti ti-stack-2"></i>MOQ ${p.moq}</span>
          <span><i class="ti ti-clock"></i>${p.leadTime}d</span>
          <span class="mono"><i class="ti ti-barcode"></i>${p.sku}</span>
        </div>
        <div class="listing-actions">
          <button class="btn-secondary btn-sm" style="flex:1" onclick="editProductDemo(${p.id})"><i class="ti ti-edit"></i>Edit</button>
          <button class="btn-primary btn-sm" style="flex:1" onclick="promoteProduct(${p.id})"><i class="ti ti-rocket"></i>Promote</button>
        </div>
      </div>
    </div>`).join('');
}
function setProductView(v){
  state.productView = v;
  document.getElementById('gridViewBtn').style.borderColor = v==='grid' ? 'var(--accent)' : '';
  document.getElementById('listViewBtn').style.borderColor = v==='list' ? 'var(--accent)' : '';
  renderProducts();
}
function editProductDemo(id){
  toast('info','Edit product', 'In the live version, the full edit form for this product opens here.');
}
function promoteProduct(id){
  const p = state.products.find(x=>x.id===id);
  if(!p) return;
  p.lastPromoted = 'a few seconds ago';
  toast('success','Product promoted', `"${p.title}" has been promoted to the top of search results.`);
}

/* ---------------------------------------------------------------------- */
/* PRODUCT WIZARD                                                          */
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
    if(!document.getElementById('wTitle').value.trim() || !document.getElementById('wSize').value.trim()){
      toast('warning','Required fields','Please fill in the product name and SKU before continuing.');
      return;
    }
  }
  if(dir>0 && state.wizardStep===2){
    if(!document.getElementById('wCity').value.trim()){
      toast('warning','Missing origin','Please fill in the country of origin.');
      return;
    }
  }
  if(dir>0 && state.wizardStep===4){
    if(!document.getElementById('wPrice').value){
      toast('warning','Missing price','Please enter the wholesale price.');
      return;
    }
  }
  if(dir>0 && state.wizardStep===wizardTotal){
    publishProduct();
    return;
  }
  document.getElementById('wizardStep'+state.wizardStep).style.display='none';
  state.wizardStep += dir;
  document.getElementById('wizardStep'+state.wizardStep).style.display='block';
  document.getElementById('wizardBackBtn').style.display = state.wizardStep>1 ? 'inline-flex' : 'none';
  document.getElementById('wizardNextBtn').textContent = state.wizardStep===wizardTotal ? 'Publish product' : 'Continue';
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
  const category = document.getElementById('wType').value;
  const collection = document.getElementById('wDeal').value;
  const moq = document.getElementById('wBeds').value || '4';
  const tags = Array.from(document.getElementById('wTags').querySelectorAll('.pill.on')).map(p=>p.textContent);
  document.getElementById('wDesc').value = buildDescription(category, collection, moq, tags.join(', ') || 'quality materials');
  toast('success','Description generated','The AI description has been added — feel free to edit it.');
}
function publishProduct(){
  const p = {
    id: nextId++,
    title: document.getElementById('wTitle').value.trim(),
    category: document.getElementById('wType').value,
    sku: document.getElementById('wSize').value.trim(),
    price: Number(document.getElementById('wPrice').value)||0,
    moq: Number(document.getElementById('wBeds').value)||1,
    leadTime: Number(document.getElementById('wZone').value)||14,
    country: document.getElementById('wCity').value.trim(),
    status:'active',
    views:0,
    lastPromoted:'—',
    tags: Array.from(document.getElementById('wTags').querySelectorAll('.pill.on')).map(p=>p.textContent),
    grad:'#1A73E8',
  };
  state.products.unshift(p);
  closeModal('modal-add-product');
  showSection('products');
  document.getElementById('productStatusFilter').value='all';
  document.getElementById('productSearch').value='';
  renderProducts();
  updateSidebarCounts();
  toast('success','Product published', `"${p.title}" is now live on LuciHome.`);
}

/* ---------------------------------------------------------------------- */
/* QUOTE REQUESTS — KANBAN + DETAIL DRAWER                                 */
/* ---------------------------------------------------------------------- */
function renderKanban(){
  const q = (document.getElementById('quoteSearch').value||'').toLowerCase();
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
        </div>`).join('') || '<p style="font-size:11.5px;color:var(--text-muted);padding:8px 6px">No requests here yet.</p>'}
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
    if(oldStageLabel !== newLabel) toast('success','Request moved', `${contact.name} is now in the "${newLabel}" stage.`);
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
      <span class="badge badge-neutral">€${c.budget.toLocaleString('en-US')} est. order</span>
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
  toast('success','Saved','Buyer notes have been updated.');
}
function addContact(){
  const name = document.getElementById('cName').value.trim();
  if(!name){ toast('warning','Missing name','Please enter the company\'s name.'); return; }
  const initials = name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
  state.contacts.push({
    id: nextId++, name, initials,
    budget: Number(document.getElementById('cBudget').value)||0,
    type: document.getElementById('cType').value,
    stage:'new',
    notes: document.getElementById('cNotes').value || 'No notes yet.',
    activity:[{d:'today', t:'Quote request added manually to pipeline'}],
    reminder:null,
  });
  ['cName','cEmail','cPhone','cBudget','cNotes'].forEach(id=>document.getElementById(id).value='');
  closeModal('modal-add-quote');
  showSection('quotes');
  renderKanban();
  updateSidebarCounts();
  toast('success','Quote request added', `${name} has been added to the "New Request" stage.`);
}

/* ---------------------------------------------------------------------- */
/* ACTIVE PROJECTS                                                         */
/* ---------------------------------------------------------------------- */
function renderTx(){
  const list = document.getElementById('txList');
  list.innerHTML = state.transactions.map(t=>`
    <div class="list-row ${state.currentTxId===t.id?'selected':''}" onclick="openDealRoom(${t.id})">
      <div class="fi-icon"><i class="ti ti-building-warehouse"></i></div>
      <div style="min-width:0;flex:1">
        <p class="lr-title">${t.property}</p>
        <p class="lr-sub">${t.buyer}</p>
      </div>
      <span class="badge badge-info">${state.txStages[t.stage]}</span>
    </div>`).join('');

  const arch = document.getElementById('txArchive');
  arch.innerHTML = `<div class="section-label">Closed projects</div><div class="grid grid-3">` +
    state.archivedTx.map(t=>`
    <div class="card">
      <i class="ti ti-archive mi"></i>
      <p class="mt">${t.property}</p>
      <p class="ms">Client: ${t.buyer}</p>
      <p class="ms" style="margin-top:6px">Order value: <strong style="color:var(--text-primary)">€${t.commission.toLocaleString('en-US')}</strong></p>
      <span class="badge badge-sold" style="margin-top:8px">Completed — ${t.closedOn}</span>
    </div>`).join('') + `</div>`;

  if(state.currentTxId) openDealRoom(state.currentTxId, true);
}
function toggleArchive(){
  state.archiveVisible = !state.archiveVisible;
  document.getElementById('txArchive').style.display = state.archiveVisible ? 'block' : 'none';
  document.getElementById('archiveBtnLabel').textContent = state.archiveVisible ? 'Hide archive' : 'Closed projects archive';
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

        <p class="section-label">Fulfillment checklist</p>
        <div id="txChecklist">${t.checklist.map((c,i)=>`
          <div class="chk-row ${c.done?'done':''}">
            <input type="checkbox" id="chk-${t.id}-${i}" ${c.done?'checked':''} onchange="toggleChecklist(${t.id},${i})">
            <label for="chk-${t.id}-${i}">${c.t}</label>
          </div>`).join('')}</div>
      </div>
      <div class="span-4">
        <div class="mini-stat" style="margin-bottom:10px"><p class="v">€${t.commission.toLocaleString('en-US')}</p><p class="l">Order value — ${t.commissionStatus}</p></div>
        <div class="alert alert-warning"><i class="ti ti-bell"></i>Deadline approaching for the next production milestone.</div>
        <p class="section-label" style="margin-top:0">Multi-party access</p>
        <div class="pill-row">
          <span class="pill on">Brand (you)</span><span class="pill on">Client</span>
          <span class="pill clickable" onclick="toast('success','Invitation sent','The freight forwarder has been invited into the fulfillment room.')">+ Invite freight forwarder</span>
          <span class="pill clickable" onclick="toast('success','Invitation sent','The QC inspector has been invited into the fulfillment room.')">+ Invite QC inspector</span>
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
    toast('info','Almost there','Last step remaining: mark the project as completed from the archive.');
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
  toast('success','Document uploaded','The document has been added to the project vault.');
}

/* ---------------------------------------------------------------------- */
/* REFERRALS (rendered inside Ecosystem / My network)                      */
/* ---------------------------------------------------------------------- */
function populateReferralClients(){
  const sel = document.getElementById('rClient');
  sel.innerHTML = state.contacts.map(c=>`<option value="${c.id}">${c.name} (${c.type})</option>`).join('');
}
function renderReferrals(){
  const statusMap = {pending:['badge-pending','Pending'], accepted:['badge-info','Accepted'], declined:['badge-danger','Declined'], closed:['badge-sold','Closed']};
  const grid = document.getElementById('referralsGrid');
  if(!grid) return;

  const sentCards = state.sentReferrals.map(r=>`
    <div class="card">
      <div class="flex-between"><p class="mt">${r.client}</p><span class="badge ${statusMap[r.status][0]}">${statusMap[r.status][1]}</span></div>
      <p class="ms">Sent · Market: ${r.market}<br>Partner brand: ${r.agent}<br>Agreed commission: ${r.pct}%</p>
    </div>`);

  const receivedCards = state.receivedReferrals.map(r=>`
    <div class="card">
      <div class="flex-between"><p class="mt">${r.client}</p><span class="badge ${statusMap[r.status][0]}">${statusMap[r.status][1]}</span></div>
      <p class="ms">Received from: ${r.agent}<br>Estimated order value: €${r.budget.toLocaleString('en-US')}<br>${r.notes}</p>
      ${r.status==='pending' ? `<div class="listing-actions" style="margin-top:10px">
        <button class="btn-secondary btn-sm" style="flex:1" onclick="declineReferral(${r.id})">Decline</button>
        <button class="btn-primary btn-sm" style="flex:1" onclick="acceptReferral(${r.id})">Accept</button>
      </div>` : ''}
    </div>`);

  grid.innerHTML = [...sentCards, ...receivedCards].join('') || '<div class="empty-state" style="grid-column:1/-1"><i class="ti ti-send-off"></i>No referrals sent or received yet.</div>';
}
function acceptReferral(id){
  const r = state.receivedReferrals.find(x=>x.id===id);
  r.status='accepted';
  state.contacts.push({id:nextId++, name:r.client, initials:r.client.split(' ').map(w=>w[0]).slice(0,2).join(''), budget:r.budget, type:'Retailer', stage:'new', notes:'Buyer sourced from an international referral: '+r.notes, activity:[{d:'today', t:'Referral accepted and added to the pipeline'}], reminder:'First contact within 48h'});
  renderReferrals();
  renderKanban();
  updateSidebarCounts();
  toast('success','Referral accepted', `${r.client} has been automatically added to your quote pipeline.`);
}
function declineReferral(id){
  const r = state.receivedReferrals.find(x=>x.id===id);
  r.status='declined';
  renderReferrals();
  toast('info','Referral declined','The referring brand has been notified.');
}
function sendReferral(){
  const clientId = Number(document.getElementById('rClient').value);
  const client = state.contacts.find(c=>c.id===clientId);
  state.sentReferrals.unshift({
    id: nextId++,
    client: client ? client.name : 'Selected buyer',
    market: document.getElementById('rMarket').value,
    agent: document.getElementById('rAgent').value || 'LuciHome partner brand',
    pct: Number(document.getElementById('rPct').value),
    status:'pending',
  });
  closeModal('modal-send-referral');
  showSection('ecosystem');
  switchTab('eco','eco-mine');
  document.querySelector('.tab-btn[data-tab="eco-mine"]').classList.add('active');
  renderReferrals();
  toast('success','Referral sent', 'The partner brand has been notified and will respond soon.');
}

/* ---------------------------------------------------------------------- */
/* AI TOOLS                                                                */
/* ---------------------------------------------------------------------- */
function buildDescription(category, collection, moq, features){
  const openers = [
    `Introducing a ${category.toLowerCase()} piece from the ${collection}, ideal for buyers seeking comfort and elegance at scale.`,
    `Discover this remarkable ${category.toLowerCase()} addition to the ${collection}, designed for a refined retail or hospitality experience.`,
  ];
  const opener = openers[Math.floor(Math.random()*openers.length)];
  return `${opener} Available from a minimum order quantity of ${moq} units, with consistent quality across every production run.

Highlights include: ${features}. Loomora's production facilities offer reliable lead times and full documentation, making this one of the most requested items in the ${collection}.

The product is available for immediate quoting — contact us to request samples or discuss volume pricing and shipping options.`;
}
function generateDescription(){
  const loading = document.getElementById('descLoading');
  const output = document.getElementById('descOutput');
  loading.style.display='block';
  output.style.display='none';
  setTimeout(()=>{
    const category = document.getElementById('descType').value;
    const collection = document.getElementById('descCity').value || 'core collection';
    const moq = document.getElementById('descBeds').value || '4';
    const features = document.getElementById('descFeatures').value || 'quality materials';
    output.value = buildDescription(category, collection, moq, features);
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
  const qty = Number(document.getElementById('valSize').value)||40;
  const customization = Number(document.getElementById('valBeds').value)||1;
  const grade = document.getElementById('valCondition').value;
  const category = document.getElementById('valCity').value || 'the selected category';
  let base = 22;
  if(grade.includes('Premium')) base = 30;
  if(grade.includes('custom')) base = 42;
  const mid = Math.round(qty*base/10)*10 + customization*15;
  const low = Math.round(mid*0.92/10)*10;
  const high = Math.round(mid*1.08/10)*10;
  document.getElementById('valResultCard').innerHTML = `
    <p class="mt">Estimate result</p>
    <p class="stat-card value" style="font-size:30px;margin:6px 0">€${low.toLocaleString('en-US')} – €${high.toLocaleString('en-US')}</p>
    <p class="ms" style="margin-bottom:14px">~78% confidence range, based on ${qty} units in "${category}" with "${grade}" grade.</p>
    <p class="section-label" style="margin-top:0">Comparable orders</p>
    <div class="feed-item" style="border:none;padding:6px 0"><div class="fi-icon"><i class="ti ti-package"></i></div><div class="fi-text"><p>Similar order, same category — €${(mid-4000).toLocaleString('en-US')}</p><span>Confirmed 3 weeks ago</span></div></div>
    <div class="feed-item" style="border:none;padding:6px 0"><div class="fi-icon"><i class="ti ti-package"></i></div><div class="fi-text"><p>Comparable order — €${(mid+6000).toLocaleString('en-US')}</p><span>Quoted 12 days ago</span></div></div>
    <div class="feed-item" style="border:none;padding:6px 0"><div class="fi-icon"><i class="ti ti-package"></i></div><div class="fi-text"><p>Comparable order — €${(mid-1500).toLocaleString('en-US')}</p><span>Confirmed 6 weeks ago</span></div></div>
  `;
  toast('success','Estimate generated','The quote estimate has been calculated based on the data you entered.');
}

const translations = {
  ro: "Canapea modulară cu 3 locuri, cadru din stejar și tapițerie boucle, complet certificată, disponibilă cu un termen de producție de 4 săptămâni.",
  fr: "Canapé modulaire 3 places avec structure en chêne et tissu bouclé, entièrement certifié, disponible avec un délai de production de 4 semaines.",
  de: "Modulares 3-Sitzer-Sofa mit Eichenrahmen und Bouclé-Bezug, vollständig zertifiziert, Produktionszeit 4 Wochen.",
  es: "Sofá modular de 3 plazas con estructura de roble y tapizado boucle, totalmente certificado, disponible con un plazo de producción de 4 semanas.",
  ar: "أريكة معيارية بثلاثة مقاعد بهيكل من خشب البلوط وتنجيد بوكليه، معتمدة بالكامل، متاحة بمهلة إنتاج مدتها 4 أسابيع.",
};
function generateTranslation(){
  const lang = document.getElementById('translateLang').value;
  const input = document.getElementById('translateInput').value.trim();
  const defaultText = "Modular 3-seat sofa with oak frame and boucle upholstery, fully certified, available for a 4-week production lead time.";
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
  if(c.stage==='negotiation') score += 3;
  if(c.stage==='quoted') score += 2;
  if(c.stage==='reviewing') score += 1;
  if(c.budget>40000) score += 1;
  if(c.reminder) score += 1;
  return Math.min(10, score);
}
function renderLeadScores(){
  const body = document.getElementById('leadScoreBody');
  const rows = state.contacts.filter(c=>c.stage!=='confirmed').map(c=>{
    const score = computeLeadScore(c);
    const color = score>=8 ? '#188038' : score>=5 ? '#F29900' : '#D93025';
    return `<tr>
      <td class="strong">${c.name}</td>
      <td>€${c.budget.toLocaleString('en-US')}</td>
      <td>${state.stages.find(s=>s.id===c.stage).label}</td>
      <td><span class="score-bar"><span class="score-fill" style="width:${score*10}%;background:${color}"></span></span>${score}/10</td>
      <td><button class="btn-ghost btn-sm" onclick="showSection('quotes');openContactDetail(${c.id})">Open</button></td>
    </tr>`;
  }).sort().reverse().join('');
  body.innerHTML = rows;
}

const homyAnswers = [
  {keys:['follow up','follow-up','this week'], a:'Based on LuciHome data, Vantage Distributors and Casa Bella Hospitality have the highest order values still awaiting a reply — both are worth a call before Friday.'},
  {keys:['underperform','weak','my products'], a:'"Wisp Table Lamp" is still in draft and hasn\'t generated any views — publish it to appear in search results. "Nova Dining Table" is discontinued, so it can be archived.'},
  {keys:['commission','referral'], a:'The standard referral commission on LuciHome is between 20% and 25% of the receiving brand\'s order value — configurable per referral, agreed in writing on the platform.'},
];
function homyReply(question){
  const q = question.toLowerCase();
  const match = homyAnswers.find(a=>a.keys.some(k=>q.includes(k)));
  return match ? match.a : 'Good question! Based on your catalog data, I\'d recommend checking the Analytics section for detailed figures, or give me a few more details so I can help you more precisely.';
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
/* ECOSYSTEM                                                               */
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
    </div>`).join('') || '<div class="empty-state" style="grid-column:1/-1"><i class="ti ti-users"></i>No partners found.</div>';
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
    </div>`).join('') || '<div class="empty-state" style="grid-column:1/-1"><i class="ti ti-users"></i>You are not connected with any partners yet.</div>';
  renderReferrals();
}
function renderDevProjects(){
  document.getElementById('devProjectsGrid').innerHTML = state.devProjects.map(d=>`
    <div class="card">
      <i class="ti ti-certificate mi"></i>
      <p class="mt">${d.name}</p>
      <p class="ms">${d.location}</p>
      <p class="ms" style="margin-top:6px">${d.desc}</p>
      <button class="btn-${d.applied?'secondary':'primary'} btn-sm" style="margin-top:12px" onclick="applyProject(${d.id})" ${d.applied?'disabled':''}>${d.applied?'Application sent ✓':'Apply now'}</button>
    </div>`).join('');
}
function applyProject(id){
  const d = state.devProjects.find(x=>x.id===id);
  d.applied = true;
  renderDevProjects();
  toast('success','Application sent', `You've applied for "${d.name}" — the program owner will respond soon.`);
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
/* ANALYTICS — export                                                      */
/* ---------------------------------------------------------------------- */
function exportReport(){
  const lines = [
    'LuciHome — Brand Performance Report',
    'Brand: Loomora Furnishings',
    'Generated: ' + new Date().toLocaleDateString('en-US'),
    '',
    'Active products: ' + state.products.filter(p=>p.status==='active').length,
    'Open quote requests: ' + state.contacts.filter(c=>c.stage!=='confirmed').length,
    'Active projects: ' + state.transactions.length,
    'Revenue earned: €14,200',
    'Revenue pending: €6,800',
    'Revenue projected: €27,400',
    '',
    'Top products by views:',
    ...state.products.sort((a,b)=>b.views-a.views).slice(0,5).map(p=>`  - ${p.title} (${p.views} views)`),
  ];
  downloadFile('LuciHome-report.txt', lines.join('\n'));
  toast('success','Report exported','The file LuciHome-report.txt has been downloaded.');
}
function exportAccountData(){
  const data = {
    brand:{name:'Loomora Furnishings', email:'trade@loomora.com'},
    products: state.products,
    contacts: state.contacts,
    transactions: state.transactions,
  };
  downloadFile('LuciHome-account-data.json', JSON.stringify(data, null, 2));
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
  const activeProducts = state.products.filter(p=>p.status==='active'||p.status==='limited').length;
  const openQuotes = state.contacts.filter(c=>c.stage!=='confirmed').length;
  document.querySelector('.nav-item[data-section="products"] .nbadge').textContent = activeProducts;
  document.querySelector('.nav-item[data-section="quotes"] .nbadge').textContent = openQuotes;
  document.querySelector('.nav-item[data-section="projects"] .nbadge').textContent = state.transactions.length;
}

/* ---------------------------------------------------------------------- */
/* INIT                                                                    */
/* ---------------------------------------------------------------------- */
function init(){
  renderFeed();
  renderAgenda();
  renderDashboardCharts();
  renderCollections();
  renderProducts();
  renderKanban();
  renderTx();
  renderDirectory();
  renderDevProjects();
  renderMarketGroups();
  renderReferrals();
  renderLeadScores();
  renderAnalyticsCharts();
  updateSidebarCounts();
  appendChat('bot', "Hi, Diana! I'm Ada, your AI assistant. Ask me anything about the market, your buyers, or your products.");

  document.getElementById('globalSearch').addEventListener('keydown', e=>{
    if(e.key==='Enter' && e.target.value.trim()){
      showSection('products');
      document.getElementById('productSearch').value = e.target.value;
      renderProducts();
      toast('info','Search','Products have been filtered based on your search.');
    }
  });
}
document.addEventListener('DOMContentLoaded', init);