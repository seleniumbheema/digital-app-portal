export class Driver {

  driverType: string;
  title: string;
  gender: string;
  forename: string;
  surname: string;
  driveOtherCarsInd: string;
  classOfUse: string;
  classOfUseShortDescription: string;
  classOfUseLongDescription: string;
  coverTypeDescription: string;
  ncdProtection: boolean;
  voluntaryExcess: number;
  compulsoryExcess: number;
  uwAdExcess: number;
  fireExcess: number;
  theftExcess: number;
  driverSpecificXs: number;
  ncdLevel: number;

  constructor(data: any) {
    this.driverType = data.driverType;
    this.title = data.title;
    this.gender = data.gender;
    this.forename = data.forename;
    this.surname = data.surname;
    this.driveOtherCarsInd = data.driveOtherCarsInd;
    this.classOfUse = data.classOfUse;
    this.classOfUseShortDescription = data.classOfUseShortDescription;
    this.classOfUseLongDescription = data.classOfUseLongDescription;
    this.coverTypeDescription = data.coverTypeDescription;
    this.ncdProtection = data.ncdProtection === 'YES';
    this.voluntaryExcess = data.voluntaryExcess;
    this.compulsoryExcess = data.compulsoryExcess;
    this.uwAdExcess = data.uwAdExcess;
    this.fireExcess = data.fireExcess;
    this.theftExcess = data.theftExcess;
    this.driverSpecificXs = data.driverSpecificXs;
    this.ncdLevel = data.ncdLevel;
  }
}
