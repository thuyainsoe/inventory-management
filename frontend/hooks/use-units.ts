import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { unitService } from "@/lib/api/services";
import type { Unit } from "@/types";

export interface UseUnitsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface CreateUnitData {
  name: string;
  description?: string;
  symbol?: string;
  conversionFactor?: number;
  isActive?: boolean;
}

export interface UpdateUnitData {
  code?: string;
  name?: string;
  description?: string;
  symbol?: string;
  conversionFactor?: number;
  isActive?: boolean;
}

// Re-export Unit type for convenience
export type { Unit };

// Query Keys
export const unitKeys = {
  all: ["units"] as const,
  lists: () => [...unitKeys.all, "list"] as const,
  list: (filters: Record<string, any>) =>
    [...unitKeys.lists(), { filters }] as const,
  details: () => [...unitKeys.all, "detail"] as const,
  detail: (id: number) => [...unitKeys.details(), id] as const,
  stats: () => [...unitKeys.all, "stats"] as const,
  simple: () => [...unitKeys.all, "simple"] as const,
};

// Hook to get units with pagination and filtering
export function useUnits(params?: UseUnitsParams) {
  return useQuery({
    queryKey: unitKeys.list(params || {}),
    queryFn: () => unitService.getUnits(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to get all units (simple list)
export function useAllUnits() {
  return useQuery({
    queryKey: unitKeys.simple(),
    queryFn: () => unitService.getAllUnits(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook to get a single unit
export function useUnit(id: number) {
  return useQuery({
    queryKey: unitKeys.detail(id),
    queryFn: () => unitService.getUnit(id),
    enabled: !!id,
  });
}

// Hook to get unit stats
export function useUnitStats() {
  return useQuery({
    queryKey: unitKeys.stats(),
    queryFn: () => unitService.getStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to create a unit
export function useCreateUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (unitData: CreateUnitData) => unitService.createUnit(unitData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: unitKeys.lists() });
      queryClient.invalidateQueries({ queryKey: unitKeys.simple() });
      queryClient.invalidateQueries({ queryKey: unitKeys.stats() });
    },
  });
}

// Hook to update a unit
export function useUpdateUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUnitData }) =>
      unitService.updateUnit(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: unitKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: unitKeys.lists() });
      queryClient.invalidateQueries({ queryKey: unitKeys.simple() });
      queryClient.invalidateQueries({ queryKey: unitKeys.stats() });
    },
  });
}

// Hook to delete a unit
export function useDeleteUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => unitService.deleteUnit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: unitKeys.lists() });
      queryClient.invalidateQueries({ queryKey: unitKeys.simple() });
      queryClient.invalidateQueries({ queryKey: unitKeys.stats() });
    },
  });
}
