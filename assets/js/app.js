/**
 * app.js - Main Application Engine for Informatika SMA Learning Hub
 * Handles Data Processing, Dynamic Rendering, Hash Routing, Search & Filters, Lock System, Word Doc Preview
 */

// Global Application State
let allMaterials = [];
let currentCategoryFilter = 'Semua';
let currentSearchQuery = '';

// DOM Elements
const appContainer = document.getElementById('app');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileDrawer = document.getElementById('mobileDrawer');
const closeMobileMenuBtn = document.getElementById('closeMobileMenuBtn');
const searchModal = document.getElementById('searchModal');
const openSearchBtns = document.querySelectorAll('.open-search-btn');
const closeSearchBtn = document.getElementById('closeSearchBtn');
const searchModalInput = document.getElementById('searchModalInput');
const searchModalResults = document.getElementById('searchModalResults');

// Document Preview Modal Elements
const docPreviewModal = document.getElementById('docPreviewModal');
const docModalTitle = document.getElementById('docModalTitle');
const docModalFilePath = document.getElementById('docModalFilePath');
const docModalDownloadBtn = document.getElementById('docModalDownloadBtn');
const closeDocPreviewBtn = document.getElementById('closeDocPreviewBtn');
const closeDocPreviewFooterBtn = document.getElementById('closeDocPreviewFooterBtn');

/**
 * Initialize Application
 */
async function initApp() {
  // Initialize Theme Preference
  initTheme();

  // Load Materials Dataset
  allMaterials = await fetchMaterialsData();

  // Setup Event Listeners
  setupEventListeners();

  // Handle Initial Route
  handleRoute();

  // Re-render Lucide Icons if available
  renderLucideIcons();
}

/**
 * Setup Event Listeners
 */
function setupEventListeners() {
  // Hash Routing Listener
  window.addEventListener('hashchange', () => {
    handleRoute();
    closeMobileDrawer();
    closeDocPreviewModal();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Theme Toggle Listener
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }

  // Mobile Menu Controls
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', openMobileDrawer);
  }
  if (closeMobileMenuBtn) {
    closeMobileMenuBtn.addEventListener('click', closeMobileDrawer);
  }

  // Search Modal Controls
  openSearchBtns.forEach(btn => {
    btn.addEventListener('click', openSearchModal);
  });
  if (closeSearchBtn) {
    closeSearchBtn.addEventListener('click', closeSearchModal);
  }
  if (searchModalInput) {
    searchModalInput.addEventListener('input', handleModalSearch);
  }

  // Document Preview Modal Controls
  if (closeDocPreviewBtn) {
    closeDocPreviewBtn.addEventListener('click', closeDocPreviewModal);
  }
  if (closeDocPreviewFooterBtn) {
    closeDocPreviewFooterBtn.addEventListener('click', closeDocPreviewModal);
  }

  // Keyboard Shortcuts (Ctrl+K for Search, Esc for closing modals)
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSearchModal();
    }
    if (e.key === 'Escape') {
      closeSearchModal();
      closeMobileDrawer();
      closeDocPreviewModal();
    }
  });
}

/**
 * Theme Toggle Handler
 */
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  updateThemeIcon();
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateThemeIcon();
}

function updateThemeIcon() {
  const isDark = document.documentElement.classList.contains('dark');
  const themeIcons = document.querySelectorAll('.theme-icon');
  themeIcons.forEach(icon => {
    if (isDark) {
      icon.setAttribute('data-lucide', 'sun');
    } else {
      icon.setAttribute('data-lucide', 'moon');
    }
  });
  renderLucideIcons();
}

/**
 * Mobile Drawer Handlers
 */
