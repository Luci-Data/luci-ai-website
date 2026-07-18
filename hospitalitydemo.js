/* ==========================================================================
   LuciHome — Hospitality Workspace Demo
   Interaction layer for the property manager view: property portfolio
   management, portfolio-wide room/unit approval, a shared guest CRM
   pipeline, a multi-property reservation room, ecosystem referrals, AI
   tools, portfolio brand/profile and analytics. Reuses the same
   dependency-free SVG chart engine, quick-create menu, dropdowns, modal
   system and slide-over detail drawer pattern as the Agency Workspace demo.
   ========================================================================== */

let nextId = 1000;
const CHART_COLORS = ['#1A73E8','#12B5CB','#F29900','#D93025','#9334E6','#188038'];
const BRAND_COLORS = ['#1A73E8','#188038','#9334E6','#D93025','#F29900','#12B5CB','#202124'];

const state = {

  agents: [
    {id:1, name:'Golden Horizon Boutique Hotel', initials:'GH', role:'Hotel & Resort', market:'Bucharest', listings:42, leads:9, closed:6, revenue:19200, responseTime:'2.4h', status:'active', bio:'A 42-room boutique hotel in Bucharest\'s Old Town, walking distance to the historic center.'},
    {id:2, name:'Carpathian Pines Villas', initials:'CP', role:'Villas & Private Rentals', market:'Brasov', listings:8, leads:7, closed:4, revenue:16400, responseTime:'5.1h', status:'active', bio:'8 private mountain villas near Poiana Brasov, popular with families and groups.'},
    {id:3, name:'Seaside Serviced Suites', initials:'SS', role:'Serviced Apartments', market:'Constanta', listings:24, leads:6, closed:3, revenue:11100, responseTime:'4.0h', status:'active', bio:'24 serviced apartments in Mamaia, favored by long-stay and business guests.'},
  ],
  agentSuspended:{},

  feed: [
    {id:1, icon:'ti-calendar-plus', text:'<strong>Golden Horizon</strong> received a new reservation for the Executive Suite.', time:'18 min ago', read:false},
    {id:2, icon:'ti-user-plus', text:'New unassigned inquiry came in from the portfolio profile page.', time:'1 h ago', read:false},
    {id:3, icon:'ti-arrows-exchange', text:'New referral received from <strong>Paris Prestige Immobilier</strong>.', time:'2 h ago', read:false},
    {id:4, icon:'ti-door-check', text:'<strong>Carpathian Pines Villas</strong> completed a 7-night stay for the Rhodes family.', time:'4 h ago', read:false},
    {id:5, icon:'ti-alert-triangle', text:'Reservation "Seafront Studio" has had no activity for 6 days.', time:'yesterday, 5:40 PM', read:false},
    {id:6, icon:'ti-door', text:'<strong>Seaside Serviced Suites</strong> published a new unit — 1-Bedroom Sea View Apartment.', time:'yesterday, 11:05 AM', read:true},
  ],

  attention: [
    {icon:'ti-clock', danger:false, text:'2 guest inquiries have not been responded to in over 48 hours.', sub:'Golden Horizon, Seaside Serviced Suites'},
    {icon:'ti-tools', danger:false, text:'"Garden View Twin" room needs a maintenance check before check-in.', sub:'Golden Horizon Boutique Hotel'},
    {icon:'ti-alert-triangle', danger:true, text:'"Seafront Studio" reservation is missing the guest ID document.', sub:'Stalled 6 days — no activity'},
  ],

  teamAgenda: [
    {time:'09:00', text:'Housekeeping round — all rooms, Golden Horizon', sub:'Full floor inspection · 45 min', done:false},
    {time:'11:30', text:'Maintenance visit — Garden View Twin, Golden Horizon', sub:'Plumbing check before next check-in', done:false},
    {time:'14:00', text:'Deadline — Studio Villa with Hot Tub approval', sub:'Carpathian Pines submission', done:false},
    {time:'16:30', text:'Deep clean — 3-Bedroom Pine Villa turnover', sub:'Scheduled Tuesday', done:true},
  ],

  resources: [
    {id:1, name:'Portfolio onboarding guide.pdf', icon:'ti-file-text'},
    {id:2, name:'Cross-border referral script.docx', icon:'ti-file-text'},
    {id:3, name:'Q2 2026 market report — Black Sea Coast.pdf', icon:'ti-file-text'},
  ],

  weekTrend:{
    labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    views:[820,910,860,1040,1180,990,1250],
    leads:[4,6,5,8,7,5,9],
  },

  listings: [
    {id:1, title:'Deluxe Double Room', city:'Golden Horizon Boutique Hotel, Bucharest', type:'Deluxe Room', price:120, beds:2, baths:1, size:28, status:'active', views:412, agentId:1, tags:['Breakfast included']},
    {id:2, title:'Executive Suite', city:'Golden Horizon Boutique Hotel, Bucharest', type:'Suite', price:210, beds:3, baths:1, size:45, status:'offer', views:378, agentId:1, tags:['Sea / mountain view','Breakfast included'], grad:'#12B5CB'},
    {id:3, title:'Garden View Twin', city:'Golden Horizon Boutique Hotel, Bucharest', type:'Standard Room', price:95, beds:2, baths:1, size:24, status:'sold', views:120, agentId:1, tags:[], grad:'#80868B'},
    {id:4, title:'3-Bedroom Pine Villa', city:'Carpathian Pines Villas, Brasov', type:'Villa', price:340, beds:6, baths:3, size:160, status:'active', views:378, agentId:2, tags:['Terrace','Parking'], grad:'#9334E6'},
    {id:5, title:'2-Bedroom Pine Villa', city:'Carpathian Pines Villas, Brasov', type:'Villa', price:260, beds:4, baths:2, size:120, status:'offer', views:214, agentId:2, tags:['Parking'], grad:'#80868B'},
    {id:6, title:'Studio Villa with Hot Tub', city:'Carpathian Pines Villas, Brasov', type:'Studio Apartment', price:190, beds:2, baths:1, size:60, status:'pending', views:0, agentId:2, tags:['Pet friendly'], grad:'#F29900'},
    {id:7, title:'Seafront Studio', city:'Seaside Serviced Suites, Constanta', type:'Studio Apartment', price:85, beds:2, baths:1, size:32, status:'active', views:196, agentId:3, tags:['Sea / mountain view'], grad:'#188038'},
    {id:8, title:'1-Bedroom Sea View Apartment', city:'Seaside Serviced Suites, Constanta', type:'Suite', price:130, beds:3, baths:1, size:52, status:'active', views:151, agentId:3, tags:['Sea / mountain view','Breakfast included'], grad:'#9334E6'},
    {id:9, title:'Penthouse Suite', city:'Seaside Serviced Suites, Constanta', type:'Suite', price:280, beds:4, baths:2, size:90, status:'draft', views:0, agentId:3, tags:['Terrace'], grad:'#80868B'},
  ],
  listingView:'grid',

  contacts: [
    {id:1, name:'Michael Turner', initials:'MT', budget:120, type:'Business', stage:'contacted', agentId:1, notes:'Looking for a 3-night stay in the Executive Suite, arriving next week.', activity:[{d:'Jul 8', t:'Inquiry came in from the Golden Horizon profile'},{d:'Jul 9', t:'First reply — interested, will confirm dates'}]},
    {id:2, name:'The Rhodes family', initials:'RF', budget:340, type:'Group', stage:'offer', agentId:2, notes:'7-night stay at the 3-Bedroom Pine Villa, celebrating a family reunion.', activity:[{d:'Jul 2', t:'Requested a quote for the full week'},{d:'Jul 10', t:'Offer sent, awaiting confirmation'}]},
    {id:3, name:'Robert Constantin', initials:'RC', budget:150, type:'Leisure', stage:'new', agentId:null, notes:'Interested in a long weekend at Golden Horizon. Not yet assigned.', activity:[{d:'Jul 11', t:'New inquiry from the portfolio profile page'}]},
    {id:4, name:'Anna Popescu', initials:'AP', budget:90, type:'Leisure', stage:'viewing', agentId:3, notes:'Looking for a studio for a weekend getaway, flexible on dates.', activity:[{d:'Jul 5', t:'Contacted by phone'},{d:'Jul 9', t:'Availability check scheduled for July 14'}]},
    {id:5, name:'Bogdan Ellis', initials:'BE', budget:260, type:'Business', stage:'closed', agentId:2, notes:'Stay completed — the 2-Bedroom Pine Villa.', activity:[{d:'Jun 20', t:'Booking confirmed'},{d:'Jun 30', t:'Stay completed successfully'}]},
    {id:6, name:'Corina Vale', initials:'CV', budget:210, type:'Leisure', stage:'new', agentId:null, notes:'Asked for more details about the Executive Suite. Not yet assigned.', activity:[{d:'Jul 10', t:'Message received via the platform'}]},
    {id:7, name:'Teodora Barbu', initials:'TB', budget:85, type:'Long-stay', stage:'contacted', agentId:3, notes:'Relocating to Constanta for work, needs a 6-week stay.', activity:[{d:'Jul 6', t:'Inquiry assigned to Seaside Serviced Suites team'}]},
    {id:8, name:'Sorin Enache', initials:'SE', budget:190, type:'Leisure', stage:'viewing', agentId:2, notes:'Looking at the hot tub studio for a couples getaway.', activity:[{d:'Jul 4', t:'First availability check scheduled'}]},
    {id:9, name:'Larisa Ionescu', initials:'LI', budget:95, type:'Leisure', stage:'new', agentId:null, notes:'Enquired about the Garden View Twin, no response yet.', activity:[{d:'Jul 12', t:'New inquiry — awaiting assignment'}]},
  ],
  stages: [
    {id:'new', label:'New Inquiry'},
    {id:'contacted', label:'Contacted'},
    {id:'viewing', label:'Quote Sent'},
    {id:'offer', label:'Booking Pending'},
    {id:'closed', label:'Checked Out'},
  ],
  selectedContactId:null,

  transactions: [
    {id:1, property:'Executive Suite, Golden Horizon', buyer:'Michael Turner', seller:'Golden Horizon Front Desk', agentId:1, stage:2, commission:630, commissionStatus:'Pending', lastActivity:'1 day ago',
      docs:['Booking confirmation.pdf','Guest ID scan.pdf'], checklist:[{t:'Guest ID verification', done:true},{t:'Deposit received', done:true},{t:'Room prepared & inspected', done:false},{t:'Welcome message sent', done:false}]},
    {id:2, property:'3-Bedroom Pine Villa', buyer:'The Rhodes family', seller:'Carpathian Pines Villas', agentId:2, stage:4, commission:2380, commissionStatus:'Pending', lastActivity:'3 hours ago',
      docs:['Rental agreement.pdf','Damage deposit receipt.pdf','Guest ID scan.pdf'], checklist:[{t:'Guest ID verification', done:true},{t:'Deposit received', done:true},{t:'Room prepared & inspected', done:true},{t:'Welcome message sent', done:true},{t:'Check-out & deposit refund', done:false}]},
    {id:3, property:'Seafront Studio', buyer:'Teodora Barbu', seller:'Seaside Serviced Suites', agentId:3, stage:1, commission:510, commissionStatus:'Projected', lastActivity:'6 days ago', stalled:true,
      docs:['Booking confirmation.pdf'], checklist:[{t:'Guest ID verification', done:false},{t:'Deposit received', done:false},{t:'Room prepared & inspected', done:false}]},
  ],
  archivedTx:[
    {id:99, property:'2-Bedroom Pine Villa', buyer:'Bogdan Ellis', seller:'Carpathian Pines Villas', agentId:2, commission:1560, closedOn:'June 30, 2026'}
  ],
  txStages:['Booked','Confirmed','Prepared','Checked-in','Checked-out','Completed'],
  currentTxId:1,
  archiveVisible:false,

  sentReferrals:[
    {id:1, client:'Corina Vale', market:'Golden Horizon Boutique Hotel, Bucharest', agent:'Sophie Laurent — Paris Prestige Immobilier', handlingAgent:'Golden Horizon Front Desk', pct:15, status:'pending'},
    {id:2, client:'Bogdan Ellis (past guest)', market:'Carpathian Pines Villas, Brasov', agent:'Khalid Al-Farsi — Dubai Estates Partners', handlingAgent:'Carpathian Pines Team', pct:12, status:'closed'},
  ],
  receivedReferrals:[
    {id:1, client:'Marc Dubois (French client)', market:'Bucharest, Romania', agent:'Sophie Laurent — Paris', pct:15, status:'pending', budget:150, notes:'Relocating for a project, needs a 2-week stay while apartment hunting.', assignedTo:null},
    {id:2, client:'Fatima Al-Sayed', market:'Constanta, Romania', agent:'Khalid Al-Farsi — Dubai', pct:12, status:'pending', budget:220, notes:'Investor scouting the Black Sea coast, wants a premium sea-view stay.', assignedTo:'Seaside Serviced Suites Team'},
  ],
  partners:[
    {id:1, name:'Paris Prestige Immobilier', contact:'Sophie Laurent', market:'Paris, France', lang:'FR / EN', rating:4.9, deals:5},
    {id:2, name:'Dubai Estates Partners', contact:'Khalid Al-Farsi', market:'Dubai, UAE', lang:'AR / EN', rating:4.8, deals:3},
    {id:3, name:'Milano Casa Group', contact:'Marco Bianchi', market:'Milan, Italy', lang:'IT / EN', rating:4.7, deals:1},
    {id:4, name:'Barcelona Home Partners', contact:'Laura Fernandez', market:'Barcelona, Spain', lang:'ES / EN', rating:4.6, deals:0},
  ],

  directory:[
    {id:1, name:'Paris Prestige Immobilier', type:'Agency', market:'Paris, France', lang:'FR / EN', rating:4.9, connected:true},
    {id:2, name:'Dubai Estates Partners', type:'Agency', market:'Dubai, UAE', lang:'AR / EN', rating:4.8, connected:true},
    {id:3, name:'Skyline Development', type:'Developer', market:'Cluj-Napoca, Romania', lang:'RO / EN', rating:4.6, connected:false},
    {id:4, name:'BRD Corporate Travel Desk', type:'Corporate', market:'Romania (national)', lang:'RO / EN', rating:4.5, connected:false},
    {id:5, name:'Black Sea Events Co.', type:'Planner', market:'Constanta, Romania', lang:'RO / EN', rating:4.7, connected:false},
    {id:6, name:'Carpathia Tours', type:'Operator', market:'Brasov, Romania', lang:'RO / EN', rating:4.6, connected:true},
    {id:7, name:'Milano Casa Group', type:'Agency', market:'Milan, Italy', lang:'IT / EN', rating:4.7, connected:true},
    {id:8, name:'Barcelona Home Partners', type:'Agency', market:'Barcelona, Spain', lang:'ES / EN', rating:4.6, connected:true},
    {id:9, name:'Sophie Laurent', type:'Agency', market:'Paris, France', lang:'FR / EN', rating:4.9, connected:true},
  ],

  marketGroups:[
    {id:1, name:'Dubai Corporate Travel', members:214, joined:false, desc:'A network of corporate travel managers booking stays for relocating employees.'},
    {id:2, name:'Paris Luxury Referral Circle', members:156, joined:true, desc:'A group of agencies referring luxury clients travelling to Romania.'},
    {id:3, name:'Brasov Mountain Hosts', members:98, joined:false, desc:'Hosts and tour operators focused on the Poiana Brasov ski &amp; hiking season.'},
    {id:4, name:'Black Sea Coast Rentals', members:187, joined:true, desc:'A community focused exclusively on the Constanta / Mamaia rental market.'},
  ],

  buyerOrigin:[
    {label:'Romania', value:44}, {label:'France', value:22}, {label:'UAE', value:16}, {label:'Italy', value:11}, {label:'Other', value:7},
  ],

  reviews:[
    {id:1, guest:'Michael Turner', property:'Golden Horizon Boutique Hotel', text:'Fantastic stay, the staff went above and beyond during check-in.'},
    {id:2, guest:'The Rhodes family', property:'Carpathian Pines Villas', text:'Beautiful villa, very clean, would book again for our next trip.'},
    {id:3, guest:'Teodora Barbu', property:'Seaside Serviced Suites', text:'Great location near the beach, though the wifi was a bit slow.'},
  ],

  brandColor:'#1A73E8',
  integrations:{},
  wizardStep:1,
  uploadedFiles:[],
  aiChatLog:[],
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
  if(id==='modal-add-room') resetWizard();
  if(id==='modal-send-referral') populateReferralSelects();
  if(id==='modal-add-guest') populateAgentSelect('cAgent');
  if(id==='modal-add-reservation') populateRoomSelect('resRoom');
}
function closeModal(id){ document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('.modal-overlay').forEach(ov=>{
  ov.addEventListener('click', e=>{ if(e.target===ov) ov.classList.remove('open'); });
});

function populateAgentSelect(selectId, includeUnassigned){
  const sel = document.getElementById(selectId);
  const activeAgents = state.agents.filter(a=>a.status==='active');
  sel.innerHTML = (includeUnassigned ? '<option value="">Unassigned</option>' : '') +
    activeAgents.map(a=>`<option value="${a.id}">${a.name} — ${a.market}</option>`).join('');
}
function populateRoomSelect(selectId){
  const sel = document.getElementById(selectId);
  sel.innerHTML = state.listings.map(l=>`<option value="${l.id}">${l.title} — ${l.city}</option>`).join('');
}

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
    {name:'Profile views (portfolio-wide)', color:'#1A73E8', values:state.weekTrend.views},
    {name:'New inquiries (×80 scale)', color:'#12B5CB', values:state.weekTrend.leads.map(v=>v*80)},
  ], state.weekTrend.labels);

  const segs = state.stages.map((s,i)=>({
    label:s.label,
    value: state.contacts.filter(c=>c.stage===s.id).length,
    color: CHART_COLORS[i%CHART_COLORS.length],
  }));
  renderDonutChart('dashFunnelDonut', segs);
}

