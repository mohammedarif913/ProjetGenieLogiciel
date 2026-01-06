import { Account } from "./account.mjs";
import { accountCommandDAO } from "./accountCommandDAO.mjs";
import { ACCOUNT_SUMMARY_LIST } from "./queryDatabase.mjs";
import { accountCache } from "./cache.mjs";

export const accountCommand = {
  addAccount(lastName, firstName) {
    const newAccount = new Account(null, lastName, firstName, null);
    accountCommandDAO.insertAccount(newAccount);
    ACCOUNT_SUMMARY_LIST.push({
      id: newAccount.id,
      lastName: newAccount.lastName,
      firstName: newAccount.firstName,
    });
    accountCache[newAccount.id] = {
      id: newAccount.id,
      name: newAccount.lastName + " " + newAccount.firstName,
    };
    return newAccount;
  },
  saveAccount(id, lastName, firstName) {
    const account = accountCommandDAO.retrieveAccount(id);
    if (account) {
      account.lastName = lastName;
      account.firstName = firstName;
      accountCommandDAO.updateAccount(account);
      const summaryAccount = ACCOUNT_SUMMARY_LIST.find(acc => acc.id === id);
      if (summaryAccount) {
        summaryAccount.lastName = lastName;
        summaryAccount.firstName = firstName;
      }
      accountCache[id] = {
        id: id,
        name: lastName + " " + firstName,
      };
    }
  },
};
