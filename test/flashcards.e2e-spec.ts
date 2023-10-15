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

  it('/flashcards/{lessonId} (POST)', async () => {
    return request(app.getHttpServer())
      .post('/flashcards/1')
      .send([
        {
          question: 'test flashcard',
          answer: 'answer',
        },
      ])
      .set('Authorization', `Bearer ${tokens.authToken}`)
      .expect(HttpStatus.CREATED);
    //   .then((res) => {
    //     console.log(res.body);
    //   });
  });

  it('/flashcards/{lessonId}/{id} (PUT)', async () => {
    return request(app.getHttpServer())
      .put('/flashcards/1/1')
      .send({
        id: 1,
        question: 'updated test',
        answer: 'test',
      })
      .set('Authorization', `Bearer ${tokens.authToken}`)
      .expect(HttpStatus.OK);
    //   .then((res) => {
    //     console.log(res.body);
    //   });
  });

  it('/flashcards/{lessonId}/{id} (DELETED)', async () => {
    return request(app.getHttpServer())
      .delete('/flashcards/1/1')
      .set('Authorization', `Bearer ${tokens.authToken}`)
      .expect(HttpStatus.OK);
    //   .then((res) => {
    //     console.log(res.body);
    //   });
  });
});
