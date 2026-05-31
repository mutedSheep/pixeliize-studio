/* ============================================================
   js/admin/requests.js
   Admin Requests page — card render, detail modal, assign & status
   ============================================================ */

'use strict';

/* ── Sample Requests Data ── */
const REQUESTS = [
  {
    id: 'REQ-001', clientName: 'Anna Martinez', clientEmail: 'anna.martinez@email.com',
    serviceType: 'Photo Edit', projectTitle: 'Brand Portrait Series',
    desc: 'Need professional retouching for 3 executive headshots. Moody studio look, skin smoothing, and background cleanup. Deliverable should be high-res PSD and JPG.',
    budget: '₱2,500', deadline: 'June 15, 2025', date: 'May 28, 2025',
    status: 'pending', assignedTo: null,
  },
  {
    id: 'REQ-002', clientName: 'Rafael Cruz', clientEmail: 'rafael.cruz@email.com',
    serviceType: 'Video Edit', projectTitle: 'Startup Brand Intro',
    desc: 'Cinematic 10-second brand intro for YouTube channel. Dark background with glowing logo reveal. Should include a version with and without music.',
    budget: '₱8,000', deadline: 'June 10, 2025', date: 'May 27, 2025',
    status: 'progress', assignedTo: 'Miguel Santos',
  },
  {
    id: 'REQ-003', clientName: 'Sofia Lim', clientEmail: 'sofia.lim@gmail.com',
    serviceType: 'Banner Design', projectTitle: 'Summer Sale Banners',
    desc: 'Need 2 web banners for our clothing store — 1 for website header (1920x600) and 1 for Facebook cover (820x312). Bright summer color palette.',
    budget: '₱1,800', deadline: 'May 31, 2025', date: 'May 26, 2025',
    status: 'complete', assignedTo: 'Carla Reyes',
  },
  {
    id: 'REQ-004', clientName: 'Eli Bautista', clientEmail: 'eli.bautista@work.ph',
    serviceType: 'Presentation', projectTitle: 'Q3 Investor Pitch Deck',
    desc: 'Need a 30-slide investor pitch deck designed from scratch. Corporate dark theme, modern typography. I will provide the content and structure.',
    budget: '₱5,500', deadline: 'June 20, 2025', date: 'May 25, 2025',
    status: 'review', assignedTo: 'Miguel Santos',
  },
  {
    id: 'REQ-005', clientName: 'Marco Reyes', clientEmail: 'marco.r@design.co',
    serviceType: 'Flyer / Poster', projectTitle: 'Graduation Night Event Flyer',
    desc: 'A4 event flyer for a graduation night celebration. Elegant gold and navy theme. Must include event name, date, venue, and QR code placeholder.',
    budget: '₱900', deadline: 'June 5, 2025', date: 'May 24, 2025',
    status: 'pending', assignedTo: null,
  },
  {
    id: 'REQ-006', clientName: 'Tricia Aquino', clientEmail: 'tricia.aquino@brand.com',
    serviceType: 'Photo Edit', projectTitle: 'Product Launch Composite',
    desc: 'Need 5 product composites for our new skincare line launch. White marble background, soft shadows, and color correction to match brand palette.',
    budget: '₱3,200', deadline: 'June 8, 2025', date: 'May 23, 2025',
    status: 'progress', assignedTo: 'Carla Reyes',
  },
  {
    id: 'REQ-007', clientName: 'Diego Santos', clientEmail: 'diego.s@startup.io',
    serviceType: 'Video Edit', projectTitle: 'Social Media Reel Pack',
    desc: 'Need 3 vertical reels (9:16) for Instagram and TikTok. Energetic transitions, text overlays, and music sync. Raw footage will be provided.',
    budget: '₱4,500', deadline: 'June 12, 2025', date: 'May 22, 2025',
    status: 'pending', assignedTo: null,
  },
  {
    id: 'REQ-008', clientName: 'Pia Ferrer', clientEmail: 'pia.ferrer@events.ph',
    serviceType: 'Banner Design', projectTitle: 'Corporate Event Backdrop',
    desc: 'Large format banner for corporate event backdrop (8ft x 4ft). Company logo and sponsors to be included. Will provide all logos in high resolution.',
    budget: '₱2,100', deadline: 'June 3, 2025', date: 'May 21, 2025',
    status: 'cancelled', assignedTo: null,
  },
];

