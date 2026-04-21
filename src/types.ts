export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  senderName: string;
  senderEmail: string;
  senderAddress: string;
  receiverName: string;
  receiverEmail: string;
  receiverAddress: string;
  items: InvoiceItem[];
  notes: string;
  taxRate: number;
}
