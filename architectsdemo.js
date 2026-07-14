/* ============================================================================
   LuciHome — Architects & Designers Workspace Demo
   Same engine/pattern as the Agent Workspace demo: a single `state` object,
   dependency-free inline-SVG charts, and small render() functions per module.
   Everything here is simulated client-side data for presentation purposes.
   ============================================================================ */

const CHART_COLORS = ['#1A73E8','#12B5CB','#8E24AA','#F9AB00','#34A853','#EA4335'];
let nextId = 900;

const state = {
  feed:[
    {id:1, icon:'ti-user-plus', text:'New lead received — <strong>Michael Turner</strong> wants a full renovation quote.', time:'12 min ago', read:false},
    {id:2, icon:'ti-arrows-exchange', text:'<strong>Sophie Laurent</strong> (agent) referred a client for the Herastrau project.', time:'1 h ago', read:false},
    {id:3, icon:'ti-star', text:'New 5-star review from the <strong>Rhodes family</strong>.', time:'3 h ago', read:false},
    {id:4, icon:'ti-photo', text:'Your "Pipera Villa" portfolio project reached 100 views.', time:'yesterday', read:false},
    {id:5, icon:'ti-crane', text:'<strong>Skyline Development</strong> invited you to an off-plan project.', time:'2 days ago', read:true},
  ],

  agenda:[
    {time:'09:30', text:'Site survey — Pipera Villa', sub:'With client, on-site', done:false},
    {time:'12:00', text:'Follow up with Michael Turner', sub:'Send proposal + estimate', done:false},
    {time:'16:00', text:'Call with Skyline Development', sub:'Off-plan project brief', done:true},
  ],

  weekTrend:{
    labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    views:[120,160,150,210,240,190,170],
    leads:[1,2,1,3,2,2,1],
  },

  portfolio:[
    {id:1, title:'Full renovation, park-view apartment', category:'Both', city:'Herastrau, Bucharest', year:2026, size:140, views:412, featured:true, tags:['Modern Luxury','Minimalist'], grad:'#1A73E8'},
    {id:2, title:'Scandinavian family home interior', category:'Interior Design', city:'Pipera, Bucharest', year:2025, size:210, views:298, featured:true, tags:['Scandinavian'], grad:'#12B5CB'},
    {id:3, title:'New-build villa, structural design', category:'Architecture', city:'Corbeanca', year:2025, size:320, views:187, featured:false, tags:['Contemporary'], grad:'#8E24AA'},
    {id:4, title:'Loft conversion, industrial style', category:'Interior Design', city:'Cotroceni, Bucharest', year:2024, size:95, views:255, featured:false, tags:['Industrial'], grad:'#F9AB00'},
    {id:5, title:'Off-plan residential block — facade', category:'Architecture', city:'Cluj-Napoca', year:2024, size:2400, views:143, featured:false, tags:['Contemporary'], grad:'#34A853'},
    {id:6, title:'Mediterranean-style seaside villa', category:'Both', city:'Mamaia', year:2023, size:280, views:334, featured:true, tags:['Mediterranean'], grad:'#EA4335'},
    {id:7, title:'Boutique office fit-out', category:'Interior Design', city:'Floreasca, Bucharest', year:2023, size:410, views:121, featured:false, tags:['Modern Luxury'], grad:'#1A73E8'},
    {id:8, title:'Extension + full renovation', category:'Architecture', city:'Baneasa, Bucharest', year:2022, size:180, views:98, featured:false, tags:['Classic'], grad:'#12B5CB'},
    {id:9, title:'Paris pied-à-terre restyling', category:'Interior Design', city:'Paris, FR', year:2022, size:65, views:176, featured:false, tags:['Minimalist'], grad:'#8E24AA'},
  ],
  portfolioView:'grid',

  txStages:['Inquiry','Proposal Sent','Contract Signed','In Progress','Completed'],
  transactions:[
    {id:1, property:'Herastrau Apartment — Full renovation', buyer:'Sophie & Mark Reyes', seller:'Elena Dumitrescu', stage:2, type:'Interior Design', budget:52000, spent:31000, deadline:'Aug 12, 2026'},
    {id:2, property:'Pipera Villa — Mood board & materials', buyer:'Michael Turner', seller:'Elena Dumitrescu', stage:1, type:'Interior Design', budget:38000, spent:6000, deadline:'Sep 2, 2026'},
    {id:3, property:'Corbeanca New Build — Structural design', buyer:'Corbeanca Development SRL', seller:'Elena Dumitrescu', stage:3, type:'Architecture', budget:145000, spent:98000, deadline:'Nov 20, 2026'},
  ],
  archivedTx:[
    {property:'Cotroceni Loft — Interior styling', buyer:'The Rhodes family', seller:'Elena Dumitrescu', fee:9800, closedOn:'May 2026'},
    {property:'Floreasca Office — Fit-out', buyer:'Nova Consulting SRL', seller:'Elena Dumitrescu', fee:14200, closedOn:'Feb 2026'},
  ],
  currentTxId:null,
  archiveVisible:false,

  stages:[
    {id:'new', label:'New'},
    {id:'contacted', label:'Contacted'},
    {id:'meeting', label:'Meeting Scheduled'},
    {id:'proposal', label:'Proposal Sent'},
    {id:'won', label:'Won'},
  ],
  contacts:[
    {id:1, name:'Michael Turner', initials:'MT', budget:38000, type:'Full renovation', stage:'proposal', notes:'Wants a Scandinavian mood board first, then full quote.', activity:[{d:'today', t:'Sent initial message via public profile'}], reminder:'Send proposal by Friday'},
    {id:2, name:'Jane Whitfield', initials:'JW', budget:22000, type:'Furnishing only', stage:'new', notes:'Referred by agent Sophie Laurent.', activity:[{d:'today', t:'Lead referred by agent'}], reminder:null},
    {id:3, name:'Corbeanca Development SRL', initials:'CD', budget:145000, type:'New build', stage:'won', notes:'Contract signed for structural design.', activity:[{d:'3 weeks ago', t:'Contract signed'}], reminder:null},
    {id:4, name:'Laura Ionescu', initials:'LI', budget:15000, type:'Furnishing only', stage:'contacted', notes:'Small apartment, wants a quick furnishing plan.', activity:[{d:'2 days ago', t:'First call completed'}], reminder:'Follow up in 3 days'},
    {id:5, name:'Ahmed Al Farsi', initials:'AF', budget:60000, type:'Extension', stage:'meeting', notes:'UAE-based buyer, extension on a Baneasa property.', activity:[{d:'yesterday', t:'Site visit scheduled'}], reminder:'Meeting Thursday 11:00'},
  ],
  selectedContactId:null,

  directory:[
    {id:1, name:'Sophie Laurent', type:'Agent', market:'Bucharest', lang:'EN, FR', rating:4.8, connected:true},
    {id:2, name:'Skyline Development', type:'Developer', market:'Cluj-Napoca', lang:'EN, RO', rating:4.6, connected:true},
    {id:3, name:'Radu Popescu', type:'Notary', market:'Bucharest', lang:'RO, EN', rating:4.9, connected:false},
    {id:4, name:'Claire Fontaine', type:'Designer', market:'Paris', lang:'FR, EN', rating:4.7, connected:false},
    {id:5, name:'Corbeanca Development SRL', type:'Developer', market:'Corbeanca', lang:'RO', rating:4.5, connected:true},
    {id:6, name:'Marius Enache', type:'Agent', market:'Mamaia', lang:'RO, EN', rating:4.4, connected:false},
  ],
  devProjects:[
    {id:1, name:'Corbeanca Residential Park', developer:'Corbeanca Development SRL', role:'Seeking Architect', desc:'12-unit off-plan residential park — structural design and permit support needed.'},
    {id:2, name:'Cluj Skyline Towers — Phase 2', developer:'Skyline Development', role:'Seeking Architect + Interior Designer', desc:'Facade and unit interior fit-out packages for a 40-unit tower.'},
  ],

  buyerOrigin:[
    {label:'Romania', value:46}, {label:'France', value:22}, {label:'UAE', value:16}, {label:'Germany', value:9}, {label:'Other', value:7},
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
/* QUICK CREATE MENU                                                       */
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
  if(id==='modal-send-request') populateRequestOptions();
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
    {name:'Portfolio views', color:'#1A73E8', values:state.weekTrend.views},
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
  const top = [...state.portfolio].sort((a,b)=>b.views-a.views).slice(0,5)
    .map((p,i)=>({label:p.title.length>22?p.title.slice(0,22)+'…':p.title, value:p.views, color:CHART_COLORS[i%CHART_COLORS.length]}));
  renderBarChart('portfolioViewsChart', top, {leftPad:170});

  renderBarChart('leadFunnelChart', [
    {label:'New lead', value:22, color:CHART_COLORS[0]},
    {label:'Contacted', value:16, color:CHART_COLORS[0]},
    {label:'Meeting scheduled', value:10, color:CHART_COLORS[0]},
    {label:'Proposal sent', value:7, color:CHART_COLORS[0]},
    {label:'Won', value:4, color:CHART_COLORS[0]},
  ], {leftPad:150});

  renderDonutChart('audienceOriginChart', state.buyerOrigin.map((b,i)=>({label:b.label, value:b.value, color:CHART_COLORS[i%CHART_COLORS.length]})));

  renderBarChart('revenueChart', [
    {label:'Completed', value:184, color:CHART_COLORS[4], suffix:'k'},
    {label:'In progress', value:98, color:CHART_COLORS[0], suffix:'k'},
    {label:'Pipeline', value:52, color:'#80868B', suffix:'k'},
  ], {leftPad:120, maxValue:220});
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
/* PORTFOLIO                                                               */
/* ---------------------------------------------------------------------- */
const categoryBadge = {'Architecture':'spec-arch','Interior Design':'spec-int','Both':'spec-both'};
const categoryIcon = {'Architecture':'ti-blueprint','Interior Design':'ti-sofa','Both':'ti-building-castle'};

function renderPortfolio(){
  const q = (document.getElementById('portfolioSearch').value||'').toLowerCase();
  const typeFilter = document.getElementById('portfolioTypeFilter').value;
  const sort = document.getElementById('portfolioSort').value;

  let list = state.portfolio.filter(p=>{
    const matchQ = p.title.toLowerCase().includes(q) || p.city.toLowerCase().includes(q);
    const matchT = typeFilter==='all' || p.category===typeFilter;
    return matchQ && matchT;
  });
  if(sort==='views') list.sort((a,b)=>b.views-a.views);
  if(sort==='year') list.sort((a,b)=>b.year-a.year);
  if(sort==='size') list.sort((a,b)=>b.size-a.size);

  const grid = document.getElementById('portfolioGrid');
  grid.className = state.portfolioView==='grid' ? 'grid grid-3' : 'grid grid-2';

  if(list.length===0){
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><i class="ti ti-photo-off"></i>No portfolio projects match the current filters.</div>`;
    return;
  }

  grid.innerHTML = list.map(p=>`
    <div class="card listing-card hoverable">
      <div class="listing-photo" style="background:${p.grad}">
        <i class="ti ${categoryIcon[p.category]||'ti-photo'}"></i>
        <span class="spec-badge ${categoryBadge[p.category]} ph-badge">${p.category}</span>
        <span class="ph-views"><i class="ti ti-eye"></i>${p.views}</span>
      </div>
      <div class="listing-body">
        <p class="listing-price" style="font-size:16px">${p.title}${p.featured?' <i class="ti ti-star" style="color:#F9AB00;font-size:14px" title="Featured"></i>':''}</p>
        <p class="listing-addr"><i class="ti ti-map-pin" style="font-size:13px"></i>${p.city} · ${p.year}</p>
        <div class="listing-specs">
          <span><i class="ti ti-ruler-2"></i>${p.size} m²</span>
        </div>
        <div class="pill-row" style="margin-bottom:14px">${p.tags.map(t=>`<span class="pill">${t}</span>`).join('')}</div>
        <div class="listing-actions">
          <button class="btn-secondary btn-sm" style="flex:1" onclick="editPortfolioDemo(${p.id})"><i class="ti ti-edit"></i>Edit</button>
          <button class="btn-primary btn-sm" style="flex:1" onclick="toggleFeatured(${p.id})"><i class="ti ti-star"></i>${p.featured?'Unfeature':'Feature'}</button>
        </div>
      </div>
    </div>`).join('');
}
function setPortfolioView(v){
  state.portfolioView = v;
  document.getElementById('gridViewBtn').style.borderColor = v==='grid' ? 'var(--accent)' : '';
  document.getElementById('listViewBtn').style.borderColor = v==='list' ? 'var(--accent)' : '';
  renderPortfolio();
}
function editPortfolioDemo(id){
  toast('info','Edit project', 'In the live version, the full portfolio editor for this project opens here.');
}
function toggleFeatured(id){
  const p = state.portfolio.find(x=>x.id===id);
  if(!p) return;
  p.featured = !p.featured;
  renderPortfolio();
  toast('success', p.featured?'Marked as featured':'Removed from featured', `"${p.title}" ${p.featured?'now appears first on your public profile.':'is no longer featured.'}`);
}

/* ---------------------------------------------------------------------- */
/* PORTFOLIO PROJECT WIZARD                                                */
/* ---------------------------------------------------------------------- */
const wizardTotal = 5;
function resetWizard(){
  state.wizardStep = 1;
  state.uploadedFiles = [];
  document.getElementById('uploadedFilesListModal').innerHTML = '';
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
      toast('warning','Required fields','Please fill in the project title and size before continuing.');
      return;
    }
  }
  if(dir>0 && state.wizardStep===2){
    if(!document.getElementById('wCity').value.trim()){
      toast('warning','Missing location','Please fill in the project city.');
      return;
    }
  }
  if(dir>0 && state.wizardStep===wizardTotal){
    publishPortfolioProject();
    return;
  }
  document.getElementById('wizardStep'+state.wizardStep).style.display='none';
  state.wizardStep += dir;
  document.getElementById('wizardStep'+state.wizardStep).style.display='block';
  document.getElementById('wizardBackBtn').style.display = state.wizardStep>1 ? 'inline-flex' : 'none';
  document.getElementById('wizardNextBtn').textContent = state.wizardStep===wizardTotal ? 'Publish project' : 'Continue';
  renderWizardDots();
}
function simulateUpload(){
  const n = state.uploadedFiles.length + 1;
  const name = `photo-${n}.jpg`;
  state.uploadedFiles.push(name);
  const html = state.uploadedFiles.map(f=>`
    <div class="flex-between" style="padding:8px 0;border-bottom:1px solid var(--border)">
      <span style="font-size:12.5px;color:var(--text-secondary)"><i class="ti ti-photo" style="margin-right:8px;color:var(--accent)"></i>${f}</span>
      <span class="badge badge-active">Uploaded</span>
    </div>`).join('');
  const modalList = document.getElementById('uploadedFilesListModal');
  if(modalList) modalList.innerHTML = html;
  const inlineList = document.getElementById('uploadedFilesList');
  if(inlineList) inlineList.innerHTML = html;
}
function wizardGenerateDesc(){
  const type = document.getElementById('wType').value;
  const city = (document.getElementById('wCity').value || document.getElementById('wZone').value || 'central area');
  const size = document.getElementById('wSize').value || '140';
  const tags = Array.from(document.getElementById('wTags').querySelectorAll('.pill.on')).map(p=>p.textContent);
  document.getElementById('wDesc').value = buildDescription(type, city, size, tags.join(', ') || 'clean lines, natural materials');
  toast('success','Description generated','The AI description has been added — feel free to edit it.');
}
function buildDescription(type, city, size, features){
  return `A ${size} m² ${type.toLowerCase()} project completed in ${city}, blending functionality with a refined aesthetic. Every space was designed around the client's daily routine, with a focus on ${features}. The result is a home that feels both considered and effortless — a project we're proud to showcase in our LuciHome portfolio.`;
}
function publishPortfolioProject(){
  const p = {
    id: nextId++,
    title: document.getElementById('wTitle').value.trim(),
    category: document.getElementById('wType').value,
    city: document.getElementById('wCity').value.trim() + (document.getElementById('wZone').value ? ', '+document.getElementById('wZone').value : ''),
    year: Number(document.getElementById('wYear').value)||new Date().getFullYear(),
    size: Number(document.getElementById('wSize').value)||0,
    views:0,
    featured:false,
    tags: Array.from(document.getElementById('wTags').querySelectorAll('.pill.on')).map(p=>p.textContent),
    grad:'#1A73E8',
  };
  state.portfolio.unshift(p);
  closeModal('modal-add-project');
  showSection('portfolio');
  document.getElementById('portfolioTypeFilter').value='all';
  document.getElementById('portfolioSearch').value='';
  renderPortfolio();
  toast('success','Project published', `"${p.title}" is now live on your LuciHome portfolio.`);
}

/* ---------------------------------------------------------------------- */
/* LEADS & CRM — KANBAN + CONTACT DETAIL DRAWER                            */
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
  }
  closeContactDrawer();
  toast('success','Saved','Client notes have been updated.');
}
function addContact(){
  const name = document.getElementById('cName').value.trim();
  if(!name){ toast('warning','Missing name','Please enter the lead\'s full name.'); return; }
  const initials = name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
  state.contacts.push({
    id: nextId++, name, initials,
    budget: Number(document.getElementById('cBudget').value)||0,
    type: document.getElementById('cType').value,
    stage:'new',
    notes: document.getElementById('cNotes').value || 'No notes yet.',
    activity:[{d:'today', t:'Lead added manually to CRM'}],
    reminder:null,
  });
  ['cName','cEmail','cPhone','cBudget','cNotes'].forEach(id=>document.getElementById(id).value='');
  closeModal('modal-add-lead');
  showSection('leads');
  renderKanban();
  toast('success','Lead added', `${name} has been added to the "New" stage.`);
}

/* ---------------------------------------------------------------------- */
/* COST ESTIMATE CALCULATOR                                                */
/* ---------------------------------------------------------------------- */
function generateCostEstimate(){
  const size = Number(document.getElementById('estSize').value)||90;
  const finish = document.getElementById('estFinish').value;
  const type = document.getElementById('estType').value;
  const perSqm = {Standard:250, Premium:400, Luxury:700}[finish] || 400;
  const base = size*perSqm;
  const low = Math.round(base*0.9/100)*100;
  const high = Math.round(base*1.25/100)*100;
  document.getElementById('estResultCard').innerHTML = `
    <p class="mt">Estimate result</p>
    <p class="stat-card value" style="font-size:28px;margin:6px 0">€${low.toLocaleString('en-US')} – €${high.toLocaleString('en-US')}</p>
    <p class="ms">Indicative budget for a ${size} m² "${type}" project at ${finish.toLowerCase()} finish level. Ready to send to the client as a first response.</p>
    <button class="btn-secondary btn-sm" style="margin-top:10px" onclick="toast('success','Sent (demo)','The estimate has been sent to the lead as a first response.')"><i class="ti ti-send"></i>Send to lead</button>
  `;
}

/* ---------------------------------------------------------------------- */
/* PROJECTS — workspace list + deal room detail                            */
/* ---------------------------------------------------------------------- */
function renderTx(){
  const list = document.getElementById('txList');
  list.innerHTML = state.transactions.map(t=>`
    <div class="list-row ${state.currentTxId===t.id?'selected':''}" onclick="openDealRoom(${t.id})">
      <div class="fi-icon"><i class="ti ti-briefcase"></i></div>
      <div style="min-width:0;flex:1">
        <p class="lr-title">${t.property}</p>
        <p class="lr-sub">${t.buyer}</p>
      </div>
      <span class="badge badge-info">${state.txStages[t.stage]}</span>
    </div>`).join('');

  const arch = document.getElementById('txArchive');
  arch.innerHTML = `<div class="section-label">Completed projects</div><div class="grid grid-3">` +
    state.archivedTx.map(t=>`
    <div class="card">
      <i class="ti ti-archive mi"></i>
      <p class="mt">${t.property}</p>
      <p class="ms">Client: ${t.buyer}</p>
      <p class="ms" style="margin-top:6px">Fee earned: <strong style="color:var(--text-primary)">€${t.fee.toLocaleString('en-US')}</strong></p>
      <span class="badge badge-sold" style="margin-top:8px">Completed — ${t.closedOn}</span>
    </div>`).join('') + `</div>`;

  if(state.currentTxId) openDealRoom(state.currentTxId, true);
  else if(state.transactions.length) openDealRoom(state.transactions[0].id, true);
}
function toggleArchive(){
  state.archiveVisible = !state.archiveVisible;
  document.getElementById('txArchive').style.display = state.archiveVisible ? 'block' : 'none';
  document.getElementById('archiveBtnLabel').textContent = state.archiveVisible ? 'Hide archive' : 'Completed projects archive';
}
function openDealRoom(id, silent){
  state.currentTxId = id;
  const t = state.transactions.find(x=>x.id===id);
  if(!t) return;
  if(!silent) renderTx();
  const room = document.getElementById('dealRoom');
  const isArch = t.type === 'Architecture';
  const pct = Math.min(100, Math.round(t.spent/t.budget*100));
  room.innerHTML = `
    <div class="flex-between" style="margin-bottom:6px">
      <p class="mt" style="font-size:16px">${t.property}</p>
      <button class="btn-primary btn-sm" onclick="advanceStage(${t.id})" ${t.stage>=state.txStages.length-1?'disabled':''}>
        <i class="ti ti-arrow-right"></i>Advance stage
      </button>
    </div>
    <p class="ms" style="margin-bottom:16px">Client: ${t.buyer} · Deadline: ${t.deadline}</p>
    <div class="stepper">
      ${state.txStages.map((s,i)=>`
        <div class="step ${i<t.stage?'done':i===t.stage?'current':''}">
          <div class="sline"></div>
          <div class="sdot">${i<t.stage?'<i class=\"ti ti-check\"></i>':i+1}</div>
          <div class="slabel">${s}</div>
        </div>`).join('')}
    </div>

    <div class="grid grid-2" style="margin-bottom:16px">
      <div class="rc">
        <p class="rl">Budget vs. spent</p>
        <p class="rv">€${t.spent.toLocaleString('en-US')} / €${t.budget.toLocaleString('en-US')}</p>
        <div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:${pct>=100?'var(--danger)':pct>=80?'#F9AB00':'var(--accent)'}"></div></div>
        <p class="rsb">${pct}% of budget consumed${pct>=80?' — alert threshold reached':''}</p>
      </div>
      <div class="rc">
        <p class="rl">Client portal</p>
        <p class="rv">Active</p>
        <p class="rsb">Client can view progress and approve documents</p>
      </div>
    </div>

    <p class="section-label">Tasks</p>
    <div class="chk-row done"><input type="checkbox" checked disabled><label>Brief &amp; site survey completed</label></div>
    <div class="chk-row done"><input type="checkbox" checked disabled><label>Concepts presented to client</label></div>
    <div class="chk-row"><input type="checkbox" onchange="toast('success','Task updated','Task status has been saved.')"><label>Final documentation delivered</label></div>

    ${isArch ? `
    <p class="section-label">Permits &amp; approvals</p>
    <div class="card elevated">
      <div class="permit-row"><div><p class="permit-name">Building permit</p><p class="permit-sub">Submitted to local authority</p></div><span class="badge badge-pending">In review</span></div>
      <div class="permit-row"><div><p class="permit-name">Fire safety approval</p><p class="permit-sub">Documentation prepared</p></div><span class="badge badge-neutral">Not started</span></div>
      <div class="permit-row"><div><p class="permit-name">Technical documentation</p><p class="permit-sub">Structural drawings finalized</p></div><span class="badge badge-active">Approved</span></div>
    </div>` : `
    <p class="section-label">Mood board &amp; material selections</p>
    <div class="card elevated">
      <div class="moodboard">
        <div class="swatch"><div class="swatch-color" style="background:#EDE6DA"></div><span>Warm oak</span></div>
        <div class="swatch"><div class="swatch-color" style="background:#D9CBB8"></div><span>Linen</span></div>
        <div class="swatch"><div class="swatch-color" style="background:#3C4A3E"></div><span>Deep sage</span></div>
        <div class="swatch"><div class="swatch-color" style="background:#B9A48C"></div><span>Brass</span></div>
        <div class="swatch"><div class="swatch-color" style="background:#F4F1EC"></div><span>Off-white</span></div>
      </div>
    </div>`}

    <p class="section-label">Document vault</p>
    <div class="feed-item" style="border:none;padding:8px 0"><div class="fi-icon"><i class="ti ti-file-text"></i></div><div class="fi-text"><p>Signed contract.pdf</p><span>Added 3 weeks ago</span></div></div>
    <div class="feed-item" style="border:none;padding:8px 0"><div class="fi-icon"><i class="ti ti-file-text"></i></div><div class="fi-text"><p>Client brief.pdf</p><span>Added 3 weeks ago</span></div></div>
  `;
}
function advanceStage(id){
  const t = state.transactions.find(x=>x.id===id);
  if(!t || t.stage>=state.txStages.length-1) return;
  t.stage++;
  renderTx();
  openDealRoom(id);
  toast('success','Stage advanced', `"${t.property}" moved to "${state.txStages[t.stage]}".`);
}

/* ---------------------------------------------------------------------- */
/* COLLABORATION — directory, my network, developer projects               */
/* ---------------------------------------------------------------------- */
function renderDirectory(){
  const q = (document.getElementById('dirSearch').value||'').toLowerCase();
  const typeFilter = document.getElementById('dirType').value;
  const list = state.directory.filter(d=>{
    const matchQ = d.name.toLowerCase().includes(q);
    const matchT = typeFilter==='all' || d.type===typeFilter;
    return matchQ && matchT;
  });
  document.getElementById('directoryGrid').innerHTML = list.map(d=>`
    <div class="card">
      <div class="flex-gap" style="align-items:center;margin-bottom:10px">
        <div class="avatar-circle">${d.name.split(' ').map(w=>w[0]).slice(0,2).join('')}</div>
        <div><p class="mt" style="margin:0">${d.name}</p><p class="ms">${d.type} · ${d.market}</p></div>
      </div>
      <p class="ms">Languages: ${d.lang} · <i class="ti ti-star" style="color:#F9AB00"></i> ${d.rating}</p>
      <button class="btn-${d.connected?'secondary':'primary'} btn-sm btn-block" style="margin-top:12px" onclick="${d.connected?`toast('info','Already connected','You are already connected with ${d.name}.')`:`quickConnect(${d.id})`}">
        <i class="ti ti-${d.connected?'message-dots':'user-plus'}"></i>${d.connected?'Message':'Connect'}
      </button>
    </div>`).join('');
}
function quickConnect(id){
  const d = state.directory.find(x=>x.id===id);
  if(!d) return;
  d.connected = true;
  renderDirectory();
  renderMyNetwork();
  toast('success','Request sent', `A connection request has been sent to ${d.name}.`);
}
function renderMyNetwork(){
  const list = state.directory.filter(d=>d.connected);
  document.getElementById('myNetworkGrid').innerHTML = list.length ? list.map(d=>`
    <div class="card">
      <div class="flex-gap" style="align-items:center;margin-bottom:10px">
        <div class="avatar-circle">${d.name.split(' ').map(w=>w[0]).slice(0,2).join('')}</div>
        <div><p class="mt" style="margin:0">${d.name}</p><p class="ms">${d.type} · ${d.market}</p></div>
      </div>
      <span class="badge badge-active"><i class="ti ti-rosette-discount-check"></i>In your network</span>
    </div>`).join('') : `<div class="empty-state" style="grid-column:1/-1"><i class="ti ti-users"></i>You haven't connected with anyone yet.</div>`;
}
function renderDevProjects(){
  document.getElementById('devProjectsGrid').innerHTML = state.devProjects.map(p=>`
    <div class="card">
      <i class="ti ti-crane mi"></i>
      <p class="mt">${p.name}</p>
      <p class="ms">${p.developer} · <span class="badge badge-info">${p.role}</span></p>
      <p class="ms" style="margin-top:8px">${p.desc}</p>
      <button class="btn-primary btn-sm" style="margin-top:12px" onclick="toast('success','Application sent (demo)','Your application for &quot;${p.name}&quot; has been sent to the developer.')"><i class="ti ti-send"></i>Apply</button>
    </div>`).join('');
}
function populateRequestOptions(){
  const sel = document.getElementById('rClient');
  sel.innerHTML = state.directory.map(d=>`<option value="${d.id}">${d.name} — ${d.type}</option>`).join('');
}
function sendReferral(){
  const sel = document.getElementById('rClient');
  const name = sel.options[sel.selectedIndex] ? sel.options[sel.selectedIndex].text : 'the professional';
  closeModal('modal-send-request');
  showSection('collaboration');
  toast('success','Request sent', `Your collaboration request has been sent to ${name}.`);
}

/* ---------------------------------------------------------------------- */
/* AI TOOLS                                                                */
/* ---------------------------------------------------------------------- */
function generateDescription(){
  const type = document.getElementById('descType').value;
  const city = document.getElementById('descCity').value || 'the project location';
  const size = document.getElementById('descSize').value || '140';
  const features = document.getElementById('descFeatures').value || 'clean lines, natural materials';
  const loading = document.getElementById('descLoading');
  loading.style.display = 'block';
  setTimeout(()=>{
    loading.style.display = 'none';
    document.getElementById('descOutput').value = buildDescription(type, city, size, features);
    toast('success','Description generated','Feel free to edit the result before publishing.');
  }, 700);
}
function generateStaging(){
  const room = document.getElementById('stagingRoom').value;
  const style = document.getElementById('stagingStyle').value;
  document.getElementById('stagingResultCard').innerHTML = `
    <p class="mt">Staged result</p>
    <div class="listing-photo" style="height:180px;background:#8E24AA;border-radius:8px;margin-bottom:12px">
      <i class="ti ti-sofa"></i>
    </div>
    <p class="ms">Your ${room.toLowerCase()} has been virtually staged in <strong style="color:var(--text-primary)">${style}</strong> style. The result is ready to attach to your portfolio gallery or an active listing.</p>
    <button class="btn-secondary btn-sm" style="margin-top:10px" onclick="toast('success','Attached (demo)','The staged image has been attached to your portfolio gallery.')"><i class="ti ti-link"></i>Attach to portfolio</button>
  `;
  toast('success','Room staged','The virtual staging result is ready.');
}
function generateTranslation(){
  const lang = document.getElementById('translateLang').value;
  const input = document.getElementById('translateInput').value;
  const samples = {
    ro:'Renovare completă a unui apartament cu 3 dormitoare, stil scandinav, materiale naturale, finalizat în 10 săptămâni.',
    fr:'Rénovation complète d\'un appartement de 3 chambres, style scandinave, matériaux naturels, achevée en 10 semaines.',
    de:'Komplettsanierung einer 3-Zimmer-Wohnung im skandinavischen Stil mit natürlichen Materialien, abgeschlossen in 10 Wochen.',
    es:'Renovación completa de un apartamento de 3 dormitorios, estilo escandinavo, materiales naturales, terminada en 10 semanas.',
    ar:'تجديد كامل لشقة من 3 غرف نوم بأسلوب اسكندنافي ومواد طبيعية، تم الانتهاء منه خلال 10 أسابيع.',
  };
  document.getElementById('translateOutput').value = input ? (samples[lang] || samples.ro) : '';
  toast('success','Translated','The text has been translated.');
}
function renderTrendInsights(){
  renderBarChart('trendInsightsChart', [
    {label:'Scandinavian', value:38, color:CHART_COLORS[0]},
    {label:'Modern Luxury', value:31, color:CHART_COLORS[1]},
    {label:'Mediterranean', value:19, color:CHART_COLORS[2]},
    {label:'Industrial', value:14, color:CHART_COLORS[3]},
    {label:'Classic', value:8, color:CHART_COLORS[4]},
  ], {leftPad:150, suffix:' searches'});
}
function copyText(id){
  const el = document.getElementById(id);
  el.select();
  document.execCommand('copy');
  toast('success','Copied','The text has been copied to your clipboard.');
}

/* Homy chat */
const homyAnswers = [
  {keys:['trend','trending','style','scandinavian'], a:'Scandinavian and Modern Luxury are leading searches this month in Bucharest, especially for 2–3 bedroom renovations. Mediterranean is growing fastest in seaside markets like Mamaia.'},
  {keys:['underperform','weak','views'], a:'"Extension + full renovation" and "Boutique office fit-out" have the fewest views in the last 30 days. Try adding more photos or marking one of them as featured.'},
  {keys:['charge','price','cost','estimate'], a:'Based on your market and finish level, full renovations in Bucharest typically range from €250–€400/m² for premium finishes. Try the Cost Estimate Calculator in Leads & CRM for a tailored figure.'},
];
function homyReply(question){
  const q = question.toLowerCase();
  const match = homyAnswers.find(a=>a.keys.some(k=>q.includes(k)));
  return match ? match.a : 'Good question! In the live version, Homy analyzes your live LuciHome data to answer this precisely. For this demo, try one of the suggested questions on the right.';
}
function renderHomyGreeting(){
  const chat = document.getElementById('homyChat');
  chat.innerHTML = '';
  appendChat('bot', "Hi Elena! I'm Homy, your LuciHome AI assistant. Ask me about market trends, your portfolio performance, or pricing.");
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
/* PROFILE                                                                 */
/* ---------------------------------------------------------------------- */
function toggleProfileEdit(){
  const bio = document.getElementById('profBio');
  const editing = bio.getAttribute('contenteditable')==='true';
  bio.setAttribute('contenteditable', editing ? 'false' : 'true');
  bio.style.outline = editing ? 'none' : '1px solid var(--accent)';
  bio.style.borderRadius = '6px';
  document.querySelectorAll('#profEditFields input').forEach(i=>i.disabled = editing);
  document.getElementById('editProfileBtn').innerHTML = editing ? '<i class="ti ti-edit"></i>Edit profile' : '<i class="ti ti-device-floppy"></i>Save profile';
  if(editing) toast('success','Profile saved','Your public profile has been updated.');
}

/* ---------------------------------------------------------------------- */
/* SETTINGS                                                                */
/* ---------------------------------------------------------------------- */
function toggleIntegration(btn){
  const name = btn.dataset.name;
  const connected = btn.classList.contains('connected');
  if(connected){
    btn.classList.remove('connected');
    btn.innerHTML = 'Connect';
    toast('info','Disconnected', `${name} has been disconnected.`);
  } else {
    btn.classList.add('connected');
    btn.innerHTML = 'Connected <i class="ti ti-check"></i>';
    toast('success','Connected', `${name} is now connected to your LuciHome workspace.`);
  }
}
function exportAccountData(){
  const data = JSON.stringify({portfolio:state.portfolio, contacts:state.contacts, transactions:state.transactions}, null, 2);
  const blob = new Blob([data], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'lucihome-account-data.json';
  a.click();
  URL.revokeObjectURL(url);
  toast('success','Export ready','Your account data has been downloaded as a JSON file.');
}
function confirmDeleteAccount(){
  const val = document.getElementById('deleteConfirmInput').value.trim();
  if(val!=='DELETE'){
    toast('warning','Confirmation required','Please type DELETE to confirm this action.');
    return;
  }
  closeModal('modal-delete-account');
  toast('danger','Demo only','Account deletion is disabled in this demo — no data was removed.');
}
function exportReport(){
  toast('success','Report exported','Your monthly performance report has been generated as a PDF (demo).');
}

/* ---------------------------------------------------------------------- */
/* SLIDER helpers used in modal (referral % + before/after in wizard)      */
/* ---------------------------------------------------------------------- */

/* ---------------------------------------------------------------------- */
/* INIT                                                                    */
/* ---------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', ()=>{
  renderFeed();
  renderAgenda();
  renderDashboardCharts();
  renderPortfolio();
  renderTx();
  renderKanban();
  renderDirectory();
  renderMyNetwork();
  renderDevProjects();
  renderAnalyticsCharts();
  renderTrendInsights();
  renderHomyGreeting();
});
