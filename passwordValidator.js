function verifyPassword(password){
  let hasMinLength = password.length >=8
  let hasDigit = password.split('').filter(char => char >='0' && char <='9').length > 0

  return hasMinLength && hasDigit
}

module.exports = {verifyPassword}
