import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { In, Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(Product) private productRepo: Repository<Product>
  ) { }

  async create(createOrderDto: CreateOrderDto & { client_id: number }) {
    const productsIds = createOrderDto.items.map((item) => item.product_id);
    const uniqueProductIds = [...new Set(productsIds)];
    const products = await this.productRepo.findBy({
      id: In(uniqueProductIds)
    });

    if (products.length !== uniqueProductIds.length) {
      throw new Error(
        `Algum produto não existe. Produtos passados ${productsIds}, produtos encontrados ${products.map((produt) => produt.id)}`
      );
    }

    const order = Order.create({
      client_id: createOrderDto.client_id,
      items: createOrderDto.items.map((item) => {
        const product = products.find((product) => product.id === item.product_id);

        return {
          price: product.price,
          product_id: item.product_id,
          quantity: item.quantity
        }
      })
    });

    await this.orderRepo.save(order);

    return order;
  }

  findAll(clientId: number) {
    return this.orderRepo.find({
      where: {
        client_id: clientId
      },
      order: {
        created_at: 'DESC'
      }
    });
  }

  findOne(id: string, clientId: number) {
    return this.orderRepo.findOneByOrFail({
      id,
      client_id: clientId
    });
  }
}
