import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseOrder } from './purchase-order.entity';
import { PurchaseOrderItem } from './purchase-order-item.entity';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';

@Injectable()
export class PurchaseOrdersService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private readonly purchaseOrderRepository: Repository<PurchaseOrder>,
    @InjectRepository(PurchaseOrderItem)
    private readonly purchaseOrderItemRepository: Repository<PurchaseOrderItem>,
  ) {}

  async create(
    createPurchaseOrderDto: CreatePurchaseOrderDto,
    currentUserId: number,
  ): Promise<PurchaseOrder> {
    const existingPO = await this.purchaseOrderRepository.findOne({
      where: { poNumber: createPurchaseOrderDto.poNumber },
    });

    if (existingPO) {
      throw new ConflictException('Purchase Order with this PO Number already exists');
    }

    const { items, ...poData } = createPurchaseOrderDto;
    
    const purchaseOrder = this.purchaseOrderRepository.create({
      ...poData,
      createdBy: currentUserId,
    });

    const savedPO = await this.purchaseOrderRepository.save(purchaseOrder);

    if (items && items.length > 0) {
      const poItems = items.map(item => {
        const lineTotal = (item.unitPrice * item.quantity) - item.discount + item.tax;
        return this.purchaseOrderItemRepository.create({
          ...item,
          purchaseOrderId: savedPO.id,
          lineTotal,
        });
      });

      await this.purchaseOrderItemRepository.save(poItems);
    }

    return this.findOne(savedPO.id);
  }

  async findAll(
    page: number = 1,
    limit: number = 20,
    search?: string,
    status?: string,
  ): Promise<{
    data: PurchaseOrder[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;
    const queryBuilder = this.purchaseOrderRepository
      .createQueryBuilder('po')
      .leftJoinAndSelect('po.creator', 'creator')
      .leftJoinAndSelect('po.items', 'items')
      .leftJoinAndSelect('items.product', 'product');

    if (search) {
      queryBuilder.where(
        'po.poNumber LIKE :search OR po.notes LIKE :search',
        { search: `%${search}%` },
      );
    }

    if (status) {
      if (search) {
        queryBuilder.andWhere('po.status = :status', { status });
      } else {
        queryBuilder.where('po.status = :status', { status });
      }
    }

    queryBuilder.orderBy('po.updatedAt', 'DESC').skip(offset).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<PurchaseOrder> {
    const purchaseOrder = await this.purchaseOrderRepository.findOne({
      where: { id },
      relations: ['creator', 'items', 'items.product'],
    });

    if (!purchaseOrder) {
      throw new NotFoundException('Purchase Order not found');
    }

    return purchaseOrder;
  }

  async update(
    id: string,
    updatePurchaseOrderDto: UpdatePurchaseOrderDto,
  ): Promise<PurchaseOrder> {
    const purchaseOrder = await this.findOne(id);

    if (updatePurchaseOrderDto.poNumber && 
        updatePurchaseOrderDto.poNumber !== purchaseOrder.poNumber) {
      const existingPO = await this.purchaseOrderRepository.findOne({
        where: { poNumber: updatePurchaseOrderDto.poNumber },
      });

      if (existingPO) {
        throw new ConflictException('Purchase Order with this PO Number already exists');
      }
    }

    const { items, ...poData } = updatePurchaseOrderDto;

    Object.assign(purchaseOrder, poData);
    await this.purchaseOrderRepository.save(purchaseOrder);

    if (items) {
      await this.purchaseOrderItemRepository.delete({ purchaseOrderId: id });

      if (items.length > 0) {
        const poItems = items.map(item => {
          const lineTotal = (item.unitPrice * item.quantity) - item.discount + item.tax;
          return this.purchaseOrderItemRepository.create({
            ...item,
            purchaseOrderId: id,
            lineTotal,
          });
        });

        await this.purchaseOrderItemRepository.save(poItems);
      }
    }

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const purchaseOrder = await this.findOne(id);
    await this.purchaseOrderRepository.remove(purchaseOrder);
  }

  async findByStatus(status: string): Promise<PurchaseOrder[]> {
    return await this.purchaseOrderRepository
      .createQueryBuilder('po')
      .leftJoinAndSelect('po.creator', 'creator')
      .leftJoinAndSelect('po.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .where('po.status = :status', { status })
      .orderBy('po.createdAt', 'DESC')
      .getMany();
  }

  async updateStatus(id: string, status: string): Promise<PurchaseOrder> {
    const purchaseOrder = await this.findOne(id);
    purchaseOrder.status = status;
    await this.purchaseOrderRepository.save(purchaseOrder);
    return this.findOne(id);
  }
}