// DOM要素の取得
const squareList = document.getElementById('squareList');
const emptySquare = document.getElementById('emptySquare');
const refreshSquareBtn = document.getElementById('refreshSquareBtn');
const publishPostBtn = document.getElementById('publishPostBtn');
const postAuthorInput = document.getElementById('postAuthorInput');
const postJobInput = document.getElementById('postJobInput');
const postContentInput = document.getElementById('postContentInput');
const squarePostNotice = document.getElementById('squarePostNotice');
const workStars = document.querySelectorAll('.work-stars-select .work-star');
const workStarText = document.getElementById('workStarText');

let selectedWorkRating = 3;

// 评分星星交互
workStars.forEach(star => {
  star.addEventListener('click', () => {
    const rating = parseInt(star.dataset.rating, 10);
    selectedWorkRating = rating;
    updateWorkStars(rating);
  });
});

function updateWorkStars(rating) {
  workStars.forEach(s => {
    const r = parseInt(s.dataset.rating, 10);
    if (r <= rating) {
      s.classList.add('active');
    } else {
      s.classList.remove('active');
    }
  });
  if (workStarText) {
    workStarText.textContent = `${'★'.repeat(rating)} (${rating}点)`;
  }
}

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
  const safeAttr = (id, attr, val) => { const el = document.getElementById(id); if (el) el[attr] = val; };

  safe('squarePageTitle', t.squarePageTitle);
  safe('squarePageSubtitle', t.squarePageSubtitle);
  safe('squarePublishTitle', t.squarePublishTitle);
  safeAttr('postAuthorInput', 'placeholder', t.squareAuthorPlaceholder);
  safeAttr('postJobInput', 'placeholder', t.jobPlaceholder || t.squareJobPlaceholder);
  safe('squareWorkRatingLabel', t.squareWorkRatingLabel);
  safeAttr('postContentInput', 'placeholder', t.squareContentPlaceholder);
  safe('publishPostBtn', publishPostBtn && publishPostBtn.disabled ? t.squarePublishingBtn : t.squarePublishBtn);
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

// 发布我的工作心声
if (publishPostBtn) {
  publishPostBtn.addEventListener('click', async () => {
    const t = i18n[getLang()];
    const content = postContentInput.value.trim();
    if (!content) {
      alert(t.squareReplyEmptyErr || '内容を入力してください');
      return;
    }

    publishPostBtn.disabled = true;
    publishPostBtn.textContent = t.squarePublishingBtn;

    try {
      const res = await fetch('/api/square/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: postAuthorInput.value.trim(),
          jobType: postJobInput.value.trim(),
          content: content,
          workRating: selectedWorkRating
        })
      });

      const data = await res.json();
      if (res.ok) {
        postContentInput.value = '';
        if (squarePostNotice) {
          squarePostNotice.textContent = t.squarePostSuccess;
          squarePostNotice.style.display = 'block';
          setTimeout(() => { squarePostNotice.style.display = 'none'; }, 4000);
        }
        // 重新刷新列表
        loadSquareFeed();
      } else {
        alert(data.error || '投稿に失敗しました');
      }
    } catch (err) {
      console.error('Publish error:', err);
    } finally {
      publishPostBtn.disabled = false;
      publishPostBtn.textContent = t.squarePublishBtn;
    }
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

  const authorName = item.author_name || '匿名社畜';
  const jobType = item.job_type || item.mode || '社畜';
  const postContent = item.content || item.input || '';
  const workRating = item.work_rating || item.rating || 3;
  const starsHtml = `<span class="post-work-stars">${'★'.repeat(workRating)}${'☆'.repeat(5 - workRating)}</span>`;

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
      <div class="post-user-info">
        <span class="post-author-name">👤 ${escapeHtml(authorName)}</span>
        <span class="post-job-badge">${escapeHtml(jobType)}</span>
        ${starsHtml}
      </div>
      <span class="history-date">${formattedDate}</span>
    </div>

    <div class="square-post-body">${escapeHtml(postContent)}</div>
    
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
          postId: item.id,
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
