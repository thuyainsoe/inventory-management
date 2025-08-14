import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { categoryService } from '@/lib/api/services'
import type { Category } from '@/types'

export interface UseCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  isActive?: boolean;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
  isActive?: boolean;
}

// Re-export Category type for convenience
export type { Category }

// Query Keys
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...categoryKeys.lists(), { filters }] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: number) => [...categoryKeys.details(), id] as const,
  stats: () => [...categoryKeys.all, 'stats'] as const,
  simple: () => [...categoryKeys.all, 'simple'] as const,
}

// Hook to get categories with pagination and filtering
export function useCategories(params?: UseCategoriesParams) {
  return useQuery({
    queryKey: categoryKeys.list(params || {}),
    queryFn: () => categoryService.getCategories(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook to get all categories (simple list)
export function useAllCategories() {
  return useQuery({
    queryKey: categoryKeys.simple(),
    queryFn: () => categoryService.getAllCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hook to get a single category
export function useCategory(id: number) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoryService.getCategory(id),
    enabled: !!id,
  })
}

// Hook to get category stats
export function useCategoryStats() {
  return useQuery({
    queryKey: categoryKeys.stats(),
    queryFn: () => categoryService.getStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook to create a category
export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (categoryData: CreateCategoryData) =>
      categoryService.createCategory(categoryData),
    onSuccess: () => {
      // Invalidate and refetch categories list
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: categoryKeys.simple() })
      queryClient.invalidateQueries({ queryKey: categoryKeys.stats() })
    },
  })
}

// Hook to update a category
export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCategoryData }) =>
      categoryService.updateCategory(id, data),
    onSuccess: (_, { id }) => {
      // Invalidate specific category and list
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: categoryKeys.simple() })
      queryClient.invalidateQueries({ queryKey: categoryKeys.stats() })
    },
  })
}

// Hook to delete a category
export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => categoryService.deleteCategory(id),
    onSuccess: () => {
      // Invalidate categories list
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: categoryKeys.simple() })
      queryClient.invalidateQueries({ queryKey: categoryKeys.stats() })
    },
  })
}