import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { Tokens } from '../src/auth/type/tokens.type';

describe('AuthController (e2e)', () => {
  let tokens: Tokens;
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('/auth/register (POST)', async () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        userName: 'test',
        email: 'test@gmail.com',
        hashedPassword: 'test',
      })
      .expect(HttpStatus.CREATED)
      .then((res) => {
        // console.log(res.body);
        tokens = res.body;
      });
  });

  it('/auth/login (POST)', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test@gmail.com',
        hashedPassword: 'test',
      })
      .expect(HttpStatus.OK)
      .then((res) => {
        // console.log(res.body);
        tokens = res.body;
      });
  });

  it('/auth/refreshtoken (POST)', async () => {
    return request(app.getHttpServer())
      .post('/auth/refreshtoken')
      .set('Authorization', `Bearer ${tokens.refreshToken}`)
      .expect(HttpStatus.OK)
      .then((res) => {
        // console.log('tokens:' + res.body);
        tokens = res.body;
      });
  });

  it('/auth/logout (POST)', async () => {
    return request(app.getHttpServer())
      .post('/auth/logout')
      .set('Authorization', `Bearer ${tokens.authToken}`)
      .expect(HttpStatus.OK);
    // .then((res) => {
    //   console.log(res.body);
    // });
  });
});