/* ── Admin team members ── */
const ADMINS = [
  { name: 'Kenzo C. Ragundiaz',        role: 'Senior Editor',    initials: 'KR', color: 'linear-gradient(135deg,#4A7CC7,#8B5CF6)' },
  { name: 'John Cee S. Gumera',        role: 'Video Editor',     initials: 'JG', color: 'linear-gradient(135deg,#5BB8D4,#4A7CC7)' },
  { name: 'Lawrenz Mikael S. Alcaparaz', role: 'Photo Specialist', initials: 'LA', color: 'linear-gradient(135deg,#C45FA0,#8B5CF6)' },
  { name: 'Jericho B. Marquez',        role: 'Graphic Designer', initials: 'JM', color: 'linear-gradient(135deg,#8B5CF6,#C45FA0)' },
];

/* ── State ── */
let statusFilter  = 'all';
let currentRequest = null;

/* ── Boot ── */
document.addEventListener('DOMContentLoaded', () => {
  renderRequests();
  updatePendingBadge();
});

/* ── Render cards ── */
function renderRequests() {
  const search = (document.getElementById('req-search')?.value || '').toLowerCase().trim();

  let list = statusFilter === 'all' ? [...REQUESTS] : REQUESTS.filter(r => r.status === statusFilter);
  if (search) {
    list = list.filter(r =>
      r.clientName.toLowerCase().includes(search) ||
      r.serviceType.toLowerCase().includes(search) ||
      r.projectTitle.toLowerCase().includes(search)
    );
  }

  const countEl = document.getElementById('req-count');
  if (countEl) countEl.textContent = `${list.length} request${list.length !== 1 ? 's' : ''}`;

  /* Pending counter in tab */
  const pendingCount = REQUESTS.filter(r => r.status === 'pending').length;
  const pcEl = document.getElementById('count-pending');
  if (pcEl) pcEl.textContent = pendingCount;

  const grid = document.getElementById('requests-grid');
  if (!grid) return;

  if (list.length === 0) {
    grid.innerHTML = `<div class="col-span-3 text-center py-20 text-gray-400">
      <svg class="w-12 h-12 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
      </svg>
      <p class="font-semibold text-lg">No requests found</p></div>`;
    return;
  }

  grid.innerHTML = list.map(r => buildRequestCard(r)).join('');
}

