import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export default class CodeValidationPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata): string {
    const regex = /^[a-zA-Z0-9]+$/;

    if (value.length != Number(process.env.SHORT_CODE_LENGTH) || !regex.test(value)) {
      throw new BadRequestException('Invalid Code');
    }
    return value
  }
}