// DOM要素の取得
const squareList = document.getElementById('squareList');
const emptySquare = document.getElementById('emptySquare');
const refreshSquareBtn = document.getElementById('refreshSquareBtn');

// 已点赞的 ID 列表（保存在本地防止重复刷赞）
function getLikedIds() {
  return JSON.parse(localStorage.getItem('aiCommentLikedIds') || '[]');
}

function addLikedId(id) {
  const liked = getLikedIds();
  if (!liked.includes(id)) {
    liked.push(id);
    localStorage.setItem('aiCommentLikedIds', JSON.stringify(liked));
  }
}

// 应用语言到广场页
function applyLang(lang) {
  const t = i18n[lang];
  applyNavLang(t);

  const safe = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  safe('squarePageTitle', t.squarePageTitle);
  safe('squarePageSubtitle', t.squarePageSubtitle);
  safe('refreshSquareBtn', t.squareRefreshBtn);
  safe('squareEmptyText', t.squareEmpty);
}

// 初始化
applyLang(getLang());
bindLangButtons((lang) => {
  applyLang(lang);
  loadSquareFeed();
});

// 页面加载
document.addEventListener('DOMContentLoaded', () => {
  loadSquareFeed();
});

if (refreshSquareBtn) {
  refreshSquareBtn.addEventListener('click', () => {
    loadSquareFeed();
  });
}

// 加载广场动态
async function loadSquareFeed() {
  const t = i18n[getLang()];
  if (refreshSquareBtn) refreshSquareBtn.textContent = '⏳ ...';

  try {
    const res = await fetch('/api/square');
    const items = await res.json();

    if (!Array.isArray(items) || items.length === 0) {
      squareList.style.display = 'none';
      emptySquare.style.display = 'block';
      return;
    }

    squareList.style.display = 'flex';
    emptySquare.style.display = 'none';
    squareList.innerHTML = '';

    const likedIds = getLikedIds();

    items.forEach((item) => {
      const isLiked = likedIds.includes(item.id);
      const card = createSquareItem(item, isLiked);
      squareList.appendChild(card);
    });
  } catch (err) {
    console.error('Failed to load square feed:', err);
  } finally {
    if (refreshSquareBtn) refreshSquareBtn.textContent = t.squareRefreshBtn;
  }
}

// 创建广场动态卡片
function createSquareItem(item, isLiked) {
  const div = document.createElement('div');
  div.className = 'square-item';

  const date = new Date(item.created_at || item.timestamp || Date.now());
  const formattedDate = formatDate(date);
  const t = i18n[getLang()];

  let feedbackHtml = '';
  const userRating = item.user_rating || item.userRating;
  const customAnswer = item.user_custom_answer || item.userCustomAnswer;

  if ((userRating && userRating > 0) || (customAnswer && customAnswer.trim() !== '')) {
    let starsHtml = '';
    if (userRating && userRating > 0) {
      starsHtml = `<span class="history-user-rating">${'★'.repeat(userRating)}${'☆'.repeat(5 - userRating)} (${userRating}/5)</span>`;
    }

    feedbackHtml = `
      <div class="history-feedback-box">
        <div class="history-feedback-header">
          <span class="history-feedback-badge">${t.userFeedbackBadge}</span>
          ${starsHtml}
        </div>
        ${customAnswer ? `<div class="history-custom-answer">💬 ${escapeHtml(customAnswer)}</div>` : ''}
      </div>
    `;
  }

  const likesCount = item.likes || 0;

  div.innerHTML = `
    <div class="history-header">
      <span class="mode-badge ${item.mode}">${item.mode}</span>
      <span class="history-date">${formattedDate}</span>
    </div>
    <div class="history-input">“ ${escapeHtml(item.input)} ”</div>
    <div class="history-comment">${escapeHtml(item.comment)}</div>
    ${feedbackHtml}
    <div class="square-item-footer">
      <button class="like-btn ${isLiked ? 'liked' : ''}" data-id="${item.id}">
        <span class="like-icon">${isLiked ? '❤️' : '👍'}</span>
        <span class="like-count">${likesCount}</span>
      </button>
    </div>
  `;

  // 绑定点赞事件
  const likeBtn = div.querySelector('.like-btn');
  likeBtn.addEventListener('click', async () => {
    if (likeBtn.classList.contains('liked')) return; // 防止重复点赞

    try {
      const response = await fetch('/api/square/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id })
      });
      const data = await response.json();
      if (data.success) {
        addLikedId(item.id);
        likeBtn.classList.add('liked');
        likeBtn.querySelector('.like-icon').textContent = '❤️';
        likeBtn.querySelector('.like-count').textContent = data.likes;
      }
    } catch (e) {
      console.error('Like failed:', e);
    }
  });

  return div;
}

// 格式化日期
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}/${month}/${day} ${hours}:${minutes}`;
}

// HTML 转义
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
