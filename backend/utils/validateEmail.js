const validator = require("validator");
const blockedDomains = require("disposable-email-domains");
const wildcardBlockedDomains = require("disposable-email-domains/wildcard.json");

const blockedDomainsSet = new Set(blockedDomains);

function validateEmail(email) {
  if (!validator.isEmail(email))
    return { valid: false, message: "Invalid email" };

  const domain = email.split("@")[1].toLowerCase();

  if (blockedDomainsSet.has(domain))
    return { valid: false, message: "Temporary/disposable email not allowed" };

  for (const baseDomain of wildcardBlockedDomains) {
    if (domain === baseDomain || domain.endsWith(`.${baseDomain}`)) {
      return {
        valid: false,
        message: "Temporary/disposable email not allowed",
      };
    }
  }

  return { valid: true };
}

module.exports = validateEmail;
