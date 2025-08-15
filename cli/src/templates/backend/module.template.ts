export const moduleTemplate = `import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { {{plural.pascal}}Service } from './{{plural.param}}.service';
import { {{plural.pascal}}Controller } from './{{plural.param}}.controller';
import { {{singular.pascal}} } from './{{singular.param}}.entity';

@Module({
  imports: [TypeOrmModule.forFeature([{{singular.pascal}}])],
  controllers: [{{plural.pascal}}Controller],
  providers: [{{plural.pascal}}Service],
  exports: [{{plural.pascal}}Service],
})
export class {{plural.pascal}}Module {}`;