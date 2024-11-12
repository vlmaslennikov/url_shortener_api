import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class OriginalUrlDto {
  @ApiProperty({ type: String, required: true, example: 'https://example.com' })
  @IsString()
  @IsUrl()
  @IsNotEmpty()
  url: string;
}
