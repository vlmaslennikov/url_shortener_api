import {
  Body, Controller, Get, Param, Post, Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBadRequestResponse, ApiBody, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ShortLinkDataService } from './short-link-data.service';
import { OriginalUrlDto } from './dto/original-url.dto';
import { ShortUrlResponseType } from './types/short-url-response.type';
import { ShortLinkData } from './schema/short-link-data.schema';
import CodeValidationPipe from 'src/shared/utils/code-validation.pipe';

@ApiTags('ShortLinkData')
@Controller()
export class ShortLinkDataController {
  constructor(private readonly shortLinkDataService: ShortLinkDataService) { }

  @ApiOkResponse({
    description: 'Returns a unique shortened URL',
    schema: {
      type: 'object',
      properties: {
        shortUrl: {
          type: 'string',
          example: 'https://backendurl/api/Qw3RtY'
        }
      }
    }
  })
  @ApiBody({ type: OriginalUrlDto })
  @Post('/shorten')
  getShortUrl(
    @Body() body: OriginalUrlDto,
  ): Promise<ShortUrlResponseType> {
    return this.shortLinkDataService.getShortUrl(body?.url);
  }

  @ApiOkResponse({
    description: 'Returns basic statistics for a shortened URL',
    schema: {
      type: 'object',
      properties: {
        _id: {
          type: 'string'
        },
        originalUrl: {
          type: 'string',
          example: 'https://example.com'
        },
        code: {
          type: 'string'
          ,
          example: 'Qw3RtY'
        },
        clickCounts: {
          type: 'number',
          example: '1'
        },
        createdAt: {
          type: 'date',
          example: '2024-11-09T19:56:01.607Z'
        },
        updatedAt: {
          type: 'date',
          example: '2024-11-09T19:56:51.607Z'
        },
      }
    }
  })
  @ApiNotFoundResponse({ example: 'Not Found' })
  @ApiBadRequestResponse({ example: 'Invalid Code' })
  @ApiParam({ type: String, name: 'code' })
  @Get('/stats/:code')
  getStats(
    @Param('code', CodeValidationPipe) shortCode: string,
  ): Promise<ShortLinkData> {
    return this.shortLinkDataService.getStatsByCode(shortCode);
  }

  @ApiOperation({ summary: 'Redirect to the original URL' })
  @ApiResponse({
    status: 301,
    description: 'Redirected permanently to the original URL',
  })
  @ApiNotFoundResponse({ example: 'Not Found' })
  @ApiBadRequestResponse({ example: 'Invalid Code' })
  @ApiParam({ type: String, name: 'code' })
  @Get('/:code')
  async redirectToOriginalUrl(
    @Res() res: Response,
    @Param('code', CodeValidationPipe) code: string,
  ): Promise<void> {
    const originalUrl: string = await this.shortLinkDataService.getOriginalUrl(code);

    res.redirect(originalUrl);
  }
}
