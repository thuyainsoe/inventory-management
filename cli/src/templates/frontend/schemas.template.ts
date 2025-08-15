export const formSchemaTemplate = `import { z } from "zod";

export const {{singular.pascal}}FormSchema = z.object({
{{#each fields}}
{{#if this.required}}
  {{this.name}}: z
    .{{#if (eq this.type 'string')}}string{{else if (eq this.type 'number')}}number{{else if (eq this.type 'boolean')}}boolean{{else}}string{{/if}}({
      required_error: "{{this.label}} is required",
      invalid_type_error: "{{this.label}} must be {{#if (eq this.type 'string')}}a string{{else if (eq this.type 'number')}}a number{{else if (eq this.type 'boolean')}}a boolean{{else}}a string{{/if}}",
    })
    {{#if (eq this.type 'string')}}.min(1, "{{this.label}} is required")
    .min(2, "{{this.label}} must be at least 2 characters")
    .max(100, "{{this.label}} must not exceed 100 characters"){{else if (eq this.type 'number')}}.positive("{{this.label}} must be greater than 0"){{/if}},
{{else}}
  {{this.name}}: z
    .{{#if (eq this.type 'string')}}string{{else if (eq this.type 'number')}}number{{else if (eq this.type 'boolean')}}boolean{{else}}string{{/if}}()
    {{#if (eq this.type 'string')}}.max({{#if (eq this.name 'description')}}500{{else}}100{{/if}}, "{{this.label}} must not exceed {{#if (eq this.name 'description')}}500{{else}}100{{/if}} characters"){{else if (eq this.type 'number')}}.positive("{{this.label}} must be greater than 0"){{/if}}
    .optional(){{#if (eq this.type 'string')}}
    .or(z.literal("")){{else if (eq this.type 'boolean')}}
    .default(true){{else if (eq this.type 'number')}}
    .default(1){{/if}},
{{/if}}
{{/each}}
});

export type {{singular.pascal}}FormValues = z.infer<typeof {{singular.pascal}}FormSchema>;`;

export const fieldSchemaTemplate = `import type {
  SelectOption,
  FormSchema,
} from "@/components/form/form-field-generator";

export const {{singular.pascal}}FormFieldsSchema = (): FormSchema => {
  const fields = [
    // Basic Information Section
    {
      sectionId: 1,
      fields: [
{{#each fields}}
        {
          id: {{@index}},
          type: "{{#if (eq this.type 'string')}}{{#if (eq this.name 'description')}}textarea{{else}}text{{/if}}{{else if (eq this.type 'number')}}number{{else if (eq this.type 'boolean')}}checkbox{{else}}text{{/if}}" as const,
          name: "{{this.name}}",
          label: "{{this.label}}",
          placeholder: "Enter {{this.label}}{{#if (eq this.name 'description')}} (optional){{/if}}",
          required: {{this.required}},
          fullWidth: true,
          {{#if (eq this.type 'string')}}{{#if (eq this.name 'description')}}rows: 3,
          maxLength: 500,{{else}}maxLength: {{#if (eq this.name 'symbol')}}10{{else if (eq this.name 'code')}}20{{else}}100{{/if}},{{/if}}{{/if}}
          {{#if (eq this.type 'boolean')}}description: "{{this.label}} is available for use",{{/if}}
        },
{{/each}}
      ],
    },
  ];

  return fields;
};`;