import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productService } from '@/lib/api/services'
import type { Product, PaginatedResponse, ApiResponse } from '@/types'

// Query Keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
}

// Hook to get products with pagination and filtering
export function useProducts(params?: {
  page?: number
  limit?: number
  search?: string
  category?: string
}) {
  return useQuery({
    queryKey: productKeys.list(params || {}),
    queryFn: () => productService.getProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook to get a single product
export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.getProduct(id),
    enabled: !!id,
  })
}

// Hook to create a product
export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (productData: Partial<Product>) =>
      productService.createProduct(productData),
    onSuccess: () => {
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    },
  })
}

// Hook to update a product
export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      productService.updateProduct(id, data),
    onSuccess: (_, { id }) => {
      // Invalidate specific product and list
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    },
  })
}

// Hook to delete a product
export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: () => {
      // Invalidate products list
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    },
  })
}