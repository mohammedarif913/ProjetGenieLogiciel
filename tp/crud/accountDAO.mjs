import { ACCOUNT_LIST } from "./database.mjs";

export const accountDAO = {
  insertAccount(account) {
    ACCOUNT_LIST.push(account);
    console.log(`Account inserted: ${account.firstName} ${account.lastName} (ID: ${account.id})`);
  },
  retrieveAccountList() {
    return ACCOUNT_LIST.map(({ id, lastName, firstName }) => ({
      id,
      lastName,
      firstName,
    }));
  },
  updateAccount(account) {
    const index = ACCOUNT_LIST.findIndex(acc => acc.id === account.id);
    if (index !== -1) {
      ACCOUNT_LIST[index] = account;
      console.log(`Account updated: ${account.firstName} ${account.lastName} (ID: ${account.id})`);
      console.log("Database content:", ACCOUNT_LIST);
    }
  },
  retrieveAccount(id) {},
};
