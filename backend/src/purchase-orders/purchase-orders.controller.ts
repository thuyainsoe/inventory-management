import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  ParseIntPipe,
  DefaultValuePipe,
  UseGuards,
} from '@nestjs/common';
import { PurchaseOrdersService } from './purchase-orders.service';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
import { PurchaseOrderDto } from './dto/purchase-order.dto';
import { PaginatedPurchaseOrdersDto } from './dto/paginated-purchase-orders.dto';
import { SerializeInterceptor } from '../interceptors/serialize.interceptor';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';

@Controller('purchase-orders')
@UseGuards(AuthGuard)
export class PurchaseOrdersController {
  constructor(private readonly purchaseOrdersService: PurchaseOrdersService) {}

  @Post()
  @UseInterceptors(new SerializeInterceptor(PurchaseOrderDto))
  async create(
    @Body() createPurchaseOrderDto: CreatePurchaseOrderDto,
    @CurrentUser() user: User,
  ) {
    return await this.purchaseOrdersService.create(createPurchaseOrderDto, user.id);
  }

  @Get()
  @UseInterceptors(new SerializeInterceptor(PaginatedPurchaseOrdersDto))
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return await this.purchaseOrdersService.findAll(page, limit, search, status);
  }

  @Get('status/:status')
  @UseInterceptors(new SerializeInterceptor(PurchaseOrderDto))
  async findByStatus(@Param('status') status: string) {
    return await this.purchaseOrdersService.findByStatus(status);
  }

  @Get(':id')
  @UseInterceptors(new SerializeInterceptor(PurchaseOrderDto))
  async findOne(@Param('id') id: string) {
    return await this.purchaseOrdersService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(new SerializeInterceptor(PurchaseOrderDto))
  async update(
    @Param('id') id: string,
    @Body() updatePurchaseOrderDto: UpdatePurchaseOrderDto,
  ) {
    return await this.purchaseOrdersService.update(id, updatePurchaseOrderDto);
  }

  @Patch(':id/status')
  @UseInterceptors(new SerializeInterceptor(PurchaseOrderDto))
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return await this.purchaseOrdersService.updateStatus(id, status);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.purchaseOrdersService.remove(id);
    return { message: 'Purchase Order deleted successfully' };
  }
}