// グローバル変数
let selectedMode = null;
let currentResultItem = null;
let userGivenRating = 0;

// ランダムお題リスト（日本語）
const randomTopicsJa = [
  '今日はJavaを勉強しました',
  '会議が長すぎました',
  'エラーが直りません',
  '定時で帰りたいです',
  '日報を書く気力がありません',
  '今日は少しだけ成長しました',
  'コードレビューで指摘されました',
  'テストが全部通りました',
  '新しいフレームワークを学びました',
  'バグを見つけてしまいました',
  '残業が確定しました',
  'ドキュメントを読みました',
  'リファクタリングしました',
  'デプロイに成功しました',
  '仕様変更がありました'
];

// ランダムお題リスト（中文）
const randomTopicsZh = [
  '今天学了新知识，但感觉还没完全搞懂',
  '开了一个小时的会，什么都没决定',
  '一个bug找了半天还没解决',
  '想准时下班结果又多留了一小时',
  '今天什么都没干，莫名其妙就到下班了',
  '今天稍微进步了一点点',
  '被上司指出了问题所在',
  '终于把任务都做完了',
  '接触了一个新工具，感觉挺有意思',
  '发现了一个隐藏很深的问题',
  '今天加班已成定局',
  '认真读了一份文档',
  '把之前乱七八糟的代码整理了一遍',
  '成功上线了，终于松了一口气',
  '需求又变了，从头开始'
];

// DOM要素の取得
const userInput = document.getElementById('userInput');
const charCount = document.getElementById('charCount');
const modeCards = document.querySelectorAll('.mode-card');
const generateBtn = document.getElementById('generateBtn');
const randomTopicBtn = document.getElementById('randomTopicBtn');
const errorMessage = document.getElementById('errorMessage');
const resultSection = document.getElementById('resultSection');
const resultMode = document.getElementById('resultMode');
const resultComment = document.getElementById('resultComment');
const starButtons = document.querySelectorAll('.interactive-stars .star-btn');
const starScoreText = document.getElementById('starScoreText');
const userCustomAnswer = document.getElementById('userCustomAnswer');
const saveFeedbackBtn = document.getElementById('saveFeedbackBtn');
const feedbackNotice = document.getElementById('feedbackNotice');

// 应用语言到当前页面
function applyLang(lang) {
  const t = i18n[lang];
  applyNavLang(t);

  const safe = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  const safeAttr = (id, attr, val) => { const el = document.getElementById(id); if (el) el[attr] = val; };

  safe('siteTitle', t.siteTitle);
  safe('siteSubtitle', t.siteSubtitle);
  safe('inputLabel', t.inputLabel);
  safeAttr('userInput', 'placeholder', t.inputPlaceholder);
  safe('charLimit', t.charLimit);
  safe('randomTopicBtn', t.randomTopicBtn);
  safe('modeTitle', t.modeTitle);
  safe('mode1Name', t.mode1Name); safe('mode1Desc', t.mode1Desc);
  safe('mode2Name', t.mode2Name); safe('mode2Desc', t.mode2Desc);
  safe('mode3Name', t.mode3Name); safe('mode3Desc', t.mode3Desc);
  safe('mode4Name', t.mode4Name); safe('mode4Desc', t.mode4Desc);
  safe('mode5Name', t.mode5Name); safe('mode5Desc', t.mode5Desc);
  safe('generateBtn', generateBtn.disabled ? t.generatingBtn : t.generateBtn);
  safe('resultTitle', t.resultTitle);
  safe('feedbackTitle', t.feedbackTitle);
  safe('ratingLabel', t.ratingLabel);
  safe('customAnswerPrompt', t.customAnswerPrompt);
  safeAttr('userCustomAnswer', 'placeholder', t.customAnswerPlaceholder);
  safe('saveFeedbackBtn', t.saveFeedbackBtn);
  updateRatingDesc(userGivenRating);
}

// 初期化
const currentLang = getLang();
applyLang(currentLang);

// 语言切换
bindLangButtons((lang) => {
  applyLang(lang);
  // 清空结果区域
  resultSection.style.display = 'none';
  userInput.value = '';
  charCount.textContent = '0';
});

// 文字数カウント
userInput.addEventListener('input', () => {
  const count = userInput.value.length;
  charCount.textContent = count;
  charCount.style.color = count > 200 ? '#f44336' : '#b0b0b0';
});

