import { Injectable, NotFoundException } from '@nestjs/common';
import ShortUniqueId from 'short-unique-id';
import { ShortLinkDataRepository } from './short-link-data.repository';
import { RedisInternalService } from './redis-internal.service';
import { ShortLinkData } from './schema/short-link-data.schema';
import { ShortUrlResponseType } from './types/short-url-response.type';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ShortLinkDataService {
  constructor(
    private readonly shortLinkDataRepository: ShortLinkDataRepository,
    private readonly redisInternalService: RedisInternalService,
    private readonly configService: ConfigService,
  ) {
  }

  async getShortUrl(originalUrl: string): Promise<ShortUrlResponseType> {
    const uid = new ShortUniqueId({ length: 6 });
    const code: string = uid.rnd();

    await this.redisInternalService.saveData(code, originalUrl)
    await this.shortLinkDataRepository.create({ originalUrl, code });

    const appUrl = await this.configService.get('app').baseUrl

    return { shortUrl: `${appUrl}/api/${code}` };
  }

  async getStatsByCode(code: string): Promise<ShortLinkData> {
    const urlData: ShortLinkData = await this.shortLinkDataRepository.findOneByCode(code);
    if (urlData) {
      return urlData
    }
    throw new NotFoundException();
  }

  async getOriginalUrl(code: string): Promise<string> {

    let originalUrl: string = await this.redisInternalService.getData(code);

    if (!originalUrl) {
      const urlData: ShortLinkData = await this.shortLinkDataRepository.findOneByCode(code);
      originalUrl = urlData?.originalUrl
    }
    if (originalUrl) {
      await this.shortLinkDataRepository.updateCount(code);
      return originalUrl;
    }

    throw new NotFoundException();
  }
}
