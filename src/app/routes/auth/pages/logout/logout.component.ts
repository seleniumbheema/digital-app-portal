import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, timer, Subscription } from 'rxjs';

import { CustomerDataService } from '../../../../components/services/customer-data.service';
import { Offer } from '../../../../models/offer';

@Component({
  templateUrl: './logout.component.html',
})

export class LogoutComponent implements OnInit, OnDestroy {
  public showQuestionnaire: boolean = false;
  public showThankYou: boolean = false;
  public offers: Offer[];

  private timerSubscription: Subscription;
  private timer: Observable<number>;

  constructor(public customerDataService: CustomerDataService) {
    this.offers = this.customerDataService.getLogoutOffers();
  }

  ngOnInit() {
    this.setTimer(sessionStorage.getItem('surveySeen') === null, 1000);
  }

  ngOnDestroy() {
    this.timerSubscription.unsubscribe();
  }

  public closeModal() {
    sessionStorage.setItem('surveySeen', 'true');
    this.setTimer(false, 2000);
  }

  /**
   * Function to hide yes / no options & show thank you message before closing modal.
   * @param show whether it's showing or hiding the modal
   * @param duration how long to delay showing or hiding the modal
   */
  private setTimer(show: boolean, duration: number): void {
    this.showThankYou = !show;
    this.timer = timer(duration);
    this.timerSubscription = this.timer.subscribe(() => {
      this.showQuestionnaire = show;
    });
  }

}
