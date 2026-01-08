import { ACCOUNT_LIST } from "./database.mjs";
import { Account } from "./account.mjs";
import { Event } from './event';
import { addEvent } from './eventStore';


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
      console.log('Database content:', ACCOUNT_LIST);
    }
  },
  retrieveAccount(id) {
    const accountEvents = eventList.filter(event => event.accountId === id);

    if (accountEvents.length === 0) return null;

    let account = new Account(id, null, null, null);

    accountEvents.forEach(event => {
      account.lastName = event.payload.lastName;
      account.firstName = event.payload.firstName;
      account.creationDate = event.creationDate;
    });

    return account;
  },
};
