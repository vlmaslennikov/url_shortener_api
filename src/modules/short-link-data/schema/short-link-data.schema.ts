import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { CollectionNameEnum } from 'src/providers/mongodb/enums/collection-name.enum';

@Schema({
  versionKey: false,
  timestamps: true,
  collection: CollectionNameEnum.SHORT_LINK_DATA,
})
export class ShortLinkData {
  @Prop({ type: String, required: true })
  originalUrl: string;

  @Prop({
    type: String, unique: true, required: true, index: true,
  })
  code: string;

  @Prop({ type: Number, required: true, default: 0 })
  clickCounts: number;
}

export type ShortLinkDataDocument = ShortLinkData & Document;

const ShortLinkDataSchema = SchemaFactory.createForClass(ShortLinkData);

export default ShortLinkDataSchema;
