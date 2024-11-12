import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty, IsString, IsUrl, Length,
} from 'class-validator';

export class CreateShortLinkDataDto {
  @ApiProperty({ type: String, required: true, example: 'https://example.com' })
  @IsString()
  @IsUrl()
  @IsNotEmpty()
  originalUrl: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @Length(6, 6)
  @IsNotEmpty()
  code: string;
}
