import { accountService } from "./accountService.mjs";

const account = accountService.addAccount("Dupont", "Jean");
console.log(accountService.getAccountList());
accountService.saveAccount(account.id, "Martin", "Paul");
