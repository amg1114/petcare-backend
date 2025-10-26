import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';

export interface ApiStandardResponse<T> {
  success: boolean;
  message?: string;
  timestamp: string;
  data: T;
  statusCode: number;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiStandardResponse<T>>
{
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiStandardResponse<T>> {
    const now = Date.now();
    const statusCode = context.switchToHttp().getResponse().statusCode;

    return next.handle().pipe(
      map((data) => ({
        success: true,
        statusCode,
        timestamp: new Date(now).toISOString(),
        data,
      })),
    );
  }
}
