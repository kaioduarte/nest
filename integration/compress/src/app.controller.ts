import { Controller, Get, Res, UseInterceptors } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { CompressInterceptor } from './compress.interceptor';

@Controller()
export class AppController {
  @Get('/global-compress')
  globalCompress(): number[] {
    return new Array(2048).fill(1);
  }

  @Get('/manual-compress')
  manualCompress(@Res() reply: FastifyReply): unknown {
    const data = new Array(2048).fill(1);
    reply.type('application/json').compress(data);
    return reply;
  }

  @Get('/interceptor-compress')
  @UseInterceptors(CompressInterceptor)
  withInterceptor(): number[] {
    return new Array(2048).fill(1);
  }
}
