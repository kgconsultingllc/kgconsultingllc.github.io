export type InvoceRowType = {
  "invoiceNumber" : number;
  "invoiceDate": string;
  "invoiceAmount": string;
  "invoicePaymentDate"?: string;
  "customerNumber": number;
  "customerName": string;
  "customerPaymentTerms": number;
  "customerMaxCreditLine": number;
  "_invoiceOverdue": number;
}

export type Operation = {
  "customerNumber": number;
  "customerName": string; //optional
  "invoiceNumber": number;
  "amount": string;
  "date"?: string;
}

export type SpanData = {
  credit: string;
  creditLine: number;
  timedate: string;
}

export type SpanOptions = 'day' | 'week' | 'month' | 'quarter'

export type CustomerId = {
  name: string;
  id: number;
}
