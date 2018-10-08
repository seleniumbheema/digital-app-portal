import { PolicyDocument } from './policy-document';

/**
 * Top level Documents model, the xAPI will return an array of these.
 */
export interface Documents {
  policyYear: number;
  documentTransactions: DocumentsTransaction[];
}

/**
 * PolicyDocument transactions model.
 */
export interface DocumentsTransaction {
  expanded: boolean;
  startDate: string;
  endDate: string;
  printRequestId: number;
  docs: PolicyDocument[];
  transactionType: string;
  heading: string;
}
