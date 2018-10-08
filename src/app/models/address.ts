export class Address {
  number: string;
  houseName: string;
  street: string;
  city: string;
  town: string;
  county: string;
  postcode: string;

  constructor(data: any) {
    this.number = data.number || data.houseNumber;
    this.houseName = data.houseName;
    this.street = data.street;
    this.city = data.city || data.location;
    this.town = data.postalTown;
    this.county = data.county;
    this.postcode = data.postcode;
  }
}
