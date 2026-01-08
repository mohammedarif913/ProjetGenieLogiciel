import { Account } from "./account.mjs";
import { accountCommandDAO } from "./accountCommandDAO.mjs";
import { ACCOUNT_SUMMARY_LIST } from "./queryDatabase.mjs";
import { accountCache } from "./cache.mjs";


import {Event} from "./event.mjs"
import { addEvent} from "./eventStore.mjs"

export const accountCommand = {
  addAccount(lastName, firstName) {
    const newAccount = new Account(null, lastName, firstName,null);
    //accountCommandDAO.insertAccount(newAccount);
    const formattedAccount = {
      id: newAccount.id,
      lastName: newAccount.lastName,
      firstName: newAccount.firstName,
    };
    //accountQueryDAO.insertAccountSummary(formattedAccount)
    ACCOUNT_SUMMARY_LIST.push(formattedAccount);
    accountCache[newAccount.id] = {
      id: newAccount.id,
      name: newAccount.lastName + " " + newAccount.firstName,
    };
    const addAccountEvent = new Event('accountAdded', newAccount.id, {firstName,lastName});
    addEvent(addAccountEvent)
    return newAccount;
  },
  saveAccount(id, lastName, firstName) {
    const account = accountCommandDAO.retrieveAccount(id);
    if (account) {
      account.lastName = lastName;
      account.firstName = firstName;
      const updateAccountEvent = new Event('accountUpdated', id, { lastName, firstName });
      addEvent(updateAccountEvent);
      //accountCommandDAO.updateAccount(account);
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
