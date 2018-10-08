export class Vehicle {
  make: string;
  model: string;
  reg: string;
  mileage: string;
  windscreenRepairExcess: number;
  windscreenReplacementExcess: number;
  dateOfRegistration: string;
  carValue: number;
  fuelTypeCode: string;
  fuelTypeDescription: string;
  vehicleEngineSize: number;

  constructor(data: any) {
    this.make = data.vehicleMake;
    this.model = data.vehicleModel;
    this.reg = data.vehicleRegNo;
    this.mileage = data.mileageDescription;
    this.windscreenRepairExcess = data.windscreenRepairExcess;
    this.windscreenReplacementExcess = data.windscreenReplacementExcess;
    this.dateOfRegistration = data.dateOfRegistration;
    this.carValue = data.carValue;
    this.fuelTypeCode = data.fuelTypeCode;
    this.fuelTypeDescription = data.fuelTypeDescription;
    this.vehicleEngineSize = data.vehicleEngineSize;
  }
}
