import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { brandService } from "@/lib/api/services";
import type { Brand } from "@/types";

export interface UseBrandsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface CreateBrandData {
  name: string;
  description?: string;
  logo?: string;
  isActive?: boolean;
}

export interface UpdateBrandData {
  name?: string;
  description?: string;
  logo?: string;
  isActive?: boolean;
}

// Re-export Brand type for convenience
export type { Brand };

// Query Keys
export const brandKeys = {
  all: ["brands"] as const,
  lists: () => [...brandKeys.all, "list"] as const,
  list: (filters: Record<string, any>) =>
    [...brandKeys.lists(), { filters }] as const,
  details: () => [...brandKeys.all, "detail"] as const,
  detail: (id: number) => [...brandKeys.details(), id] as const,
  stats: () => [...brandKeys.all, "stats"] as const,
  simple: () => [...brandKeys.all, "simple"] as const,
};

// Hook to get brands with pagination and filtering
export function useBrands(params?: UseBrandsParams) {
  return useQuery({
    queryKey: brandKeys.list(params || {}),
    queryFn: () => brandService.getBrands(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to get all brands (simple list)
export function useAllBrands() {
  return useQuery({
    queryKey: brandKeys.simple(),
    queryFn: () => brandService.getAllBrands(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook to get a single brand
export function useBrand(id: number) {
  return useQuery({
    queryKey: brandKeys.detail(id),
    queryFn: () => brandService.getBrand(id),
    enabled: !!id,
  });
}

// Hook to get brand stats
export function useBrandStats() {
  return useQuery({
    queryKey: brandKeys.stats(),
    queryFn: () => brandService.getStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to create a brand
export function useCreateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (brandData: CreateBrandData) =>
      brandService.createBrand(brandData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
      queryClient.invalidateQueries({ queryKey: brandKeys.simple() });
      queryClient.invalidateQueries({ queryKey: brandKeys.stats() });
    },
  });
}

// Hook to update a brand
export function useUpdateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBrandData }) =>
      brandService.updateBrand(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: brandKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
      queryClient.invalidateQueries({ queryKey: brandKeys.simple() });
      queryClient.invalidateQueries({ queryKey: brandKeys.stats() });
    },
  });
}

// Hook to delete a brand
export function useDeleteBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => brandService.deleteBrand(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
      queryClient.invalidateQueries({ queryKey: brandKeys.simple() });
      queryClient.invalidateQueries({ queryKey: brandKeys.stats() });
    },
  });
}
