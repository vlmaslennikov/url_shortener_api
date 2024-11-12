import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CollectionNameEnum } from 'src/providers/mongodb/enums/collection-name.enum';
import { ShortLinkData, ShortLinkDataDocument } from './schema/short-link-data.schema';
import { CreateShortLinkDataDto } from './dto/create-short-link-data.dto';

@Injectable()
export class ShortLinkDataRepository {
  constructor(
    @InjectModel(CollectionNameEnum.SHORT_LINK_DATA)
    private readonly shortLinkDataModel: Model<ShortLinkDataDocument>,
  ) { }

  async create(shortLinkData: CreateShortLinkDataDto): Promise<ShortLinkData> {
    return this.shortLinkDataModel.create(shortLinkData);
  }

  async findOneByCode(code: string): Promise<ShortLinkData> {
    return this.shortLinkDataModel.findOne({ code }).lean();
  }

  async updateCount(code: string): Promise<ShortLinkData> {
    return this.shortLinkDataModel
      .findOneAndUpdate({ code }, { $inc: { clickCounts: 1 } })
      .lean();
  }
}
