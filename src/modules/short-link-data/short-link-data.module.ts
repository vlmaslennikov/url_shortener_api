import { Module } from '@nestjs/common';
import { ShortLinkDataController } from './short-link-data.controller';
import { ShortLinkDataService } from './short-link-data.service';
import { RedisInternalService } from './redis-internal.service';
import { ShortLinkDataRepository } from './short-link-data.repository';
import { MongooseModule } from '@nestjs/mongoose';
import ShortLinkDataSchema from './schema/short-link-data.schema';
import { CollectionNameEnum } from 'src/providers/mongodb/enums/collection-name.enum';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: CollectionNameEnum.SHORT_LINK_DATA,
      schema: ShortLinkDataSchema,
    }]),
  ],
  controllers: [ShortLinkDataController],
  providers: [
    ShortLinkDataService,
    RedisInternalService,
    ShortLinkDataRepository
  ],
})
export default class ShortLinkDataModule { }
