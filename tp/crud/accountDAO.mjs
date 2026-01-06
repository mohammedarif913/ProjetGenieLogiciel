import { ACCOUNT_LIST } from "./database.mjs";

export const accountDAO = {
  insertAccount(account) {
    ACCOUNT_LIST.push(account);
    console.log(`Account inserted: ${account.firstName} ${account.lastName} (ID: ${account.id})`);
  },
  retrieveAccountList() {
    return ACCOUNT_LIST;
  },
  updateAccount(account) {},
  retrieveAccount(id) {},
};