function buildRequestCard(r) {
  const statusLabels = { pending:'Pending', progress:'In Progress', review:'In Review', complete:'Completed', cancelled:'Cancelled' };
  const statusClass  = { pending:'status-pending', progress:'status-progress', review:'status-review', complete:'status-complete', cancelled:'status-cancelled' };
  const initials = r.clientName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const avatarColors = ['linear-gradient(135deg,#4A7CC7,#8B5CF6)','linear-gradient(135deg,#5BB8D4,#4A7CC7)','linear-gradient(135deg,#C45FA0,#8B5CF6)','linear-gradient(135deg,#8B5CF6,#C45FA0)'];
  const avatarColor = avatarColors[r.id.charCodeAt(r.id.length - 1) % avatarColors.length];

  const safeJSON = JSON.stringify(r).replace(/'/g, "\\'");
  return `
    <div class="request-card bg-white rounded-2xl border border-gray-100 shadow-sm p-6" onclick='openRequestModal(${safeJSON})'>
      <div class="flex items-start justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-700 font-display text-white flex-shrink-0"
               style="background:${avatarColor}">${initials}</div>
          <div>
            <p class="font-semibold text-navy text-sm">${r.clientName}</p>
            <p class="text-xs text-gray-400">${r.clientEmail}</p>
          </div>
        </div>
        <span class="status-pill ${statusClass[r.status] || 'status-pending'}">${statusLabels[r.status] || r.status}</span>
      </div>
      <h3 class="font-display font-700 text-navy text-base mb-1">${r.projectTitle}</h3>
      <p class="text-xs font-semibold mb-3" style="color:#4A7CC7">${r.serviceType}</p>
      <p class="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-4">${r.desc}</p>
      <div class="flex items-center justify-between pt-4 border-t border-gray-100">
        <div class="flex items-center gap-1.5 text-xs text-gray-400">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          ${r.deadline}
        </div>
        <div class="flex items-center gap-1.5 text-xs font-semibold" style="color:#4A7CC7">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          ${r.budget}
        </div>
      </div>
      ${r.assignedTo ? `<div class="mt-3 text-xs text-gray-400">Assigned: <span class="font-semibold text-navy">${r.assignedTo}</span></div>` : ''}
    </div>`;
}

/* ── Status filter tabs ── */
function setStatusFilter(status, btn) {
  statusFilter = status;
  document.querySelectorAll('#status-tabs .filter-tab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderRequests();
}

/* ── Request Detail Modal ── */
function openRequestModal(request) {
  currentRequest = { ...request };

  const initials = request.clientName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const avatarColors = ['linear-gradient(135deg,#4A7CC7,#8B5CF6)','linear-gradient(135deg,#5BB8D4,#4A7CC7)','linear-gradient(135deg,#C45FA0,#8B5CF6)'];
  const avatarColor = avatarColors[request.id.charCodeAt(request.id.length - 1) % avatarColors.length];

  const statusLabels = { pending:'Pending', progress:'In Progress', review:'In Review', complete:'Completed', cancelled:'Cancelled' };
  const statusClass  = { pending:'status-pending', progress:'status-progress', review:'status-review', complete:'status-complete', cancelled:'status-cancelled' };

  document.getElementById('rdm-avatar').textContent = initials;
  document.getElementById('rdm-avatar').style.background = avatarColor;
  document.getElementById('rdm-client-name').textContent  = request.clientName;
  document.getElementById('rdm-client-email').textContent = request.clientEmail;
  document.getElementById('rdm-service-type').textContent = request.serviceType;
  document.getElementById('rdm-budget').textContent        = request.budget;
  document.getElementById('rdm-deadline').textContent      = request.deadline;
  document.getElementById('rdm-date').textContent          = request.date;
  document.getElementById('rdm-project-title').textContent = request.projectTitle;
  document.getElementById('rdm-desc').textContent          = request.desc;

  const pillEl = document.getElementById('rdm-status-pill');
  pillEl.textContent = statusLabels[request.status] || request.status;
  pillEl.className   = `status-pill ${statusClass[request.status] || 'status-pending'}`;

  /* Build assignee list */
  const assigneeList = document.getElementById('assignee-list');
  assigneeList.innerHTML = ADMINS.map(admin => `
    <div class="assignee-option flex items-center justify-between p-3 rounded-xl border border-gray-200 ${currentRequest.assignedTo === admin.name ? 'selected' : ''}"
         onclick="selectAssignee('${admin.name}', this)">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-700 font-display text-white flex-shrink-0"
             style="background:${admin.color}">${admin.initials}</div>
        <div>
          <p class="text-sm font-semibold text-navy">${admin.name}</p>
          <p class="text-xs text-gray-400">${admin.role}</p>
        </div>
      </div>
      <div class="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 assignee-radio"
           style="border-color:${currentRequest.assignedTo === admin.name ? '#4A7CC7' : '#d1d5db'}">
        ${currentRequest.assignedTo === admin.name
          ? `<div class="w-2 h-2 rounded-full" style="background:#4A7CC7"></div>`
          : ''}
      </div>
    </div>`).join('');

  /* Build status update buttons */
  const statuses = [
    { key:'pending',   label:'Pending',     cls:'bg-amber-50 text-amber-700 border-amber-200'  },
    { key:'progress',  label:'In Progress', cls:'bg-green-50 text-green-700 border-green-200'  },
    { key:'review',    label:'In Review',   cls:'bg-purple-50 text-purple-700 border-purple-200'},
    { key:'complete',  label:'Completed',   cls:'bg-blue-50 text-blue-700 border-blue-200'     },
    { key:'cancelled', label:'Cancelled',   cls:'bg-red-50 text-red-500 border-red-200'        },
  ];
  document.getElementById('status-update-btns').innerHTML = statuses.map(s => `
    <button class="text-xs font-semibold px-4 py-2 rounded-lg border transition hover:shadow-sm ${s.cls} ${currentRequest.status === s.key ? 'ring-2 ring-offset-1 ring-blue-300' : ''}"
            onclick="setRequestStatus('${s.key}', this)">${s.label}</button>`).join('');

  showModal('request-detail-modal');
}

function closeRequestModal() { hideModal('request-detail-modal'); }

function selectAssignee(name, el) {
  currentRequest.assignedTo = name;
  /* Refresh all option styles */
  document.querySelectorAll('.assignee-option').forEach(opt => {
    opt.classList.remove('selected');
    const radio = opt.querySelector('.assignee-radio');
    if (radio) { radio.style.borderColor = '#d1d5db'; radio.innerHTML = ''; }
  });
  el.classList.add('selected');
  const radio = el.querySelector('.assignee-radio');
  if (radio) {
    radio.style.borderColor = '#4A7CC7';
    radio.innerHTML = `<div class="w-2 h-2 rounded-full" style="background:#4A7CC7"></div>`;
  }
}

function setRequestStatus(status, btn) {
  currentRequest.status = status;
  document.querySelectorAll('#status-update-btns button').forEach(b => b.classList.remove('ring-2','ring-offset-1','ring-blue-300'));
  btn.classList.add('ring-2','ring-offset-1','ring-blue-300');

  /* Also update status pill in modal header */
  const statusLabels = { pending:'Pending', progress:'In Progress', review:'In Review', complete:'Completed', cancelled:'Cancelled' };
  const statusClass  = { pending:'status-pending', progress:'status-progress', review:'status-review', complete:'status-complete', cancelled:'status-cancelled' };
  const pillEl = document.getElementById('rdm-status-pill');
  pillEl.textContent = statusLabels[status];
  pillEl.className   = `status-pill ${statusClass[status]}`;
}

function saveRequestChanges() {
  /* Update the main array */
  const idx = REQUESTS.findIndex(r => r.id === currentRequest.id);
  if (idx !== -1) {
    REQUESTS[idx].status     = currentRequest.status;
    REQUESTS[idx].assignedTo = currentRequest.assignedTo;
  }
  closeRequestModal();
  renderRequests();
  updatePendingBadge();
  showToast('Request updated successfully!');
}

function updatePendingBadge() {
  const count = REQUESTS.filter(r => r.status === 'pending').length;
  const badge = document.getElementById('pending-badge');
  if (badge) badge.textContent = count;
}

/* ── Modal helpers ── */
function showModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('hidden');
  el.classList.add('flex');
  document.body.style.overflow = 'hidden';
}
function hideModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('hidden');
  el.classList.remove('flex');
  document.body.style.overflow = '';
}

/* ── Toast ── */
function showToast(msg) {
  const toast = document.getElementById('toast-success');
  const msgEl = document.getElementById('toast-message');
  if (!toast || !msgEl) return;
  msgEl.textContent = msg;
  toast.classList.remove('hidden');
  toast.classList.add('flex');
  setTimeout(() => { toast.classList.add('hidden'); toast.classList.remove('flex'); }, 3000);
}

/* ── ESC ── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') hideModal('request-detail-modal');
});
