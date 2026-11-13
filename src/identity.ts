import './wordmark.css';

/** iMAX wordmark (dark-background variant: "iM" lightened for contrast, mint/lime kept). */
export const wordmark = () => `<img class="ax-wordmark" src="/imax-wordmark-dark.svg" width="1648" height="269" alt="iMAX — iM금융그룹 AI Transformation">`;

export const identity = (sub = 'CEO OVERVIEW') => `${wordmark()}<b class="brand-sub">${sub}</b>`;
