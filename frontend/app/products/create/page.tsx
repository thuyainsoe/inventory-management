"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Package, Save } from "lucide-react";
import ProtectedRoute from "@/components/auth/protected-route";
import { useAuth } from "@/contexts/auth-context";
import { useCreateProduct } from "@/hooks/use-products";
import { useAllCategories } from "@/hooks/use-categories";
import { FormFieldGenerator } from "@/components/form/form-field-generator";
import { ProductFormFieldsSchema } from "@/schemas/products/product-form-field-schema";
import {
  ProductFormSchema,
  ProductFormValues,
} from "@/schemas/products/product-form-schema";
import { useAllBrands } from "@/hooks/use-brands";

export default function CreateProductPage() {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const createProductMutation = useCreateProduct();
  const { data: categoriesData, isLoading: categoriesLoading } =
    useAllCategories();
  const { data: brandsData, isLoading: brandsDataLoading } = useAllBrands();

  const methods = useForm<ProductFormValues>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: "",
      description: "",
      sku: "",
      barcode: "",
      categoryId: undefined,
      price: 0,
      cost: 0,
      stock: 0,
      minStock: 0,
      images: [],
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  const onSubmit = async (data: ProductFormValues) => {
    console.log(data, "data");
    try {
      await createProductMutation.mutateAsync(data);
      router.push("/products");
    } catch (error) {
      console.error("Failed to create product:", error);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  // Convert categories data to options format
  const categoryOptions = useMemo(() => {
    if (!categoriesData) return [];
    return categoriesData.map((category) => ({
      label: category.name,
      value: category.id.toString(),
    }));
  }, [categoriesData]);

  const brandOptions = useMemo(() => {
    if (!brandsData) return [];
    return brandsData.map((brand) => ({
      label: brand.name,
      value: brand.id.toString(),
    }));
  }, [brandsData]);

  const formSchema = useMemo(() => {
    return ProductFormFieldsSchema({
      categoryOptions,
      brandOptions,
    });
  }, [categoryOptions, brandOptions]);

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
                <Package className="h-5 w-5" />
                <span>Create New Product</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {categoriesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Loading categories...
                    </p>
                  </div>
                </div>
              ) : (
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <FormFieldGenerator formSchema={formSchema} />

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
                          isSubmitting || createProductMutation.isPending
                        }
                      >
                        <Save className="mr-2 h-4 w-4" />
                        {isSubmitting || createProductMutation.isPending
                          ? "Creating..."
                          : "Create Product"}
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
