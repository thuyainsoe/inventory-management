"use client";

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';

interface ProductOption {
  value: string;
  label: string;
}

interface PurchaseOrderItemsTableProps {
  form: UseFormReturn<any>;
  itemFields: any[];
  productOptions: ProductOption[];
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onProductChange: (index: number, productId: string) => void;
  watchedItems: any[];
}

export function PurchaseOrderItemsTable({
  form,
  itemFields,
  productOptions,
  onAddItem,
  onRemoveItem,
  onProductChange,
  watchedItems,
}: PurchaseOrderItemsTableProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Purchase Order Items</h3>
        <Button type="button" onClick={onAddItem} variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      {itemFields.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Tax</TableHead>
                  <TableHead>Line Total</TableHead>
                  <TableHead className="w-[50px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itemFields.map((field, index) => {
                  const item = watchedItems[index];
                  const lineTotal = item 
                    ? (item.unitPrice * item.quantity) - item.discount + item.tax 
                    : 0;
                  
                  return (
                    <TableRow key={field.id}>
                      <TableCell className="w-[300px]">
                        <Select
                          value={item?.productId || ""}
                          onValueChange={(value) => onProductChange(index, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                          <SelectContent>
                            {productOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="1"
                          {...form.register(`items.${index}.quantity`, { valueAsNumber: true })}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          {...form.register(`items.${index}.unitPrice`, { valueAsNumber: true })}
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          {...form.register(`items.${index}.discount`, { valueAsNumber: true })}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          {...form.register(`items.${index}.tax`, { valueAsNumber: true })}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {formatCurrency(lineTotal)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveItem(index)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {itemFields.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No items added yet. Click "Add Item" to get started.
          </CardContent>
        </Card>
      )}
    </div>
  );
}