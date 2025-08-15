import fs from 'fs-extra';
import * as path from 'path';
import { GeneratorContext } from './module-generator.js';
import { renderTemplate } from '../utils/template-renderer.js';
import { entityTemplate } from '../templates/backend/entity.template.js';
import { dtoTemplate, createDtoTemplate, updateDtoTemplate } from '../templates/backend/dto.template.js';
import { serviceTemplate } from '../templates/backend/service.template.js';
import { controllerTemplate } from '../templates/backend/controller.template.js';
import { moduleTemplate } from '../templates/backend/module.template.js';

export async function generateBackend(context: GeneratorContext) {
  const modulePath = path.join(context.backendPath, 'src', context.strings.plural.param);
  
  // Create module directory
  await fs.ensureDir(modulePath);
  
  // Create dto directory
  const dtoPath = path.join(modulePath, 'dto');
  await fs.ensureDir(dtoPath);

  // Generate entity
  await generateFile(
    path.join(modulePath, `${context.strings.singular.param}.entity.ts`),
    entityTemplate,
    context
  );

  // Generate DTOs
  await generateFile(
    path.join(dtoPath, `${context.strings.singular.param}.dto.ts`),
    dtoTemplate,
    context
  );

  await generateFile(
    path.join(dtoPath, `create-${context.strings.singular.param}.dto.ts`),
    createDtoTemplate,
    context
  );

  await generateFile(
    path.join(dtoPath, `update-${context.strings.singular.param}.dto.ts`),
    updateDtoTemplate,
    context
  );

  // Generate service
  await generateFile(
    path.join(modulePath, `${context.strings.plural.param}.service.ts`),
    serviceTemplate,
    context
  );

  // Generate controller
  await generateFile(
    path.join(modulePath, `${context.strings.plural.param}.controller.ts`),
    controllerTemplate,
    context
  );

  // Generate module
  await generateFile(
    path.join(modulePath, `${context.strings.plural.param}.module.ts`),
    moduleTemplate,
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