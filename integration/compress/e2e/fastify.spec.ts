import fastifyCompress from '@fastify/compress';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { expect } from 'chai';
import { AppModule } from '../src/app.module';

describe('Fastify Compress', () => {
  let app: NestFastifyApplication;

  describe('Global middleware', () => {
    before(async () => {
      const module = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = module.createNestApplication<NestFastifyApplication>(
        new FastifyAdapter(),
      );

      await app.register(fastifyCompress, {
        global: true,
        encodings: ['deflate', 'gzip', 'br', 'identity'],
      });

      await app.init();
    });

    after(async () => {
      await app.close();
    });

    describe("Valid encoding", () => {
      it(`should compress payload with GZIP`, async () => {
        const response = await app.inject({
          method: "GET",
          url: "/global-compress",
          headers: {
            "accept-encoding": "gzip",
          }
        });
        
        expect(response.headers['content-encoding']).to.equal('gzip');
        expect(response.headers['transfer-encoding']).to.equal('chunked');
        expect(response.statusCode).to.equal(200);
      });

      it(`should compress payload with DEFLATE`, async () => {
        const response = await app.inject({
          method: "GET",
          url: "/global-compress",
          headers: {
            "accept-encoding": "deflate",
          }
        });
        
        expect(response.headers['content-encoding']).to.equal('deflate');
        expect(response.headers['transfer-encoding']).to.equal('chunked');
        expect(response.statusCode).to.equal(200);
      });

      it(`should compress payload with BR`, async () => {
        const response = await app.inject({
          method: "GET",
          url: "/global-compress",
          headers: {
            "accept-encoding": "br",
          }
        });
        
        expect(response.headers['content-encoding']).to.equal('br');
        expect(response.headers['transfer-encoding']).to.equal('chunked');
        expect(response.statusCode).to.equal(200);
      });
    });

    describe("Invalid/Identity encoding", () => {
      it(`should NOT compress payload when encoding identity is provided`, async () => {
        const response = await app.inject({
          method: "GET",
          url: "/global-compress",
          headers: {
            "accept-encoding": "identity",
          }
        });
        
        expect(response.headers['content-encoding']).to.be.undefined;
        expect(response.headers['transfer-encoding']).to.be.undefined;
        expect(response.headers['content-length']).to.exist;
        expect(response.statusCode).to.equal(200);
      });

      it(`should NOT compress payload with invalid encoding`, async () => {
        const response = await app.inject({
          method: "GET",
          url: "/global-compress",
          headers: {
            "accept-encoding": "invalid-encoding",
          }
        });
        
        expect(response.headers['content-encoding']).to.be.undefined;
        expect(response.headers['transfer-encoding']).to.be.undefined;
        expect(response.headers['content-length']).to.exist;
        expect(response.statusCode).to.equal(200);
      });
    });
  });

  describe("Non-global middleware", () => {
    before(async () => {
      const module = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = module.createNestApplication<NestFastifyApplication>(
        new FastifyAdapter(),
      );

      await app.register(fastifyCompress, {
        global: false,
        encodings: ['deflate', 'gzip', 'br', 'identity'],
      });

      await app.init();
    });

    after(async () => {
      await app.close();
    });

    describe('Manual compression', () => {
      it(`should compress payload with valid encoding`, async () => {
        const response = await app.inject({
          method: "GET",
          url: "/manual-compress",
          headers: {
            "accept-encoding": "gzip",
          }
        });
        
        expect(response.headers['content-encoding']).to.equal('gzip');
        expect(response.headers['transfer-encoding']).to.equal('chunked');
        expect(response.statusCode).to.equal(200);
      });
  
      it(`should NOT compress payload with invalid encoding`, async () => {
        const response = await app.inject({
          method: "GET",
          url: "/manual-compress",
          headers: {
            "accept-encoding": "invalid-encoding",
          }
        });
        
        expect(response.headers['content-encoding']).to.be.undefined;
        expect(response.headers['transfer-encoding']).to.be.undefined;
        expect(response.headers['content-length']).to.exist;
        expect(response.statusCode).to.equal(200);
      });
    });
  
    describe('Interceptor compression', () => {
      it(`should compress payload with valid encoding`, async () => {
        const response = await app.inject({
          method: "GET",
          url: "/interceptor-compress",
          headers: {
            "accept-encoding": "gzip",
          }
        });
        
        expect(response.headers['content-encoding']).to.equal('gzip');
        expect(response.headers['transfer-encoding']).to.equal('chunked');
        expect(response.statusCode).to.equal(200);
      });
  
      it(`should NOT compress payload with invalid encoding`, async () => {
        const response = await app.inject({
          method: "GET",
          url: "/interceptor-compress",
          headers: {
            "accept-encoding": "invalid-encoding",
          }
        });
        
        expect(response.headers['content-encoding']).to.be.undefined;
        expect(response.headers['transfer-encoding']).to.be.undefined;
        expect(response.headers['content-length']).to.exist;
        expect(response.statusCode).to.equal(200);
      });
    });
  });
});
