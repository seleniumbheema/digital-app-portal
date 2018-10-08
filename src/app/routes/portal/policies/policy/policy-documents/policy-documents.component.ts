import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import * as FileSaver from 'file-saver';
import * as moment from 'moment';

import { PolicyDataService } from '../../../../../components/services/policy-data.service';
import { Message } from '../../../../../components/view/global-messages/global-messages.component';
import { LoadingHandlerComponent } from '../../../../../components/shared/loading-handler.component';
import { Documents, DocumentsTransaction } from '../../../../../models/documents-transaction';
import { DataLayerComponent } from '../../../../../components/shared/data-layer.component';
import { PolicyDetails } from '../../../../../models/policy/policy-details';
import { PolicySummary } from '../../../../../models/policy/policy-summary';
import { StringUtils } from '../../../../../components/utils/string-utils';

@Component({
  templateUrl: './policy-documents.component.html',
})
export class PolicyDocumentsComponent extends LoadingHandlerComponent implements OnInit, OnDestroy {

  public documents: Documents[];
  public messages: Message[] = [];
  public policy: PolicyDetails;
  public policySummary: PolicySummary;
  public shownFuture: boolean = false;
  public shownCurrent: boolean = false;
  public shownPrevious: boolean = false;

  private dateNow: moment.Moment = moment.utc();

  @ViewChild(DataLayerComponent) dataLayerComponent: DataLayerComponent;

  constructor(public policyDataService: PolicyDataService, public route: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    this.route.parent.data.subscribe((data: any) => {
      this.policy = data.policy;
      this.documents = data.documents;
      if (this.documents.length > 0) {
        this.assignExpandedTransactionsAndHeading();
      }
      this.policySummary = data.policies.find((summary: PolicySummary) => summary.number === this.policy.number);
    });
  }

  ngOnDestroy() {
    this.dataLayerComponent.removeFromDataLayer(['downloadDocumentId', 'downloadDocumentType']);
  }

  /**
   * Handles the downloading of a document.
   * @param policyNumber the policy number
   * @param id the document ID
   * @param type document type, only passed in to be used for updating esureDataLayer
   */
  downloadDocument(policyNumber: number, id: number, type: string): void {
    // Show the loader
    this.showLoader();
    // Clear any messages
    this.messages = [];
    this.policyDataService.getDocument(policyNumber, id).subscribe(
      (response: HttpResponse<Blob>) => {
        // Update the data layer with downloaded doc ID and type
        this.dataLayerComponent.addToDataLayer({ downloadDocumentId: id, downloadDocumentType: type });
        this.hideLoader();
        const fileName = type ? `${StringUtils.replaceWhiteSpaceWithChar(type, '_')}_${id}.pdf` : /* istanbul ignore next */ `${id}.pdf`;
        // Call the file saver to actually make the browser download the document
        FileSaver.saveAs(response.body, fileName);
      },
      (error: any) => {
        this.hideLoader();
        console.error('Error downloading PDF document', error);
        this.messages.push({ severity: 'danger', closable: false, summary: 'Failed to download document - please try again.', heading: '' });
      });
  }

  /**
   * Assigns the expanded and heading property on a transaction.
   */
  private assignExpandedTransactionsAndHeading(): void {
    this.documents.forEach((item: Documents) => {
      item.documentTransactions.forEach((item: DocumentsTransaction) => {
        item.heading = !this.shownFuture && this.isShowFutureTransactionHeader(item) ? 'Upcoming' : null;
        item.heading = item.heading === null && !this.shownCurrent ? (this.isShowCurrentTransactionHeader(item) ? 'Current' : null) : item.heading;
        item.heading = item.heading === null && !this.shownPrevious ? (this.isShowPreviousTransactionHeader(item) ? 'Previous' : null) : item.heading;
        // Any transaction with a heading will be expanded
        item.expanded = item.heading !== null;
      });
    });
  }

  private isShowFutureTransactionHeader(transaction: DocumentsTransaction): boolean {
    const isFuture = moment.utc(transaction.startDate).isAfter(this.dateNow);
    /* istanbul ignore else */
    if (isFuture) {
      this.shownFuture = true;
    }
    return isFuture;
  }

  private isShowCurrentTransactionHeader(transaction: DocumentsTransaction): boolean {
    const isCurrent = this.dateNow.isBetween(moment.utc(transaction.startDate), moment.utc(transaction.endDate));
    if (isCurrent) {
      this.shownCurrent = true;
    }
    return isCurrent;
  }

  private isShowPreviousTransactionHeader(transaction: DocumentsTransaction): boolean {
    const isPrevious = moment.utc(transaction.endDate).isBefore(this.dateNow);
    if (isPrevious) {
      this.shownPrevious = true;
    }
    return isPrevious;
  }
}
