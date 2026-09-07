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
  const replies = item.replies || [];
  const replyCount = replies.length;

  // 渲染已有盖楼评论
  let repliesListHtml = '';
  replies.forEach(r => {
    const rDate = formatDate(new Date(r.created_at || Date.now()));
    repliesListHtml += `
      <div class="reply-bubble">
        <div class="reply-bubble-header">
          <span class="reply-nick">${escapeHtml(r.nickname || '匿名社畜')}</span>
          <span class="reply-time">${rDate}</span>
        </div>
        <div class="reply-bubble-content">${escapeHtml(r.content)}</div>
      </div>
    `;
  });

  div.innerHTML = `
    <div class="history-header">
      <span class="mode-badge ${item.mode}">${item.mode}</span>
      <span class="history-date">${formattedDate}</span>
    </div>
    <div class="history-input">“ ${escapeHtml(item.input)} ”</div>
    <div class="history-comment">${escapeHtml(item.comment)}</div>
    ${feedbackHtml}
    
    <div class="square-item-footer">
      <button class="reply-toggle-btn" data-id="${item.id}">
        ${t.squareReplyToggle(replyCount)}
      </button>
      <button class="like-btn ${isLiked ? 'liked' : ''}" data-id="${item.id}">
        <span class="like-icon">${isLiked ? '❤️' : '👍'}</span>
        <span class="like-count">${likesCount}</span>
      </button>
    </div>

    <!-- 匿名评论/盖楼抽屉区 -->
    <div class="square-replies-drawer" style="display: none;">
      <div class="replies-list-container">
        ${repliesListHtml}
      </div>
      <div class="reply-input-box">
        <input type="text" class="reply-nickname-input" placeholder="${t.squareNickPlaceholder}" maxlength="20">
        <textarea class="reply-textarea" rows="2" placeholder="${t.squareReplyPlaceholder}" maxlength="200"></textarea>
        <button class="reply-submit-btn btn-secondary">${t.squareReplySubmit}</button>
      </div>
    </div>
  `;

  // 绑定点赞事件
  const likeBtn = div.querySelector('.like-btn');
  likeBtn.addEventListener('click', async () => {
    if (likeBtn.classList.contains('liked')) return;

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

  // 绑定展开/折叠评论
  const replyToggleBtn = div.querySelector('.reply-toggle-btn');
  const repliesDrawer = div.querySelector('.square-replies-drawer');
  replyToggleBtn.addEventListener('click', () => {
    const isHidden = repliesDrawer.style.display === 'none';
    repliesDrawer.style.display = isHidden ? 'block' : 'none';
  });

  // 绑定提交匿名评论
  const submitReplyBtn = div.querySelector('.reply-submit-btn');
  const nickInput = div.querySelector('.reply-nickname-input');
  const contentInput = div.querySelector('.reply-textarea');
  const repliesListContainer = div.querySelector('.replies-list-container');

  submitReplyBtn.addEventListener('click', async () => {
    const content = contentInput.value.trim();
    if (!content) {
      alert(t.squareReplyEmptyErr);
      return;
    }

    submitReplyBtn.disabled = true;
    try {
      const res = await fetch('/api/square/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commentId: item.id,
          nickname: nickInput.value.trim(),
          content: content
        })
      });
      const newR = await res.json();
      if (newR && newR.content) {
        // 动态追加一条新回复
        const rDate = formatDate(new Date(newR.created_at || Date.now()));
        const bubble = document.createElement('div');
        bubble.className = 'reply-bubble';
        bubble.innerHTML = `
          <div class="reply-bubble-header">
            <span class="reply-nick">${escapeHtml(newR.nickname || '匿名社畜')}</span>
            <span class="reply-time">${rDate}</span>
          </div>
          <div class="reply-bubble-content">${escapeHtml(newR.content)}</div>
        `;
        repliesListContainer.appendChild(bubble);
        contentInput.value = '';

        // 更新按钮上的评论计数
        const currentCount = repliesListContainer.children.length;
        replyToggleBtn.textContent = t.squareReplyToggle(currentCount);
      }
    } catch (err) {
      console.error('Failed to submit reply:', err);
    } finally {
      submitReplyBtn.disabled = false;
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
