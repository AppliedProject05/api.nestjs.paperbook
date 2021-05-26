import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseInterceptors
} from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger'
import {
  Crud,
  CrudRequest,
  CrudRequestInterceptor,
  GetManyDefaultResponse,
  ParsedRequest
} from '@nestjsx/crud'

import { ProtectTo } from 'src/decorators/protect-to/protect-to.decorator'
import { RequestUser } from 'src/decorators/user/user.decorator'

import { UserEntity } from 'src/modules/user/entities/user.entity'

import { CreateRatingDto } from '../models/create-rating.dto'
import { RatingDto } from '../models/rating.dto'
import { UpdateRatingDto } from '../models/update-rating.dto'

import { RatingService } from '../services/rating.service'

import { map } from 'src/utils/crud'

import { RolesEnum } from 'src/models/enums/roles.enum'

/**
 * The app's main rating controller class
 *
 * Class that deals with the rating routes
 */
@Crud({
  model: {
    type: RatingDto
  },
  query: {
    persist: ['id', 'isActive'],
    filter: [{ field: 'isActive', operator: '$eq', value: true }],
    join: {
      product: {},
      user: {}
    }
  },
  routes: {
    exclude: [
      'createManyBase',
      'createOneBase',
      'updateOneBase',
      'replaceOneBase'
    ]
  }
})
@UseInterceptors(CrudRequestInterceptor)
@ApiTags('ratings')
@Controller('ratings')
export class RatingController {
  public constructor(private readonly ratingService: RatingService) {}

  /**
   * Method that is called when the user access the "/ratings"
   * route with the "POST" method
   *
   * @param requestUser stores the logged user data
   * @param createRatingDto stores the rating data
   * @returns the created rating entity dto
   */
  @ApiOperation({ summary: 'Creates a new rating' })
  @ApiCreatedResponse({
    description: 'Gets the created rating data',
    type: RatingDto
  })
  @ProtectTo(RolesEnum.Common, RolesEnum.Seller, RolesEnum.Admin)
  @Post()
  public async create(
    @RequestUser() requestUser: UserEntity,
    @Body() createRatingDto: CreateRatingDto
  ): Promise<RatingDto> {
    const entity = await this.ratingService.create(requestUser, createRatingDto)
    return entity.toDto()
  }

  /**
   * Method that is called when the user access the "/ratings/:id"
   * route with the "GET" method
   *
   * @param ratingId stores the rating id
   * @param crudRequest stores the joins, filters, etc
   * @returns the found rating entity dto
   */
  @Get(':id')
  public async get(
    @Param('id') ratingId: number,
    @ParsedRequest() crudRequest?: CrudRequest
  ): Promise<RatingDto> {
    const entity = await this.ratingService.get(ratingId, crudRequest)
    return entity.toDto()
  }

  /**
   * Method that can get rating entities
   *
   * @param crudRequest stores the joins, filters, etc
   * @returns all the found rating entity dtos
   */
  @Get()
  public async getMore(
    @ParsedRequest() crudRequest?: CrudRequest
  ): Promise<GetManyDefaultResponse<RatingDto> | RatingDto[]> {
    const entities = await this.ratingService.getMany(crudRequest)
    return map(entities, entity => entity.toDto())
  }

  /**
   * Method that is called when the user access the "/ratings/:id"
   * route with the "PATCH" method
   *
   * @param ratingId stores the rating id
   * @param requestUser stores the logged user data
   * @param updateRatingDto stores the rating entity new data
   */
  @ApiOperation({ summary: 'Updates a single rating entity' })
  @ApiOkResponse({ description: 'Updates a single rating entity' })
  @ProtectTo(RolesEnum.Common, RolesEnum.Seller, RolesEnum.Admin)
  @Patch(':id')
  public async update(
    @Param('id') ratingId: number,
    @RequestUser() requestUser: UserEntity,
    @Body() updateRatingDto: UpdateRatingDto
  ): Promise<void> {
    await this.ratingService.update(ratingId, requestUser, updateRatingDto)
  }

  /**
   * Method that is called when the user access the "/ratings/:id"
   * route with the "DELETE" method
   *
   * @param ratingId stores the rating id
   * @param requestUser stores the logged user data
   */
  @ProtectTo(RolesEnum.Common, RolesEnum.Seller, RolesEnum.Admin)
  @Delete(':id')
  public async delete(
    @Param('id') ratingId: number,
    @RequestUser() requestUser: UserEntity
  ): Promise<void> {
    await this.ratingService.delete(ratingId, requestUser)
  }

  /**
   * Method that is called when the user access the
   * "/products/:id/disable" route with the "PUT" method
   *
   * @param ratingId stores the product id
   * @param requestUser stores the logged user data
   */
  @ApiOperation({ summary: 'Disables a single rating entity' })
  @ApiOkResponse({ description: 'Disables a single rating entity' })
  @ProtectTo(RolesEnum.Common, RolesEnum.Seller, RolesEnum.Admin)
  @Put(':id/disable')
  public async disable(
    @Param('id') ratingId: number,
    @RequestUser() requestUser: UserEntity
  ): Promise<void> {
    await this.ratingService.disable(ratingId, requestUser)
  }

  /**
   * Method that is called when the user access the
   * "/products/:id/enable" route with the "PUT" method
   *
   * @param ratingId stores the product id
   * @param requestUser stores the logged user data
   */
  @ApiOperation({ summary: 'Enables a single rating entity' })
  @ApiOkResponse({ description: 'Enables a single rating entity' })
  @ProtectTo(RolesEnum.Common, RolesEnum.Seller, RolesEnum.Admin)
  @Put(':id/enable')
  public async enable(
    @Param('id') ratingId: number,
    @RequestUser() requestUser: UserEntity
  ): Promise<void> {
    await this.ratingService.enable(ratingId, requestUser)
  }
}
