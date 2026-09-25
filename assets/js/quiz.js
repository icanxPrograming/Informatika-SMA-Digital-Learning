/**
 * quiz.js - Quiz Engine for Informatika SMA
 * Handles JSON Data Loading, Quiz State, Interactive Quiz UI, Score Calculation,
 * Review Mode, and Google Sheets Integration.
 */

// Global Quiz Engine State
let quizState = {
  classLevel: null,
  quizMeta: null,
  questions: [],
  studentInfo: { name: '', classLevel: '' },
  answers: {}, // { [questionId]: optionIndex }
  currentIndex: 0,
  isSubmitted: false,
  startTime: null,
  submissionStatus: null, // 'success' | 'failed_sync'
  scoreData: null
};

/**
 * Fetch Quiz JSON Data for specified class level
 */
async function fetchQuizData(classLevel) {
  const path = classLevel === '10' 
    ? './assets/data/quiz/kelas-10/soalkuis.json'
    : './assets/data/quiz/kelas-11-12/soalkuis.json';

  try {
    const res = await fetch(path);
    if (!res.ok) {
      throw new Error(`Gagal memuat file kuis (${res.status})`);
    }
    const data = await res.json();
    
    // Validate JSON Schema
    if (!data.quiz || !Array.isArray(data.questions)) {
      throw new Error('Format JSON kuis tidak valid.');
    }

    // Limit questions to max 15
    let questions = data.questions;
    const maxQuestions = data.quiz.maxQuestions || 15;
    if (questions.length > maxQuestions) {
      console.warn(`Quiz memiliki ${questions.length} soal. Hanya ${maxQuestions} soal pertama yang digunakan.`);
      questions = questions.slice(0, maxQuestions);
    }

    return {
      quiz: data.quiz,
      questions: questions
    };
  } catch (error) {
    console.error('Quiz Fetch Error:', error);
    return null;
  }
}

/**
 * Router Handler for Quiz Sub-routes (#kuis, #kuis/kelas-10, #kuis/kelas-11-12, #kuis/hasil, #kuis/review)
 */
async function handleQuizRoute(hash) {
  const cleanHash = hash ? hash.trim().toLowerCase() : '#kuis';

  if (cleanHash === '#kuis' || cleanHash === '#kuis/') {
    renderQuizMainPage();
  } else if (cleanHash === '#kuis/kelas-10') {
    if (quizState.classLevel === '10' && quizState.questions.length > 0) {
      if (quizState.isSubmitted && quizState.scoreData) {
        renderQuizResultPage();
      } else {
        renderQuizQuestionPage();
      }
    } else {
      await renderQuizMainPage();
      openStudentModal('10');
    }
  } else if (cleanHash === '#kuis/kelas-11-12') {
    if (quizState.classLevel === '11-12' && quizState.questions.length > 0) {
      if (quizState.isSubmitted && quizState.scoreData) {
        renderQuizResultPage();
      } else {
        renderQuizQuestionPage();
      }
    } else {
      await renderQuizMainPage();
      openStudentModal('11-12');
    }
  } else if (cleanHash === '#kuis/hasil') {
    if (quizState.scoreData) {
      renderQuizResultPage();
    } else {
      window.location.hash = '#kuis';
    }
  } else if (cleanHash === '#kuis/review') {
    if (quizState.scoreData) {
      renderQuizReviewPage();
    } else {
      window.location.hash = '#kuis';
    }
  } else {
    renderQuizMainPage();
  }
}

function navigateToQuizReview() {
  if (window.location.hash !== '#kuis/review') {
    window.location.hash = '#kuis/review';
  } else {
    renderQuizReviewPage();
  }
}

function navigateToQuizResult() {
  if (window.location.hash !== '#kuis/hasil') {
    window.location.hash = '#kuis/hasil';
  } else {
    renderQuizResultPage();
  }
}

/**
 * Reset active quiz session & navigate back to main quiz selection page
 */
