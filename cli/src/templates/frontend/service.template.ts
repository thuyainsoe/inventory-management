export const serviceTemplate = `
// {{singular.pascal}} Services
export const {{singular.camel}}Service = {
  get{{plural.pascal}}: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) =>
    apiClient.get<PaginatedResponse<{{singular.pascal}}>>(API_ENDPOINTS.{{plural.constant}}, {
      params,
    }),

  getAll{{plural.pascal}}: () => apiClient.get<{{singular.pascal}}[]>(\`\${API_ENDPOINTS.{{plural.constant}}}/all\`),

  get{{singular.pascal}}: (id: number) => apiClient.get<{{singular.pascal}}>(\`\${API_ENDPOINTS.{{plural.constant}}}/\${id}\`),

  create{{singular.pascal}}: ({{singular.camel}}Data: Partial<{{singular.pascal}}>) =>
    apiClient.post<{{singular.pascal}}>(API_ENDPOINTS.{{plural.constant}}, {{singular.camel}}Data),

  update{{singular.pascal}}: (id: number, {{singular.camel}}Data: Partial<{{singular.pascal}}>) =>
    apiClient.patch<{{singular.pascal}}>(\`\${API_ENDPOINTS.{{plural.constant}}}/\${id}\`, {{singular.camel}}Data),

  delete{{singular.pascal}}: (id: number) =>
    apiClient.delete<void>(\`\${API_ENDPOINTS.{{plural.constant}}}/\${id}\`),

  getStats: () =>
    apiClient.get<{
      total: number;
      active: number;
      inactive: number;
    }>(\`\${API_ENDPOINTS.{{plural.constant}}}/stats\`),
};`;