function renderAnalyticsCharts(){
  const marketTotals = {};
  state.listings.forEach(l=>{ const city=l.city.split(',').pop().trim(); marketTotals[city]=(marketTotals[city]||0)+l.views; });
  const marketItems = Object.keys(marketTotals).map((k,i)=>({label:k, value:marketTotals[k], color:CHART_COLORS[i%CHART_COLORS.length]}));
  renderBarChart('marketPerfChart', marketItems, {leftPad:130});

  renderBarChart('leadFunnelChart', [
    {label:'New inquiry', value:38, color:CHART_COLORS[0]},
    {label:'Contacted', value:29, color:CHART_COLORS[0]},
    {label:'Quote sent', value:19, color:CHART_COLORS[0]},
    {label:'Booking pending', value:10, color:CHART_COLORS[0]},
    {label:'Checked out', value:6, color:CHART_COLORS[0]},
  ], {leftPad:150});

  renderDonutChart('buyerOriginChart', state.buyerOrigin.map((b,i)=>({label:b.label, value:b.value, color:CHART_COLORS[i%CHART_COLORS.length]})));

  const top = [...state.listings].sort((a,b)=>b.views-a.views).slice(0,6)
    .map((l,i)=>({label:l.title.length>26?l.title.slice(0,26)+'…':l.title, value:l.views, color:CHART_COLORS[i%CHART_COLORS.length]}));
  renderBarChart('listingViewsChart', top, {leftPad:190});
}

