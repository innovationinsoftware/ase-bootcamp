import { Controller, Get, Param } from '@nestjs/common';
import products from '../../products';

@Controller('products')
export class ProductsController {
  constructor() {}

  @Get()
  async index(): Promise<Product[]> {
    return products;
  }
}