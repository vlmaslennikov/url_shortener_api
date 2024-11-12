import { Test, TestingModule } from '@nestjs/testing';
import { ShortLinkDataService } from './short-link-data.service';
import { RedisInternalService } from './redis-internal.service';
import { ShortLinkDataRepository } from './short-link-data.repository';
import { ConfigService } from '@nestjs/config';
import { createMock } from '@golevelup/ts-jest';
import { NotFoundException } from '@nestjs/common';

const code = "Qw3RtY"
const originalUrl = 'https://test.com'
const appUrl = 'https://example.com'
const urlData = {
  _id: '123',
  code,
  originalUrl: 'https://example.com',
  clickCounts: 1
}

jest.mock('short-unique-id', () => {
  return {
    default: class MockShortUniqueId {
      data: any;
      constructor(data: any) {
        this.data = data;
      }
      rnd(): string {
        return code;
      }
    }
  };
});

describe('ShortLinkDataService', () => {
  let shortLinkDataService: ShortLinkDataService;
  let redisInternalService: RedisInternalService;
  let shortLinkDataRepository: ShortLinkDataRepository;
  let configService: ConfigService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        ShortLinkDataService,
        {
          provide: RedisInternalService,
          useValue: createMock<RedisInternalService>()
        },
        {
          provide: ShortLinkDataRepository,
          useValue: createMock<ShortLinkDataRepository>()
        },
        {
          provide: ConfigService,
          useValue: createMock<ConfigService>()
        },
      ],
    })
      .compile();

    shortLinkDataService = app.get<ShortLinkDataService>(ShortLinkDataService);
    redisInternalService = app.get<RedisInternalService>(RedisInternalService)
    shortLinkDataRepository = app.get<ShortLinkDataRepository>(ShortLinkDataRepository)
    configService = app.get<ConfigService>(ConfigService)
  });

  it('should be defined', () => {
    expect(shortLinkDataService).toBeDefined()
  })

  describe('method getStatsByCode', () => {

    it('should return an object that includes a "code" property with a value from "requestCode"', async () => {
      const spyFindOneByCode = (shortLinkDataRepository.findOneByCode as jest.Mock).mockImplementationOnce(() => Promise.resolve(urlData))
      const result = await shortLinkDataService.getStatsByCode(code)
      expect(spyFindOneByCode).toHaveBeenCalledWith(code);
      expect(result).toHaveProperty('code', code);

    });

    it('should return NotFoundException', async () => {
      (shortLinkDataRepository.findOneByCode as jest.Mock).mockResolvedValue(null);
      try {
        await shortLinkDataService.getStatsByCode(code)

      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException)
      }
    });
  });

  describe('method getShortUrl', () => {

    it('should return an object with that includes a "shortUrl" property with a string value consisting of the backend url + uniq code', async () => {
      const spySaveData = (redisInternalService.saveData as jest.Mock).mockResolvedValue(null);
      const spyCreate = (shortLinkDataRepository.create as jest.Mock).mockResolvedValue(null);
      const spyConfigGet = (configService.get as jest.Mock).mockReturnValue({ baseUrl: 'https://example.com' });
      const result = await shortLinkDataService.getShortUrl(originalUrl)
      expect(spySaveData).toHaveBeenCalledWith(code, originalUrl);
      expect(spyCreate).toHaveBeenCalledWith({ code, originalUrl });
      expect(spyConfigGet).toHaveBeenCalledWith('app');
      expect(result).toEqual({ shortUrl: `${appUrl}/api/${code}` });
    });
  });

  describe('method getOriginalUrl', () => {

    it('should return originalUrl from mock redis service', async () => {
      const spyGetData = (redisInternalService.getData as jest.Mock).mockResolvedValue(Promise.resolve(originalUrl));
      const spyUpdateCount = (shortLinkDataRepository.updateCount as jest.Mock).mockResolvedValue(null);
      const result = await shortLinkDataService.getOriginalUrl(code)
      expect(spyGetData).toHaveBeenCalledWith(code);
      expect(spyUpdateCount).toHaveBeenCalledWith(code);
      expect(result).toEqual(originalUrl);
    });

    it('should return originalUrl from mock DB service', async () => {
      const spyGetData = (redisInternalService.getData as jest.Mock).mockResolvedValue(null);
      const spyFindOneByCode = (shortLinkDataRepository.findOneByCode as jest.Mock).mockResolvedValue(Promise.resolve({ originalUrl }));
      const spyUpdateCount = (shortLinkDataRepository.updateCount as jest.Mock).mockResolvedValue(null);
      const result = await shortLinkDataService.getOriginalUrl(code)
      expect(spyGetData).toHaveBeenCalledWith(code);
      expect(spyFindOneByCode).toHaveBeenCalledWith(code);
      expect(spyUpdateCount).toHaveBeenCalledWith(code);
      expect(result).toEqual(originalUrl);
    });


    it('should return NotFoundException', async () => {
      const spyGetData = (redisInternalService.getData as jest.Mock).mockResolvedValue(null);
      const spyFindOneByCode = (shortLinkDataRepository.findOneByCode as jest.Mock).mockResolvedValue(null);
      try {
        await shortLinkDataService.getStatsByCode(code)
        expect(spyGetData).toHaveBeenCalledWith(code);
        expect(spyFindOneByCode).toHaveBeenCalledWith(code);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException)
      }
    });

  });
  afterEach(() => {
    jest.clearAllMocks();
  });

});
