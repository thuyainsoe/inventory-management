import pluralize from 'pluralize';
import { 
  camelCase, 
  pascalCase, 
  kebabCase, 
  constantCase, 
  sentenceCase 
} from 'change-case';

export interface StringVariations {
  singular: {
    camel: string;      // unit
    pascal: string;     // Unit
    param: string;      // unit
    constant: string;   // UNIT
    sentence: string;   // Unit
  };
  plural: {
    camel: string;      // units
    pascal: string;     // Units
    param: string;      // units
    constant: string;   // UNITS
    sentence: string;   // Units
  };
}

export function generateStringVariations(input: string): StringVariations {
  const cleanInput = input.toLowerCase().trim();
  const singularForm = pluralize.singular(cleanInput);
  const pluralForm = pluralize.plural(cleanInput);

  return {
    singular: {
      camel: camelCase(singularForm),
      pascal: pascalCase(singularForm),
      param: kebabCase(singularForm),
      constant: constantCase(singularForm),
      sentence: sentenceCase(singularForm)
    },
    plural: {
      camel: camelCase(pluralForm),
      pascal: pascalCase(pluralForm),
      param: kebabCase(pluralForm),
      constant: constantCase(pluralForm),
      sentence: sentenceCase(pluralForm)
    }
  };
}

export function generateFieldValidation(field: { name: string; type: string; required: boolean }): string {
  const decorators = [];
  
  if (field.required) {
    decorators.push('@IsNotEmpty()');
  } else {
    decorators.push('@IsOptional()');
  }

  switch (field.type) {
    case 'string':
      decorators.push('@IsString()');
      break;
    case 'number':
      decorators.push('@IsNumber()');
      break;
    case 'boolean':
      decorators.push('@IsBoolean()');
      break;
    case 'date':
      decorators.push('@IsDateString()');
      break;
  }

  return decorators.join('\n  ');
}

export function generateTypeScriptType(type: string): string {
  switch (type) {
    case 'string':
      return 'string';
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'date':
      return 'Date | string';
    default:
      return 'any';
  }
}

export function generateZodValidation(field: { name: string; type: string; required: boolean }): string {
  let validation = '';
  
  switch (field.type) {
    case 'string':
      validation = 'z.string()';
      break;
    case 'number':
      validation = 'z.number()';
      break;
    case 'boolean':
      validation = 'z.boolean()';
      break;
    case 'date':
      validation = 'z.string().datetime()';
      break;
    default:
      validation = 'z.any()';
  }

  if (!field.required) {
    validation += '.optional()';
  }

  return validation;
}