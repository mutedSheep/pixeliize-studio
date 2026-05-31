/* ============================================================
   js/admin/products.js
   Admin Products page — gallery render, upload, edit, delete
   Depends on: products-data.js (loaded before this file)
   ============================================================ */

'use strict';

/* ── State ── */
let adminFilter  = 'all';
let adminSortVal = 'popular';
let currentAdminProduct = null;

/* Local mutable copy of products (simulates a DB) */
let adminProducts = PRODUCTS.map(p => ({ ...p }));

/* ── Boot ── */
document.addEventListener('DOMContentLoaded', () => adminRender());

/* ── Filter helpers ── */
function adminFilterCategory(cat) {
  adminFilter = cat;
  document.querySelectorAll('#category-filters .filter-btn').forEach(btn => btn.classList.remove('active'));
  const idx = ['all','picture','banner','flyer','presentation','video'].indexOf(cat);
  const btns = document.querySelectorAll('#category-filters .filter-btn');
  if (btns[idx]) btns[idx].classList.add('active');
  adminRender();
}

function adminSort(val) { adminSortVal = val; adminRender(); }

function adminRender() {
  const searchVal = (document.getElementById('admin-search')?.value || '').toLowerCase().trim();

  let list = adminFilter === 'all' ? [...adminProducts] : adminProducts.filter(p => p.category === adminFilter);
  if (searchVal) list = list.filter(p => p.title.toLowerCase().includes(searchVal) || p.category.includes(searchVal));

  if (adminSortVal === 'popular')   list.sort((a, b) => b.downloads - a.downloads);
  if (adminSortVal === 'newest')    list.sort((a, b) => b.id - a.id);
  if (adminSortVal === 'priceasc')  list.sort((a, b) => a.price - b.price);
  if (adminSortVal === 'pricedesc') list.sort((a, b) => b.price - a.price);

  const countEl = document.getElementById('admin-count');
  if (countEl) countEl.textContent = `${list.length} product${list.length !== 1 ? 's' : ''}`;

  const grid = document.getElementById('admin-products-grid');
  if (!grid) return;

  if (list.length === 0) {
    grid.innerHTML = `<div class="col-span-3 text-center py-20 text-gray-400">
      <svg class="w-12 h-12 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
      <p class="font-semibold text-lg">No products found</p></div>`;
    return;
  }

  grid.innerHTML = list.map(p => buildAdminCard(p)).join('');
}

