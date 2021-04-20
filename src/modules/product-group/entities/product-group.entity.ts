import { Column, Entity, ManyToOne } from 'typeorm'

import { BaseEntity } from 'src/common/base.entity'
import { ProductEntity } from 'src/modules/product/entities/product.entity'
import { ShoppingCartEntity } from 'src/modules/shopping-cart/entities/shopping-cart.entity'

import { ProductGroupDto } from '../models/product-group.dto'

@Entity('product-group')
export class ProductGroupEntity extends BaseEntity {
  //#region Columns

  @Column({
    type: 'int',
    nullable: true,
    default: 1
  })
  public amount?: number

  @Column({
    type: 'int',
    nullable: false
  })
  public productId: number

  @Column({
    type: 'int',
    nullable: false
  })
  public shoppingCartId: number

  //#region Relations

  @ManyToOne(
    () => ProductEntity,
    product => product.productGroups,
    { onDelete: 'CASCADE' }
  )
  public product?: ProductEntity

  @ManyToOne(
    () => ShoppingCartEntity,
    shoppingCart => shoppingCart.productGroups,
    { onDelete: 'CASCADE' }
  )
  public shoppingCart?: ShoppingCartEntity

  //#endregion

  //#endregion

  public constructor(partial: Partial<ProductGroupEntity>) {
    super()
    Object.assign(this, partial)
  }

  /**
   * Method that converts the entity to your dto
   * @returns the dto data
   */
  public toDto(): ProductGroupDto {
    return new ProductGroupDto(this)
  }
}
