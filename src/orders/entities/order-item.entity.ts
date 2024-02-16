import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";
import { Product } from "../../products/entities/product.entity";

@Entity({ name: 'order_items' })
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product; // um produto pode estar em 1 ou mais itens de compra

  @Column()
  product_id: string;

  @ManyToOne(() => Order)
  order: Order;
}
