import { TestBed } from '@angular/core/testing';
import { HttpResponse, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import * as moment from 'moment';
import * as FileSaver from 'file-saver';

import { PolicyDocumentsComponent } from './policy-documents.component';
import { SharedModule } from '../../../../../components/shared/shared.module';
import { PolicyDataService } from '../../../../../components/services/policy-data.service';
import { HttpErrorModel } from '../../../../../components/services/http.service';
import { DocumentsTransaction, Documents } from '../../../../../models/documents-transaction';

const futureDocsTransaction: DocumentsTransaction = {
  startDate: moment.utc().add(4, 'days').toISOString(),
  endDate: moment.utc().add(1, 'years').toISOString(),
  printRequestId: 1,
  transactionType: '',
  docs: [{
    documentId: 1234,
    documentType: 'Policy Booklet',
    documentCreationDate: '',
    coverStartDate: '',
    coverEndDate: '',
    policyNumber: 1,
    policyYear: 1,
  }],
  expanded: false,
  heading: null,
};

const currentDocTransaction: DocumentsTransaction = {
  startDate: moment.utc().subtract(4, 'days').toISOString(),
  endDate: moment.utc().add(1, 'year').toISOString(),
  printRequestId: 2,
  transactionType: '',
  docs: [{
    documentId: 1234,
    documentType: 'Policy Booklet',
    documentCreationDate: '',
    coverStartDate: '',
    coverEndDate: '',
    policyNumber: 1,
    policyYear: 1,
  }],
  expanded: false,
  heading: null,
};

const previousDocTransaction: DocumentsTransaction = {
  startDate: moment.utc().subtract(2, 'years').toISOString(),
  endDate: moment.utc().subtract(1, 'year').toISOString(),
  printRequestId: 2,
  transactionType: '',
  docs: [{
    documentId: 1234,
    documentType: 'Policy Booklet',
    documentCreationDate: '',
    coverStartDate: '',
    coverEndDate: '',
    policyNumber: 1,
    policyYear: 1,
  }],
  expanded: false,
  heading: null,
};

const mockDocuments: DocumentsTransaction[] = [
  futureDocsTransaction,
  futureDocsTransaction,
  currentDocTransaction,
  currentDocTransaction,
  previousDocTransaction,
  previousDocTransaction,
];

const mockDocs: Documents[] = [
  {
    policyYear: 2,
    documentTransactions: mockDocuments,
  },
  {
    policyYear: 1,
    documentTransactions: mockDocuments,
  },
];

const mockActivatedRoute = {
  parent: {
    data: of({ documents: mockDocs, policy: {}, policies: [{}] }),
    snapshot: {},
  },
};

class MockPolicyDataService {
  getDocument(policyNumber: number, documentId: number): Observable<HttpResponse<Blob> | HttpErrorModel> {
    const headers = new HttpHeaders({ 'content-disposition': 'attachment; filename=Certificate_of_Insurance_220463.pdf' });
    if (documentId === 1 && policyNumber === 1) {
      return of(new HttpResponse({ headers, body: new Blob() }));
    }
    return throwError({});
  }
}

describe('PolicyDocumentsComponent', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
      ],
      declarations: [
        PolicyDocumentsComponent,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: PolicyDataService, useClass: MockPolicyDataService },
      ],
    });
  });

  it('should create the Policy Documents component instance', () => {
    const fixture = TestBed.createComponent(PolicyDocumentsComponent);
    // Call detectChanges, this triggers the ngOnInit() to get called
    fixture.detectChanges();
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should download a document', () => {
    const fixture = TestBed.createComponent(PolicyDocumentsComponent);
    // Call detectChanges, this triggers the ngOnInit() to get called
    fixture.detectChanges();
    const component = fixture.componentInstance;
    spyOn(FileSaver, 'saveAs').and.stub();
    component.downloadDocument(1, 1, 'type');
    expect(component.messages).toBeEmptyArray();
    expect(FileSaver.saveAs).toHaveBeenCalled();
  });

  it('should add an error message if download document errors', () => {
    const fixture = TestBed.createComponent(PolicyDocumentsComponent);
    // Call detectChanges, this triggers the ngOnInit() to get called
    fixture.detectChanges();
    const component = fixture.componentInstance;
    component.downloadDocument(1, 2, 'type');
    expect(component.messages).toBeArrayOfSize(1);
  });

  it('should have empty documents array if no documents came in on activated route', () => {
    const noDocsMockActivatedRoute = {
      parent: {
        data: of({ documents: [], policy: {}, policies: [{}] }),
        snapshot: {},
      },
    };
    TestBed.overrideProvider(ActivatedRoute, { useValue: noDocsMockActivatedRoute });
    const fixture = TestBed.createComponent(PolicyDocumentsComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    expect(component.documents).toBeEmptyArray();
  });

});
