import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggerInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url } = request;

    const start = Date.now();
    return next.handle().pipe(
      tap(() => {
        const timeTaken = Date.now() - start; // Вычисляем время выполнения запроса
        this.logger.log(`URL: ${url}, Method: ${method}, Time: ${timeTaken}ms`);
      }),
    );
  }
}
