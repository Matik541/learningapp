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

    // register user
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

    // add tag
    await request(app.getHttpServer())
      .post('/tags/add')
      .send({
        tagName: 'string',
      })
      .set('Authorization', `Bearer ${tokens.authToken}`)
      .expect(HttpStatus.CREATED);
    //   .then((res) => {
    //     console.log(res.body);
    //   });
  });

  it('/lessons/add (POST)', async () => {
    return await request(app.getHttpServer())
      .post('/lessons/add')
      .send({
        title: 'test lesson',
        description: 'string',
        iconPath: 'string',
        tags: [
          {
            id: 1,
          },
        ],
        flashcards: [
          {
            question: 'string',
            answer: 'string',
          },
        ],
      })
      .set('Authorization', `Bearer ${tokens.authToken}`)
      .expect(HttpStatus.CREATED);
    //   .then((res) => {
    //     console.log(res.body);
    //   });
  });

  it('/lessons (GET)', async () => {
    return request(app.getHttpServer()).get('/lessons').expect(HttpStatus.OK);
    //   .then((res) => {
    //     console.log(res.body);
    //   });
  });

  it('/lessons/{id} (GET)', async () => {
    return request(app.getHttpServer()).get('/lessons/1').expect(HttpStatus.OK);
    //   .then((res) => {
    //     console.log(res.body);
    //   });
  });

  it('/lessons/{id} (PUT)', async () => {
    return request(app.getHttpServer())
      .put('/lessons/1')
      .send({
        title: 'string',
        description: 'string',
        iconPath: 'string',
      })
      .set('Authorization', `Bearer ${tokens.authToken}`);
    //   .then((res) => {
    //     console.log(res.body);
    //   });
  });

  it('/lessons/completed/{id} (POST)', async () => {
    return request(app.getHttpServer())
      .post('/lessons/completed/1')
      .send({
        percent: 10,
      })
      .set('Authorization', `Bearer ${tokens.authToken}`)
      .expect(HttpStatus.OK);
    //   .then((res) => {
    //     console.log(res.body);
    //   });
  });

  it('/lessons/{id} (DELETE)', async () => {
    return request(app.getHttpServer())
      .delete('/lessons/1')
      .set('Authorization', `Bearer ${tokens.authToken}`)
      .expect(HttpStatus.OK);
    //   .then((res) => {
    //     console.log(res.body);
    //   });
  });
});
