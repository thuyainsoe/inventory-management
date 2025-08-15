export const controllerTemplate = `import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { {{plural.pascal}}Service } from './{{plural.param}}.service';
import { Create{{singular.pascal}}Dto } from './dto/create-{{singular.param}}.dto';
import { Update{{singular.pascal}}Dto } from './dto/update-{{singular.param}}.dto';
import { {{singular.pascal}}Dto } from './dto/{{singular.param}}.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('{{plural.param}}')
@Controller('{{plural.param}}')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class {{plural.pascal}}Controller {
  constructor(private readonly {{plural.camel}}Service: {{plural.pascal}}Service) {}

  @Post()
  @ApiOperation({ summary: 'Create a new {{singular.sentence}}' })
  @ApiResponse({ status: 201, description: 'The {{singular.sentence}} has been successfully created.', type: {{singular.pascal}}Dto })
  async create(@Body() create{{singular.pascal}}Dto: Create{{singular.pascal}}Dto, @Request() req: any) {
    return await this.{{plural.camel}}Service.create(create{{singular.pascal}}Dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all {{plural.sentence}}' })
  @ApiResponse({ status: 200, description: 'Return all {{plural.sentence}}.', type: [{{singular.pascal}}Dto] })
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    
    return await this.{{plural.camel}}Service.findAll(pageNum, limitNum, search);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get {{plural.sentence}} statistics' })
  async getStats() {
    return await this.{{plural.camel}}Service.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a {{singular.sentence}} by id' })
  @ApiResponse({ status: 200, description: 'Return the {{singular.sentence}}.', type: {{singular.pascal}}Dto })
  @ApiResponse({ status: 404, description: '{{singular.sentence}} not found.' })
  async findOne(@Param('id') id: string) {
    return await this.{{plural.camel}}Service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a {{singular.sentence}}' })
  @ApiResponse({ status: 200, description: 'The {{singular.sentence}} has been successfully updated.', type: {{singular.pascal}}Dto })
  @ApiResponse({ status: 404, description: '{{singular.sentence}} not found.' })
  async update(@Param('id') id: string, @Body() update{{singular.pascal}}Dto: Update{{singular.pascal}}Dto) {
    return await this.{{plural.camel}}Service.update(id, update{{singular.pascal}}Dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a {{singular.sentence}}' })
  @ApiResponse({ status: 200, description: 'The {{singular.sentence}} has been successfully deleted.' })
  @ApiResponse({ status: 404, description: '{{singular.sentence}} not found.' })
  async remove(@Param('id') id: string) {
    await this.{{plural.camel}}Service.remove(id);
    return { message: '{{singular.sentence}} deleted successfully' };
  }
}`;