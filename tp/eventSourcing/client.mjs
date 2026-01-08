import { accountCommand } from "./accountCommand.mjs";
import { accountQuery } from "./accountQuery.mjs";

const account = accountCommand.addAccount("Dupont", "Jean");
console.log(accountQuery.getAccountList());
accountCommand.saveAccount(account.id, "Martin", "Paul");
console.log(accountQuery.getAccount(account.id));
