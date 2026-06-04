import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import type { PasswordAnalysis } from '../types';
import { adjacencyGraphs, dictionary as commonDictionary } from '@zxcvbn-ts/language-common';
import { translations as enTranslations, dictionary as enDictionary } from '@zxcvbn-ts/language-en';

// Configure zxcvbn-ts options with correct named exports
zxcvbnOptions.setOptions({
  dictionary: {
    ...commonDictionary,
    ...enDictionary,
  },
  graphs: adjacencyGraphs,
  translations: enTranslations,
});

const getLabel = (score: number): PasswordAnalysis['label'] => {
  if (score <= 1) return 'Weak';
  if (score <= 2) return 'Medium';
  return 'Strong';
};

export const analyzePassword = (password: string): PasswordAnalysis => {
  const result = zxcvbn(password);
  
  const charsetSize = [
    /[a-z]/.test(password) ? 26 : 0,
    /[A-Z]/.test(password) ? 26 : 0,
    /\d/.test(password) ? 10 : 0,
    /[^A-Za-z0-9]/.test(password) ? 33 : 0,
  ].reduce((sum, value) => sum + value, 0);

  const entropy = password.length > 0 && charsetSize > 0
    ? Number((password.length * Math.log2(charsetSize)).toFixed(2))
    : 0;

  return {
    password,
    score: result.score,
    label: getLabel(result.score),
    crackTimeDisplay: result.crackTimesDisplay.offlineSlowHashing1e4PerSecond,
    entropy,
    length: password.length,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecialCharacters: /[^A-Za-z0-9]/.test(password),
    patternSummary: result.sequence.map((item) => `${item.pattern}: ${item.token}`),
    feedback: {
      warning: result.feedback.warning || '',
      suggestions: result.feedback.suggestions || [],
    },
  };
};