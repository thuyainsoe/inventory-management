import fs from 'fs-extra';
import * as path from 'path';
import chalk from 'chalk';
import { generateStringVariations, generateFieldValidation, generateTypeScriptType, generateZodValidation, StringVariations } from '../utils/string-helpers.js';
import { generateBackend } from './backend-generator.js';
import { generateFrontend } from './frontend-generator.js';

export interface Field {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date';
  required: boolean;
}

export interface ModuleConfig {
  moduleName: string;
  includeBackend: boolean;
  includeFrontend: boolean;
  formType?: 'drawer' | 'page';
  fields: Field[];
}

export interface GeneratorContext {
  strings: StringVariations;
  fields: ProcessedField[];
  config: ModuleConfig;
  rootPath: string;
  backendPath: string;
  frontendPath: string;
}

export interface ProcessedField extends Field {
  validation: string;
  tsType: string;
  zodValidation: string;
  label: string;
  defaultValue: string;
  cellComponent: string;
  cellProps?: string;
  fieldType: string;
  formatValue?: string;
}

export async function generateModule(config: ModuleConfig) {
  let rootPath = process.cwd();
  
  // If we're in the cli directory, go up one level
  if (path.basename(rootPath) === 'cli') {
    rootPath = path.dirname(rootPath);
  }
  
  const backendPath = path.join(rootPath, 'backend');
  const frontendPath = path.join(rootPath, 'frontend');

  console.log(chalk.cyan('📋 Processing module configuration...'));
  
  // Generate string variations
  const strings = generateStringVariations(config.moduleName);
  
  // Process fields
  const processedFields: ProcessedField[] = config.fields.map(field => ({
    ...field,
    validation: generateFieldValidation(field),
    tsType: generateTypeScriptType(field.type),
    zodValidation: generateZodValidation(field),
    label: field.name.charAt(0).toUpperCase() + field.name.slice(1).replace(/([A-Z])/g, ' $1'),
    defaultValue: getDefaultValue(field.type),
    cellComponent: getCellComponent(field.type),
    cellProps: getCellProps(field),
    fieldType: getFieldType(field.type),
    formatValue: getFormatValue(field.type),
  }));

  const context: GeneratorContext = {
    strings,
    fields: processedFields,
    config,
    rootPath,
    backendPath,
    frontendPath,
  };

  try {
    if (config.includeBackend) {
      console.log(chalk.yellow('🔧 Generating backend files...'));
      await generateBackend(context);
      console.log(chalk.green('✅ Backend files generated'));
    }

    if (config.includeFrontend) {
      console.log(chalk.yellow('🎨 Generating frontend files...'));
      await generateFrontend(context);
      console.log(chalk.green('✅ Frontend files generated'));
    }

    // Update API constants if frontend is included
    if (config.includeFrontend) {
      await updateApiConstants(context);
    }

    console.log(chalk.green('🎉 Module generation completed successfully!'));
    
  } catch (error) {
    console.error(chalk.red('❌ Error generating module:'), error);
    throw error;
  }
}

function getDefaultValue(type: string): string {
  switch (type) {
    case 'string':
      return '""';
    case 'number':
      return '0';
    case 'boolean':
      return 'false';
    case 'date':
      return 'new Date().toISOString()';
    default:
      return '""';
  }
}

function getCellComponent(type: string): string {
  switch (type) {
    case 'string':
      return 'TextCell';
    case 'number':
      return 'NumberCell';
    case 'boolean':
      return 'BadgeCell';
    case 'date':
      return 'DateCell';
    default:
      return 'TextCell';
  }
}

function getCellProps(field: Field): string | undefined {
  if (field.type === 'boolean') {
    return 'className="min-w-[100px]"';
  }
  if (field.type === 'number') {
    return 'className="min-w-[100px]"';
  }
  return undefined;
}

function getFieldType(type: string): string {
  switch (type) {
    case 'string':
      return 'input';
    case 'number':
      return 'number';
    case 'boolean':
      return 'switch';
    case 'date':
      return 'date';
    default:
      return 'input';
  }
}

function getFormatValue(type: string): string | undefined {
  switch (type) {
    case 'date':
      return 'formatDate({{singular.camel}}.{{this.name}})';
    case 'boolean':
      return '{{singular.camel}}.{{this.name}} ? "Yes" : "No"';
    default:
      return undefined;
  }
}

async function updateApiConstants(context: GeneratorContext) {
  const constantsPath = path.join(context.frontendPath, 'lib', 'constants.ts');
  
  try {
    let content = await fs.readFile(constantsPath, 'utf-8');
    
    // Add new endpoint to API_ENDPOINTS
    const endpointLine = `  ${context.strings.plural.constant}: '/${context.strings.plural.param}' as const,`;
    
    if (!content.includes(context.strings.plural.constant)) {
      // Find the API_ENDPOINTS object and add the new endpoint
      const endpointsMatch = content.match(/(export const API_ENDPOINTS = \{[\s\S]*?)(\s*\} as const;)/);
      if (endpointsMatch) {
        const beforeClosing = endpointsMatch[1];
        const closing = endpointsMatch[2];
        const updated = beforeClosing + endpointLine + '\n' + closing;
        content = content.replace(endpointsMatch[0], updated);
        await fs.writeFile(constantsPath, content);
        console.log(chalk.green('✅ Updated API constants'));
      }
    }
  } catch (error) {
    console.log(chalk.yellow('⚠️  Could not update API constants automatically'));
  }
}