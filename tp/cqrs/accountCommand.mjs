import { Account } from "./account.mjs";
import { accountCommandDAO } from "./accountCommandDAO.mjs";

export const accountCommand = {
  addAccount(lastName, firstName) {
    const newAccount = new Account(null, lastName, firstName, null);
    accountCommandDAO.insertAccount(newAccount);
    return newAccount;
  },
  saveAccount(id, lastName, firstName) {
    const account = accountCommandDAO.retrieveAccount(id);
    if (account) {
      account.lastName = lastName;
      account.firstName = firstName;
      accountCommandDAO.updateAccount(account);
    }
  },
};
