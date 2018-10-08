import { PolicyDetails } from './policy-details';
import { Driver } from '../driver';
import { Vehicle } from '../vehicle';

export class MotorPolicyDetails extends PolicyDetails {

  /** All drivers, so main driver plus additional drivers. */
  drivers: Driver[];

  /** The main driver. */
  mainDriver: Driver;

  /** The vehicle. */
  vehicle: Vehicle;

  europeanCover: boolean;

  constructor(data: any) {

    super(data);
    this.drivers = [];
    this.mainDriver = new Driver(data.mainDriver);
    const driversLength = data.drivers.length;
    for (let i = 0; i < driversLength; i = i + 1) {
      const driver = new Driver(data.drivers[i]);
      this.drivers.push(driver);
    }

    this.europeanCover = data.europeanCover;

    this.vehicle = new Vehicle(data.coveredVehicle);
  }
}
