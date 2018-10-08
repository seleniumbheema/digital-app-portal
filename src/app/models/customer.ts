export interface CrossSell {
  name: string;
}

export class Customer {

  firstName: string;
  lastName: string;
  email: string;
  title: string;
  crossSell: CrossSell[];
  id: string;
  dateOfBirth: string;
  address: any; // TODO: MTA - ADD TYPE

  constructor(data: any) {
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.title = data.title;
    this.crossSell = data.crossSell;
    this.id = data.id;
    this.dateOfBirth = data.dateOfBirth;
    this.address = data.address;
  }
}
