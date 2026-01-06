import { ACCOUNT_LIST } from "./database.mjs";
import { Account } from "./account.mjs";

export const accountCommandDAO = {
  insertAccount(account) {
    ACCOUNT_LIST.push(account);
    console.log(`Account inserted: ${account.firstName} ${account.lastName} (ID: ${account.id})`);
  },
  updateAccount(account) {
    const index = ACCOUNT_LIST.findIndex(acc => acc.id === account.id);
    if (index !== -1) {
      ACCOUNT_LIST[index] = account;
      console.log(`Account updated: ${account.firstName} ${account.lastName} (ID: ${account.id})`);
      console.log("Database content:", ACCOUNT_LIST);
    }
  },
  retrieveAccount(id) {
    const account = ACCOUNT_LIST.find(acc => acc.id === id);
    return new Account(account.id, account.lastName, account.firstName, account.creationDate);

  },
};
