const validator = require("validator");
const blockedDomains = require("disposable-email-domains");
const wildcardBlockedDomains = require("disposable-email-domains/wildcard.json");
const extraBlockedDomains = require("disposable-email/domains.json");

const additionalBlockedDomains = [
  "tempmail.org",
  "throwaway.email",
  "temp-mail.org",
  "disposable.email",
  "throwaway.mail",
  "tempmail.net",
  "tempail.com",
  "tempinbox.com",
  "tempr.email",
  "trashmail.com",
  "trash-mail.com",
  "trashmail.net",
  "trashmail.org",
  "trashymail.com",
  "trashymail.net",
  "trashymail.org",
  "10minutemail.com",
  "10minutemail.net",
  "10minutemail.org",
  "temp-mail.com",
  "temp-mail.io",
  "temp-mail.ru",
  "tempmail.com",
  "tempmail.dev",
  "tempmail.plus",
  "yopmail.com",
  "yopmail.fr",
  "yopmail.net",
  "mailinator.com",
  "mailinator.net",
  "mailinator.org",
  "guerrillamail.com",
  "guerrillamail.org",
  "guerrillamail.net",
  "guerrillamail.de",
  "guerrillamail.info",
  "guerrillamail.biz",
  "sharklasers.com",
  "grr.la",
  "getnada.com",
  "nada.ltd",
  "maildrop.cc",
  "moakt.com",
  "spamgourmet.com",
  "mailnesia.com",
  "trashmail.de",
  "trashmail.me",
  "trashmail.io",
  "fakemail.net",
  "burnermail.io",
  "dropmail.me",
  "mail.tm",
  "minuteinbox.com",
  "jourrapide.com",
  "rhyta.com",
  "superrito.com",
  "teleworm.us",
  "armyspy.com",
  "cuvox.de",
  "dayrep.com",
  "einrot.com",
  "fleckens.hu",
  "gustr.com",
  "spam4.me",
  "artvara.com",
  "dotxan.com",
];

const tempEmailPatterns = [
  /^temp.*\.com$/i,
  /^temp.*\.org$/i,
  /^temp.*\.net$/i,
  /^disposable.*\.com$/i,
  /^disposable.*\.org$/i,
  /^throwaway.*\.com$/i,
  /^throwaway.*\.org$/i,
  /^trash.*\.com$/i,
  /^trash.*\.org$/i,
  /^trash.*\.net$/i,
  /.*temp.*mail.*\./i,
  /.*disposable.*mail.*\./i,
  /.*throwaway.*mail.*\./i,
  /.*trash.*mail.*\./i,
  /.*fake.*mail.*\./i,
  /.*spam.*mail.*\./i,
  /.*junk.*mail.*\./i,
  /.*temporary.*mail.*\./i,
  /.*one.*time.*mail.*\./i,
  /.*10.*minute.*mail.*\./i,
  /.*15.*minute.*mail.*\./i,
  /.*30.*minute.*mail.*\./i,
  /.*60.*minute.*mail.*\./i,
];

// Use Sets for fast membership checks
const blockedDomainsSet = new Set(blockedDomains);
const extraBlockedDomainsSet = new Set(extraBlockedDomains);
const additionalBlockedDomainsSet = new Set(additionalBlockedDomains);

function validateEmail(email) {
  if (!validator.isEmail(email))
    return { valid: false, message: "Invalid email" };

  const domain = email.split("@")[1].toLowerCase();

  if (blockedDomainsSet.has(domain))
    return { valid: false, message: "Temporary/disposable email not allowed" };

  if (additionalBlockedDomainsSet.has(domain))
    return { valid: false, message: "Temporary/disposable email not allowed" };

  if (extraBlockedDomainsSet.has(domain))
    return { valid: false, message: "Temporary/disposable email not allowed" };

  for (const baseDomain of wildcardBlockedDomains) {
    if (domain === baseDomain || domain.endsWith(`.${baseDomain}`)) {
      return {
        valid: false,
        message: "Temporary/disposable email not allowed",
      };
    }
  }

  for (const pattern of tempEmailPatterns) {
    if (pattern.test(domain)) {
      return {
        valid: false,
        message: "Temporary/disposable email not allowed",
      };
    }
  }

  return { valid: true };
}

module.exports = validateEmail;
