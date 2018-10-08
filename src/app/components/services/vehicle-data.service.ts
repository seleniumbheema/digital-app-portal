import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpService } from './http.service';

@Injectable()
export class VehicleDataService {

  constructor(private httpService: HttpService) { }

  public getVehicleWithReg(registrationNumber: string): Observable<{} | any> { // todo: JARED types
    return this.httpService.get<any>(`/vehicles/${registrationNumber}`);
  }
}