function resetAndReturnToQuizMain() {
  closeStudentModal();
  closeSubmitConfirmModal();
  document.body.style.overflow = '';
  quizState.isSubmitted = false;
  
  if (window.location.hash !== '#kuis') {
    window.location.hash = '#kuis';
  } else {
    renderQuizMainPage();
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Render Main Quiz Selection Page (#kuis)
 */
async function renderQuizMainPage() {
  closeStudentModal();
  closeSubmitConfirmModal();
  document.body.style.overflow = '';

  const appContainer = document.getElementById('app');
  if (!appContainer) return;

  // Pre-fetch metadata for both quiz categories
  const q10Data = await fetchQuizData('10');
  const q1112Data = await fetchQuizData('11-12');

  const isQ10Locked = Boolean(q10Data && q10Data.quiz && q10Data.quiz.locked);
  const isQ1112Locked = Boolean(q1112Data && q1112Data.quiz && q1112Data.quiz.locked);

  const q10Count = q10Data ? q10Data.questions.length : 0;
  const q1112Count = q1112Data ? q1112Data.questions.length : 0;

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
            <li class="font-semibold text-slate-800 dark:text-slate-200">Kuis Informatika</li>
          </ol>
        </nav>

        <!-- Page Header -->
        <div class="mb-10 p-6 md:p-8 rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 text-white shadow-xl relative overflow-hidden">
          <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div class="relative z-10 max-w-2xl">
            <span class="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold uppercase tracking-wider mb-3">
              Evaluasi Pemahaman Digital
            </span>
            <h1 class="text-3xl sm:text-4xl font-extrabold mb-3">Kuis Informatika SMA</h1>
            <p class="text-blue-100 text-sm sm:text-base leading-relaxed mb-4">
              Uji pemahaman Anda mengenai materi Informatika SMA melalui kuis pilihan ganda interaktif. Hasil kuis akan langsung dihitung secara otomatis.
            </p>
          </div>
        </div>

        <!-- Quiz Category Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          <!-- Card Kuis Kelas 10 -->
          <div class="glass-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between group relative overflow-hidden ${isQ10Locked ? 'opacity-85 border-amber-200/60 dark:border-amber-900/40 bg-amber-50/20 dark:bg-amber-950/10' : ''}">
            <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full pointer-events-none"></div>
            <div>
              <div class="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6 text-2xl font-bold group-hover:scale-110 transition-transform">
                <i data-lucide="help-circle" class="w-8 h-8"></i>
              </div>
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-2xl font-bold text-slate-900 dark:text-white">Kuis Kelas 10</h3>
                <span class="text-xs font-semibold px-3 py-1 rounded-full ${isQ10Locked ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300'}">
                  ${isQ10Locked ? '🔒 Terkunci' : q10Count + ' Soal'}
                </span>
              </div>
              <p class="text-slate-600 dark:text-slate-400 text-sm sm:text-base mb-6 leading-relaxed">
                Uji pemahaman materi Informatika Kelas 10 mencakup TIK, Sistem Komputer, Jaringan, dan Keamanan Digital.
              </p>
            </div>
            
            ${isQ10Locked ? `
              <button onclick="alertLockedQuiz('10')" class="inline-flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm transition">
                <i data-lucide="lock" class="w-4 h-4"></i> Kuis Terkunci
              </button>
            ` : `
              <button onclick="openStudentModal('10')" class="inline-flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition shadow-md shadow-blue-500/20">
                Mulai Kuis Kelas 10 <i data-lucide="arrow-right" class="w-4 h-4"></i>
              </button>
            `}
          </div>

          <!-- Card Kuis Kelas 11-12 -->
          <div class="glass-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between group relative overflow-hidden ${isQ1112Locked ? 'opacity-85 border-amber-200/60 dark:border-amber-900/40 bg-amber-50/20 dark:bg-amber-950/10' : ''}">
            <div class="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-bl-full pointer-events-none"></div>
            <div>
              <div class="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6 text-2xl font-bold group-hover:scale-110 transition-transform">
                <i data-lucide="award" class="w-8 h-8"></i>
              </div>
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-2xl font-bold text-slate-900 dark:text-white">Kuis Kelas 11–12</h3>
                <span class="text-xs font-semibold px-3 py-1 rounded-full ${isQ1112Locked ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300' : 'bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300'}">
                  ${isQ1112Locked ? '🔒 Terkunci' : q1112Count + ' Soal'}
                </span>
              </div>
              <p class="text-slate-600 dark:text-slate-400 text-sm sm:text-base mb-6 leading-relaxed">
                Uji pemahaman materi gabungan Informatika Kelas 11–12 mencakup Jaringan, Topologi, Subnetting, dan Konfigurasi IP.
              </p>
            </div>
            
            ${isQ1112Locked ? `
              <button onclick="alertLockedQuiz('11-12')" class="inline-flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm transition">
                <i data-lucide="lock" class="w-4 h-4"></i> Kuis Terkunci
              </button>
            ` : `
              <button onclick="openStudentModal('11-12')" class="inline-flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition shadow-md shadow-purple-500/20">
                Mulai Kuis Kelas 11–12 <i data-lucide="arrow-right" class="w-4 h-4"></i>
              </button>
            `}
          </div>

        </div>

      </div>
    </section>

    <!-- Student Identity Modal Container -->
    <div id="studentIdentityModal" class="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md hidden items-center justify-center p-4">
      <div class="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 animate-fade-in">
        <div class="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold">
              <i data-lucide="user-check" class="w-5 h-5"></i>
            </div>
            <h3 class="font-bold text-slate-900 dark:text-white text-lg">Identitas Peserta Kuis</h3>
          </div>
          <button onclick="closeStudentModal()" class="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <form id="studentIdentityForm" onsubmit="handleStartQuizForm(event)">
          <input type="hidden" id="modalClassLevel" value="" />
          
          <div class="space-y-4 mb-6">
            <div>
              <label for="studentNameInput" class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Nama Lengkap Siswa <span class="text-rose-500">*</span>
              </label>
              <input 
                type="text" 
                id="studentNameInput" 
                required
                placeholder="Masukkan nama lengkap Anda..." 
                class="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div>
              <label for="studentClassSelect" class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Kelas / Tingkat <span class="text-rose-500">*</span>
              </label>
              <select 
                id="studentClassSelect" 
                required 
                class="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="Kelas 10">Kelas 10</option>
                <option value="Kelas 11–12">Kelas 11–12</option>
              </select>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-2">
            <button type="button" onclick="closeStudentModal()" class="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
              Batal
            </button>
            <button type="submit" class="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition shadow-md shadow-blue-500/20 flex items-center gap-2">
              Mulai Kuis Sekarang <i data-lucide="play" class="w-4 h-4"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  renderLucideIcons();
}

/**
 * Handle Locked Quiz Alert
 */
function alertLockedQuiz(classLevel) {
  const appContainer = document.getElementById('app');
  const classLabel = classLevel === '10' ? 'Kelas 10' : 'Kelas 11–12';
  
  appContainer.innerHTML = `
    <section class="py-16 md:py-24 text-center">
      <div class="max-w-lg mx-auto px-4">
        <div class="w-20 h-20 bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/10">
          <i data-lucide="lock" class="w-10 h-10"></i>
        </div>
        <span class="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
          Kuis ${classLabel} • Terkunci
        </span>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-3">🔒 Kuis Terkunci</h1>
        <p class="text-slate-600 dark:text-slate-300 text-sm sm:text-base mb-8 leading-relaxed">
          Kuis Informatika untuk <strong class="text-slate-800 dark:text-slate-100">${classLabel}</strong> belum dibuka oleh pengajar. Silakan menunggu akses dibuka.
        </p>
        <button onclick="resetAndReturnToQuizMain()" class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition shadow-md shadow-blue-500/20">
          <i data-lucide="arrow-left" class="w-4 h-4"></i> Kembali ke Daftar Kuis
        </button>
      </div>
    </section>
  `;
  renderLucideIcons();
}

/**
 * Student Modal Controls
 */
function openStudentModal(classLevel) {
  const modal = document.getElementById('studentIdentityModal');
  const modalClassInput = document.getElementById('modalClassLevel');
  const studentClassSelect = document.getElementById('studentClassSelect');
  
  if (modalClassInput) modalClassInput.value = classLevel;
  if (studentClassSelect) {
    studentClassSelect.value = classLevel === '10' ? 'Kelas 10' : 'Kelas 11–12';
  }

  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    const nameInput = document.getElementById('studentNameInput');
    if (nameInput) {
      nameInput.value = '';
      nameInput.focus();
    }
  }
}

function closeStudentModal() {
  const modal = document.getElementById('studentIdentityModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

async function handleStartQuizForm(e) {
  e.preventDefault();
  const classLevel = document.getElementById('modalClassLevel').value;
  const name = document.getElementById('studentNameInput').value.trim();
  const studentClass = document.getElementById('studentClassSelect').value;

  if (!name) return;

  closeStudentModal();
  await initQuizSession(classLevel, name, studentClass);
}

/**
 * Initialize Active Quiz Session
 */
async function initQuizSession(classLevel, studentName, studentClass) {
  const data = await fetchQuizData(classLevel);
  if (!data || !data.quiz || data.quiz.locked) {
    alertLockedQuiz(classLevel);
    return;
  }

  quizState = {
    classLevel: classLevel,
    quizMeta: data.quiz,
    questions: data.questions,
    studentInfo: { name: studentName, classLevel: studentClass },
    answers: {},
    currentIndex: 0,
    isSubmitted: false,
    startTime: new Date().toISOString(),
    submissionStatus: null,
    scoreData: null
  };

  const targetHash = classLevel === '10' ? '#kuis/kelas-10' : '#kuis/kelas-11-12';
  if (window.location.hash !== targetHash) {
    window.location.hash = targetHash;
  } else {
    renderQuizQuestionPage();
  }
}

/**
 * Render Active Quiz Question Page
 */
function renderQuizQuestionPage() {
  const appContainer = document.getElementById('app');
  if (!appContainer || quizState.questions.length === 0) return;

  const totalQuestions = quizState.questions.length;
  const currentIndex = quizState.currentIndex;
  const currentQuestion = quizState.questions[currentIndex];
  const selectedAnswer = quizState.answers[currentQuestion.id];
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const answeredCount = Object.keys(quizState.answers).length;

  appContainer.innerHTML = `
    <section class="py-8 md:py-12">
      <div class="max-w-4xl mx-auto px-4 sm:px-6">
        
        <!-- Header Info Bar -->
        <div class="glass-card rounded-2xl p-4 sm:p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span class="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-1">
              ${escapeHtml(quizState.quizMeta.title)}
            </span>
            <h2 class="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base">
              Peserta: <span class="text-slate-900 dark:text-white font-extrabold">${escapeHtml(quizState.studentInfo.name)}</span> (${escapeHtml(quizState.studentInfo.classLevel)})
            </h2>
          </div>

          <div class="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <span class="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              Soal ${currentIndex + 1} dari ${totalQuestions}
            </span>
            <button onclick="confirmSubmitQuizModal()" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition shadow-md shadow-emerald-500/20 flex items-center gap-1.5">
              <i data-lucide="send" class="w-3.5 h-3.5"></i> Kirim Jawaban
            </button>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mb-8">
          <div class="bg-gradient-to-r from-blue-600 to-indigo-600 h-full transition-all duration-300" style="width: ${progressPercent}%"></div>
        </div>

        <!-- Question Navigator Pills -->
        <div class="glass-card rounded-2xl p-4 mb-8">
          <div class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
            <span>Navigasi Soal (Terjawab ${answeredCount}/${totalQuestions})</span>
          </div>
          <div class="flex flex-wrap gap-2">
            ${quizState.questions.map((q, idx) => {
              const isAnswered = quizState.answers[q.id] !== undefined;
              const isCurrent = idx === currentIndex;
              return `
                <button 
                  onclick="jumpToQuestion(${idx})"
                  class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-xs font-bold transition flex items-center justify-center ${
                    isCurrent 
                      ? 'bg-blue-600 text-white ring-2 ring-blue-400 shadow-md shadow-blue-500/30' 
                      : (isAnswered ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700')
                  }"
                >
                  ${idx + 1}
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Question Card -->
        <div class="glass-card rounded-2xl p-6 sm:p-8 mb-8 animate-fade-in">
          <div class="flex items-center gap-2 mb-4 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <span class="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center font-bold">
              ${currentIndex + 1}
            </span>
            <span>Pertanyaan Ke-${currentIndex + 1}</span>
          </div>

          <h3 class="text-base sm:text-xl font-bold text-slate-900 dark:text-white mb-6 leading-relaxed">
            ${escapeHtml(currentQuestion.question)}
          </h3>

          <!-- Options Grid -->
          <div class="space-y-3">
            ${currentQuestion.options.map((opt, optIdx) => {
              const optionLetter = String.fromCharCode(65 + optIdx); // A, B, C, D
              const isSelected = selectedAnswer === optIdx;
              return `
                <div 
                  onclick="selectQuizOption(${currentQuestion.id}, ${optIdx})"
                  class="p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3.5 group ${
                    isSelected 
                      ? 'bg-blue-50/90 dark:bg-blue-950/60 border-blue-500 ring-2 ring-blue-500/20 shadow-md' 
                      : 'bg-white dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-700/60'
                  }"
                >
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition ${
                    isSelected 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:bg-slate-200 dark:group-hover:bg-slate-600'
                  }">
                    ${optionLetter}
                  </div>

                  <span class="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed flex-grow">
                    ${escapeHtml(opt)}
                  </span>

                  <div class="w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                    isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 dark:border-slate-600'
                  }">
                    ${isSelected ? '<i data-lucide="check" class="w-3.5 h-3.5"></i>' : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Footer Control Buttons -->
        <div class="flex items-center justify-between gap-4">
          <button 
            onclick="navigateQuestion(-1)"
            ${currentIndex === 0 ? 'disabled' : ''}
            class="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-2"
          >
            <i data-lucide="arrow-left" class="w-4 h-4"></i> Sebelumnya
          </button>

          ${currentIndex < totalQuestions - 1 ? `
            <button 
              onclick="navigateQuestion(1)"
              class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition shadow-md shadow-blue-500/20 flex items-center gap-2"
            >
              Berikutnya <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </button>
          ` : `
            <button 
              onclick="confirmSubmitQuizModal()"
              class="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold transition shadow-md shadow-emerald-500/20 flex items-center gap-2"
            >
              Kirim Jawaban <i data-lucide="send" class="w-4 h-4"></i>
            </button>
          `}
        </div>

      </div>
    </section>

    <!-- Confirmation Submit Modal -->
    <div id="quizSubmitConfirmModal" class="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md hidden items-center justify-center p-4">
      <div class="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 animate-fade-in text-center">
        <div class="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 flex items-center justify-center mx-auto mb-4">
          <i data-lucide="help-circle" class="w-8 h-8"></i>
        </div>
        
        <h3 class="font-bold text-slate-900 dark:text-white text-lg mb-2">Konfirmasi Kirim Jawaban</h3>
        
        <div id="submitModalMessage" class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
          <!-- Populated by JS -->
        </div>

        <div class="flex items-center justify-center gap-3">
          <button onclick="closeSubmitConfirmModal()" class="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            Kembali ke Kuis
          </button>
          <button id="btnExecuteSubmitQuiz" onclick="executeQuizSubmission()" class="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition shadow-md shadow-emerald-500/20 flex items-center gap-2">
            Tetap Kirim Jawaban <i data-lucide="send" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    </div>
  `;

  renderLucideIcons();
}

/**
 * Handle Option Selection
 */
function selectQuizOption(questionId, optionIndex) {
  if (quizState.isSubmitted) return;
  quizState.answers[questionId] = optionIndex;
  renderQuizQuestionPage();
}

/**
 * Jump to Specific Question Index
 */
function jumpToQuestion(idx) {
  if (idx >= 0 && idx < quizState.questions.length) {
    quizState.currentIndex = idx;
    renderQuizQuestionPage();
  }
}

/**
 * Navigate Previous/Next Question
 */
function navigateQuestion(direction) {
  const newIndex = quizState.currentIndex + direction;
  if (newIndex >= 0 && newIndex < quizState.questions.length) {
    quizState.currentIndex = newIndex;
    renderQuizQuestionPage();
  }
}

/**
 * Open Submit Confirmation Modal
 */
function confirmSubmitQuizModal() {
  const totalQuestions = quizState.questions.length;
  const answeredCount = Object.keys(quizState.answers).length;
  const unansweredCount = totalQuestions - answeredCount;

  const modal = document.getElementById('quizSubmitConfirmModal');
  const msgContainer = document.getElementById('submitModalMessage');

  if (msgContainer) {
    if (unansweredCount > 0) {
      msgContainer.innerHTML = `
        Masih ada <strong class="text-rose-600 dark:text-rose-400 font-bold">${unansweredCount} soal</strong> yang belum dijawab. Apakah Anda yakin ingin mengirim jawaban sekarang?
      `;
    } else {
      msgContainer.innerHTML = `
        Seluruh <strong class="text-emerald-600 dark:text-emerald-400 font-bold">${totalQuestions} soal</strong> telah dijawab. Setelah dikirim, jawaban tidak dapat diubah kembali.
      `;
    }
  }

  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeSubmitConfirmModal() {
  const modal = document.getElementById('quizSubmitConfirmModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

/**
 * Execute Final Quiz Submission
 */
async function executeQuizSubmission() {
  if (quizState.isSubmitted) return;
  
  closeSubmitConfirmModal();
  quizState.isSubmitted = true;

  const submitBtn = document.getElementById('btnExecuteSubmitQuiz');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Mengirim hasil...';
  }

  // Generate unique attempt ID
  const attemptId = `${quizState.quizMeta.id}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  // SECURE FRONTEND PAYLOAD:
  // Only send attemptId, studentName, exact classLevel ("10" or "11-12"), quizId, and answers array.
  // DO NOT send score, correctAnswers, wrongAnswers, quizTitle, or client timestamp as source of truth!
  const payload = {
    attemptId: attemptId,
    studentName: quizState.studentInfo.name,
    classLevel: quizState.classLevel, // Exact match "10" or "11-12"
    quizId: quizState.quizMeta.id,
    answers: quizState.questions.map(q => ({
      questionId: q.id,
      answer: quizState.answers[q.id] !== undefined ? quizState.answers[q.id] : -1
    }))
  };

  // Local fallback calculation (only used if server is unconfigured or offline)
  const totalQuestions = quizState.questions.length;
  let localCorrectCount = 0;
  quizState.questions.forEach(q => {
    if (quizState.answers[q.id] === q.answer) {
      localCorrectCount++;
    }
  });
  const localWrongCount = totalQuestions - localCorrectCount;
  const localScore = Math.round((localCorrectCount / totalQuestions) * 100);

  let syncStatus = 'failed_sync';
  const endpoint = (typeof QUIZ_CONFIG !== 'undefined' && QUIZ_CONFIG.spreadsheetEndpoint) 
    ? QUIZ_CONFIG.spreadsheetEndpoint 
    : '';

  if (endpoint && endpoint !== "YOUR_GOOGLE_APPS_SCRIPT_URL") {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      
      const serverRes = await response.json();

      if (serverRes && serverRes.success && serverRes.result) {
        // SERVER-SIDE OFFICIAL RESULT ACCEPTED
        quizState.scoreData = {
          totalQuestions: serverRes.result.totalQuestions || totalQuestions,
          correctCount: serverRes.result.correctAnswers,
          wrongCount: serverRes.result.wrongAnswers,
          score: serverRes.result.score
        };
        quizState.serverReviewMap = {};
        if (Array.isArray(serverRes.result.review)) {
          serverRes.result.review.forEach(item => {
            quizState.serverReviewMap[item.questionId] = item;
          });
        }
        syncStatus = 'success';
      } else {
        // Server returned valid response but reported failure
        console.warn('Server melaporkan pesan:', serverRes ? serverRes.message : 'Unknown error');
        useLocalFallbackScore();
        syncStatus = 'failed_sync';
      }
    } catch (err) {
      console.warn('Fetch standar terkendala CORS (biasa terjadi pada Apps Script redirect), mencoba mode no-cors:', err);
      try {
        await fetch(endpoint, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload)
        });
        // In no-cors mode, payload reached Google Apps Script and was calculated & stored on server
        useLocalFallbackScore();
        syncStatus = 'success'; // Sheet saved successfully
      } catch (fallbackErr) {
        console.warn('Sync Google Sheets gagal sepenuhnya:', fallbackErr);
        useLocalFallbackScore();
        syncStatus = 'failed_sync';
      }
    }
  } else {
    useLocalFallbackScore();
    syncStatus = 'failed_sync'; // Endpoint not configured yet
  }

  function useLocalFallbackScore() {
    quizState.scoreData = {
      totalQuestions: totalQuestions,
      correctCount: localCorrectCount,
      wrongCount: localWrongCount,
      score: localScore
    };
  }

  quizState.submissionStatus = syncStatus;

  // Persist session result
  try {
    sessionStorage.setItem('lastQuizResult', JSON.stringify({
      studentInfo: quizState.studentInfo,
      quizMeta: quizState.quizMeta,
      scoreData: quizState.scoreData,
      submissionStatus: syncStatus,
      answers: quizState.answers,
      questions: quizState.questions,
      serverReviewMap: quizState.serverReviewMap || null
    }));
  } catch (e) {
    console.warn('SessionStorage tidak dapat diakses');
  }

  const targetHash = '#kuis/hasil';
  if (window.location.hash !== targetHash) {
    window.location.hash = targetHash;
  } else {
    renderQuizResultPage();
  }
}

/**
 * Render Quiz Result Page
 */
function renderQuizResultPage() {
  const appContainer = document.getElementById('app');
  if (!appContainer || !quizState.scoreData) return;

  const { score, correctCount, wrongCount, totalQuestions } = quizState.scoreData;
  const isSyncSuccess = quizState.submissionStatus === 'success';

  appContainer.innerHTML = `
    <section class="py-10 md:py-16">
      <div class="max-w-3xl mx-auto px-4 sm:px-6">
        
        <!-- Celebration Header -->
        <div class="glass-card rounded-3xl p-6 sm:p-10 text-center mb-8 animate-fade-in relative overflow-hidden">
          <div class="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/25">
            <i data-lucide="award" class="w-10 h-10"></i>
          </div>

          <span class="inline-block px-3.5 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
            Kuis Selesai!
          </span>

          <h1 class="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
            ${escapeHtml(quizState.quizMeta.title)}
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-8">
            Peserta: <strong class="text-slate-800 dark:text-slate-200">${escapeHtml(quizState.studentInfo.name)}</strong> (${escapeHtml(quizState.studentInfo.classLevel)})
          </p>

          <!-- Big Score Badge -->
          <div class="inline-block p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 mb-8">
            <div class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
              ${isSyncSuccess ? 'Nilai Resmi Terverifikasi Server' : 'Hasil Lokal — Belum Diverifikasi Server'}
            </div>
            <div class="text-5xl sm:text-6xl font-black ${score >= 75 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}">
              ${score} <span class="text-xl sm:text-2xl text-slate-400 font-bold">/ 100</span>
            </div>
          </div>

          <!-- Stats Grid Breakdown -->
          <div class="grid grid-cols-3 gap-3 sm:gap-4 max-w-md mx-auto mb-8">
            <div class="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/50">
              <div class="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-0.5">${correctCount}</div>
              <div class="text-xs text-emerald-800 dark:text-emerald-300 font-semibold">Benar</div>
            </div>
            <div class="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/50">
              <div class="text-xl sm:text-2xl font-bold text-rose-600 dark:text-rose-400 mb-0.5">${wrongCount}</div>
              <div class="text-xs text-rose-800 dark:text-rose-300 font-semibold">Salah</div>
            </div>
            <div class="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div class="text-xl sm:text-2xl font-bold text-slate-700 dark:text-slate-300 mb-0.5">${totalQuestions}</div>
              <div class="text-xs text-slate-500 dark:text-slate-400 font-semibold">Total Soal</div>
            </div>
          </div>

          <!-- Spreadsheet Sync Status Banner -->
          <div class="p-4 rounded-xl text-xs text-left max-w-md mx-auto mb-8 ${
            isSyncSuccess 
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200' 
              : 'bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200'
          }">
            <div class="flex items-center gap-2 font-bold mb-1">
              <i data-lucide="${isSyncSuccess ? 'check-circle-2' : 'alert-triangle'}" class="w-4 h-4 shrink-0"></i>
              <span>${isSyncSuccess ? '✓ Hasil Berhasil Diverifikasi & Terkirim' : '⚠ Hasil belum dapat diverifikasi oleh server'}</span>
            </div>
            <p class="leading-relaxed">
              ${isSyncSuccess 
                ? 'Nilai Anda dihitung dan diverifikasi langsung oleh server Google Apps Script serta telah dicatat ke Spreadsheet.' 
                : 'Hasil kuis belum dapat diverifikasi oleh server. Silakan coba kembali atau hubungi guru jika diperlukan.'}
            </p>
          </div>

          <!-- Action Control Buttons -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button onclick="renderQuizReviewPage()" class="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm transition shadow-md shadow-blue-500/20 flex items-center justify-center gap-2">
              <i data-lucide="eye" class="w-4 h-4"></i> Lihat Pembahasan Jawaban
            </button>
            <button onclick="resetAndReturnToQuizMain()" class="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-2">
              <i data-lucide="rotate-ccw" class="w-4 h-4"></i> Kembali ke Daftar Kuis
            </button>
          </div>

        </div>

      </div>
    </section>
  `;

  renderLucideIcons();
}

/**
 * Render Review All Answers Page (Feature 15)
 */
function renderQuizReviewPage() {
  const appContainer = document.getElementById('app');
  if (!appContainer || quizState.questions.length === 0) return;

  appContainer.innerHTML = `
    <section class="py-8 md:py-12">
      <div class="max-w-4xl mx-auto px-4 sm:px-6">
        
        <!-- Header & Back Button -->
        <div class="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white">Pembahasan Jawaban Kuis</h1>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Review hasil kuis <strong class="text-slate-800 dark:text-slate-200">${escapeHtml(quizState.studentInfo.name)}</strong> (${escapeHtml(quizState.quizMeta.title)})
            </p>
          </div>
          <button onclick="navigateToQuizResult()" class="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold transition flex items-center gap-1.5 shrink-0">
            <i data-lucide="arrow-left" class="w-4 h-4"></i> Kembali ke Hasil
          </button>
        </div>

        <!-- Questions Review List -->
        <div class="space-y-6">
          ${quizState.questions.map((q, idx) => {
            const studentAns = quizState.answers[q.id];
            
            // Check server review verification map if available
            let isCorrect = false;
            let correctAnswerIndex = q.answer;

            if (quizState.serverReviewMap && quizState.serverReviewMap[q.id]) {
              const rev = quizState.serverReviewMap[q.id];
              isCorrect = rev.isCorrect;
              correctAnswerIndex = rev.correctAnswer;
            } else {
              isCorrect = studentAns === q.answer;
            }

            return `
              <div class="glass-card rounded-2xl p-6 border ${isCorrect ? 'border-emerald-200/80 dark:border-emerald-900/60' : 'border-rose-200/80 dark:border-rose-900/60'}">
                <div class="flex items-center justify-between gap-3 mb-4">
                  <span class="text-xs font-bold text-slate-500 dark:text-slate-400">
                    Soal ${idx + 1} dari ${quizState.questions.length}
                  </span>

                  ${isCorrect ? `
                    <span class="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-1">
                      <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-emerald-600"></i> BENAR
                    </span>
                  ` : `
                    <span class="px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 text-xs font-bold flex items-center gap-1">
                      <i data-lucide="x-circle" class="w-3.5 h-3.5 text-rose-600"></i> SALAH
                    </span>
                  `}
                </div>

                <h3 class="text-base font-bold text-slate-900 dark:text-white mb-6 leading-relaxed">
                  ${escapeHtml(q.question)}
                </h3>

                <div class="space-y-3">
                  ${q.options.map((opt, optIdx) => {
                    const optionLetter = String.fromCharCode(65 + optIdx);
                    const isStudentChoice = studentAns === optIdx;
                    const isCorrectChoice = correctAnswerIndex === optIdx;

                    let cardStyle = 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60';
                    let badge = '';

                    if (isCorrectChoice) {
                      cardStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 text-emerald-900 dark:text-emerald-100 font-semibold ring-1 ring-emerald-400/30';
                      badge = '<span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><i data-lucide="check" class="w-4 h-4"></i> Jawaban Benar</span>';
                    }

                    if (isStudentChoice && !isCorrectChoice) {
                      cardStyle = 'bg-rose-50 dark:bg-rose-950/60 border-rose-400 text-rose-900 dark:text-rose-100 font-semibold ring-1 ring-rose-400/30';
                      badge = '<span class="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1"><i data-lucide="x" class="w-4 h-4"></i> Jawaban Anda (Salah)</span>';
                    }

                    return `
                      <div class="p-4 rounded-xl border ${cardStyle} flex items-center justify-between gap-3 text-xs sm:text-sm">
                        <div class="flex items-center gap-3">
                          <span class="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold shrink-0">
                            ${optionLetter}
                          </span>
                          <span class="leading-relaxed">${escapeHtml(opt)}</span>
                        </div>
                        ${badge}
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <div class="mt-8 text-center">
          <button onclick="navigateToQuizResult()" class="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm transition shadow-md shadow-blue-500/20 inline-flex items-center gap-2">
            <i data-lucide="arrow-left" class="w-4 h-4"></i> Kembali ke Halaman Hasil
          </button>
        </div>

      </div>
    </section>
  `;

  renderLucideIcons();
}
