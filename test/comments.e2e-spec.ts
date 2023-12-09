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

    // register user
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        userName: 'test',
        email: 'test@gmail.com',
        hashedPassword: 'test',
      })
      .then((res) => {
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

    // create new lesson
    await request(app.getHttpServer())
      .post('/lessons/add')
      .send({
        title: 'test lesson',
        description: 'string',
        iconPath: 'string',
        tags: [1],
        flashcards: [
          {
            question: 'string',
            answer: 'string',
          },
        ],
      })
      .set('Authorization', `Bearer ${tokens.authToken}`)
      .expect(HttpStatus.CREATED);
  });

  describe('/comments/add/{lessonId} (POST)', () => {
    it('should add comment', async () => {
      return request(app.getHttpServer())
        .post('/comments/add/1')
        .send({
          comment: 'test comment',
        })
        .set('Authorization', `Bearer ${tokens.authToken}`)
        .expect(HttpStatus.CREATED)
        .then((res) => {
          expect(res.body).toEqual({
            id: 1,
            lesson: { id: 1 },
            creator: { id: 1 },
            comment: 'test comment',
          });
        });
    });

    it('should fail because not authorized', async () => {
      return request(app.getHttpServer())
        .post('/comments/add/1')
        .send({
          comment: 'test comment',
        })
        .expect(HttpStatus.UNAUTHORIZED)
        .then((res) => {
          expect(res.body).toEqual({
            statusCode: 401,
            message: 'Unauthorized',
          });
        });
    });

    it("should fail because user don't exists", async () => {
      return request(app.getHttpServer())
        .post('/comments/add/1')
        .send({
          comment: 'test comment',
        })
        .set('Authorization', `Bearer random_text`)
        .expect(HttpStatus.UNAUTHORIZED)
        .then((res) => {
          expect(res.body).toEqual({
            message: 'Unauthorized',
            statusCode: 401,
          });
        });
    });

    it("should fail because lesson don't exists", async () => {
      const lessonId = 99;

      return request(app.getHttpServer())
        .post('/comments/add/' + lessonId)
        .send({
          comment: 'test comment',
        })
        .set('Authorization', `Bearer ${tokens.authToken}`)
        .expect(HttpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body).toEqual({
            statusCode: HttpStatus.NOT_FOUND,
            message: `Could not find lesson with id: ${lessonId}.`,
            error: 'Not Found',
          });
        });
    });

    it('should fail validation', async () => {
      return request(app.getHttpServer())
        .post('/comments/add/1')
        .send({
          comment: '',
        })
        .set('Authorization', `Bearer ${tokens.authToken}`)
        .expect(HttpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body).toEqual({
            statusCode: 400,
            message: ['comment should not be empty'],
            error: 'Bad Request',
          });
        });
    });
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
