import { ACCOUNT_SUMMARY_LIST } from "./queryDatabase.mjs";

export const accountQueryDAO = {
  retrieveAccountList() {
    return ACCOUNT_SUMMARY_LIST;
  },
  retrieveAccount(id) {
    const account = ACCOUNT_LIST.find(acc => acc.id === id);
    if (account) {
      return {
        id: account.id,
        name: account.lastName + " " + account.firstName
      };
    }
    return null;
  },
};
