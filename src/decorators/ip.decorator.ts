import { createParamDecorator } from '@nestjs/common';
import { getClientIp } from 'request-ip';

export const IpAddress = createParamDecorator((data, req) => {
  return getClientIp(req); // In case we forgot to include requestIp.mw() in main.ts
});
