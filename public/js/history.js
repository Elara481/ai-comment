// DOM要素の取得
const historyList = document.getElementById('historyList');
const emptyHistory = document.getElementById('emptyHistory');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

// 应用语言到历史页
function applyLang(lang) {
  const t = i18n[lang];
  applyNavLang(t);

  const safe = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  safe('pageTitle', t.histPageTitle);
  safe('pageSubtitle', t.histPageSubtitle);
  safe('clearHistoryBtn', t.histClearBtn);
  safe('emptyText', t.histEmpty);
  safe('goHomeBtn', t.histGoHome);
}

// 初期化
applyLang(getLang());
bindLangButtons((lang) => {
  applyLang(lang);
  displayHistory();
});

// ページ読み込み時に履歴を表示
document.addEventListener('DOMContentLoaded', () => {
  displayHistory();
});

// 履歴を表示
function displayHistory() {
  const history = JSON.parse(localStorage.getItem('aiCommentHistory') || '[]');
  const t = i18n[getLang()];

  if (history.length === 0) {
    historyList.style.display = 'none';
    emptyHistory.style.display = 'block';
    clearHistoryBtn.style.display = 'none';
    return;
  }

  historyList.style.display = 'flex';
  emptyHistory.style.display = 'none';
  clearHistoryBtn.style.display = 'block';

  historyList.innerHTML = '';

  history.forEach((item, index) => {
    const historyItem = createHistoryItem(item, index);
    historyList.appendChild(historyItem);
  });
}

// 履歴アイテムを作成
function createHistoryItem(item, index) {
  const div = document.createElement('div');
  div.className = 'history-item';

  const date = new Date(item.timestamp);
  const formattedDate = formatDate(date);
  const t = i18n[getLang()];

  let feedbackHtml = '';
  const hasUserRating = item.userRating && item.userRating > 0;
  const hasCustomAnswer = item.userCustomAnswer && item.userCustomAnswer.trim() !== '';

  if (hasUserRating || hasCustomAnswer) {
    let starsHtml = '';
    if (hasUserRating) {
      starsHtml = `<span class="history-user-rating">${'★'.repeat(item.userRating)}${'☆'.repeat(5 - item.userRating)} (${item.userRating}/5)</span>`;
    }

    feedbackHtml = `
      <div class="history-feedback-box">
        <div class="history-feedback-header">
          <span class="history-feedback-badge">${t.userFeedbackBadge}</span>
          ${starsHtml}
        </div>
        ${hasCustomAnswer ? `<div class="history-custom-answer">💬 ${escapeHtml(item.userCustomAnswer)}</div>` : ''}
      </div>
    `;
  }

  div.innerHTML = `
    <div class="history-header">
      <span class="mode-badge ${item.mode}">${item.mode}</span>
      <span class="history-date">${formattedDate}</span>
    </div>
    <div class="history-input">${escapeHtml(item.input)}</div>
    <div class="history-comment">${escapeHtml(item.comment)}</div>
    ${feedbackHtml}
  `;

  return div;
}

// 日付をフォーマット
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}/${month}/${day} ${hours}:${minutes}`;
}

// HTMLエスケープ
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 履歴をすべて削除
clearHistoryBtn.addEventListener('click', () => {
  const t = i18n[getLang()];
  if (confirm(t.histConfirm)) {
    localStorage.removeItem('aiCommentHistory');
    displayHistory();
  }
});

// Made with Bob
