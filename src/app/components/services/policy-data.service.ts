import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpService, HttpErrorModel } from './http.service';
import { PolicyDetails } from '../../models/policy/policy-details';
import { PolicySummary } from '../../models/policy/policy-summary';
import { MotorPolicyDetails } from '../../models/policy/motor-details';
import { HomePolicyDetails } from '../../models/policy/home-details';
import { DocumentsTransaction } from '../../models/documents-transaction';

@Injectable()
export class PolicyDataService {

  constructor(private httpService: HttpService) { }

  public getPolicies(): Observable<{} | PolicySummary[]> {
    return this.httpService.get<PolicySummary[]>('/policies');
  }

  public getPolicy(number: number, sequenceNumber: number, type: string): Observable<{} | PolicyDetails> {
    return this.httpService.get<PolicyDetails>(`/policies/${type}/${number}/${sequenceNumber}`).pipe(
      map((policyDetails: PolicyDetails) => {
        return this.createProductPolicyDetails(type, policyDetails);
      }));
  }

  /**
   * Get all documents for a single policy.
   * @param policyNumber policy number
   */
  public getDocuments(policyNumber: number): Observable<{} | DocumentsTransaction[]> {
    return this.httpService.get<DocumentsTransaction[]>(`/documents/${policyNumber}`);
  }

  /**
   * Get a single document.
   * @param policyNumber policy number
   * @param documentId document ID
   */
  public getDocument(policyNumber: number, documentId: number): Observable<HttpResponse<Blob> | HttpErrorModel> {
    return this.httpService.getBinary(`/document/${policyNumber}/${documentId}`);
  }

  private createProductPolicyDetails(type: string, policyDetails: PolicyDetails) {
    if (type === 'motor') {
      return new MotorPolicyDetails(policyDetails);
    }
    return new HomePolicyDetails(policyDetails);
  }
}
