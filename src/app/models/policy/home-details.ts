import { PolicyDetails } from './policy-details';
import { Address } from '../address';

interface HighValueItem {
  itemDescription: string;
  itemValue: number;
}

interface PolicyHolder {
  policyholderType: string;
  title: string;
  forename: string;
  surname: string;
  dateOfBirth: string;
}

interface OptionalExtrasCover {
  coverType: string;
  coverIncluded: string;
  sumInsured: number;
}

export class HomePolicyDetails extends PolicyDetails {

  accidentalDamageBuildings: string;
  accidentalDamageContents: string;
  buildingSumInsured: number;
  children: string;
  contentsSumInsured: number;
  highValueItems: HighValueItem[];
  jointPolicyHolder: PolicyHolder;
  subsidence: number;
  waterDamage: number;
  householdGoods: number;
  highValueItemsSum: number;
  excessBuildingsVoluntary: number;
  excessBuildingsCompulsory: number;
  excessContentsVoluntary: number;
  excessContentsCompulsory: number;
  excessWater: number;
  excessSubsidence: number;
  personalPossessions: OptionalExtrasCover;
  coverType: string;
  ncdProtected: boolean;
  ncdYears: string;

  constructor(data: any) {
    super(data);
    this.accidentalDamageBuildings = data.accidentalDamageBuildings;
    this.accidentalDamageContents = data.accidentalDamageContents;
    this.buildingSumInsured = data.buildingSumInsured;
    this.children = data.children;
    this.contentsSumInsured = data.contentsSumInsured;
    this.highValueItems = data.highValueItems;
    this.jointPolicyHolder = data.jointPolicyHolder;
    this.subsidence = data.subsidence;
    this.waterDamage = data.waterDamage;
    this.householdGoods = data.householdGoods;
    this.highValueItemsSum = data.highValueItemsSum;
    this.excessBuildingsVoluntary = data.excessBuildingsVoluntary;
    this.excessBuildingsCompulsory = data.excessBuildingsCompulsory;
    this.excessContentsVoluntary = data.excessContentsVoluntary;
    this.excessContentsCompulsory = data.excessContentsCompulsory;
    this.excessWater = data.excessWater;
    this.excessSubsidence = data.excessSubsidence;
    this.riskAddress = new Address(data.address);
    this.personalPossessions = data.personalPossessions;
    this.coverType = data.coverType;
    this.ncdProtected = data.ncdProtected;
    this.ncdYears = data.ncdYears;
  }
}
