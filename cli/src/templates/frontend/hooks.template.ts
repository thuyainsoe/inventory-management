export const hooksTemplate = `import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { {{singular.camel}}Service } from "@/lib/api/services";
import type { {{singular.pascal}} } from "@/types";

export interface Use{{plural.pascal}}Params {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface Create{{singular.pascal}}Data {
{{#each fields}}
  {{this.name}}{{#unless this.required}}?{{/unless}}: {{this.tsType}};
{{/each}}
}

export interface Update{{singular.pascal}}Data {
{{#each fields}}
  {{this.name}}?: {{this.tsType}};
{{/each}}
}

// Re-export {{singular.pascal}} type for convenience
export type { {{singular.pascal}} };

// Query Keys
export const {{singular.camel}}Keys = {
  all: ["{{plural.param}}"] as const,
  lists: () => [...{{singular.camel}}Keys.all, "list"] as const,
  list: (filters: Record<string, any>) =>
    [...{{singular.camel}}Keys.lists(), { filters }] as const,
  details: () => [...{{singular.camel}}Keys.all, "detail"] as const,
  detail: (id: number) => [...{{singular.camel}}Keys.details(), id] as const,
  stats: () => [...{{singular.camel}}Keys.all, "stats"] as const,
  simple: () => [...{{singular.camel}}Keys.all, "simple"] as const,
};

// Hook to get {{plural.param}} with pagination and filtering
export function use{{plural.pascal}}(params?: Use{{plural.pascal}}Params) {
  return useQuery({
    queryKey: {{singular.camel}}Keys.list(params || {}),
    queryFn: () => {{singular.camel}}Service.get{{plural.pascal}}(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to get all {{plural.param}} (simple list)
export function useAll{{plural.pascal}}() {
  return useQuery({
    queryKey: {{singular.camel}}Keys.simple(),
    queryFn: () => {{singular.camel}}Service.getAll{{plural.pascal}}(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook to get a single {{singular.param}}
export function use{{singular.pascal}}(id: number) {
  return useQuery({
    queryKey: {{singular.camel}}Keys.detail(id),
    queryFn: () => {{singular.camel}}Service.get{{singular.pascal}}(id),
    enabled: !!id,
  });
}

// Hook to get {{singular.param}} stats
export function use{{singular.pascal}}Stats() {
  return useQuery({
    queryKey: {{singular.camel}}Keys.stats(),
    queryFn: () => {{singular.camel}}Service.getStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to create a {{singular.param}}
export function useCreate{{singular.pascal}}() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({{singular.camel}}Data: Create{{singular.pascal}}Data) => {{singular.camel}}Service.create{{singular.pascal}}({{singular.camel}}Data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: {{singular.camel}}Keys.lists() });
      queryClient.invalidateQueries({ queryKey: {{singular.camel}}Keys.simple() });
      queryClient.invalidateQueries({ queryKey: {{singular.camel}}Keys.stats() });
    },
  });
}

// Hook to update a {{singular.param}}
export function useUpdate{{singular.pascal}}() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Update{{singular.pascal}}Data }) =>
      {{singular.camel}}Service.update{{singular.pascal}}(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: {{singular.camel}}Keys.detail(id) });
      queryClient.invalidateQueries({ queryKey: {{singular.camel}}Keys.lists() });
      queryClient.invalidateQueries({ queryKey: {{singular.camel}}Keys.simple() });
      queryClient.invalidateQueries({ queryKey: {{singular.camel}}Keys.stats() });
    },
  });
}

// Hook to delete a {{singular.param}}
export function useDelete{{singular.pascal}}() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => {{singular.camel}}Service.delete{{singular.pascal}}(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: {{singular.camel}}Keys.lists() });
      queryClient.invalidateQueries({ queryKey: {{singular.camel}}Keys.simple() });
      queryClient.invalidateQueries({ queryKey: {{singular.camel}}Keys.stats() });
    },
  });
}`;