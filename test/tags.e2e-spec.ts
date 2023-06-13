import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { Tokens } from '../src/auth/type/tokens.type';

describe('UsersController (e2e)', () => {
  let tokens: Tokens;
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
        console.log(res.body);
        tokens = res.body;
      });
  });

  it('/tags (GET)', async () => {
    return request(app.getHttpServer())
      .get('/tags')
      .expect(HttpStatus.OK)
      .then((res) => {
        console.log(res.body);
      });
  });

  it('/tags/add (POST)', async () => {
    return request(app.getHttpServer())
      .post('/tags/add')
      .set('Authorization', `Bearer ${tokens.authToken}`)
      .send({ tagName: 'english' })
      .expect(HttpStatus.CREATED)
      .then((res) => {
        console.log(res.body);
      });
  });

  it('/tags/{id} (PUT)', async () => {
    return request(app.getHttpServer())
      .put('/tags/1')
      .set('Authorization', `Bearer ${tokens.authToken}`)
      .send({ tagName: 'test_name' })
      .expect(HttpStatus.OK)
      .then((res) => {
        console.log(res.body);
      });
  });

  it('/tags/delete/{id} (DELETE)', async () => {
    return request(app.getHttpServer())
      .delete('/tags/1')
      .set('Authorization', `Bearer ${tokens.authToken}`)
      .expect(HttpStatus.OK)
      .then((res) => {
        console.log(res.body);
      });
  });
});
