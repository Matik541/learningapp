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

    // create new lesson
    await request(app.getHttpServer())
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

  it('/comments/add/{lessonId} (POST)', async () => {
    return request(app.getHttpServer())
      .post('/comments/add/1')
      .send({
        comment: 'test comment',
      })
      .set('Authorization', `Bearer ${tokens.authToken}`)
      .expect(HttpStatus.CREATED);
    //   .then((res) => {
    //     console.log(res.body);
    //   });
  });

  it('/comments/{id} (PUT)', async () => {
    return request(app.getHttpServer())
      .put('/comments/1')
      .send({
        comment: 'updated comment',
      })
      .set('Authorization', `Bearer ${tokens.authToken}`)
      .expect(HttpStatus.OK);
    //   .then((res) => {
    //     console.log(res.body);
    //   });
  });

  it('/comments/{id} (DELETE)', async () => {
    return request(app.getHttpServer())
      .delete('/comments/1')
      .set('Authorization', `Bearer ${tokens.authToken}`)
      .expect(HttpStatus.OK);
    //   .then((res) => {
    //     console.log(res.body);
    //   });
  });
});
