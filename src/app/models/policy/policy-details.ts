import { Address } from '../address';

interface AddOn {
  code: string;
  name: string;
  purchased: boolean;
}

export abstract class PolicyDetails {

  number: number;
  type: string;
  lapsed: boolean;

  startDate: string;
  renewalDate: string;
  endDate: string;

  ncdProof: boolean;
  installmentPlan: number;
  riskAddress?: Address;
  holder: any;
  isMotor: boolean;
  isHome: boolean;
  addOns: AddOn[];
  // this could well be reinstated later
  // ddPayment: any;
  // ccPayment: any;
  cost: number;

  mtaAvailable: boolean;

  constructor(data: any) {
    this.number = data.number;
    this.type = data.type;
    this.isMotor = this.type === 'motor';
    this.isHome = this.type === 'home';

    this.startDate = data.startDate || data.coverStartDate;
    this.renewalDate = data.renewalDate;
    this.endDate = data.endDate;

    this.ncdProof = data.ncdProof;

    this.installmentPlan = data.installmentPlan;

    this.holder = data.holder;

    this.lapsed = data.lapsed;

    this.addOns = data.addOns;
    // this could well be reinstated later
    // this.ddPayment = data.ddPayment;
    // this.ccPayment = data.ccPayment;
    this.cost = data.cost;

    this.mtaAvailable = data.mtaAvailable;
  }
}
