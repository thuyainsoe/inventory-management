import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { UnitsService } from './units.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { UnitDto } from './dto/unit.dto';
import { PaginatedUnitsDto } from './dto/paginated-units.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('units')
@UseGuards(AuthGuard)
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Get()
  @Serialize(PaginatedUnitsDto)
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ) {
    const offset = (page - 1) * limit;
    const [units, total] = await this.unitsService.findAllWithPagination(
      offset,
      limit,
      search,
    );

    return {
      data: units,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  @Get('all')
  @Serialize(UnitDto)
  async findAllSimple() {
    return this.unitsService.findAll();
  }

  @Get('stats')
  async getStats() {
    return this.unitsService.getStats();
  }

  @Get(':id')
  @Serialize(UnitDto)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.unitsService.findOne(id);
  }

  @Post()
  @Serialize(UnitDto)
  async create(@Body() createUnitDto: CreateUnitDto) {
    return this.unitsService.create(createUnitDto);
  }

  @Patch(':id')
  @Serialize(UnitDto)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUnitDto: UpdateUnitDto,
  ) {
    return this.unitsService.update(id, updateUnitDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.unitsService.remove(id);
    return { message: 'Unit deleted successfully' };
  }
}