function renderAgentPerfTable(){
  const body = document.getElementById('agentPerfBody');
  const maxRevenue = Math.max(...state.agents.map(a=>a.revenue), 1);
  body.innerHTML = state.agents.filter(a=>a.status==='active').map(a=>{
    const score = Math.round((a.revenue/maxRevenue)*100);
    const color = score>70?'var(--success)':score>40?'var(--warning)':'var(--danger)';
    const occ = Math.min(97, 60+score/3);
    const adr = Math.round(a.revenue / (a.listings*3 || 1));
    const revpar = Math.round(adr * occ/100);
    return `<tr>
      <td class="strong">${a.name}<div class="ms" style="margin-top:2px">${a.role} · ${a.market}</div></td>
      <td>${a.listings}</td>
      <td>${occ.toFixed(0)}%</td>
      <td>€${adr}</td>
      <td class="strong">€${revpar}</td>
      <td><span class="score-bar"><span class="score-fill" style="width:${score}%;background:${color}"></span></span>${score}</td>
    </tr>`;
  }).join('');
}

/* ---------------------------------------------------------------------- */
/* DASHBOARD — feed, attention list, arrivals list                        */
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
  toast('success','Updated','All portfolio activity has been marked as read.');
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

function renderAttentionList(){
  const list = document.getElementById('attentionList');
  list.innerHTML = state.attention.map(a=>`
    <div class="attention-row">
      <div class="attention-icon ${a.danger?'danger':''}"><i class="ti ${a.icon}"></i></div>
      <div class="attention-text"><p>${a.text}</p><span>${a.sub}</span></div>
    </div>`).join('');
}

function renderLeaderboard(){
  const list = document.getElementById('leaderboardList');
  const arrivals = [
    {name:'Michael Turner', room:'Executive Suite', nights:3, note:'Late check-in requested'},
    {name:'The Rhodes family', room:'3-Bedroom Pine Villa', nights:7, note:'Early check-in confirmed'},
    {name:'Anna Popescu', room:'Seafront Studio', nights:2, note:'Departing today'},
    {name:'Sorin Enache', room:'Studio Villa with Hot Tub', nights:2, note:'Arriving today'},
  ];
  list.innerHTML = arrivals.map((a,i)=>`
    <div class="leaderboard-row">
      <div class="lb-rank">${i+1}</div>
      <div style="flex:1;min-width:0">
        <p class="lb-name">${a.name}</p>
        <p class="lb-sub">${a.room} · ${a.note}</p>
      </div>
      <div class="lb-value"><p class="v">${a.nights}n</p><p class="l">stay</p></div>
    </div>`).join('');
}

/* ---------------------------------------------------------------------- */
/* PROPERTIES                                                              */
/* ---------------------------------------------------------------------- */
const roleBadge = {'Hotel & Resort':'badge-info', 'Villas & Private Rentals':'badge-active', 'Serviced Apartments':'badge-neutral'};

function renderProperties(){
  const q = (document.getElementById('propertySearch').value||'').toLowerCase();
  const typeFilter = document.getElementById('propertyTypeFilter').value;
  let items = state.agents.filter(a=>{
    const matchQ = a.name.toLowerCase().includes(q) || a.market.toLowerCase().includes(q);
    const matchType = typeFilter==='all' || a.role===typeFilter;
    return matchQ && matchType;
  });
  document.getElementById('propertiesGrid').innerHTML = items.map(a=>`
    <div class="card hoverable" style="cursor:pointer" onclick="openAgentDetail(${a.id})">
      <div class="flex flex-gap" style="align-items:center;margin-bottom:10px">
        <div class="avatar-circle">${a.initials}</div>
        <div style="flex:1;min-width:0">
          <p class="mt" style="margin-bottom:2px">${a.name}</p>
          <span class="badge ${roleBadge[a.role]}">${a.role}</span>
        </div>
      </div>
      <p class="ms" style="margin-bottom:10px"><i class="ti ti-map-pin" style="margin-right:4px"></i>${a.market} ${a.status==='invited'?' · <span style="color:var(--warning)">Setup pending</span>':''}</p>
      <div class="grid grid-3" style="gap:8px">
        <div class="mini-stat" style="padding:8px"><p class="v" style="font-size:15px">${a.listings}</p><p class="l">Rooms</p></div>
        <div class="mini-stat" style="padding:8px"><p class="v" style="font-size:15px">${a.leads}</p><p class="l">Inquiries</p></div>
        <div class="mini-stat" style="padding:8px"><p class="v" style="font-size:15px">${a.closed}</p><p class="l">Closed</p></div>
      </div>
    </div>`).join('') || `<div class="empty-state" style="grid-column:1/-1"><i class="ti ti-building"></i><p>No properties match your filters.</p></div>`;
}

