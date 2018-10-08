import { Component, OnInit, Input } from '@angular/core';

/**
 * This global variable is defined outside of Angular as a regualar Javascript variable,
 * so me make it available to Angular by declaring it
 */
declare let esureDataLayer: object;

/**
 * This is responsible for updating the esureDataLayer global Javascript variable.
 */
@Component({
  selector: 'es-data-layer',
  template: '',
})
export class DataLayerComponent implements OnInit {

  @Input()
  vars: object;

  constructor() {
  }

  /**
   * Sets the passed in object key/value pairs onto the esureDataLayer object.
   */
  ngOnInit() {
    if (this.vars !== undefined) {
      Object.keys(this.vars).forEach((prop) => {
        esureDataLayer[prop] = this.vars[prop];
      });
      // console.debug('esureDataLayer is:', JSON.stringify(esureDataLayer, null, 2));
    }
  }

  /**
   * Add the passed in key/value pairs to the data layer.
   *
   * @param {object} varsToAdd
   * @memberof DataLayerComponent
   */
  public addToDataLayer(varsToAdd: object) {
    Object.keys(varsToAdd).forEach((prop) => {
      esureDataLayer[prop] = varsToAdd[prop];
    });
  }

  /**
   * Removes the passed in properties from the data layer.
   *
   * @param {string[]} varsToRemove
   * @memberof DataLayerComponent
   */
  public removeFromDataLayer(varsToRemove: string[]) {
    for (const prop of varsToRemove) {
      delete esureDataLayer[prop];
    }
  }
}
