import { ACCOUNT_SUMMARY_LIST } from "./queryDatabase.mjs";
import { accountCache } from "./cache.mjs";

export const accountQueryDAO = {
  retrieveAccountList() {
    return ACCOUNT_SUMMARY_LIST;
  },
  retrieveAccount(id) {
    return accountCache[id] || null;
  },
};
