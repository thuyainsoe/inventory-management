"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Plus, Save, Trash2, ShoppingCart } from "lucide-react";
import ProtectedRoute from "@/components/auth/protected-route";
import { useAuth } from "@/contexts/auth-context";
import { useCreatePurchaseOrder } from "@/hooks/use-purchase-orders";
import { useProducts } from "@/hooks/use-products";
import { FormFieldGenerator } from "@/components/form/form-field-generator";
import { purchaseOrderFormFieldSchema } from "@/schemas/purchase-orders/purchase-order-form-field-schema";
import {
  PurchaseOrderFormSchema,
  PurchaseOrderFormValues,
} from "@/schemas/purchase-orders/purchase-order-form-schema";
import { formatCurrency } from "@/lib/utils";

export default function CreatePurchaseOrderPage() {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const createPurchaseOrderMutation = useCreatePurchaseOrder();
  const { data: productsData, isLoading: productsLoading } = useProducts({ page: 1, limit: 1000 });

  const methods = useForm<PurchaseOrderFormValues>({
    resolver: zodResolver(PurchaseOrderFormSchema),
    defaultValues: {
      poNumber: "",
      poDate: new Date().toISOString().split('T')[0],
      supplierId: undefined,
      deliveryDate: "",
      status: "draft",
      paymentTerms: "",
      paymentMethod: "",
      totalAmount: 0,
      paidAmount: 0,
      notes: "",
      items: [],
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
    watch,
    setValue,
  } = methods;

  const { fields: itemFields, append: appendItem, remove: removeItem } = useFieldArray({
    control: methods.control,
    name: "items",
  });

  const watchedItems = watch("items");

  // Calculate total amount whenever items change
  useEffect(() => {
    const total = watchedItems.reduce((sum, item) => {
      const lineTotal = (item.unitPrice * item.quantity) - item.discount + item.tax;
      return sum + lineTotal;
    }, 0);
    setValue("totalAmount", total);
  }, [watchedItems, setValue]);

  const onSubmit = async (data: PurchaseOrderFormValues) => {
    try {
      await createPurchaseOrderMutation.mutateAsync(data);
      router.push("/purchase-orders");
    } catch (error) {
      console.error("Failed to create purchase order:", error);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const addItem = () => {
    appendItem({
      productId: "",
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      tax: 0,
    });
  };

  const removeItemHandler = (index: number) => {
    removeItem(index);
  };

  const productOptions = useMemo(() => {
    if (!productsData?.data) return [];
    return productsData.data.map((product) => ({
      label: `${product.name} (${product.sku})`,
      value: product.id,
      price: product.price,
    }));
  }, [productsData]);

  const handleProductChange = (index: number, productId: string) => {
    const product = productsData?.data.find(p => p.id === productId);
    if (product) {
      setValue(`items.${index}.productId`, productId);
      setValue(`items.${index}.unitPrice`, product.price);
    }
  };

  const formSchema = useMemo(() => {
    return purchaseOrderFormFieldSchema;
  }, []);

  return (
    <ProtectedRoute>
      <MainLayout user={currentUser || undefined}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={handleGoBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5" />
                <span>Create New Purchase Order</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {productsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Loading data...
                    </p>
                  </div>
                </div>
              ) : (
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <FormFieldGenerator formSchema={formSchema} />

                    {/* Purchase Order Items */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Purchase Order Items</h3>
                        <Button type="button" onClick={addItem} variant="outline">
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
                                  const lineTotal = item ? (item.unitPrice * item.quantity) - item.discount + item.tax : 0;
                                  
                                  return (
                                    <TableRow key={field.id}>
                                      <TableCell className="w-[300px]">
                                        <Select
                                          value={item?.productId || ""}
                                          onValueChange={(value) => handleProductChange(index, value)}
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
                                          {...methods.register(`items.${index}.quantity`, { valueAsNumber: true })}
                                          className="w-20"
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <Input
                                          type="number"
                                          min="0"
                                          step="0.01"
                                          {...methods.register(`items.${index}.unitPrice`, { valueAsNumber: true })}
                                          className="w-24"
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <Input
                                          type="number"
                                          min="0"
                                          step="0.01"
                                          {...methods.register(`items.${index}.discount`, { valueAsNumber: true })}
                                          className="w-20"
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <Input
                                          type="number"
                                          min="0"
                                          step="0.01"
                                          {...methods.register(`items.${index}.tax`, { valueAsNumber: true })}
                                          className="w-20"
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <span className="font-medium">
                                          {formatCurrency(lineTotal)}
                                        </span>
                                      </TableCell>
                                      <TableCell>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => removeItemHandler(index)}
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
                        <div className="text-center py-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                          <p className="text-muted-foreground">No items added yet</p>
                          <Button type="button" onClick={addItem} variant="outline" className="mt-2">
                            <Plus className="mr-2 h-4 w-4" />
                            Add First Item
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-4 pt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => reset()}
                        className="flex-1"
                      >
                        Reset Form
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1"
                        disabled={
                          isSubmitting || createPurchaseOrderMutation.isPending
                        }
                      >
                        <Save className="mr-2 h-4 w-4" />
                        {isSubmitting || createPurchaseOrderMutation.isPending
                          ? "Creating..."
                          : "Create Purchase Order"}
                      </Button>
                    </div>
                  </form>
                </FormProvider>
              )}
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}