const config = window.LANDING_CONFIG || {};
const configuredText = (value) => typeof value === 'string' ? value.trim() : '';

// Only accept hex colors; invalid/missing settings keep the CSS fallback.
const themeProperties = {
  background: '--background',
  cardTop: '--card-top',
  cardBottom: '--card-bottom',
  border: '--border',
  heading: '--heading',
  text: '--text',
  muted: '--muted',
  accent: '--accent',
  accentMuted: '--accent-muted',
  primary: '--primary',
  primaryHover: '--primary-hover',
  onPrimary: '--on-primary',
  member: '--member'
};
for (const [setting, property] of Object.entries(themeProperties)) {
  const color = configuredText(config.theme?.[setting]);
  if (/^#[0-9a-f]{6}$/i.test(color)) {
    document.documentElement.style.setProperty(property, color);
    if (setting === 'background') {
      document.querySelector('meta[name="theme-color"]').content = color;
    }
  }
}

// Only load Meta's script when a valid Pixel ID is configured.
const metaPixelId = configuredText(config.metaPixelId);
const pixelEnabled = /^\d+$/.test(metaPixelId);
if (pixelEnabled) {
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  window.fbq('init', metaPixelId);
  window.fbq('track', 'PageView');
}

const textSettings = {
  'page-subtitle': 'subtitle',
  'channel-label': 'channelLabel',
  'member-label': 'memberLabel',
  'button-text': 'buttonText',
  'badge-line-1': 'badgeLine1',
  'badge-line-2': 'badgeLine2',
  'disclaimer-text': 'disclaimer'
};
for (const [id, setting] of Object.entries(textSettings)) {
  document.getElementById(id).textContent = configuredText(config[setting]);
}

const heading = document.getElementById('page-heading');
const headingParts = ['headingBefore', 'headingHighlight', 'headingAfter'];
for (const setting of headingParts) {
  const text = configuredText(config[setting]);
  if (!text) continue;
  if (heading.childNodes.length) heading.append(' ');
  if (setting === 'headingHighlight') {
    const highlight = document.createElement('span');
    highlight.textContent = text;
    heading.append(highlight);
  } else {
    heading.append(text);
  }
}

const channelName = configuredText(config.channelName);
const avatar = document.getElementById('join-avatar');
if (channelName) {
  document.getElementById('join-title').textContent = channelName;
  avatar.textContent = channelName.charAt(0).toUpperCase();
}

const description = configuredText(config.description);
if (description) {
  document.getElementById('channel-description').textContent = description;
}
document.title = configuredText(config.pageTitle) || (channelName ? `${channelName} | Telegram channel` : 'Telegram channel');
document.querySelector('meta[name="description"]').content = configuredText(config.metaDescription) || description || 'Telegram channel';

const activeUsers = configuredText(config.activeUsers);
if (activeUsers) {
  const count = document.getElementById('active-users');
  count.textContent = activeUsers;

  if (/^\d+\+?$/.test(activeUsers) && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const readableCount = document.createElement('span');
    readableCount.className = 'visually-hidden';
    readableCount.textContent = activeUsers;

    const rollingCount = document.createElement('span');
    rollingCount.className = 'rolling-count';
    rollingCount.setAttribute('aria-hidden', 'true');

    for (const [index, character] of [...activeUsers].entries()) {
      if (character === '+') {
        const suffix = document.createElement('span');
        suffix.textContent = character;
        rollingCount.append(suffix);
        continue;
      }

      const digit = document.createElement('span');
      digit.className = 'rolling-digit';
      const track = document.createElement('span');
      track.className = 'rolling-digit-track';
      track.style.animationDelay = `${index * 90}ms`;

      for (let step = 0; step <= 10; step += 1) {
        const frame = document.createElement('span');
        frame.textContent = String((Number(character) + step) % 10);
        track.append(frame);
      }

      digit.append(track);
      rollingCount.append(digit);
    }

    count.replaceChildren(readableCount, rollingCount);
  }
}

const displayPicture = configuredText(config.displayPicture);
if (displayPicture) {
  const picture = new Image();
  picture.alt = '';
  picture.onload = () => avatar.replaceChildren(picture);
  picture.src = displayPicture;
}

const telegramLink = document.getElementById('telegram-link');
const telegramUrl = configuredText(config.telegramUrl);
if (telegramUrl) {
  telegramLink.href = telegramUrl;
  telegramLink.removeAttribute('aria-disabled');
}
const TELEGRAM_CHANNEL_URL = telegramLink.href;

const advertisingManager = configuredText(config.advertisingManager);
const advertisingEmail = configuredText(config.advertisingEmail);
if (advertisingManager && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(advertisingEmail)) {
  document.getElementById('advertising-manager').textContent = advertisingManager;
  document.getElementById('advertising-email').textContent = advertisingEmail;
  document.getElementById('advertising-contact').hidden = false;
}

telegramLink.addEventListener('click', (event) => {
  if (!telegramUrl) {
    event.preventDefault();
    return;
  }
  if (pixelEnabled && typeof window.fbq === 'function') {
    window.fbq('trackCustom', 'TelegramClick');
  }

  // Keep ordinary navigation open briefly so the browser can send the Pixel event.
  if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
    event.preventDefault();
    window.setTimeout(() => {
      window.location.assign(TELEGRAM_CHANNEL_URL);
    }, 180);
  }
});
