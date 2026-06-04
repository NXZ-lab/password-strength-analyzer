export interface GeneratorOptions {
  length: number;
  includeNumbers: boolean;
  includeSymbols: boolean;
  includeUppercase: boolean;
  includeLowercase: boolean;
}

const sets = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

export const generatePassword = (options: GeneratorOptions): string => {
  const activeSets = [
    options.includeLowercase ? sets.lowercase : '',
    options.includeUppercase ? sets.uppercase : '',
    options.includeNumbers ? sets.numbers : '',
    options.includeSymbols ? sets.symbols : '',
  ].filter(Boolean);

  if (!activeSets.length) {
    throw new Error('Select at least one character set.');
  }

  const allChars = activeSets.join('');
  const seed = new Uint32Array(options.length);
  crypto.getRandomValues(seed);

  const guaranteed = activeSets.map((group, index) => group[seed[index] % group.length]);
  const generated = [...guaranteed];

  for (let index = guaranteed.length; index < options.length; index += 1) {
    generated.push(allChars[seed[index] % allChars.length]);
  }

  for (let index = generated.length - 1; index > 0; index -= 1) {
    const swapIndex = seed[index] % (index + 1);
    [generated[index], generated[swapIndex]] = [generated[swapIndex], generated[index]];
  }

  return generated.join('');
};
