export class Event {


  constructor(name , accountId , payload) {

    this.name = name;
    this.accountId = accountId;
    this.payload = payload;
    this.creationDate = new Date();


  }



}
