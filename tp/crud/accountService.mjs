import { Account } from "./account.mjs";
import { accountDAO } from "./accountDAO.mjs";

export const accountService = {
  addAccount(lastName, firstName) {
    const newAccount = new Account(null, lastName, firstName, null);
    accountDAO.insertAccount(newAccount);
    return newAccount;
  },
  getAccountList() {},
  saveAccount(id, lastName, firstName) {},
  getAccount(id) {},
};
