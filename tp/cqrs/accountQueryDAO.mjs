import { ACCOUNT_LIST } from "./database.mjs";

export const accountQueryDAO = {
  retrieveAccountList() {
    return ACCOUNT_LIST.map(({ id, lastName, firstName }) => ({
      id,
      lastName,
      firstName,
    }));
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