// 禁止文字の入力を防ぐ
userInput.addEventListener('input', (e) => {
  const forbiddenChars = ['<', '>', '&', ';'];
  let value = e.target.value;
  const t = i18n[getLang()];

  forbiddenChars.forEach(char => {
    if (value.includes(char)) {
      value = value.replace(new RegExp(char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '');
      showError(t.errForbidChar(char));
    }
  });

  e.target.value = value;
});

// モード選択
modeCards.forEach(card => {
  card.addEventListener('click', () => {
    modeCards.forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selectedMode = card.dataset.mode;
    hideError();
  });
});

// ランダムお題ボタン
randomTopicBtn.addEventListener('click', () => {
  const topics = getLang() === 'zh' ? randomTopicsZh : randomTopicsJa;
  const randomIndex = Math.floor(Math.random() * topics.length);
  userInput.value = topics[randomIndex];
  charCount.textContent = userInput.value.length;
});

// 生成ボタン
generateBtn.addEventListener('click', async () => {
  const input = userInput.value.trim();
  const lang = getLang();
  const t = i18n[lang];

  if (!input) { showError(t.errNoInput); return; }
  if (input.length > 200) { showError(t.errTooLong); return; }
  if (!selectedMode) { showError(t.errNoMode); return; }

  generateBtn.disabled = true;
  generateBtn.textContent = t.generatingBtn;

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input, mode: selectedMode, lang })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || t.errGeneric);
    }

    displayResult(data);

    const newHistoryItem = {
      id: Date.now().toString(),
      input,
      mode: selectedMode,
      comment: data.comment,
      rating: data.rating,
      userRating: 0,
      userCustomAnswer: '',
      timestamp: new Date().toISOString()
    };
    currentResultItem = newHistoryItem;

    // AI 生成的评论保存在本地历史履历中
    saveToHistory(newHistoryItem);

    hideError();

  } catch (error) {
    showError(error.message);
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = i18n[getLang()].generateBtn;
  }
});

// 結果を表示
function displayResult(data) {
  resultMode.textContent = data.mode;
  resultMode.className = 'mode-badge ' + data.mode;
  resultComment.textContent = data.comment;
  
  // 重置互动区状态
  userGivenRating = 0;
  highlightStars(0);
  starScoreText.textContent = '';
  if (userCustomAnswer) userCustomAnswer.value = '';
  if (feedbackNotice) {
    feedbackNotice.style.display = 'none';
    feedbackNotice.textContent = '';
  }

  resultSection.style.display = 'block';
  resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// 互动评分星星逻辑
starButtons.forEach(star => {
  star.addEventListener('click', () => {
    const rating = parseInt(star.dataset.star, 10);
    userGivenRating = rating;
    highlightStars(rating);
    updateRatingDesc(rating);
  });

  star.addEventListener('mouseenter', () => {
    const rating = parseInt(star.dataset.star, 10);
    highlightStars(rating);
  });
});

const starsContainer = document.getElementById('interactiveStars');
if (starsContainer) {
  starsContainer.addEventListener('mouseleave', () => {
    highlightStars(userGivenRating);
  });
}

function highlightStars(count) {
  starButtons.forEach(btn => {
    const s = parseInt(btn.dataset.star, 10);
    if (s <= count) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function updateRatingDesc(rating) {
  if (!starScoreText) return;
  const t = i18n[getLang()];
  if (!rating) {
    starScoreText.textContent = '';
    return;
  }
  const map = {
    1: t.rating1,
    2: t.rating2,
    3: t.rating3,
    4: t.rating4,
    5: t.rating5
  };
  starScoreText.textContent = map[rating] || '';
}

// 保存用户互动反馈
if (saveFeedbackBtn) {
  saveFeedbackBtn.addEventListener('click', () => {
    if (!currentResultItem) return;
    const customText = userCustomAnswer ? userCustomAnswer.value.trim() : '';
    
    // 更新当前项
    currentResultItem.userRating = userGivenRating;
    currentResultItem.userCustomAnswer = customText;

    updateHistoryFeedback(currentResultItem);

    const t = i18n[getLang()];
    if (feedbackNotice) {
      feedbackNotice.textContent = t.feedbackSaved;
      feedbackNotice.style.display = 'block';
    }
  });
}

function updateHistoryFeedback(updatedItem) {
  let history = JSON.parse(localStorage.getItem('aiCommentHistory') || '[]');
  const index = history.findIndex(h => h.id === updatedItem.id || (h.timestamp === updatedItem.timestamp && h.input === updatedItem.input));
  if (index !== -1) {
    history[index] = { ...history[index], ...updatedItem };
  } else {
    history.unshift(updatedItem);
  }
  localStorage.setItem('aiCommentHistory', JSON.stringify(history));
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add('show');
}

function hideError() {
  errorMessage.textContent = '';
  errorMessage.classList.remove('show');
}

function saveToHistory(data) {
  let history = JSON.parse(localStorage.getItem('aiCommentHistory') || '[]');
  history.unshift(data);
  if (history.length > 100) history = history.slice(0, 100);
  localStorage.setItem('aiCommentHistory', JSON.stringify(history));
}

// Made with Bob
