export const typesTemplate = `export interface {{singular.pascal}} {
  id: string;
{{#each fields}}
  {{this.name}}: {{this.tsType}};
{{/each}}
  createdAt: Date | string;
  updatedAt: Date | string;
  creator?: {
    id: string;
    name: string;
    email: string;
  };
  creatorId?: string;
}

export interface Create{{singular.pascal}}Request {
{{#each fields}}
  {{this.name}}: {{this.tsType}};
{{/each}}
}

export interface Update{{singular.pascal}}Request extends Partial<Create{{singular.pascal}}Request> {}

export interface {{plural.pascal}}Response {
  data: {{singular.pascal}}[];
  total: number;
  page: number;
  totalPages: number;
}`;