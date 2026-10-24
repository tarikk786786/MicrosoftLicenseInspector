/**
 * Privacy & Log Scrubbing Utilities
 */

const KEY_REGEX = /([A-Z0-9]{5}-){4}[A-Z0-9]{5}/gi;

export function scrubLogs(text) {
  if (typeof text !== 'string') return text;
  return text.replace(KEY_REGEX, (match) => {
    const parts = match.split('-');
    return `${parts[0]}-*****-*****-*****-${parts[4]}`;
  });
}

export function safeLog(...args) {
  const scrubbed = args.map(arg => {
    if (typeof arg === 'string') return scrubLogs(arg);
    if (typeof arg === 'object' && arg !== null) {
      try {
        return JSON.parse(scrubLogs(JSON.stringify(arg)));
      } catch {
        return '[Object]';
      }
    }
    return arg;
  });
  console.log(...scrubbed);
}
