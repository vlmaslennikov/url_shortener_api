import { ThrottlerGuard } from '@nestjs/throttler';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ProjectThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Request): Promise<string> {
    return req.headers['x-original-forwarded-for']
      ? (req.headers['x-original-forwarded-for'] as string)
      : req.ip;
  }
}
