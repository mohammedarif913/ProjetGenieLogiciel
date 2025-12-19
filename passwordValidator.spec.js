const { verifyPassword } = require('./passwordValidator');

describe('verifyPassword', () => {
  test('devrait retourner true pour un mot de passe de 8 caractères ou plus', () => {
    expect(verifyPassword('azerty123')).toBe(true);
  });

  test('devrait retourner false pour un mot de passe de moins de 8 caractères', () => {
    expect(verifyPassword('court')).toBe(false);
  });

  test('devrait retourner true pour un mot de passe de exactement 8 caractères', () => {
    expect(verifyPassword('12345678')).toBe(true);
  });
});
