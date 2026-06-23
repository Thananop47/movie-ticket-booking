import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    // Skip PDF responses — they have their own content-type / stream handling
    if (
      response.getHeader &&
      response.getHeader('Content-Type') === 'application/pdf'
    ) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        // If the controller already returned a formatted response, pass through
        if (data && data.success !== undefined) return data;

        return {
          success: true,
          statusCode: response.statusCode ?? 200,
          message: 'Success',
          data,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
