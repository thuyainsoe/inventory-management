#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import { generateModule } from './generators/module-generator.js';
import { validateProjectStructure } from './utils/project-validator.js';

interface FieldInput {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date';
  required: boolean;
}

interface ModuleAnswers {
  moduleName: string;
  includeBackend: boolean;
  includeFrontend: boolean;
  formType?: 'drawer' | 'page';
  fields: FieldInput[];
}

async function main() {
  console.log(chalk.blue.bold('🚀 Inventory Management Module Generator'));
  console.log(chalk.gray('Generate NestJS backend and Next.js frontend modules quickly\n'));

  // Validate project structure
  const isValidProject = await validateProjectStructure();
  if (!isValidProject) {
    console.log(chalk.red('❌ Please run this command from the root of your inventory management project'));
    process.exit(1);
  }

  try {
    const answers = await inquirer.prompt<ModuleAnswers>([
      {
        type: 'input',
        name: 'moduleName',
        message: 'What is the module name? (e.g., unit, category, supplier)',
        validate: (input: string) => {
          if (!input.trim()) {
            return 'Module name is required';
          }
          if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(input.trim())) {
            return 'Module name should start with a letter and contain only letters and numbers';
          }
          return true;
        },
        transformer: (input: string) => input.toLowerCase().trim()
      },
      {
        type: 'confirm',
        name: 'includeBackend',
        message: 'Generate backend files (NestJS)?',
        default: true
      },
      {
        type: 'confirm',
        name: 'includeFrontend',
        message: 'Generate frontend files (Next.js)?',
        default: true
      },
      {
        type: 'list',
        name: 'formType',
        message: 'Choose form type for create/edit:',
        choices: [
          { name: 'Side Drawer (like User module)', value: 'drawer' },
          { name: 'Next Page (like Product module)', value: 'page' }
        ],
        when: (answers) => answers.includeFrontend,
        default: 'drawer'
      }
    ]);

    // Ask for fields
    const fields: FieldInput[] = [];
    let addMoreFields = true;

    console.log(chalk.cyan('\n📝 Let\'s define the fields for your module:'));
    
    while (addMoreFields) {
      const fieldAnswers = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Field name:',
          validate: (input: string) => {
            if (!input.trim()) return 'Field name is required';
            if (fields.some((f: FieldInput) => f.name === input.trim())) return 'Field name already exists';
            return true;
          },
          transformer: (input: string) => input.toLowerCase().trim()
        },
        {
          type: 'list',
          name: 'type',
          message: 'Field type:',
          choices: [
            { name: 'String (text)', value: 'string' },
            { name: 'Number', value: 'number' },
            { name: 'Boolean (true/false)', value: 'boolean' },
            { name: 'Date', value: 'date' }
          ]
        },
        {
          type: 'confirm',
          name: 'required',
          message: 'Is this field required?',
          default: true
        },
        {
          type: 'confirm',
          name: 'addMore',
          message: 'Add another field?',
          default: false
        }
      ]);

      fields.push({
        name: fieldAnswers.name,
        type: fieldAnswers.type,
        required: fieldAnswers.required
      });

      addMoreFields = fieldAnswers.addMore;
    }

    answers.fields = fields;

    console.log(chalk.cyan('\\n🔧 Generating module files...'));
    
    await generateModule(answers);
    
    console.log(chalk.green.bold('\\n✅ Module generated successfully!'));
    console.log(chalk.gray('\\nDon\'t forget to:'));
    console.log(chalk.gray('1. Install any new dependencies if needed'));
    console.log(chalk.gray('2. Import the new module in your app.module.ts (backend)'));
    console.log(chalk.gray('3. Add navigation links if needed (frontend)'));
    
  } catch (error: any) {
    if (error.isTtyError) {
      console.log(chalk.red('❌ Prompt couldn\'t be rendered in the current environment'));
    } else {
      console.log(chalk.red('❌ An error occurred:'), error.message);
    }
    process.exit(1);
  }
}

main().catch(console.error);