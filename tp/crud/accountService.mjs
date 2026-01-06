import { Account } from "./account.mjs";
import { accountDAO } from "./accountDAO.mjs";
import { ACCOUNT_LIST } from './database.mjs';

export const accountService = {
  addAccount(lastName, firstName) {
    const newAccount = new Account(null, lastName, firstName, null);
    accountDAO.insertAccount(newAccount);
    return newAccount;
  },
  getAccountList() {
    return accountDAO.retrieveAccountList();
  },
  saveAccount(id, lastName, firstName) {
    const account = accountDAO.retrieveAccount(id);
    if (account) {
      account.lastName = lastName;
      account.firstName = firstName;
      accountDAO.updateAccount(account);
    }
  },
  getAccount(id) {
    return accountDAO.retrieveAccount(id);
  },
};
