import { Component, ViewChild } from '@angular/core';
import { DataLayerComponent } from '../../../../components/shared/data-layer.component';

const STARTING_PAGE_NAME = 'Portal Register Online';

@Component({
  templateUrl: './register.component.html',
  host: { class: 'main' },
})
export class RegisterComponent {

  private polOrReg = 'PolicyNumber';
  public pageName = `${STARTING_PAGE_NAME} (${this.polOrReg})`;

  @ViewChild(DataLayerComponent) dataLayerComponent: DataLayerComponent;

  public updateDataLayer(event: string) {
    if (event !== this.polOrReg) {
      this.polOrReg = event;
      this.dataLayerComponent.addToDataLayer({ pageName: `${STARTING_PAGE_NAME} (${event})` });
    }
  }

}
