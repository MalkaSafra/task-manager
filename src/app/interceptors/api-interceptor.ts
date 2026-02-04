import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUrl = environment.apiUrl;
  const apiReq = req.clone({
    url: `${baseUrl}${req.url.startsWith('/') ? '' : '/'}${req.url}`
  });

  return next(apiReq);
};