function openMobileDrawer() {
  if (mobileDrawer) {
    mobileDrawer.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeMobileDrawer() {
  if (mobileDrawer) {
    mobileDrawer.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

/**
 * Document Preview Modal Handlers
 */
async function openDocPreviewModal(title, filePath) {
  if (!docPreviewModal) return;
  if (docModalTitle) docModalTitle.textContent = title;
  if (docModalFilePath) docModalFilePath.textContent = `File Path: ${filePath}`;
  if (docModalDownloadBtn) {
    docModalDownloadBtn.setAttribute('href', filePath);
  }

  docPreviewModal.classList.remove('hidden');
  docPreviewModal.classList.add('flex');
  document.body.style.overflow = 'hidden';
  renderLucideIcons();
}

function closeDocPreviewModal() {
  if (docPreviewModal) {
    docPreviewModal.classList.add('hidden');
    docPreviewModal.classList.remove('flex');
    document.body.style.overflow = '';
  }
}

/**
 * Dynamic Verification for Word Document File Existence
 */
async function verifyAndRenderDocSection(material) {
  const container = document.getElementById('docSectionContainer');
  if (!container) return;

  const docFile = material.document && material.document.file;
  const isAvailable = Boolean(material.document && material.document.available);

  // If material JSON explicitly says available: false or file is missing/null
  if (!isAvailable || !docFile) {
    renderMissingDocUi(container, 'Materi belum tersedia dalam docx, silakan hubungi pengajar.');
    return;
  }

  // Perform client-side fetch check to verify if the file physically exists at URL
  try {
    const response = await fetch(docFile, { method: 'HEAD' });
    if (response.ok) {
      renderAvailableDocUi(container, material.title, docFile);
    } else {
      // 404 Not Found or file missing on disk
      renderMissingDocUi(container, 'Materi belum tersedia dalam docx, silakan hubungi pengajar.');
    }
  } catch (error) {
    // Catch fetch error (e.g. file missing under file:// or CORS 404)
    // Double check with normal GET fallback if HEAD fails
    try {
      const getRes = await fetch(docFile);
      if (getRes.ok) {
        renderAvailableDocUi(container, material.title, docFile);
      } else {
        renderMissingDocUi(container, 'Materi belum tersedia dalam docx, silakan hubungi pengajar.');
      }
    } catch (e) {
      renderMissingDocUi(container, 'Materi belum tersedia dalam docx, silakan hubungi pengajar.');
    }
  }
}

function renderAvailableDocUi(container, title, filePath) {
  container.innerHTML = `
    <div class="p-6 rounded-2xl glass-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-blue-200/80 dark:border-slate-800">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 flex items-center justify-center shrink-0">
          <i data-lucide="file-text" class="w-6 h-6"></i>
        </div>
        <div>
          <h4 class="font-bold text-slate-900 dark:text-white text-base">📄 Materi Pembelajaran</h4>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Tersedia dalam format Microsoft Word (.docx)
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2.5 w-full sm:w-auto">
        <button onclick="openDocPreviewModal('${escapeHtml(title)}', '${escapeHtml(filePath)}')" class="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition">
          <i data-lucide="eye" class="w-4 h-4"></i> Preview
        </button>
        <a href="${escapeHtml(filePath)}" download class="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-md shadow-blue-500/20">
          <i data-lucide="download" class="w-4 h-4"></i> Download DOCX
        </a>
      </div>
    </div>
  `;
  renderLucideIcons();
}

function renderMissingDocUi(container, message) {
  container.innerHTML = `
    <div class="p-6 rounded-2xl glass-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-amber-200/80 dark:border-amber-900/50 bg-amber-50/30 dark:bg-amber-950/20">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
          <i data-lucide="file-warning" class="w-6 h-6"></i>
        </div>
        <div>
          <h4 class="font-bold text-slate-900 dark:text-white text-base">📄 Materi Pembelajaran</h4>
          <p class="text-xs text-amber-800 dark:text-amber-300 font-semibold mt-0.5">
            ${escapeHtml(message)}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-xl bg-amber-100/80 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800 shrink-0">
        <i data-lucide="lock" class="w-4 h-4 text-amber-600 dark:text-amber-400"></i> Dokumen Belum Tersedia
      </div>
    </div>
  `;
  renderLucideIcons();
}

/**
 * Search Modal Handlers
 */
function openSearchModal() {
  if (searchModal) {
    searchModal.classList.remove('hidden');
    searchModal.classList.add('flex');
    if (searchModalInput) {
      searchModalInput.value = '';
      searchModalInput.focus();
      handleModalSearch();
    }
    document.body.style.overflow = 'hidden';
  }
}

function closeSearchModal() {
  if (searchModal) {
    searchModal.classList.add('hidden');
    searchModal.classList.remove('flex');
    document.body.style.overflow = '';
  }
}

function handleModalSearch() {
  if (!searchModalInput || !searchModalResults) return;
  const query = searchModalInput.value.trim().toLowerCase();

  if (query === '') {
    searchModalResults.innerHTML = `
      <div class="p-6 text-center text-slate-400 dark:text-slate-500 text-sm">
        <i data-lucide="search" class="w-8 h-8 mx-auto mb-2 opacity-50"></i>
        Ketik kata kunci untuk mencari judul, topik, atau isi materi Informatika.
      </div>
    `;
    renderLucideIcons();
    return;
  }

  const matches = allMaterials.filter(m => {
    return (
      m.title.toLowerCase().includes(query) ||
      m.description.toLowerCase().includes(query) ||
      m.category.toLowerCase().includes(query) ||
      m.classLevel.includes(query)
    );
  });

  if (matches.length === 0) {
    searchModalResults.innerHTML = `
      <div class="p-6 text-center text-slate-500 dark:text-slate-400 text-sm">
        <i data-lucide="search-x" class="w-8 h-8 mx-auto mb-2 text-rose-500 opacity-80"></i>
        <p class="font-medium text-slate-700 dark:text-slate-300 mb-1">Materi Tidak Ditemukan</p>
        <p>Tidak ada materi yang sesuai dengan kata kunci "<span class="font-semibold">${escapeHtml(query)}</span>".</p>
      </div>
    `;
  } else {
    searchModalResults.innerHTML = matches.map(m => `
      <a href="#materi/${m.id}" onclick="closeSearchModal()" class="block p-4 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition border-b border-slate-100 dark:border-slate-800 last:border-b-0">
        <div class="flex items-center justify-between mb-1">
          <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full ${m.classLevel === '10' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'}">
            Kelas ${m.classLevel === '10' ? '10' : '11–12'} • Pertemuan ${m.meeting}
          </span>
          ${m.locked ? `
            <span class="text-xs text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
              <i data-lucide="lock" class="w-3.5 h-3.5"></i> Terkunci
            </span>
          ` : `
            <span class="text-xs text-slate-400 flex items-center gap-1">
              <i data-lucide="clock" class="w-3 h-3"></i> ${m.duration}
            </span>
          `}
        </div>
        <h4 class="font-bold text-slate-800 dark:text-slate-100 text-base mb-1 hover:text-blue-600 dark:hover:text-blue-400 transition">${escapeHtml(m.title)}</h4>
        <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">${escapeHtml(m.description)}</p>
      </a>
    `).join('');
  }
  renderLucideIcons();
}

/**
 * Hash Router Engine
 */
function handleRoute() {
  const hash = window.location.hash.trim();
  updateActiveNavLinks(hash);

  if (!hash || hash === '#' || hash === '#index' || hash === '#beranda') {
    renderHome();
  } else if (hash === '#kelas-10') {
    renderClassPage('10');
  } else if (hash === '#kelas-11-12') {
    renderClassPage('11-12');
  } else if (hash.startsWith('#materi/')) {
    const materialId = hash.replace('#materi/', '');
    renderMaterialDetail(materialId);
  } else if (hash === '#tentang') {
    renderAbout();
  } else {
    renderNotFound('Halaman yang Anda tuju tidak ditemukan.');
  }

  renderLucideIcons();
}

/**
 * Highlight active navigation links
 */
function updateActiveNavLinks(hash) {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if ((!hash || hash === '#' || hash === '#index') && (href === '#index' || href === '#')) {
      link.classList.add('active');
    } else if (hash && href === hash) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Page Renderer: Beranda (Home)
 */
function renderHome() {
  const countClass10 = allMaterials.filter(m => m.classLevel === '10').length;
  const countClass1112 = allMaterials.filter(m => m.classLevel === '11-12').length;
  
  // Dynamic stats calculation
  const totalCount = allMaterials.length;
  const unlockedCount = allMaterials.filter(m => !m.locked).length;
  const lockedCount = allMaterials.filter(m => m.locked).length;
  const docCount = allMaterials.filter(m => !m.locked && m.document && m.document.available).length;

  // Show unlocked or first 4 materials
  const recentMaterials = allMaterials.filter(m => !m.locked).slice(0, 4);

  appContainer.innerHTML = `
    <!-- Hero Section -->
    <section class="relative pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden">
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-tr from-blue-500/20 to-indigo-500/20 blur-[100px] rounded-full pointer-events-none -z-10"></div>
      
      <div class="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-medium mb-6 animate-fade-in">
          <span class="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
          Perpustakaan Belajar Digital Informatika SMA
        </div>

        <!-- Main Title -->
        <h1 class="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.15]">
          Pusat Pembelajaran <span class="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Informatika SMA</span>
        </h1>

        <!-- Subtitle -->
        <p class="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
          Jelajahi roadmap materi Informatika SMA kelas 10 hingga kelas 11–12 Pertemuan 1–10 dalam satu ruang belajar digital yang terstruktur.
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <a href="#kelas-10" class="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 group">
            Mulai Kelas 10
            <i data-lucide="arrow-right" class="w-5 h-5 group-hover:translate-x-1 transition-transform"></i>
          </a>
          <a href="#kelas-11-12" class="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold text-base border border-slate-200 dark:border-slate-700 shadow-sm transition-all flex items-center justify-center gap-2">
            Mulai Kelas 11–12
            <i data-lucide="sparkles" class="w-5 h-5 text-indigo-500"></i>
          </a>
        </div>

        <!-- Quick Stats Banner (Fully Dynamic) -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div class="p-3 text-center">
            <div class="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 mb-0.5">${totalCount}</div>
            <div class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">Modul Pertemuan</div>
          </div>
          <div class="p-3 text-center border-l border-slate-100 dark:border-slate-800">
            <div class="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-0.5">${unlockedCount}</div>
            <div class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">Pertemuan Terbuka</div>
          </div>
          <div class="p-3 text-center border-l border-slate-100 dark:border-slate-800">
            <div class="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 mb-0.5">${lockedCount}</div>
            <div class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">Pertemuan Terkunci 🔒</div>
          </div>
          <div class="p-3 text-center border-l border-slate-100 dark:border-slate-800">
            <div class="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-0.5">${docCount}</div>
            <div class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">File Word Terhubung</div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION PILIH KELAS -->
    <section class="py-12 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200/60 dark:border-slate-800/60">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="text-center max-w-xl mx-auto mb-10">
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">Pilih Kategori Kelas</h2>
          <p class="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Pilih tingkat kelas Anda untuk mengakses daftar roadmap 10 pertemuan Informatika SMA.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <!-- Card Kelas 10 -->
          <div class="glass-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between group relative overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full pointer-events-none"></div>
            <div>
              <div class="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6 text-2xl font-bold group-hover:scale-110 transition-transform">
                <i data-lucide="laptop" class="w-8 h-8"></i>
              </div>
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-2xl font-bold text-slate-900 dark:text-white">Kelas 10</h3>
                <span class="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                  ${countClass10} Pertemuan
                </span>
              </div>
              <p class="text-slate-600 dark:text-slate-400 text-sm sm:text-base mb-6 leading-relaxed">
                Roadmap Pertemuan 1–10: Pengenalan TIK, Pemrosesan Komputer, OS & Manajemen File, Jaringan, Keamanan Digital, hingga TIK Perkantoran.
              </p>
            </div>
            <a href="#kelas-10" class="inline-flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-md shadow-blue-500/20">
              Lihat Materi Kelas 10
              <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </a>
          </div>

          <!-- Card Kelas 11-12 -->
          <div class="glass-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between group relative overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-bl-full pointer-events-none"></div>
            <div>
              <div class="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6 text-2xl font-bold group-hover:scale-110 transition-transform">
                <i data-lucide="code-2" class="w-8 h-8"></i>
              </div>
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-2xl font-bold text-slate-900 dark:text-white">Kelas 11–12</h3>
                <span class="text-xs font-semibold px-3 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300">
                  ${countClass1112} Pertemuan
                </span>
              </div>
              <p class="text-slate-600 dark:text-slate-400 text-sm sm:text-base mb-6 leading-relaxed">
                Roadmap Pertemuan 1–10 Gabungan: Pengantar Jaringan, Topologi, Perangkat Jaringan, Subnetting, Konfigurasi IP, hingga Cloud Storage & Kolaborasi.
              </p>
            </div>
            <a href="#kelas-11-12" class="inline-flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition-colors shadow-md shadow-purple-500/20">
              Lihat Materi Kelas 11–12
              <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Recent Materials Preview Section -->
    <section class="py-12 md:py-16">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Materi Pembelajaran Terbuka</h2>
            <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">Pertemuan 1–5 siap dipelajari dan diunduh dokumen Word-nya.</p>
          </div>
          <a href="#kelas-10" class="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
            Semua Roadmap <i data-lucide="chevron-right" class="w-4 h-4"></i>
          </a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          ${recentMaterials.map(m => renderMaterialCardHtml(m)).join('')}
        </div>
      </div>
    </section>
  `;
}

/**
 * Page Renderer: Daftar Materi Kelas
 */
function renderClassPage(classLevel) {
  const isClass10 = classLevel === '10';
  const classTitle = isClass10 ? 'Kelas 10' : 'Kelas 11–12';
  const classDescription = isClass10 
    ? 'Roadmap materi Informatika SMA Kelas 10 (Pertemuan 1–5 Terbuka, Pertemuan 6–10 Terkunci).'
    : 'Roadmap gabungan materi Informatika SMA Kelas 11 & 12 (Pertemuan 1–5 Terbuka, Pertemuan 6–10 Terkunci).';

  // Filter materials for this class level
  const classMaterials = allMaterials.filter(m => m.classLevel === classLevel);

  // Extract unique categories for filter tabs
  const categories = ['Semua', ...new Set(classMaterials.map(m => m.category))];

  appContainer.innerHTML = `
    <section class="py-8 md:py-12">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        
        <!-- Breadcrumb -->
        <nav class="flex text-sm text-slate-500 dark:text-slate-400 mb-6" aria-label="Breadcrumb">
          <ol class="inline-flex items-center space-x-1 md:space-x-3">
            <li>
              <a href="#index" class="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1">
                <i data-lucide="home" class="w-4 h-4"></i> Beranda
              </a>
            </li>
            <li><i data-lucide="chevron-right" class="w-4 h-4 text-slate-400"></i></li>
            <li class="font-semibold text-slate-800 dark:text-slate-200">Materi ${classTitle}</li>
          </ol>
        </nav>

        <!-- Page Header -->
        <div class="mb-8 p-6 md:p-8 rounded-3xl bg-gradient-to-r ${isClass10 ? 'from-blue-600 to-indigo-700' : 'from-purple-600 to-indigo-800'} text-white shadow-xl relative overflow-hidden">
          <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div class="relative z-10 max-w-2xl">
            <span class="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold uppercase tracking-wider mb-3">
              Roadmap Pembelajaran Pertemuan 1–10
            </span>
            <h1 class="text-3xl sm:text-4xl font-extrabold mb-3">Materi Informatika ${classTitle}</h1>
            <p class="text-blue-100 text-sm sm:text-base leading-relaxed mb-4">${classDescription}</p>
            <div class="inline-flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white/10 text-xs font-medium backdrop-blur-sm">
              <span><i data-lucide="check-circle-2" class="w-4 h-4 inline text-emerald-300"></i> P1–P5 Terbuka</span>
              <span>•</span>
              <span><i data-lucide="lock" class="w-4 h-4 inline text-amber-300"></i> P6–P10 Terkunci</span>
            </div>
          </div>
        </div>

        <!-- Filter & Search Control Toolbar -->
        <div class="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-8">
          
          <!-- Category Filter Tabs -->
          <div class="flex flex-wrap gap-2 w-full md:w-auto" id="categoryFilterContainer">
            ${categories.map(cat => `
              <button 
                onclick="setCategoryFilter('${escapeHtml(cat)}', '${classLevel}')"
                class="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${cat === currentCategoryFilter ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}"
              >
                ${escapeHtml(cat)}
              </button>
            `).join('')}
          </div>

          <!-- Page In-line Search Input -->
          <div class="relative w-full md:w-72">
            <i data-lucide="search" class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"></i>
            <input 
              type="text" 
              id="classSearchInput"
              value="${escapeHtml(currentSearchQuery)}"
              oninput="handleClassSearch(this.value, '${classLevel}')"
              placeholder="Cari materi ${classTitle}..." 
              class="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
            />
          </div>
        </div>

        <!-- Material Cards Grid Container -->
        <div id="materialGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${renderFilteredClassMaterialsHtml(classMaterials)}
        </div>

      </div>
    </section>
  `;
}

/**
 * Filter materials inside class view
 */
function setCategoryFilter(category, classLevel) {
  currentCategoryFilter = category;
  renderClassPage(classLevel);
}

function handleClassSearch(query, classLevel) {
  currentSearchQuery = query.trim().toLowerCase();
  const classMaterials = allMaterials.filter(m => m.classLevel === classLevel);
  const grid = document.getElementById('materialGrid');
  if (grid) {
    grid.innerHTML = renderFilteredClassMaterialsHtml(classMaterials);
    renderLucideIcons();
  }
}

function renderFilteredClassMaterialsHtml(classMaterials) {
  let filtered = classMaterials;

  // Filter Category
  if (currentCategoryFilter !== 'Semua') {
    filtered = filtered.filter(m => m.category === currentCategoryFilter);
  }

  // Filter Search Query
  if (currentSearchQuery !== '') {
    filtered = filtered.filter(m => 
      m.title.toLowerCase().includes(currentSearchQuery) ||
      m.description.toLowerCase().includes(currentSearchQuery) ||
      m.category.toLowerCase().includes(currentSearchQuery)
    );
  }

  if (filtered.length === 0) {
    return `
      <div class="col-span-full py-16 text-center glass-card rounded-2xl p-8">
        <div class="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
          <i data-lucide="file-question" class="w-8 h-8"></i>
        </div>
        <h3 class="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">Materi Tidak Ditemukan</h3>
        <p class="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto mb-4">
          Tidak ada materi yang cocok dengan pencarian atau filter yang dipilih. Coba reset pencarian Anda.
        </p>
        <button onclick="resetFilters('${classMaterials[0]?.classLevel || '10'}')" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition">
          Reset Filter & Pencarian
        </button>
      </div>
    `;
  }

  return filtered.map(m => renderMaterialCardHtml(m)).join('');
}

function resetFilters(classLevel) {
  currentCategoryFilter = 'Semua';
  currentSearchQuery = '';
  renderClassPage(classLevel);
}

/**
 * Generate Material Card HTML snippet
 */
function renderMaterialCardHtml(m) {
  const isLocked = Boolean(m.locked);

  return `
    <div class="glass-card rounded-2xl p-6 flex flex-col justify-between group ${isLocked ? 'opacity-85 border-amber-200/60 dark:border-amber-900/40 bg-amber-50/20 dark:bg-amber-950/10' : ''}">
      <div>
        <div class="flex items-center justify-between mb-3">
          <span class="text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${isLocked ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300' : (m.classLevel === '10' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/70 dark:text-blue-300' : 'bg-purple-50 text-purple-600 dark:bg-purple-950/70 dark:text-purple-300')}">
            ${isLocked ? '🔒 Pertemuan ' + m.meeting : 'Pertemuan ' + m.meeting}
          </span>
          
          ${isLocked ? `
            <span class="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <i data-lucide="lock" class="w-3.5 h-3.5"></i> Terkunci
            </span>
          ` : `
            <span class="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 font-medium">
              <i data-lucide="clock" class="w-3.5 h-3.5"></i> ${m.duration}
            </span>
          `}
        </div>

        <span class="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">
          ${escapeHtml(m.category)}
        </span>

        <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition line-clamp-2">
          ${escapeHtml(m.title)}
        </h3>

        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-6 leading-relaxed">
          ${isLocked ? 'Materi belum tersedia untuk dipelajari. Silakan menunggu materi dibuka oleh pengajar.' : escapeHtml(m.description)}
        </p>
      </div>

      <a href="#materi/${m.id}" class="inline-flex items-center justify-between w-full pt-4 border-t border-slate-100 dark:border-slate-800 text-sm font-semibold ${isLocked ? 'text-amber-600 dark:text-amber-400 hover:text-amber-700' : 'text-blue-600 dark:text-blue-400 group-hover:text-blue-700'}">
        <span>${isLocked ? '🔒 Materi Terkunci' : 'Pelajari Materi'}</span>
        <i data-lucide="${isLocked ? 'lock' : 'arrow-right'}" class="w-4 h-4 ${isLocked ? '' : 'group-hover:translate-x-1 transition-transform'}"></i>
      </a>
    </div>
  `;
}

/**
 * Page Renderer: Detail Materi
 */
function renderMaterialDetail(materialId) {
  const material = allMaterials.find(m => m.id === materialId);
  if (!material) {
    renderNotFound('Materi pembelajaran yang Anda minta tidak dapat ditemukan.');
    return;
  }

  // STRICT LOCK ENFORCEMENT
  if (material.locked) {
    renderLockedMaterialPage(material);
    return;
  }

  // Prev & Next navigation calculation
  const currentIndex = allMaterials.findIndex(m => m.id === materialId);
  const prevMaterial = currentIndex > 0 ? allMaterials[currentIndex - 1] : null;
  const nextMaterial = currentIndex < allMaterials.length - 1 ? allMaterials[currentIndex + 1] : null;

  const isClass10 = material.classLevel === '10';
  const classHash = isClass10 ? '#kelas-10' : '#kelas-11-12';
  const classLabel = isClass10 ? 'Kelas 10' : 'Kelas 11–12';

  appContainer.innerHTML = `
    <article class="py-8 md:py-12">
      <div class="reading-container px-4 sm:px-6">
        
        <!-- Breadcrumb Navigation -->
        <nav class="flex text-sm text-slate-500 dark:text-slate-400 mb-8" aria-label="Breadcrumb">
          <ol class="inline-flex items-center space-x-1 md:space-x-2 flex-wrap">
            <li>
              <a href="#index" class="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1">
                <i data-lucide="home" class="w-4 h-4"></i> Beranda
              </a>
            </li>
            <li><i data-lucide="chevron-right" class="w-4 h-4 text-slate-400"></i></li>
            <li>
              <a href="${classHash}" class="hover:text-blue-600 dark:hover:text-blue-400">
                ${classLabel}
              </a>
            </li>
            <li><i data-lucide="chevron-right" class="w-4 h-4 text-slate-400"></i></li>
            <li class="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px] sm:max-w-none">
              Pertemuan ${material.meeting}
            </li>
          </ol>
        </nav>

        <!-- Material Title & Meta Header -->
        <header class="mb-10 pb-8 border-b border-slate-200 dark:border-slate-800">
          <div class="flex flex-wrap items-center gap-2 mb-4">
            <span class="px-3 py-1 rounded-full text-xs font-bold ${isClass10 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300' : 'bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300'}">
              Kelas ${classLabel} • Pertemuan ${material.meeting}
            </span>
            <span class="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              ${escapeHtml(material.category)}
            </span>
            <span class="ml-auto text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <i data-lucide="clock" class="w-4 h-4"></i> Estimasi: ${material.duration}
            </span>
          </div>

          <h1 class="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight">
            ${escapeHtml(material.title)}
          </h1>

          <p class="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            ${escapeHtml(material.description)}
          </p>
        </header>

        <!-- Word Document Section (Dynamic Verification) -->
        <div id="docSectionContainer" class="mb-10"></div>

        <!-- Learning Objectives Card -->
        ${material.content && material.content.objectives && material.content.objectives.length > 0 ? `
          <div class="mb-10 p-6 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60">
            <h2 class="text-base font-bold text-blue-900 dark:text-blue-200 mb-3 flex items-center gap-2">
              <i data-lucide="target" class="w-5 h-5 text-blue-600 dark:text-blue-400"></i>
              Tujuan Pembelajaran
            </h2>
            <ul class="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              ${material.content.objectives.map(obj => `
                <li class="flex items-start gap-2.5">
                  <i data-lucide="check-circle-2" class="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5"></i>
                  <span>${escapeHtml(obj)}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}

        <!-- Main Sections Content -->
        <div class="space-y-10 text-slate-800 dark:text-slate-200 text-base leading-relaxed">
          ${material.content && material.content.sections && material.content.sections.length > 0 ? material.content.sections.map((section, idx) => `
            <section class="space-y-4">
              <h2 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <span class="w-7 h-7 rounded-lg bg-blue-600 text-white text-xs flex items-center justify-center shrink-0">
                  ${idx + 1}
                </span>
                ${escapeHtml(section.heading)}
              </h2>

              ${section.paragraphs.map(p => {
                if (p.startsWith('`') && p.endsWith('`')) {
                  return `<pre class="my-4"><code>${escapeHtml(p.replace(/`/g, ''))}</code></pre>`;
                }
                return `<p class="leading-relaxed whitespace-pre-line text-slate-700 dark:text-slate-300">${formatParagraphText(p)}</p>`;
              }).join('')}
            </section>
          `).join('') : `
            <div class="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-center text-slate-500 text-sm">
              <p>Materi pembelajaran ringkas untuk topik <strong>"${escapeHtml(material.title)}"</strong>.</p>
              <p class="text-xs text-slate-400 mt-1">Unduh file Word di atas untuk membaca modul selengkapnya.</p>
            </div>
          `}
        </div>

        <!-- Key Points Summary -->
        ${material.content && material.content.keyPoints && material.content.keyPoints.length > 0 ? `
          <div class="mt-12 p-6 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
            <h3 class="text-base font-bold text-amber-900 dark:text-amber-200 mb-3 flex items-center gap-2">
              <i data-lucide="bookmark" class="w-5 h-5 text-amber-600 dark:text-amber-400"></i>
              Poin-Poin Penting
            </h3>
            <ul class="space-y-2 text-sm text-amber-900/90 dark:text-amber-100/90">
              ${material.content.keyPoints.map(kp => `
                <li class="flex items-start gap-2">
                  <span class="text-amber-500 font-bold">•</span>
                  <span>${escapeHtml(kp)}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}

        <!-- Interactive Self Evaluation Prompt -->
        <div class="mt-8 p-6 rounded-2xl glass-card text-center">
          <h4 class="font-bold text-slate-800 dark:text-slate-200 mb-1 text-sm sm:text-base">Refleksi Pembelajaran</h4>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-4">
            Apakah Anda telah memahami materi pertemuan ini? Cobalah mengunduh file Word untuk memperdalam materi.
          </p>
          <button onclick="window.print()" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition">
            <i data-lucide="printer" class="w-4 h-4"></i> Cetak Ringkasan Materi
          </button>
        </div>

        <!-- Prev / Next Navigation -->
        <div class="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
          ${prevMaterial ? `
            <a href="#materi/${prevMaterial.id}" class="p-4 rounded-xl glass-card hover:border-blue-500/50 transition group flex flex-col justify-between ${prevMaterial.locked ? 'opacity-70' : ''}">
              <span class="text-xs font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1 mb-1">
                <i data-lucide="arrow-left" class="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform"></i> Materi Sebelumnya
              </span>
              <span class="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-1">
                ${prevMaterial.locked ? '🔒 ' : ''}${escapeHtml(prevMaterial.title)}
              </span>
            </a>
          ` : '<div></div>'}

          ${nextMaterial ? `
            <a href="#materi/${nextMaterial.id}" class="p-4 rounded-xl glass-card hover:border-blue-500/50 transition group flex flex-col justify-between text-right ${nextMaterial.locked ? 'opacity-70' : ''}">
              <span class="text-xs font-medium text-slate-400 dark:text-slate-500 flex items-center justify-end gap-1 mb-1">
                Materi Berikutnya <i data-lucide="${nextMaterial.locked ? 'lock' : 'arrow-right'}" class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"></i>
              </span>
              <span class="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-1">
                ${nextMaterial.locked ? '🔒 ' : ''}${escapeHtml(nextMaterial.title)}
              </span>
            </a>
          ` : '<div></div>'}
        </div>

      </div>
    </article>
  `;

  // Dynamically verify file existence and render doc section UI
  verifyAndRenderDocSection(material);
}

/**
 * Page Renderer: Locked Material Fallback
 */
function renderLockedMaterialPage(material) {
  const classHash = material.classLevel === '10' ? '#kelas-10' : '#kelas-11-12';
  
  appContainer.innerHTML = `
    <section class="py-16 md:py-24 text-center">
      <div class="max-w-lg mx-auto px-4">
        <div class="w-20 h-20 bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/10">
          <i data-lucide="lock" class="w-10 h-10"></i>
        </div>
        <span class="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
          Pertemuan ${material.meeting} • Terkunci
        </span>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-3">🔒 Materi Terkunci</h1>
        <p class="text-slate-600 dark:text-slate-300 text-sm sm:text-base mb-8 leading-relaxed">
          Materi <strong class="text-slate-800 dark:text-slate-100">"${escapeHtml(material.title)}"</strong> belum tersedia untuk dipelajari. Silakan menunggu materi dibuka oleh pengajar.
        </p>
        <a href="${classHash}" class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition shadow-md shadow-blue-500/20">
          <i data-lucide="arrow-left" class="w-4 h-4"></i> Kembali ke Daftar Materi
        </a>
      </div>
    </section>
  `;
}

/**
 * Format inline backticks in paragraph text safely
 */
function formatParagraphText(text) {
  let safe = escapeHtml(text);
  safe = safe.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-mono text-xs border border-slate-200 dark:border-slate-700">$1</code>');
  return safe;
}

/**
 * Page Renderer: Tentang
 */
function renderAbout() {
  appContainer.innerHTML = `
    <section class="py-10 md:py-16">
      <div class="max-w-4xl mx-auto px-4 sm:px-6">
        
        <!-- Header -->
        <div class="text-center max-w-2xl mx-auto mb-12">
          <div class="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
            <i data-lucide="book-open" class="w-8 h-8"></i>
          </div>
          <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">Tentang Informatika SMA</h1>
          <p class="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
            Platform portal perpustakaan digital pembelajaran Informatika SMA Kelas 10 & Kelas 11–12 Pertemuan 1–10.
          </p>
        </div>

        <!-- Content Cards Grid -->
        <div class="space-y-6">
          <div class="glass-card rounded-2xl p-6 sm:p-8">
            <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <i data-lucide="compass" class="w-5 h-5 text-blue-600 dark:text-blue-400"></i>
              Alur Pembelajaran & Akses Modul
            </h2>
            <p class="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
              Materi disusun secara bertahap per tingkat kelas. Pertemuan yang aktif dapat langsung dipelajari oleh siswa, sedangkan pertemuan selanjutnya dibuka secara bertahap sesuai alur pembelajaran pengajar.
            </p>
            <p class="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              Setiap pertemuan yang aktif dilengkapi dengan modul ringkas serta dokumen Microsoft Word (<code>.docx</code>) yang dapat dipreview dan diunduh sebagai bahan ajar mandiri.
            </p>
          </div>

          <div class="glass-card rounded-2xl p-6 sm:p-8">
            <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <i data-lucide="sparkles" class="w-5 h-5 text-indigo-600 dark:text-indigo-400"></i>
              Keunggulan & Kemudahan Platform
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <h3 class="font-bold text-slate-800 dark:text-slate-200 text-sm mb-1 flex items-center gap-1.5">
                  <i data-lucide="zap" class="w-4 h-4 text-blue-500"></i> Akses Instan & Ringan
                </h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">Dapat dibuka langsung melalui berbagai peramban di komputer maupun smartphone tanpa memerlukan instalasi tambahan.</p>
              </div>
              <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <h3 class="font-bold text-slate-800 dark:text-slate-200 text-sm mb-1 flex items-center gap-1.5">
                  <i data-lucide="book-open" class="w-4 h-4 text-indigo-500"></i> Materi Terorganisir
                </h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">Seluruh topik tersusun secara terstruktur berdasarkan urutan pertemuan dan kategori bidang studi Informatika.</p>
              </div>
              <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <h3 class="font-bold text-slate-800 dark:text-slate-200 text-sm mb-1 flex items-center gap-1.5">
                  <i data-lucide="file-text" class="w-4 h-4 text-emerald-500"></i> Dokumen Pembelajaran
                </h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">Setiap modul aktif terhubung dengan dokumen Microsoft Word yang dapat dipreview dan diunduh untuk bahan belajar mandiri.</p>
              </div>
              <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <h3 class="font-bold text-slate-800 dark:text-slate-200 text-sm mb-1 flex items-center gap-1.5">
                  <i data-lucide="search" class="w-4 h-4 text-purple-500"></i> Pencarian & Navigasi Pintar
                </h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">Dilengkapi fitur pencarian topik cepat dan filter kategori untuk mendukung kenyamanan siswa dalam belajar.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  `;
}

/**
 * Page Renderer: Fallback Not Found (404)
 */
function renderNotFound(message = 'Halaman tidak ditemukan') {
  appContainer.innerHTML = `
    <section class="py-16 md:py-24 text-center">
      <div class="max-w-md mx-auto px-4">
        <div class="w-20 h-20 bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-rose-500/10">
          <i data-lucide="alert-triangle" class="w-10 h-10"></i>
        </div>
        <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Materi Tidak Ditemukan</h1>
        <p class="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">
          ${escapeHtml(message)}
        </p>
        <a href="#index" class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition shadow-md shadow-blue-500/20">
          <i data-lucide="arrow-left" class="w-4 h-4"></i> Kembali ke Beranda
        </a>
      </div>
    </section>
  `;
}

/**
 * Utility: Render Lucide Icons dynamically
 */
function renderLucideIcons() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

/**
 * Utility: HTML Escape for Security
 */
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Start application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initApp);
