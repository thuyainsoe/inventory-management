import { FormSchema } from "@/components/form/form-field-generator";

export const purchaseOrderFormFieldSchema: FormSchema = [
  {
    sectionId: 1,
    title: "Purchase Order Information",
    fields: [
      {
        id: 1,
        name: "poNumber",
        label: "PO Number",
        type: "text",
        placeholder: "Enter PO number",
        required: true,
      },
      {
        id: 2,
        name: "poDate",
        label: "PO Date",
        type: "date",
        placeholder: "Select PO date",
        required: true,
      },
      {
        id: 3,
        name: "supplierId",
        label: "Supplier",
        type: "select",
        placeholder: "Select supplier",
        options: [], // To be populated dynamically
      },
      {
        id: 4,
        name: "deliveryDate",
        label: "Delivery Date",
        type: "date",
        placeholder: "Select delivery date",
      },
      {
        id: 5,
        name: "status",
        label: "Status",
        type: "select",
        placeholder: "Select status",
        options: [
          { label: "Draft", value: "draft" },
          { label: "Pending", value: "pending" },
          { label: "Approved", value: "approved" },
          { label: "Ordered", value: "ordered" },
          { label: "Received", value: "received" },
          { label: "Cancelled", value: "cancelled" },
        ],
      },
    ],
  },
  {
    sectionId: 2,
    title: "Payment Information",
    fields: [
      {
        id: 6,
        name: "paymentTerms",
        label: "Payment Terms",
        type: "text",
        placeholder: "e.g., Net 30",
      },
      {
        id: 7,
        name: "paymentMethod",
        label: "Payment Method",
        type: "select",
        placeholder: "Select payment method",
        options: [
          { label: "Bank Transfer", value: "bank_transfer" },
          { label: "Credit Card", value: "credit_card" },
          { label: "Cash", value: "cash" },
          { label: "Check", value: "check" },
        ],
      },
      {
        id: 8,
        name: "totalAmount",
        label: "Total Amount",
        type: "number",
        placeholder: "0.00",
        min: 0,
        step: 0.01,
        required: true,
      },
      {
        id: 9,
        name: "paidAmount",
        label: "Paid Amount",
        type: "number",
        placeholder: "0.00",
        min: 0,
        step: 0.01,
      },
    ],
  },
  {
    sectionId: 3,
    title: "Additional Information",
    fields: [
      {
        id: 10,
        name: "notes",
        label: "Notes",
        type: "textarea",
        placeholder: "Additional notes or comments",
        fullWidth: true,
        rows: 3,
        maxLength: 1000,
      },
    ],
  },
];