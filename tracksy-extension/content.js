// ── Content script — runs on LinkedIn Jobs and Indeed ─────────────────────────
// Listens for messages from the popup asking for job info.

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action !== 'getJobInfo') return;

  let company  = '';
  let position = '';

  const url = window.location.href;

  // ── LinkedIn Jobs ──────────────────────────────────────────────────────────
  if (url.includes('linkedin.com')) {
    // Job title
    const titleEl = document.querySelector(
      'h1.job-details-jobs-unified-top-card__job-title, h1.t-24, .jobs-unified-top-card__job-title'
    );
    if (titleEl) position = titleEl.textContent?.trim() || '';

    // Company name
    const compEl = document.querySelector(
      '.job-details-jobs-unified-top-card__company-name a, .jobs-unified-top-card__company-name a, a.ember-view.t-black.t-normal'
    );
    if (compEl) company = compEl.textContent?.trim() || '';
  }

  // ── Indeed ─────────────────────────────────────────────────────────────────
  if (url.includes('indeed.com')) {
    const titleEl = document.querySelector('h1[data-testid="jobsearch-JobInfoHeader-title"], h1.jobsearch-JobInfoHeader-title');
    if (titleEl) position = titleEl.textContent?.replace(/\s*-\s*job.*$/i, '').trim() || '';

    const compEl = document.querySelector('[data-testid="inlineHeader-companyName"] a, .icl-u-lg-mr--sm');
    if (compEl) company = compEl.textContent?.trim() || '';
  }

  sendResponse({ company, position });
  return true; // keep channel open
});
