export const dtoTemplate = `import { Expose } from 'class-transformer';

export class {{singular.pascal}}Dto {
  @Expose()
  id: number;

{{#each fields}}
  @Expose()
  {{this.name}}: {{this.tsType}};
{{/each}}

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}`;

export const createDtoTemplate = `import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  MaxLength,
  MinLength,
} from 'class-validator';

export class Create{{singular.pascal}}Dto {
{{#each fields}}
{{#if this.required}}
  @IsString()
  @MinLength(1, { message: '{{this.label}} is required' })
  @MaxLength({{#if (eq this.name 'description')}}500{{else if (eq this.name 'symbol')}}10{{else if (eq this.name 'code')}}20{{else}}100{{/if}}, { message: '{{this.label}} must not exceed {{#if (eq this.name 'description')}}500{{else if (eq this.name 'symbol')}}10{{else if (eq this.name 'code')}}20{{else}}100{{/if}} characters' })
  {{this.name}}: {{this.tsType}};
{{else}}
  @IsOptional()
  {{#if (eq this.type 'string')}}@IsString()
  @MaxLength({{#if (eq this.name 'description')}}500{{else if (eq this.name 'symbol')}}10{{else}}100{{/if}}, { message: '{{this.label}} must not exceed {{#if (eq this.name 'description')}}500{{else if (eq this.name 'symbol')}}10{{else}}100{{/if}} characters' }){{else if (eq this.type 'number')}}@IsNumber({}, { message: '{{this.label}} must be a number' }){{else if (eq this.type 'boolean')}}@IsBoolean(){{/if}}
  {{this.name}}?: {{this.tsType}};
{{/if}}

{{/each}}
}`;

export const updateDtoTemplate = `import { PartialType } from '@nestjs/mapped-types';
import { Create{{singular.pascal}}Dto } from './create-{{singular.param}}.dto';

export class Update{{singular.pascal}}Dto extends PartialType(Create{{singular.pascal}}Dto) {}`;