function openAgentDetail(id){
  const a = state.agents.find(x=>x.id===id);
  if(!a) return;
  document.getElementById('agentDetailName').textContent = a.name;
  document.getElementById('agentDetailBody').innerHTML = `
    <div class="flex flex-gap" style="align-items:center;margin-bottom:14px">
      <div class="avatar-circle lg">${a.initials}</div>
      <div>
        <p class="mt" style="font-size:16px;margin-bottom:4px">${a.name}</p>
        <span class="badge ${roleBadge[a.role]}">${a.role}</span>
      </div>
    </div>
    <p class="ms" style="margin-bottom:16px">${a.bio}</p>
    <div class="grid grid-4" style="margin-bottom:16px">
      <div class="mini-stat"><p class="v">${a.listings}</p><p class="l">Rooms</p></div>
      <div class="mini-stat"><p class="v">${a.leads}</p><p class="l">Active inquiries</p></div>
      <div class="mini-stat"><p class="v">${a.closed}</p><p class="l">Stays closed</p></div>
      <div class="mini-stat"><p class="v">${a.responseTime}</p><p class="l">Avg. response time</p></div>
    </div>
    <div class="field"><label class="field-label">Ecosystem commission default</label><select class="select"><option>15% (standard)</option><option>12% (partner rate)</option><option>Custom per referral</option></select></div>
  `;
  const suspendBtn = document.getElementById('agentSuspendBtn');
  const isSuspended = !!state.agentSuspended[id];
  suspendBtn.innerHTML = isSuspended ? '<i class="ti ti-building-check"></i>Reactivate property' : '<i class="ti ti-building-off"></i>Deactivate property';
  suspendBtn.dataset.agentId = id;
  openModal('modal-agent-detail');
}
function toggleSuspendAgent(){
  const id = Number(document.getElementById('agentSuspendBtn').dataset.agentId);
  const isSuspended = !!state.agentSuspended[id];
  state.agentSuspended[id] = !isSuspended;
  closeModal('modal-agent-detail');
  const a = state.agents.find(x=>x.id===id);
  toast(isSuspended?'success':'warning', isSuspended?'Property reactivated':'Property deactivated', isSuspended
    ? `${a.name} is visible on LuciHome again.`
    : `${a.name}'s rooms will be hidden from search until reactivated. Full activity history is retained (demo).`);
}
function addProperty(){
  const name = document.getElementById('pName').value.trim();
  if(!name){ toast('warning','Missing name','Please enter the property name.'); return; }
  state.agents.push({
    id: nextId++, name, initials: name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase(),
    role: document.getElementById('pType').value, market: document.getElementById('pCity').value || 'Bucharest',
    listings: Number(document.getElementById('pRooms').value)||0, leads:0, closed:0, revenue:0, responseTime:'—', status:'active', bio:'Newly added property, awaiting its first reservations.',
  });
  closeModal('modal-add-property');
  ['pName','pCity','pRooms'].forEach(id=>document.getElementById(id).value='');
  renderProperties(); updateSidebarCounts();
  toast('success','Property added', `${name} has been added to your portfolio.`);
}

function renderTeamAgenda(){
  const list = document.getElementById('teamAgendaList');
  list.innerHTML = state.teamAgenda.map((a,i)=>`
    <div class="agenda-item ${a.done?'done':''}">
      <div class="agenda-time">${a.time}</div>
      <div class="agenda-text"><p>${a.text}</p><span>${a.sub}</span></div>
      <input type="checkbox" ${a.done?'checked':''} onchange="toggleTeamAgenda(${i})" style="accent-color:var(--accent);width:16px;height:16px;cursor:pointer">
    </div>`).join('');
}
function toggleTeamAgenda(i){
  state.teamAgenda[i].done = !state.teamAgenda[i].done;
  renderTeamAgenda();
}

function renderResources(){
  document.getElementById('resourcesList').innerHTML = state.resources.map(r=>`
    <div class="feed-item" style="border:none;padding:8px 0;cursor:default">
      <div class="fi-icon"><i class="ti ${r.icon}"></i></div>
      <div class="fi-text"><p>${r.name}</p><span>Visible to all properties</span></div>
    </div>`).join('');
}
function uploadResource(){
  const name = 'New resource — ' + new Date().toLocaleDateString('en-US') + '.pdf';
  state.resources.unshift({id:nextId++, name, icon:'ti-file-text'});
  renderResources();
  toast('success','Uploaded','The resource has been added to the shared library.');
}

/* ---------------------------------------------------------------------- */
/* ROOMS & UNITS                                                           */
/* ---------------------------------------------------------------------- */
const statusLabel = {pending:'Pending approval', draft:'Draft', active:'Available', offer:'Booked', sold:'Out of service'};
const statusBadge = {pending:'badge-pending', draft:'badge-neutral', active:'badge-active', offer:'badge-pending', sold:'badge-sold'};
const typeIcon = {'Standard Room':'ti-bed','Deluxe Room':'ti-bed-flat','Suite':'ti-building-castle','Villa':'ti-home','Studio Apartment':'ti-home-2'};

function agentName(id){ const a = state.agents.find(x=>x.id===id); return a ? a.name : 'Unassigned'; }
function agentInitials(id){ const a = state.agents.find(x=>x.id===id); return a ? a.initials : '—'; }

function populateListingAgentFilter(){
  const sel = document.getElementById('roomPropertyFilter');
  sel.innerHTML = '<option value="all">All properties</option>' + state.agents.map(a=>`<option value="${a.id}">${a.name}</option>`).join('');
}

function renderApprovalList(){
  const pending = state.listings.filter(l=>l.status==='pending');
  const box = document.getElementById('approvalList');
  if(pending.length===0){
    box.innerHTML = `<div class="note-box" style="margin-bottom:20px"><i class="ti ti-circle-check"></i> Nothing waiting for approval right now.</div>`;
    return;
  }
  box.innerHTML = pending.map(l=>`
    <div class="card" style="margin-bottom:12px">
      <div class="flex-between" style="flex-wrap:wrap;gap:10px">
        <div>
          <p class="mt">${l.title}</p>
          <p class="ms">${l.city} · submitted by the property team</p>
        </div>
        <div class="flex flex-gap">
          <button class="btn-secondary btn-sm" onclick="requestListingChanges(${l.id})"><i class="ti ti-message-2"></i>Request changes</button>
          <button class="btn-primary btn-sm" onclick="approveListing(${l.id})"><i class="ti ti-check"></i>Approve &amp; publish</button>
        </div>
      </div>
    </div>`).join('');
}
function approveListing(id){
  const l = state.listings.find(x=>x.id===id);
  if(l){ l.status='active'; }
  renderApprovalList(); renderRooms(); updateSidebarCounts();
  toast('success','Room published', `"${l.title}" is now live on LuciHome.`);
}
function requestListingChanges(id){
  const l = state.listings.find(x=>x.id===id);
  toast('info','Changes requested', `The property team has been notified to update "${l.title}".`);
}

