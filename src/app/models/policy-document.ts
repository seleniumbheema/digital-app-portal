/**
 * PolicyDocument model.
 */
export interface PolicyDocument {
  policyNumber: number;
  documentType: string;
  documentCreationDate: string;
  documentId: number;
  policyYear: number;
  coverStartDate: string;
  coverEndDate: string;
}
