import { Directive, HostListener, OnInit } from '@angular/core';

import { CustomerDataService } from '../services/customer-data.service';

@Directive({
  selector: '[es-scrollTop]',
})
export class ScrollTopDirective implements OnInit {

  private innerWidth: number;

  constructor(private customerDataService: CustomerDataService) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
  }

  @HostListener('window:resize', [])
  public onResize(): void {
    this.innerWidth = window.innerWidth;
  }

  @HostListener('scroll', ['$event'])
  public scrollToTop($event): void {
    const target = $event.target || $event.srcElement;
    this.customerDataService.mobileScrollHidden = target.scrollTop < this.innerWidth;
  }
}
