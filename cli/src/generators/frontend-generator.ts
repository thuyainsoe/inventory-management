import fs from 'fs-extra';
import * as path from 'path';
import { GeneratorContext } from './module-generator.js';
import { renderTemplate } from '../utils/template-renderer.js';
import { typesTemplate } from '../templates/frontend/types.template.js';
import { formSchemaTemplate, fieldSchemaTemplate } from '../templates/frontend/schemas.template.js';
import { serviceTemplate } from '../templates/frontend/service.template.js';
import { hooksTemplate } from '../templates/frontend/hooks.template.js';
import { 
  drawerListPageTemplate, 
  createDrawerTemplate, 
  editDrawerTemplate 
} from '../templates/frontend/pages-drawer.template.js';
import { 
  nextPageListTemplate, 
  createPageTemplate, 
  editPageTemplate, 
  detailPageTemplate 
} from '../templates/frontend/pages-nextpage.template.js';

export async function generateFrontend(context: GeneratorContext) {
  // Update types
  await updateTypes(context);
  
  // Generate schemas
  await generateSchemas(context);
  
  // Generate service
  await generateService(context);
  
  // Generate hooks
  await generateHooks(context);
  
  // Generate pages based on form type
  if (context.config.formType === 'drawer') {
    await generateDrawerPages(context);
  } else {
    await generateNextPages(context);
  }
}

async function updateTypes(context: GeneratorContext) {
  const typesPath = path.join(context.frontendPath, 'types', 'index.ts');
  
  try {
    let content = await fs.readFile(typesPath, 'utf-8');
    
    // Check if types already exist
    if (content.includes(`export interface ${context.strings.singular.pascal} {`)) {
      console.log(`⚠️  Skipping types generation - ${context.strings.singular.pascal} types already exist`);
      return;
    }
    
    // Generate new type definitions
    const newTypes = renderTemplate(typesTemplate, {
      singular: context.strings.singular,
      plural: context.strings.plural,
      fields: context.fields,
    });
    
    // Append to types file
    content += '\n\n' + newTypes;
    await fs.writeFile(typesPath, content);
  } catch (error) {
    console.warn('Could not update types file automatically');
  }
}

async function generateSchemas(context: GeneratorContext) {
  const schemasPath = path.join(context.frontendPath, 'schemas', context.strings.plural.param);
  await fs.ensureDir(schemasPath);

  // Generate form schema
  await generateFile(
    path.join(schemasPath, `${context.strings.singular.param}-form-schema.ts`),
    formSchemaTemplate,
    context
  );

  // Generate field schema
  await generateFile(
    path.join(schemasPath, `${context.strings.singular.param}-form-field-schema.ts`),
    fieldSchemaTemplate,
    context
  );
}

async function generateService(context: GeneratorContext) {
  // Update services.ts
  const servicesPath = path.join(context.frontendPath, 'lib', 'api', 'services.ts');
  
  try {
    let content = await fs.readFile(servicesPath, 'utf-8');
    
    // Check if service already exists
    if (content.includes(`export const ${context.strings.singular.camel}Service = {`)) {
      console.log(`⚠️  Skipping service generation - ${context.strings.singular.camel}Service already exists`);
      return;
    }
    
    // Generate service code
    const serviceCode = renderTemplate(serviceTemplate, {
      singular: context.strings.singular,
      plural: context.strings.plural,
      fields: context.fields,
    });
    
    // Add imports for new types
    const importLine = `  ${context.strings.singular.pascal},\n  Create${context.strings.singular.pascal}Request,\n  Update${context.strings.singular.pascal}Request,\n  ${context.strings.plural.pascal}Response,`;
    
    if (!content.includes(`${context.strings.singular.pascal},`)) {
      // Add to imports
      const importMatch = content.match(/(import type \{[\s\S]*?)(\} from ['"]\.\.\/\.\.\/types['"];)/);
      if (importMatch) {
        const beforeClosing = importMatch[1];
        const closing = importMatch[2];
        const updated = beforeClosing + importLine + '\n' + closing;
        content = content.replace(importMatch[0], updated);
      }
    }
    
    // Append service code
    content += '\n\n' + serviceCode;
    await fs.writeFile(servicesPath, content);
  } catch (error) {
    console.warn('Could not update services file automatically');
  }
}

async function generateHooks(context: GeneratorContext) {
  const hooksPath = path.join(context.frontendPath, 'hooks', `use-${context.strings.plural.param}.ts`);
  
  await generateFile(hooksPath, hooksTemplate, context);
}

async function generateDrawerPages(context: GeneratorContext) {
  const pagesPath = path.join(context.frontendPath, 'app', context.strings.plural.param);
  const componentsPath = path.join(context.frontendPath, 'components', context.strings.plural.param);
  
  await fs.ensureDir(pagesPath);
  await fs.ensureDir(componentsPath);

  // Generate main list page
  await generateFile(
    path.join(pagesPath, 'page.tsx'),
    drawerListPageTemplate,
    context
  );

  // Generate drawer components
  await generateFile(
    path.join(componentsPath, `create-${context.strings.singular.param}-drawer.tsx`),
    createDrawerTemplate,
    context
  );

  await generateFile(
    path.join(componentsPath, `edit-${context.strings.singular.param}-drawer.tsx`),
    editDrawerTemplate,
    context
  );
}

async function generateNextPages(context: GeneratorContext) {
  const pagesPath = path.join(context.frontendPath, 'app', context.strings.plural.param);
  
  await fs.ensureDir(pagesPath);
  await fs.ensureDir(path.join(pagesPath, 'create'));
  await fs.ensureDir(path.join(pagesPath, '[id]'));
  await fs.ensureDir(path.join(pagesPath, '[id]', 'edit'));

  // Generate main list page
  await generateFile(
    path.join(pagesPath, 'page.tsx'),
    nextPageListTemplate,
    context
  );

  // Generate create page
  await generateFile(
    path.join(pagesPath, 'create', 'page.tsx'),
    createPageTemplate,
    context
  );

  // Generate detail page
  await generateFile(
    path.join(pagesPath, '[id]', 'page.tsx'),
    detailPageTemplate,
    context
  );

  // Generate edit page
  await generateFile(
    path.join(pagesPath, '[id]', 'edit', 'page.tsx'),
    editPageTemplate,
    context
  );
}

async function generateFile(filePath: string, template: string, context: GeneratorContext) {
  // Check if file already exists
  if (await fs.pathExists(filePath)) {
    console.log(`⚠️  Skipping ${filePath} - file already exists`);
    return;
  }

  const content = renderTemplate(template, {
    singular: context.strings.singular,
    plural: context.strings.plural,
    fields: context.fields,
  });
  
  await fs.writeFile(filePath, content);
}