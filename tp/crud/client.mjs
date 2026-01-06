import { accountService } from "./accountService.mjs";

accountService.addAccount("Dupont", "Jean");
console.log(accountService.getAccountList());
