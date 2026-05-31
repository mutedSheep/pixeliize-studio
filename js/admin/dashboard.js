/* ============================================================
   js/admin/dashboard.js
   Dashboard charts and top products list
   Requires Chart.js (loaded in Dashboard.html via CDN)
   ============================================================ */

'use strict';

/* ── Revenue Chart ── */
(function initRevenueChart() {
  const ctx = document.getElementById('revenueChart');
  if (!ctx) return;

  const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, 'rgba(74,124,199,0.25)');
  gradient.addColorStop(1, 'rgba(74,124,199,0)');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      datasets: [{
        label: 'Revenue (₱)',
        data: [18400, 22100, 19800, 31200, 27500, 35600, 42100, 38900, 44300, 48200, 51000, 55800],
        borderColor: '#4A7CC7',
        backgroundColor: gradient,
        borderWidth: 2.5,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#4A7CC7',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.4,
      }]
    },
    options: {
      responsive: true,
      interaction: { intersect: false, mode: 'index' },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#111827',
          titleColor: '#9CA3AF',
          bodyColor: '#fff',
          padding: 12,
          cornerRadius: 10,
          callbacks: {
            label: ctx => ' ₱' + ctx.parsed.y.toLocaleString(),
          }
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#9CA3AF', font: { size: 11 } } },
        y: {
          grid: { color: '#F3F4F6' },
          ticks: {
            color: '#9CA3AF',
            font: { size: 11 },
            callback: v => '₱' + (v >= 1000 ? (v/1000).toFixed(0)+'K' : v),
          }
        }
      }
    }
  });
})();

/* ── Category Donut Chart ── */
(function initCategoryChart() {
  const ctx = document.getElementById('categoryChart');
  if (!ctx) return;

  const labels   = ['Presentation', 'Photo Edits', 'Banners', 'Flyers', 'Video'];
  const data     = [8, 6, 4, 3, 3];
  const colors   = ['#4A7CC7', '#8B5CF6', '#5BB8D4', '#C45FA0', '#F59E0B'];

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: '#fff',
        hoverOffset: 6,
      }]
    },
    options: {
      responsive: true,
      cutout: '68%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#111827',
          titleColor: '#9CA3AF',
          bodyColor: '#fff',
          padding: 10,
          cornerRadius: 10,
          callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed} products` }
        }
      }
    }
  });

  /* Build custom legend */
  const total = data.reduce((a, b) => a + b, 0);
  const container = document.getElementById('legend-container');
  if (!container) return;
  container.innerHTML = labels.map((label, i) => `
    <div class="flex items-center justify-between text-xs">
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" style="background:${colors[i]}"></span>
        <span class="text-gray-600">${label}</span>
      </div>
      <span class="font-semibold text-navy">${data[i]} <span class="text-gray-400 font-normal">(${Math.round(data[i]/total*100)}%)</span></span>
    </div>`).join('');
})();

/* ── Top Products ── */
(function initTopProducts() {
  const container = document.getElementById('top-products-list');
  if (!container) return;

  const top = [
    { title: 'Nexus Corporate Deck', cat: 'Presentation', sales: 1204, rev: '₱781K' },
    { title: 'Summer Sale Banner Set', cat: 'Banner',       sales: 890,  rev: '₱355K' },
    { title: 'Aurora Creative Portfolio', cat: 'Presentation', sales: 890, rev: '₱445K' },
    { title: 'Social Reel Edit Pack', cat: 'Video',         sales: 489,  rev: '₱489K' },
    { title: 'Product Composite Pack', cat: 'Photo',         sales: 567,  rev: '₱453K' },
  ];

  const catColor = { Presentation:'#4A7CC7', Banner:'#5BB8D4', Video:'#8B5CF6', Photo:'#C45FA0', Flyer:'#F59E0B' };

  container.innerHTML = top.map((p, i) => `
    <div class="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition">
      <div class="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-800 font-display text-white flex-shrink-0"
           style="background:linear-gradient(135deg,#4A7CC7,#8B5CF6)">${i + 1}</div>
      <div class="flex-1 min-w-0">
        <p class="text-navy text-sm font-semibold truncate">${p.title}</p>
        <p class="text-xs font-semibold mt-0.5" style="color:${catColor[p.cat] || '#4A7CC7'}">${p.cat}</p>
      </div>
      <div class="text-right flex-shrink-0">
        <p class="text-navy text-sm font-700">${p.sales.toLocaleString()}</p>
        <p class="text-gray-400 text-xs">sales</p>
      </div>
    </div>`).join('');
})();

/* ── URL Parameter & Toast Notification ── */
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('login') === 'success') {
    showToast('Successfully logged in!', false);
    
    // Clean up the URL parameter without refreshing the page
    window.history.replaceState({}, document.title, window.location.pathname);
  }
});

function showToast(msg, isError = false) {
  const toast = document.getElementById('toast-notification');
  const msgEl = document.getElementById('toast-message');
  const iconEl = document.getElementById('toast-icon');
  if (!toast || !msgEl || !iconEl) return;
  
  msgEl.textContent = msg;
  toast.style.borderColor = isError ? 'rgba(239,68,68,0.3)' : 'rgba(91,184,212,0.3)';
  
  if (isError) {
    iconEl.innerHTML = '<svg class="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';
  } else {
    iconEl.innerHTML = '<svg class="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>';
  }
  
  toast.classList.remove('hidden');
  toast.classList.add('flex');
  setTimeout(() => { toast.classList.add('hidden'); toast.classList.remove('flex'); }, 3000);
}
