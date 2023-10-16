import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { TokensDto } from '../src/auth/dto/tokens.dto';

describe('UsersController (e2e)', () => {
  let tokens: TokensDto;
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        userName: 'test',
        email: 'test@gmail.com',
        hashedPassword: 'test',
      })
      .then((res) => {
        // console.log(res.body);
        tokens = res.body;
      });
  });

  it('/users/me (GET)', async () => {
    return request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${tokens.authToken}`)
      .expect(HttpStatus.OK);
    // .then((res) => {
    // console.log(res.body);
    // });
  });

  it('/users/{id} (GET)', async () => {
    return request(app.getHttpServer()).get('/users/1').expect(HttpStatus.OK);
    // .then((res) => {
    //   console.log(res.body);
    // });
  });
});
