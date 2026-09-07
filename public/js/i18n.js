// 语言配置（中日双语）
const i18n = {
  ja: {
    siteTitle: 'AI社畜評論家',
    siteSubtitle: 'あなたの今日を、AIが容赦なく評価します。',
    navHome: 'ホーム',
    navSquare: '社畜広場',
    navHistory: '履歴',
    navContact: 'お問い合わせ',
    inputLabel: '今日の出来事を入力してください（200文字以内）',
    inputPlaceholder: '例：今日はJavaを勉強しました',
    charLimit: '/ 200文字',
    randomTopicBtn: '今日のお題',
    modeTitle: 'AIモードを選択',
    mode1Name: '毒舌AI', mode1Desc: '辛口で少し意地悪',
    mode2Name: '優しいAI', mode2Desc: '肯定的で励ます',
    mode3Name: '上司AI', mode3Desc: 'ビジネス風評価',
    mode4Name: '同期AI', mode4Desc: '友達っぽく共感',
    mode5Name: '限界社畜AI', mode5Desc: '疲れ切った目線',
    generateBtn: '評価を生成',
    generatingBtn: '生成中...',
    resultTitle: '評価結果',
    // 互动评分 & 自定义回答
    feedbackTitle: 'この評価はいかがでしたか？',
    ratingLabel: 'AIの評価に点数をつけてください：',
    rating1: '全然ダメ 👎',
    rating2: '微妙 😐',
    rating3: 'まあまあ 🙂',
    rating4: '面白い 😄',
    rating5: '神対応 🌟',
    customAnswerPrompt: '納得いきませんか？あなたの「理想の回答 / 反論」を書いてみましょう：',
    customAnswerPlaceholder: '例：いやいや、今日は定時退社したかっただけです！/ もっと優しく言ってほしかった...',
    saveFeedbackBtn: '自分の回答・評価を記録する',
    feedbackSaved: '✅ あなたの評価・回答を履歴に記録しました！',
    userFeedbackBadge: 'あなたの感想・反論',
    userRatingLabel: '自己評価点',
    errNoInput: '入力内容を入力してください。',
    errTooLong: '入力は200文字以内にしてください。',
    errNoMode: 'AIモードを選択してください。',
    errForbidChar: (c) => `禁止文字「${c}」は入力できません。`,
    errGeneric: 'エラーが発生しました',
    // history
    histPageTitle: '評価履歴',
    histPageSubtitle: '過去の評価を振り返りましょう',
    histClearBtn: '履歴をすべて削除',
    histEmpty: 'まだ評価履歴がありません',
    histGoHome: '評価を生成する',
    histConfirm: 'すべての履歴を削除しますか？この操作は取り消せません。',
    // square
    squarePageTitle: '社畜広場 🏢',
    squarePageSubtitle: 'みんなの日常とAIの容赦ない評価・魂の反論をのぞいてみよう！',
    squareRefreshBtn: '🔄 最新の投稿を読み込む',
    squareEmpty: 'まだ広場への投稿がありません。ホームで評価を生成してみましょう！',
    squareLikeBtn: '👍 共感する',
    squareLikedBtn: '❤️ 共感済み',
    // contact
    contactPageTitle: 'お問い合わせ',
    contactPageSubtitle: 'ご意見・ご要望をお聞かせください',
    labelName: 'お名前',
    labelEmail: 'メールアドレス',
    labelMessage: 'お問い合わせ内容',
    submitBtn: '送信する',
    submittingBtn: '送信中...',
    contactSuccess: 'お問い合わせを受け付けました。ありがとうございます。',
    errAllRequired: 'すべての項目を入力してください。',
    errInvalidEmail: '有効なメールアドレスを入力してください。',
    footer: '© 2026 AI社畜評論家. All rights reserved.',
  },
  zh: {
    siteTitle: 'AI打工人评论家',
    siteSubtitle: '你的今天，由AI毫不留情地评价。',
    navHome: '首页',
    navSquare: '吐槽广场',
    navHistory: '历史记录',
    navContact: '联系我们',
    inputLabel: '请输入今天发生的事情（200字以内）',
    inputPlaceholder: '例：今天学了新知识，感觉还没完全搞懂',
    charLimit: '/ 200字',
    randomTopicBtn: '随机话题',
    modeTitle: '选择AI模式',
    mode1Name: '毒舌AI', mode1Desc: '辛辣吐槽，稍带刻薄',
    mode2Name: '温柔AI', mode2Desc: '肯定鼓励，暖心支持',
    mode3Name: '上司AI', mode3Desc: '职场风格，施加压力',
    mode4Name: '同事AI', mode4Desc: '朋友口吻，共情吐槽',
    mode5Name: '极限打工人AI', mode5Desc: '精疲力竭的同病相怜',
    generateBtn: '生成评价',
    generatingBtn: '生成中...',
    resultTitle: '评价结果',
    // 互动评分 & 自定义回答
    feedbackTitle: '觉得这个评价怎么样？',
    ratingLabel: '给AI的毒舌/评价打个分吧：',
    rating1: '太差劲 👎',
    rating2: '有点水 😐',
    rating3: '还凑合 🙂',
    rating4: '挺有趣 😄',
    rating5: '太绝了 🌟',
    customAnswerPrompt: '不满意这个回答？写下你的「理想评价 / 灵魂反驳」：',
    customAnswerPlaceholder: '例：才不是呢！今天明明是因为需求突变才加班的！/ 应该多夸夸我...',
    saveFeedbackBtn: '保存我的反驳与评分',
    feedbackSaved: '✅ 已将你的反驳与评分记录到历史中！',
    userFeedbackBadge: '我的反驳/自定义评价',
    userRatingLabel: '打分',
    errNoInput: '请输入内容。',
    errTooLong: '请在200字以内输入。',
    errNoMode: '请选择AI模式。',
    errForbidChar: (c) => `不能输入禁止字符「${c}」。`,
    errGeneric: '发生了错误',
    // history
    histPageTitle: '历史记录',
    histPageSubtitle: '回顾过去的评价',
    histClearBtn: '清空全部记录',
    histEmpty: '暂无历史记录',
    histGoHome: '去生成评价',
    histConfirm: '确定要清空全部历史记录吗？此操作不可撤销。',
    // square
    squarePageTitle: '打工人广场 🏢',
    squarePageSubtitle: '围观各路打工人的日常、AI的毒舌辣评与灵魂反驳！',
    squareRefreshBtn: '🔄 刷新最新动态',
    squareEmpty: '广场上还没有内容，快去首页生成第一个评价吧！',
    squareLikeBtn: '👍 共鸣/点赞',
    squareLikedBtn: '❤️ 已点赞',
    // contact
    contactPageTitle: '联系我们',
    contactPageSubtitle: '欢迎提出您的意见与建议',
    labelName: '姓名',
    labelEmail: '邮箱地址',
    labelMessage: '联系内容',
    submitBtn: '发送',
    submittingBtn: '发送中...',
    contactSuccess: '已收到您的留言，感谢您的反馈！',
    errAllRequired: '请填写所有必填项。',
    errInvalidEmail: '请输入有效的邮箱地址。',
    footer: '© 2026 AI打工人评论家. All rights reserved.',
  }
};

// 读取/保存语言设置
function getLang() {
  return localStorage.getItem('aiCommentLang') || 'ja';
}

function setLang(lang) {
  localStorage.setItem('aiCommentLang', lang);
}

// 应用语言到通用导航元素
function applyNavLang(t) {
  const safe = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  safe('navLogo', t.siteTitle);
  safe('navHome', t.navHome);
  safe('navSquare', t.navSquare);
  safe('navHistory', t.navHistory);
  safe('navContact', t.navContact);
  safe('footerText', t.footer);

  const langJa = document.getElementById('langJa');
  const langZh = document.getElementById('langZh');
  const lang = getLang();
  if (langJa) langJa.classList.toggle('active', lang === 'ja');
  if (langZh) langZh.classList.toggle('active', lang === 'zh');
}

// 绑定语言切换按钮（通用）
function bindLangButtons(onSwitch) {
  const langJa = document.getElementById('langJa');
  const langZh = document.getElementById('langZh');
  if (langJa) langJa.addEventListener('click', () => { setLang('ja'); onSwitch('ja'); });
  if (langZh) langZh.addEventListener('click', () => { setLang('zh'); onSwitch('zh'); });
}

// Made with Bob