function renderRooms(){
  const q = (document.getElementById('roomSearch').value||'').toLowerCase();
  const propFilter = document.getElementById('roomPropertyFilter').value;
  const statusFilter = document.getElementById('roomStatusFilter').value;
  let items = state.listings.filter(l=>{
    const matchQ = l.title.toLowerCase().includes(q) || l.city.toLowerCase().includes(q);
    const matchProp = propFilter==='all' || String(l.agentId)===propFilter;
    const matchStatus = statusFilter==='all' || l.status===statusFilter;
    return matchQ && matchProp && matchStatus;
  });
  const grid = document.getElementById('roomsGrid');
  grid.className = state.listingView==='grid' ? 'grid grid-3' : 'grid grid-2';
  if(items.length===0){
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><i class="ti ti-door-off"></i><p>No rooms or units match your filters.</p></div>`;
    return;
  }
  grid.innerHTML = items.map(l=>`
    <div class="card listing-card">
      <div class="listing-photo" style="${l.grad?`background:linear-gradient(135deg,${l.grad},#20212433)`:''}">
        <i class="ti ${typeIcon[l.type]||'ti-door'}"></i>
        <span class="badge ${statusBadge[l.status]} ph-badge">${statusLabel[l.status]}</span>
        <span class="ph-views"><i class="ti ti-eye"></i>${l.views}</span>
      </div>
      <div class="listing-body">
        <p class="listing-price">€${l.price} / night</p>
        <p class="listing-addr"><i class="ti ti-map-pin"></i>${l.city}</p>
        <div class="listing-specs">
          <span><i class="ti ti-users"></i>${l.beds}</span>
          <span><i class="ti ti-bath"></i>${l.baths||1}</span>
          <span><i class="ti ti-ruler-2"></i>${l.size} m²</span>
        </div>
        <p class="ms" style="margin-bottom:12px"><i class="ti ti-building" style="margin-right:4px"></i>${agentName(l.agentId)}</p>
        <div class="listing-actions">
          <button class="btn-secondary btn-sm" style="flex:1" onclick="toast('info','Preview','Opens the public room page (demo).')"><i class="ti ti-eye"></i>Preview</button>
          <button class="btn-secondary btn-sm" style="flex:1" onclick="reassignListing(${l.id})"><i class="ti ti-arrows-exchange"></i>Reassign</button>
        </div>
      </div>
    </div>`).join('');
}
function reassignListing(id){
  const l = state.listings.find(x=>x.id===id);
  const others = state.agents.filter(a=>a.status==='active' && a.id!==l.agentId);
  const next = others[Math.floor(Math.random()*others.length)];
  l.agentId = next.id;
  renderRooms();
  toast('success','Room reassigned', `"${l.title}" is now listed under ${next.name}.`);
}
function setRoomView(v){
  state.listingView = v;
  document.getElementById('gridViewBtn').classList.toggle('active', v==='grid');
  document.getElementById('listViewBtn').classList.toggle('active', v==='list');
  renderRooms();
}

/* ---------------------------------------------------------------------- */
/* ADD ROOM WIZARD                                                         */
/* ---------------------------------------------------------------------- */
function resetWizard(){
  state.wizardStep = 1;
  state.uploadedFiles = [];
  ['wTitle','wSize','wCity','wZone','wPrice','wBeds','wDesc'].forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; });
  document.getElementById('uploadedFilesList').innerHTML='';
  populateAgentSelect('wAgent');
  renderWizardStep();
}
function renderWizardStep(){
  for(let i=1;i<=5;i++){ document.getElementById('wizardStep'+i).style.display = (i===state.wizardStep)?'block':'none'; }
  const dots = document.getElementById('wizardDots');
  dots.innerHTML = [1,2,3,4,5].map(i=>`<span class="wdot ${i===state.wizardStep?'active':i<state.wizardStep?'done':''}"></span>`).join('');
  document.getElementById('wizardBackBtn').style.display = state.wizardStep>1 ? 'inline-flex' : 'none';
  document.getElementById('wizardNextBtn').innerHTML = state.wizardStep<5 ? 'Continue' : '<i class="ti ti-send"></i>Submit room';
}
function wizardNav(dir){
  if(dir>0 && state.wizardStep===5){ submitListing(); return; }
  state.wizardStep = Math.min(5, Math.max(1, state.wizardStep+dir));
  renderWizardStep();
}
function simulateUpload(){
  const n = state.uploadedFiles.length+1;
  state.uploadedFiles.push('photo-'+n+'.jpg');
  document.getElementById('uploadedFilesList').innerHTML = state.uploadedFiles.map(f=>`
    <div class="feed-item" style="border:none;padding:6px 0;cursor:default"><div class="fi-icon"><i class="ti ti-photo"></i></div><div class="fi-text"><p>${f}</p><span>Uploaded</span></div></div>`).join('');
}
function wizardGenerateDesc(){
  const title = document.getElementById('wTitle').value || 'this room';
  const city = document.getElementById('wCity').value || 'the property';
  document.getElementById('wDesc').value = `Discover ${title.toLowerCase()} located at ${city}. This room combines comfort and style, with premium finishes and thoughtful touches for a memorable stay. Book directly through LuciHome to secure your dates.`;
  toast('success','Description generated','The AI description is ready — feel free to edit it.');
}
function submitListing(){
  const title = document.getElementById('wTitle').value.trim();
  const agentId = Number(document.getElementById('wAgent').value);
  if(!title){ toast('warning','Missing title','Please enter a room or unit name before submitting.'); return; }
  const needsApproval = Math.random() < 0.35;
  state.listings.unshift({
    id: nextId++, title, city: (agentName(agentId) + ', ' + (document.getElementById('wCity').value || 'Bucharest')), type: document.getElementById('wType').value,
    price: Number(document.getElementById('wPrice').value)||0, beds: Number(document.getElementById('wBeds').value)||0, baths:1,
    size: Number(document.getElementById('wSize').value)||0, status: needsApproval?'pending':'active', views:0, agentId, tags:[], grad: CHART_COLORS[Math.floor(Math.random()*CHART_COLORS.length)],
  });
  closeModal('modal-add-room');
  renderRooms(); renderApprovalList(); updateSidebarCounts();
  toast('success', needsApproval?'Submitted for approval':'Room published', needsApproval
    ? `The room has been sent for review before publishing.`
    : `"${title}" is now live on LuciHome.`);
}

/* ---------------------------------------------------------------------- */
/* GUESTS & CRM — kanban pipeline                                          */
/* ---------------------------------------------------------------------- */
function populateCrmAgentFilter(){
  const sel = document.getElementById('crmAgentFilter');
  sel.innerHTML = '<option value="all">All staff</option><option value="unassigned">Unassigned</option>' + state.agents.map(a=>`<option value="${a.id}">${a.name}</option>`).join('');
}
function renderKanban(){
  const q = (document.getElementById('crmSearch').value||'').toLowerCase();
  const agentFilter = document.getElementById('crmAgentFilter').value;
  const board = document.getElementById('kanbanBoard');
  board.innerHTML = state.stages.map(stage=>{
    const cards = state.contacts.filter(c=>{
      const matchStage = c.stage===stage.id;
      const matchQ = c.name.toLowerCase().includes(q) || c.type.toLowerCase().includes(q);
      const matchAgent = agentFilter==='all' || (agentFilter==='unassigned' ? !c.agentId : String(c.agentId)===agentFilter);
      return matchStage && matchQ && matchAgent;
    });
    return `<div class="kcol" data-stage="${stage.id}" ondragover="event.preventDefault();this.classList.add('dragover')" ondragleave="this.classList.remove('dragover')" ondrop="dropCard(event,'${stage.id}')">
      <div class="kcol-head"><span>${stage.label}</span><span class="kcol-count">${cards.length}</span></div>
      ${cards.map(c=>`
        <div class="kcard" draggable="true" ondragstart="dragCard(event,${c.id})" onclick="openContactDrawer(${c.id})">
          <p class="kname"><span class="kavatar">${c.initials}</span>${c.name}</p>
          <p class="kmeta">€${c.budget.toLocaleString('en-US')}/night · ${c.type}</p>
          <p class="kmeta">${c.agentId ? '<i class="ti ti-building"></i> '+agentName(c.agentId) : '<span style="color:var(--warning)"><i class="ti ti-alert-circle"></i> Unassigned</span>'}</p>
        </div>`).join('')}
    </div>`;
  }).join('');
  document.getElementById('crmUnassignedCount').textContent = state.contacts.filter(c=>!c.agentId).length;
  document.getElementById('crmOver24Count').textContent = 2;
  document.getElementById('crmClosedCount').textContent = state.contacts.filter(c=>c.stage==='closed').length;
}
let draggedId = null;
function dragCard(e,id){ draggedId = id; e.target.classList.add('dragging'); }
function dropCard(e, stageId){
  e.currentTarget.classList.remove('dragover');
  const contact = state.contacts.find(c=>c.id===draggedId);
  if(contact){ contact.stage = stageId; }
  document.querySelectorAll('.kcard.dragging').forEach(el=>el.classList.remove('dragging'));
  renderKanban(); renderDashboardCharts();
  toast('success','Moved', `${contact.name} moved to "${state.stages.find(s=>s.id===stageId).label}".`);
}

function openContactDrawer(id){
  state.selectedContactId = id;
  const c = state.contacts.find(x=>x.id===id);
  document.getElementById('cdName').textContent = c.name;
  document.getElementById('cdBody').innerHTML = `
    <div class="flex flex-gap" style="align-items:center;margin-bottom:16px">
      <div class="avatar-circle lg">${c.initials}</div>
      <div>
        <p class="mt" style="font-size:16px;margin-bottom:4px">${c.name}</p>
        <span class="badge badge-neutral">${c.type}</span>
      </div>
    </div>
    <div class="grid grid-2" style="margin-bottom:16px">
      <div class="mini-stat"><p class="v">€${c.budget.toLocaleString('en-US')}</p><p class="l">Budget / night</p></div>
      <div class="mini-stat"><p class="v">${state.stages.find(s=>s.id===c.stage).label}</p><p class="l">Stage</p></div>
    </div>
    <div class="field"><label class="field-label">Assigned property / staff</label>
      <select class="select" id="cdAgentSelect">
        <option value="">Unassigned</option>
        ${state.agents.filter(a=>a.status==='active').map(a=>`<option value="${a.id}" ${a.id===c.agentId?'selected':''}>${a.name}</option>`).join('')}
      </select>
    </div>
    <div class="field"><label class="field-label">Notes</label><textarea class="textarea" id="cdNotes">${c.notes}</textarea></div>
    <p class="field-label" style="margin-top:6px">Activity history</p>
    ${c.activity.map(a=>`<div class="feed-item" style="border:none;padding:6px 0;cursor:default"><div class="fi-icon"><i class="ti ti-clock"></i></div><div class="fi-text"><p>${a.t}</p><span>${a.d}</span></div></div>`).join('')}
  `;
  document.getElementById('contactDrawer').classList.add('open');
  document.getElementById('contactDrawerBackdrop').classList.add('open');
}
function closeContactDrawer(){
  document.getElementById('contactDrawer').classList.remove('open');
  document.getElementById('contactDrawerBackdrop').classList.remove('open');
}
function saveContactDetail(){
  const c = state.contacts.find(x=>x.id===state.selectedContactId);
  if(!c) return;
  const agentId = document.getElementById('cdAgentSelect').value;
  const wasUnassigned = !c.agentId;
  c.agentId = agentId ? Number(agentId) : null;
  c.notes = document.getElementById('cdNotes').value;
  closeContactDrawer();
  renderKanban();
  toast('success','Saved', wasUnassigned && c.agentId ? `${c.name} has been assigned to ${agentName(c.agentId)}.` : `Changes to ${c.name} have been saved.`);
}
function addContact(){
  const name = document.getElementById('cName').value.trim();
  if(!name){ toast('warning','Missing name','Please enter the guest\'s full name.'); return; }
  const agentId = document.getElementById('cAgent').value;
  state.contacts.push({
    id: nextId++, name, initials: name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase(),
    budget: Number(document.getElementById('cBudget').value)||0, type: document.getElementById('cType').value,
    stage:'new', agentId: agentId?Number(agentId):null, notes: document.getElementById('cNotes').value, activity:[{d:'Today', t:'Lead added manually by the property manager'}],
  });
  closeModal('modal-add-guest');
  ['cName','cEmail','cPhone','cBudget','cNotes'].forEach(id=>document.getElementById(id).value='');
  renderKanban(); updateSidebarCounts();
  toast('success','Guest lead added', `${name} has been added to the CRM.`);
}

/* ---------------------------------------------------------------------- */
/* RESERVATIONS — multi-property reservation room                         */
/* ---------------------------------------------------------------------- */
function renderTx(){
  const list = document.getElementById('txList');
  list.innerHTML = state.transactions.map(t=>`
    <div class="list-row ${t.id===state.currentTxId?'selected':''}" onclick="selectTx(${t.id})">
      <div class="avatar-circle">${agentInitials(t.agentId)}</div>
      <div style="flex:1;min-width:0">
        <p class="lr-title">${t.property} ${t.stalled?'<span class="badge badge-danger" style="margin-left:6px">Stalled</span>':''}</p>
        <p class="lr-sub">${t.buyer} · ${state.txStages[t.stage]}</p>
      </div>
    </div>`).join('');
  renderDealRoom();
}
function selectTx(id){ state.currentTxId = id; renderTx(); }
function renderDealRoom(){
  const t = state.transactions.find(x=>x.id===state.currentTxId);
  const box = document.getElementById('dealRoom');
  if(!t){ box.innerHTML = `<div class="detail-empty"><i class="ti ti-calendar-event"></i><p>Select a reservation</p></div>`; return; }
  box.innerHTML = `
    <div class="flex-between" style="margin-bottom:6px">
      <p class="mt" style="font-size:17px">${t.property}</p>
      ${t.stalled?'<span class="badge badge-danger"><i class="ti ti-alert-triangle"></i>No activity in 6 days</span>':''}
    </div>
    <p class="ms" style="margin-bottom:18px">Handled by <strong>${t.seller}</strong> · Guest: ${t.buyer}</p>

    <div class="stepper">
      ${state.txStages.map((s,i)=>`<div class="step ${i<t.stage?'done':i===t.stage?'current':''}"><div class="sline"></div><div class="sdot">${i<t.stage?'<i class="ti ti-check"></i>':i+1}</div><div class="slabel">${s}</div></div>`).join('')}
    </div>

    <div class="grid grid-2" style="margin-bottom:20px">
      <div class="mini-stat"><p class="v">€${t.commission.toLocaleString('en-US')}</p><p class="l">Total (${t.commissionStatus})</p></div>
      <div class="mini-stat"><p class="v">${t.lastActivity}</p><p class="l">Last activity</p></div>
    </div>

    <p class="field-label">Checklist</p>
    ${t.checklist.map((c,i)=>`<div class="chk-row ${c.done?'done':''}"><input type="checkbox" ${c.done?'checked':''} onchange="toggleChecklist(${t.id},${i})" id="chk${i}"><label for="chk${i}">${c.t}</label></div>`).join('')}

    <p class="field-label" style="margin-top:16px">Documents</p>
    ${t.docs.map(d=>`<div class="feed-item" style="border:none;padding:6px 0;cursor:default"><div class="fi-icon"><i class="ti ti-file-text"></i></div><div class="fi-text"><p>${d}</p><span>Uploaded</span></div></div>`).join('')}
    <button class="btn-secondary btn-sm" style="margin-top:8px" onclick="toast('info','Document vault','Manager-level upload is available from the reservation room (demo).')"><i class="ti ti-cloud-upload"></i>Upload document</button>
  `;
}
function toggleChecklist(txId, idx){
  const t = state.transactions.find(x=>x.id===txId);
  t.checklist[idx].done = !t.checklist[idx].done;
  t.lastActivity = 'just now';
  t.stalled = false;
  renderDealRoom(); renderTx();
}
function toggleArchive(){
  state.archiveVisible = !state.archiveVisible;
  const box = document.getElementById('txArchive');
  box.style.display = state.archiveVisible ? 'block' : 'none';
  document.getElementById('archiveBtnLabel').textContent = state.archiveVisible ? 'Hide archive' : 'Completed stays archive';
  if(state.archiveVisible){
    box.innerHTML = `<div class="section-label" style="margin-top:0">Completed stays</div>` + state.archivedTx.map(a=>`
      <div class="list-row">
        <div class="avatar-circle">${agentInitials(a.agentId)}</div>
        <div style="flex:1;min-width:0"><p class="lr-title">${a.property}</p><p class="lr-sub">${a.buyer} · Completed ${a.closedOn} · €${a.commission.toLocaleString('en-US')}</p></div>
      </div>`).join('');
  }
}
function addReservation(){
  const guest = document.getElementById('resGuest').value.trim();
  if(!guest){ toast('warning','Missing guest name','Please enter the guest\'s full name.'); return; }
  const roomId = Number(document.getElementById('resRoom').value);
  const room = state.listings.find(l=>l.id===roomId);
  state.transactions.unshift({
    id: nextId++, property: room ? room.title+', '+room.city.split(',')[0] : 'New reservation', buyer: guest, seller: room ? agentName(room.agentId) : 'Front desk',
    agentId: room ? room.agentId : 1, stage:0, commission: room ? room.price*3 : 0, commissionStatus:'Pending', lastActivity:'just now',
    docs:['Booking confirmation.pdf'], checklist:[{t:'Guest ID verification', done:false},{t:'Deposit received', done:false},{t:'Room prepared & inspected', done:false}],
  });
  closeModal('modal-add-reservation');
  ['resGuest'].forEach(id=>document.getElementById(id).value='');
  renderTx(); updateSidebarCounts();
  toast('success','Reservation created', `A new reservation for ${guest} has been added.`);
}

/* ---------------------------------------------------------------------- */
/* ECOSYSTEM — referrals & professional directory                         */
/* ---------------------------------------------------------------------- */
function populateReferralSelects(){
  const clientSel = document.getElementById('rClient');
  clientSel.innerHTML = state.contacts.map(c=>`<option value="${c.id}">${c.name}</option>`).join('');
  populateAgentSelect('rAgentHandling');
}
function renderReferrals(){
  document.getElementById('refSentCount').textContent = state.sentReferrals.length;
  document.getElementById('refReceivedCount').textContent = state.receivedReferrals.length;
  document.getElementById('refProgressCount').textContent = state.sentReferrals.filter(r=>r.status==='pending').length + state.receivedReferrals.filter(r=>r.status==='pending').length;
  document.getElementById('refClosedCount').textContent = state.sentReferrals.filter(r=>r.status==='closed').length;

  document.getElementById('sentReferralsList').innerHTML = state.sentReferrals.map(r=>`
    <div class="card">
      <div class="flex-between"><p class="mt">${r.client}</p><span class="badge ${r.status==='closed'?'badge-active':'badge-pending'}">${r.status}</span></div>
      <p class="ms">To ${r.market}</p>
      <p class="ms">Partner: ${r.agent}</p>
      <p class="ms">Handled by: ${r.handlingAgent} · Commission: ${r.pct}%</p>
    </div>`).join('') || `<div class="empty-state"><i class="ti ti-send"></i><p>No referrals sent yet.</p></div>`;

  document.getElementById('receivedReferralsList').innerHTML = state.receivedReferrals.map(r=>`
    <div class="card">
      <div class="flex-between"><p class="mt">${r.client}</p><span class="badge badge-pending">${r.status}</span></div>
      <p class="ms">From ${r.agent} · Destination: ${r.market}</p>
      <p class="ms">Budget: €${r.budget.toLocaleString('en-US')}/night · Commission: ${r.pct}%</p>
      <p class="ms" style="margin-bottom:10px">${r.notes}</p>
      ${r.assignedTo ? `<span class="badge badge-active"><i class="ti ti-user-check"></i>Assigned to ${r.assignedTo}</span>` : `
      <div class="field" style="margin-bottom:0">
        <label class="field-label">Assign to property</label>
        <select class="select" onchange="assignReceivedReferral(${r.id}, this.value)">
          <option value="">Choose a property...</option>
          ${state.agents.filter(a=>a.status==='active').map(a=>`<option value="${a.name}">${a.name}</option>`).join('')}
        </select>
      </div>`}
    </div>`).join('');
}
function assignReceivedReferral(id, agentName){
  if(!agentName) return;
  const r = state.receivedReferrals.find(x=>x.id===id);
  r.assignedTo = agentName;
  renderReferrals();
  toast('success','Referral assigned', `${r.client} has been assigned to ${agentName}.`);
}
function sendReferral(){
  const clientSel = document.getElementById('rClient');
  const client = clientSel.options[clientSel.selectedIndex]?.text || 'Guest';
  const agentSel = document.getElementById('rAgentHandling');
  const handlingAgent = agentSel.options[agentSel.selectedIndex]?.text?.split(' — ')[0] || 'Unassigned';
  state.sentReferrals.unshift({
    id: nextId++, client, market: document.getElementById('rMarket').value, agent: document.getElementById('rAgent').value,
    handlingAgent, pct: Number(document.getElementById('rPct').value), status:'pending',
  });
  closeModal('modal-send-referral');
  renderReferrals();
  toast('success','Referral sent', `The referral for ${client} has been sent.`);
}

function renderDirectory(){
  const q = (document.getElementById('dirSearch').value||'').toLowerCase();
  const type = document.getElementById('dirType').value;
  const items = state.directory.filter(d=>{
    const matchQ = d.name.toLowerCase().includes(q);
    const matchType = type==='all' || d.type===type;
    return matchQ && matchType;
  });
  document.getElementById('directoryGrid').innerHTML = items.map(d=>`
    <div class="card pro-card">
      <div class="pro-head">
        <div class="avatar-circle">${d.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
        <div><p class="n">${d.name}</p><p class="r">${d.type} · ${d.market}</p></div>
      </div>
      <p class="ms">${d.lang} · <span class="stars">★</span> ${d.rating}</p>
      <button class="btn-secondary btn-sm btn-block" onclick="toggleConnect(this,${d.id})">${d.connected?'Connected <i class="ti ti-check"></i>':'Connect'}</button>
    </div>`).join('') || `<div class="empty-state" style="grid-column:1/-1"><i class="ti ti-network"></i><p>No professionals match your search.</p></div>`;
}
function toggleConnect(btn, id){
  const d = state.directory.find(x=>x.id===id);
  d.connected = !d.connected;
  btn.innerHTML = d.connected ? 'Connected <i class="ti ti-check"></i>' : 'Connect';
  toast(d.connected?'success':'info', d.connected?'Connected':'Disconnected', `${d.name} ${d.connected?'has been added to':'has been removed from'} your professional network.`);
}
function renderMarketGroups(){
  document.getElementById('marketGroupsGrid').innerHTML = state.marketGroups.map(g=>`
    <div class="card">
      <p class="mt">${g.name}</p>
      <p class="ms" style="margin-bottom:10px">${g.desc}</p>
      <p class="ms" style="margin-bottom:12px"><i class="ti ti-users" style="margin-right:4px"></i>${g.members} members</p>
      <button class="btn-${g.joined?'secondary':'primary'} btn-sm btn-block" onclick="toggleJoinGroup(${g.id})">${g.joined?'Joined <i class="ti ti-check"></i>':'Join group'}</button>
    </div>`).join('');
}
function toggleJoinGroup(id){
  const g = state.marketGroups.find(x=>x.id===id);
  g.joined = !g.joined;
  if(g.joined) g.members++; else g.members--;
  renderMarketGroups();
  toast(g.joined?'success':'info', g.joined?'Joined':'Left group', `Your portfolio has ${g.joined?'joined':'left'} "${g.name}".`);
}

/* ---------------------------------------------------------------------- */
/* AI TOOLS                                                                */
/* ---------------------------------------------------------------------- */
function populateAiTools(){
  const roomSel = document.getElementById('aiPriceRoom');
  roomSel.innerHTML = state.listings.map(l=>`<option value="${l.id}">${l.title} — ${l.city}</option>`).join('');
  const reviewSel = document.getElementById('aiReviewSelect');
  reviewSel.innerHTML = state.reviews.map(r=>`<option value="${r.id}">${r.guest} — ${r.property}</option>`).join('');
  renderAiChat();
}
function renderAiChat(){
  const box = document.getElementById('aiChatBox');
  if(state.aiChatLog.length===0){
    state.aiChatLog.push({from:'bot', text:'Hi Alexandra — ask me to draft a room description, suggest a nightly rate, or summarize a guest conversation.'});
  }
  box.innerHTML = state.aiChatLog.map(m=>`<div class="chat-msg ${m.from}">${m.text}</div>`).join('');
  box.scrollTop = box.scrollHeight;
}
function sendAiChat(){
  const input = document.getElementById('aiChatInput');
  const text = input.value.trim();
  if(!text) return;
  state.aiChatLog.push({from:'user', text});
  input.value='';
  const lower = text.toLowerCase();
  let reply = `Here's a draft based on your request: "${text}" — feel free to ask me to refine the tone, shorten it, or translate it into Romanian or French.`;
  if(lower.includes('description') || lower.includes('write')){
    reply = 'Here\'s a sample description: "A bright, well-appointed room blending modern comfort with local character — perfect for both business stays and weekend escapes. Steps away from the best the city has to offer."';
  } else if(lower.includes('rate') || lower.includes('price') || lower.includes('pricing')){
    reply = 'Based on this week\'s demand and comparable properties nearby, I\'d suggest a rate between €135–€155/night for that unit — about 12% above your current price.';
  } else if(lower.includes('summar')){
    reply = 'Summary: the guest is asking about early check-in and late checkout, mentions traveling with a pet, and wants to confirm parking availability.';
  }
  state.aiChatLog.push({from:'bot', text:reply});
  renderAiChat();
}
function generateReviewReply(){
  const sel = document.getElementById('aiReviewSelect');
  const review = state.reviews.find(r=>String(r.id)===sel.value) || state.reviews[0];
  document.getElementById('aiReviewReply').value = `Thank you so much for staying with us, ${review.guest.split(' ')[0]}! We're thrilled you enjoyed your time at ${review.property} — your feedback means a lot to the whole team, and we'd love to welcome you back soon.`;
  toast('success','Reply generated','The AI reply is ready — feel free to edit before sending.');
}
function suggestPrice(){
  const sel = document.getElementById('aiPriceRoom');
  const room = state.listings.find(l=>String(l.id)===sel.value) || state.listings[0];
  const suggested = Math.round(room.price * (1 + (Math.random()*0.18 - 0.04)));
  document.getElementById('aiPriceResult').innerHTML = `
    <div class="mini-stat" style="margin-bottom:8px"><p class="v">€${suggested}</p><p class="l">Suggested rate / night (current: €${room.price})</p></div>
    <button class="btn-primary btn-block btn-sm" onclick="applyPrice(${room.id},${suggested})"><i class="ti ti-check"></i>Apply suggested rate</button>`;
}
function applyPrice(id, price){
  const room = state.listings.find(l=>l.id===id);
  room.price = price;
  renderRooms();
  toast('success','Rate updated', `${room.title} is now priced at €${price}/night.`);
}

/* ---------------------------------------------------------------------- */
/* BRAND & PROFILE                                                        */
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
  if(!profileEditing) toast('success','Profile updated','Your portfolio profile changes have been saved.');
}
function renderPublicRoster(){
  document.getElementById('publicRosterList').innerHTML = state.agents.filter(a=>a.status==='active').map(a=>`
    <div class="card" style="padding:14px">
      <div class="flex flex-gap" style="align-items:center">
        <div class="avatar-circle">${a.initials}</div>
        <div><p class="mt" style="margin-bottom:2px;font-size:13.5px">${a.name}</p><p class="ms">${a.role}</p></div>
      </div>
    </div>`).join('');
}
function renderColorSwatches(){
  document.getElementById('colorSwatches').innerHTML = BRAND_COLORS.map(c=>`
    <div class="color-swatch ${c===state.brandColor?'selected':''}" style="background:${c}" onclick="selectBrandColor('${c}')"></div>`).join('');
}
function selectBrandColor(c){
  state.brandColor = c;
  renderColorSwatches();
  toast('success','Brand color updated', 'Applied to your profile header and room cards.');
}
function copyEmbed(){
  toast('success','Copied','The embed code has been copied to your clipboard (demo).');
}

/* ---------------------------------------------------------------------- */
/* ANALYTICS — export                                                      */
/* ---------------------------------------------------------------------- */
function exportReport(){
  const lines = [
    'LuciHome — Hospitality Performance Report',
    'Portfolio: Golden Horizon Hospitality',
    'Generated: ' + new Date().toLocaleDateString('en-US'),
    '',
    'Active properties: ' + state.agents.filter(a=>a.status==='active').length,
    'Available rooms/units: ' + state.listings.filter(l=>l.status==='active').length,
    'Open reservations: ' + state.transactions.length,
    'Commission earned: €41,300',
    'Commission pending: €22,600',
    'Commission projected: €96,000',
    '',
    'Property leaderboard (by revenue):',
    ...[...state.agents].filter(a=>a.status==='active').sort((a,b)=>b.revenue-a.revenue).map(a=>`  - ${a.name}: €${a.revenue.toLocaleString('en-US')} (${a.closed} closed)`),
  ];
  downloadFile('lucihome-hospitality-report.txt', lines.join('\n'));
  toast('success','Report exported','The file lucihome-hospitality-report.txt has been downloaded.');
}
function exportAccountData(){
  const data = {
    portfolio:{name:'Golden Horizon Hospitality', contact:'office@lucihome.com'},
    properties: state.agents,
    rooms: state.listings,
    guests: state.contacts,
    reservations: state.transactions,
  };
  downloadFile('lucihome-hospitality-data.json', JSON.stringify(data, null, 2));
  toast('success','Export complete','Your portfolio data has been downloaded as JSON.');
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
/* SETTINGS & STAFF MODALS                                                 */
/* ---------------------------------------------------------------------- */
function toggleIntegration(btn){
  const connected = btn.classList.toggle('connected');
  btn.innerHTML = connected ? 'Connected <i class="ti ti-check"></i>' : 'Connect';
  toast(connected?'success':'info', connected?'Integration active':'Integration disabled', `${btn.dataset.name} is now ${connected?'connected':'disconnected'}.`);
}
function inviteAgent(){
  const name = document.getElementById('iName').value.trim();
  const email = document.getElementById('iEmail').value.trim();
  if(!name || !email){ toast('warning','Missing details','Please enter the staff member\'s name and email.'); return; }
  closeModal('modal-invite-staff');
  ['iName','iEmail','iMarket'].forEach(id=>document.getElementById(id).value='');
  toast('success','Invitation sent', `An invite has been emailed to ${email}.`);
}

/* ---------------------------------------------------------------------- */
/* SIDEBAR COUNTS                                                          */
/* ---------------------------------------------------------------------- */
function updateSidebarCounts(){
  document.querySelector('.nav-item[data-section="properties"] .nbadge').textContent = state.agents.filter(a=>a.status==='active').length;
  const activeRooms = state.listings.filter(l=>l.status==='active'||l.status==='offer'||l.status==='pending').length;
  document.querySelector('.nav-item[data-section="rooms"] .nbadge').textContent = activeRooms;
  const activeGuests = state.contacts.filter(c=>c.stage!=='closed').length;
  document.querySelector('.nav-item[data-section="guests"] .nbadge').textContent = activeGuests;
  document.querySelector('.nav-item[data-section="reservations"] .nbadge').textContent = state.transactions.length;
}

/* ---------------------------------------------------------------------- */
/* INIT                                                                    */
/* ---------------------------------------------------------------------- */
function init(){
  renderFeed();
  renderAttentionList();
  renderLeaderboard();
  renderDashboardCharts();

  populateListingAgentFilter();
  renderApprovalList();
  renderRooms();

  renderProperties();
  renderTeamAgenda();
  renderResources();

  populateCrmAgentFilter();
  renderKanban();

  renderTx();
  renderReferrals();
  renderDirectory();
  renderMarketGroups();

  populateAiTools();

  renderPublicRoster();
  renderColorSwatches();

  renderAgentPerfTable();
  renderAnalyticsCharts();

  updateSidebarCounts();

  document.getElementById('globalSearch').addEventListener('keydown', e=>{
    if(e.key==='Enter' && e.target.value.trim()){
      showSection('rooms');
      document.getElementById('roomSearch').value = e.target.value;
      renderRooms();
      toast('info','Search','Rooms & units have been filtered based on your search.');
    }
  });
}
document.addEventListener('DOMContentLoaded', init);
