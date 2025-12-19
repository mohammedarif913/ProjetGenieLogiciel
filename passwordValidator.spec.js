const { verifyPassword } = require('./passwordValidator');

describe('verifyPassword', () => {
  test('Valide : un mot de passe de 8 caractères ou plus et contient un chiffre ', () => {// is valid
    expect(verifyPassword('azerty123')).toBe(true);
  });
  test('Invalide : un mot de passe de 8 caractères ou plus et ne contient pas  un chiffre ', () => {
    expect(verifyPassword('azertyuio')).toBe(false);
  });

  test('Invalide :  un mot de passe de moins de 8 caractères avec un chiffre ', () => {
    expect(verifyPassword('court8')).toBe(false);
  });
  test('Invalide :  un mot de passe de moins de 8 caractères sans un chiffre ', () => { // suppr
    expect(verifyPassword('court')).toBe(false);
  });

  test('Valide : un mot de passe de exactement 8 caractères dont un est un chiffre ', () => {
    expect(verifyPassword('e2345678')).toBe(true);
  });

  test('Invalide : un mot de passe de exactement 8 caractères sans un chiffre ', () => { //suppr
    expect(verifyPassword('abcdefgh')).toBe(false);
  });
});
