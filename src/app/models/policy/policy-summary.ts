import { Address } from '../address';
import { Vehicle } from '../vehicle';

export class PolicySummary {
  number: number;
  sequenceNumber: number;
  type: string;
  lapsed: boolean;
  startDate: string;
  renewalDate: string;
  endDate: string;
  renewable: boolean;
  ncdProof: boolean;
  installmentPlan: number;
  riskAddress?: Address;
  vehicle?: Vehicle;
  isMotor: boolean;
  isHome: boolean;
  renewalNotificationCode: string;
  mtaNotificationCode: string;
  mtaStartDate: string;

  constructor(data: any) {
    this.number = data.number;
    this.sequenceNumber = data.sequenceNumber;
    this.type = data.type;
    this.isMotor = this.type === 'motor';
    this.isHome = this.type === 'home';
    this.startDate = data.startDate;
    this.renewalDate = data.renewalDate;
    this.endDate = data.endDate;
    this.renewable = data.renewable;
    this.ncdProof = data.ncdProof;
    this.installmentPlan = data.installmentPlan;
    this.lapsed = data.lapsed;
    this.renewalNotificationCode = data.renewalNotificationCode;
    this.mtaNotificationCode = data.mtaNotificationCode;
    this.mtaStartDate = data.mtaStartDate;

    if (this.isMotor) {
      const summaryVehicle = {
        vehicleRegNo: data.vehicleReg,
        vehicleMake: data.vehicleType.make,
        vehicleModel: data.vehicleType.model,
      };
      this.vehicle = new Vehicle(summaryVehicle);
    } else if (this.isHome) {
      this.riskAddress = new Address(data.riskAddress);
    }
  }
}