function buildAdminCard(p) {
  const safeJSON = JSON.stringify(p).replace(/'/g, "\\'");
  return `
    <div class="product-card bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
         onclick='openAdminProductModal(${safeJSON})'>
      <div class="${p.imgClass} relative h-48 flex items-center justify-center">
        <div class="product-overlay absolute inset-0 bg-black/30 flex items-center justify-center">
          <div class="bg-white/90 backdrop-blur-sm text-navy text-xs font-semibold px-4 py-2 rounded-full">View Details</div>
        </div>
        <div class="relative z-10">${p.icon}</div>
        <div class="absolute top-3 right-3 price-badge text-white text-xs font-bold px-2.5 py-1 rounded-lg">₱${p.price.toLocaleString()}</div>
        <div class="absolute top-3 left-3 bg-black/40 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-md capitalize">${p.category}</div>
      </div>
      <div class="p-4">
        <h3 class="font-display font-700 text-navy text-sm leading-tight mb-1">${p.title}</h3>
        <div class="flex items-center justify-between mt-2">
          <div class="flex items-center gap-1">
            <span style="color:#F59E0B" class="text-xs">★</span>
            <span class="text-gray-500 text-xs">${p.rating}</span>
          </div>
          <span class="text-gray-400 text-xs">${p.downloads.toLocaleString()} sales</span>
        </div>
      </div>
    </div>`;
}

/* ── Admin Product Detail Modal ── */
function openAdminProductModal(product) {
  currentAdminProduct = product;

  document.getElementById('adm-modal-title').textContent          = product.title;
  document.getElementById('adm-modal-author').textContent         = product.author;
  document.getElementById('adm-modal-price').textContent          = `₱${product.price.toLocaleString()}`;
  document.getElementById('adm-modal-rating').textContent         = `${product.rating} reviews`;
  document.getElementById('adm-modal-desc').textContent           = product.desc;
  document.getElementById('adm-modal-img-inner').className        = `absolute inset-0 ${product.imgClass}`;
  document.getElementById('adm-modal-icon').innerHTML             = product.icon;
  document.getElementById('adm-modal-category-badge').textContent =
    product.category.charAt(0).toUpperCase() + product.category.slice(1);
  document.getElementById('adm-modal-features').innerHTML = product.features
    .map(f => `<div class="flex items-center gap-2 text-xs text-gray-600">
      <svg class="w-4 h-4 flex-shrink-0" style="color:#4A7CC7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
      </svg>${f}</div>`).join('');

  showModal('admin-product-modal');
}

function closeAdminProductModal() { hideModal('admin-product-modal'); }

/* ── Edit Modal ── */
function openEditModal(product) {
  currentAdminProduct = product;
  document.getElementById('edit-title').value    = product.title;
  document.getElementById('edit-category').value = product.category;
  document.getElementById('edit-price').value    = product.price;
  document.getElementById('edit-desc').value     = product.desc;
  document.getElementById('edit-features').value = product.features.join(', ');
  hideModal('admin-product-modal');
  showModal('edit-product-modal');
}

function closeEditModal() { hideModal('edit-product-modal'); }

function saveEditProduct() {
  const title    = document.getElementById('edit-title').value.trim();
  const category = document.getElementById('edit-category').value;
  const price    = parseInt(document.getElementById('edit-price').value);
  const desc     = document.getElementById('edit-desc').value.trim();
  const features = document.getElementById('edit-features').value.split(',').map(f => f.trim()).filter(Boolean);

  if (!title || !category || !price || !desc) {
    showToast('Please fill in all required fields.', true); return;
  }

  const idx = adminProducts.findIndex(p => p.id === currentAdminProduct.id);
  if (idx !== -1) {
    adminProducts[idx] = { ...adminProducts[idx], title, category, price, desc, features };
    currentAdminProduct = adminProducts[idx];
  }

  closeEditModal();
  adminRender();
  showToast('Product updated successfully!');
}

/* ── Delete ── */
function confirmDeleteProduct(product) {
  if (!confirm(`Delete "${product.title}"? This cannot be undone.`)) return;
  adminProducts = adminProducts.filter(p => p.id !== product.id);
  closeAdminProductModal();
  adminRender();
  showToast('Product deleted.');
}

/* ── Upload Modal ── */
function openUploadModal() { showModal('upload-product-modal'); }
function closeUploadModal() {
  hideModal('upload-product-modal');
  resetUploadForm();
}

function resetUploadForm() {
  ['upload-title','upload-price','upload-features'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const desc = document.getElementById('upload-desc');
  const cat  = document.getElementById('upload-category');
  if (desc) desc.value = '';
  if (cat)  cat.value  = '';
  const errEl = document.getElementById('upload-error');
  if (errEl) errEl.classList.add('hidden');
  resetUploadZone();
}

function handleUploadSubmit() {
  const title    = document.getElementById('upload-title')?.value.trim();
  const category = document.getElementById('upload-category')?.value;
  const price    = parseInt(document.getElementById('upload-price')?.value);
  const desc     = document.getElementById('upload-desc')?.value.trim();
  const features = (document.getElementById('upload-features')?.value || '')
    .split(',').map(f => f.trim()).filter(Boolean);

  const errEl = document.getElementById('upload-error');

  if (!title || !category || !price || !desc) {
    if (errEl) { errEl.textContent = 'Please fill in all required fields.'; errEl.classList.remove('hidden'); }
    return;
  }

  /* Map category to imgClass + icon from PRODUCTS constant */
  const catMap = {
    picture:      { imgClass: 'img-photo',  icon: PRODUCTS[3].icon },
    banner:       { imgClass: 'img-banner', icon: PRODUCTS[6].icon },
    flyer:        { imgClass: 'img-flyer',  icon: PRODUCTS[8].icon },
    presentation: { imgClass: 'img-pres',   icon: PRODUCTS[0].icon },
    video:        { imgClass: 'img-video',  icon: PRODUCTS[10].icon },
  };

  const newProduct = {
    id: Date.now(),
    title,
    category,
    price,
    desc,
    features: features.length ? features : ['Included File', 'Fully Editable'],
    author: 'by Pixeliize Studio',
    rating: '5.0 (0)',
    downloads: 0,
    imgClass: catMap[category]?.imgClass || 'img-pres',
    icon: catMap[category]?.icon || PRODUCTS[0].icon,
  };

  adminProducts.unshift(newProduct);
  closeUploadModal();
  adminRender();
  showToast('Product published successfully!');
}

/* ── File upload zone ── */
let selectedFile = null;

function handleFileSelect(event) {
  selectedFile = event.target.files[0];
  if (selectedFile) updateUploadZoneUI(selectedFile.name);
}
function handleDragOver(e) {
  e.preventDefault();
  document.getElementById('upload-zone')?.classList.add('drag-over');
}
function handleDragLeave() {
  document.getElementById('upload-zone')?.classList.remove('drag-over');
}
function handleDrop(e) {
  e.preventDefault();
  document.getElementById('upload-zone')?.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file) { selectedFile = file; updateUploadZoneUI(file.name); }
}
function updateUploadZoneUI(name) {
  const zoneContent = document.getElementById('upload-zone-content');
  if (!zoneContent) return;
  zoneContent.innerHTML = `
    <svg class="w-8 h-8 mx-auto mb-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
    </svg>
    <p class="text-sm font-semibold text-navy truncate px-4">${name}</p>
    <button onclick="resetUploadZone(event)" class="text-xs text-red-400 mt-1 hover:underline">Remove</button>`;
}
function resetUploadZone(e) {
  if (e) e.stopPropagation();
  selectedFile = null;
  const fi = document.getElementById('upload-file-input');
  if (fi) fi.value = '';
  const zc = document.getElementById('upload-zone-content');
  if (!zc) return;
  zc.innerHTML = `
    <svg class="w-10 h-10 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
    </svg>
    <p class="text-sm font-semibold text-navy">Drag & drop your file here</p>
    <p class="text-xs text-gray-400 mt-1">or click to browse — PNG, JPG, MP4, PDF, PPTX</p>`;
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
function showToast(msg, isError = false) {
  const toast = document.getElementById('toast-success');
  const msgEl = document.getElementById('toast-message');
  if (!toast || !msgEl) return;
  msgEl.textContent = msg;
  toast.style.borderColor = isError ? 'rgba(239,68,68,0.3)' : 'rgba(91,184,212,0.3)';
  toast.classList.remove('hidden');
  toast.classList.add('flex');
  setTimeout(() => { toast.classList.add('hidden'); toast.classList.remove('flex'); }, 3000);
}

/* ── ESC ── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    hideModal('admin-product-modal');
    hideModal('edit-product-modal');
    hideModal('upload-product-modal');
  }
});
