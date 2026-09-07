// DOM要素の取得
const contactForm = document.getElementById('contactForm');
const contactError = document.getElementById('contactError');
const contactSuccess = document.getElementById('contactSuccess');

// 应用语言到联系页
function applyLang(lang) {
  const t = i18n[lang];
  applyNavLang(t);

  const safe = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  safe('pageTitle', t.contactPageTitle);
  safe('pageSubtitle', t.contactPageSubtitle);
  safe('labelName', t.labelName);
  safe('labelEmail', t.labelEmail);
  safe('labelMessage', t.labelMessage);
  safe('submitBtn', t.submitBtn);
}

// 初期化
applyLang(getLang());
bindLangButtons((lang) => { applyLang(lang); });

// フォーム送信
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  hideError();
  hideSuccess();

  const lang = getLang();
  const t = i18n[lang];

  const formData = new FormData(contactForm);
  const data = {
    name: formData.get('name').trim(),
    email: formData.get('email').trim(),
    message: formData.get('message').trim()
  };

  if (!data.name || !data.email || !data.message) {
    showError(t.errAllRequired);
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    showError(t.errInvalidEmail);
    return;
  }

  const submitBtn = contactForm.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = t.submittingBtn;

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || t.errGeneric);
    }

    showSuccess(t.contactSuccess);
    contactForm.reset();

  } catch (error) {
    showError(error.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = i18n[getLang()].submitBtn;
  }
});

function showError(message) {
  contactError.textContent = message;
  contactError.classList.add('show');
}

function hideError() {
  contactError.textContent = '';
  contactError.classList.remove('show');
}

function showSuccess(message) {
  contactSuccess.textContent = message;
  contactSuccess.style.display = 'block';
}

function hideSuccess() {
  contactSuccess.textContent = '';
  contactSuccess.style.display = 'none';
}

// Made with Bob
