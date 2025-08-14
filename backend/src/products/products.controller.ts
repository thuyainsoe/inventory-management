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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductDto } from './dto/product.dto';
import { PaginatedProductsDto } from './dto/paginated-products.dto';
import { SerializeInterceptor } from '../interceptors/serialize.interceptor';
import { AuthGuard } from '../guards/auth.guard';

@Controller('products')
@UseGuards(AuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(new SerializeInterceptor(ProductDto))
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productsService.create(createProductDto);
  }

  @Get()
  @UseInterceptors(new SerializeInterceptor(PaginatedProductsDto))
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('category') category?: string,
  ) {
    return await this.productsService.findAll(page, limit, search, category);
  }

  @Get('categories')
  async getCategories() {
    return await this.productsService.getCategories();
  }

  @Get('low-stock')
  @UseInterceptors(new SerializeInterceptor(ProductDto))
  async findLowStock() {
    return await this.productsService.findLowStock();
  }

  @Get(':id')
  @UseInterceptors(new SerializeInterceptor(ProductDto))
  async findOne(@Param('id') id: string) {
    return await this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(new SerializeInterceptor(ProductDto))
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return await this.productsService.update(id, updateProductDto);
  }

  @Patch(':id/stock')
  @UseInterceptors(new SerializeInterceptor(ProductDto))
  async updateStock(
    @Param('id') id: string,
    @Body('quantity', ParseIntPipe) quantity: number,
  ) {
    return await this.productsService.updateStock(id, quantity);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.productsService.remove(id);
    return { message: 'Product deleted successfully' };
  }
}