import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { TokensDto } from '../src/auth/dto/tokens.dto';

describe('Lessons (e2e)', () => {
  let tokens: TokensDto;
  let tokensNotAuthor: TokensDto;

  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // register users
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

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        userName: 'test2',
        email: 'test2@gmail.com',
        hashedPassword: 'test2',
      })
      .then((res) => {
        tokensNotAuthor = res.body;
      });

    // add tags
    await request(app.getHttpServer())
      .post('/tags/add')
      .send({
        tagName: 'first test tag',
      })
      .set('Authorization', `Bearer ${tokens.authToken}`)
      .expect(HttpStatus.CREATED);

    await request(app.getHttpServer())
      .post('/tags/add')
      .send({
        tagName: 'second test tag',
      })
      .set('Authorization', `Bearer ${tokens.authToken}`)
      .expect(HttpStatus.CREATED);
  });

  describe('/lessons/add (POST)', () => {
    it('should add lesson with proper data', async () => {
      return await request(app.getHttpServer())
        .post('/lessons/add')
        .send({
          title: 'test lesson',
          description: 'string',
          iconPath: 'string',
          tags: [1, 2],
          flashcards: [
            {
              question: 'first lesson flashcard',
              answer: 'string',
            },
            {
              question: 'second lesson flashcard',
              answer: 'string',
            },
            {
              question: 'third lesson flashcard',
              answer: 'string',
            },
          ],
        })
        .set('Authorization', `Bearer ${tokens.authToken}`)
        .expect(HttpStatus.CREATED)
        .then((res) => {
          expect(res.body).toEqual({
            id: 1,
            title: 'test lesson',
            description: 'string',
            iconPath: 'string',
            creator: {
              id: 1,
            },
            tags: [
              {
                id: 1,
                tagName: 'first test tag',
              },
              {
                id: 2,
                tagName: 'second test tag',
              },
            ],
            flashcards: [
              { question: 'first lesson flashcard', answer: 'string' },
              { question: 'second lesson flashcard', answer: 'string' },
              { question: 'third lesson flashcard', answer: 'string' },
            ],
          });
        });
    });

    it('should fail because not authenticated', async () => {
      return await request(app.getHttpServer())
        .post('/lessons/add')
        .send({
          title: 'test lesson',
          description: 'string',
          iconPath: 'string',
          tags: [1, 2],
          flashcards: [
            {
              question: 'first lesson flashcard',
              answer: 'string',
            },
            {
              question: 'second lesson flashcard',
              answer: 'string',
            },
            {
              question: 'third lesson flashcard',
              answer: 'string',
            },
          ],
        })
        .expect(HttpStatus.UNAUTHORIZED)
        .then((res) => {
          expect(res.body).toEqual({
            statusCode: 401,
            message: 'Unauthorized',
          });
        });
    });

    // it('should fail validation', () => {});
  });

  describe('/lessons/completed/{id} (POST)', () => {
    it('should add user score', async () => {
      return await request(app.getHttpServer())
        .post('/lessons/completed/1')
        .send({
          percent: 10,
        })
        .set('Authorization', `Bearer ${tokens.authToken}`)
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).toEqual({
            id: 1,
            user: { id: 1 },
            lesson: { id: 1 },
            score: 10,
          });
        });
    });

    it('should fail because not authenticated', async () => {
      return await request(app.getHttpServer())
        .post('/lessons/completed/1')
        .send({
          percent: 10,
        })
        .expect(HttpStatus.UNAUTHORIZED)
        .then((res) => {
          expect(res.body).toEqual({
            statusCode: 401,
            message: 'Unauthorized',
          });
        });
    });

    it('should fail because lesson does not exist', async () => {
      const lessonId = '77';

      return await request(app.getHttpServer())
        .post('/lessons/completed/' + lessonId)
        .send({
          percent: 10,
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

    // it('should fail validation', () => {})
  });

  describe('/lessons (GET)', () => {
    it('should return lesson without scores', async () => {
      return request(app.getHttpServer())
        .get('/lessons')
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).toEqual([
            {
              id: 1,
              title: 'test lesson',
              description: 'string',
              iconPath: 'string',
              creator: {
                id: 1,
                userName: 'test',
              },
              tags: [
                {
                  id: 1,
                  tagName: 'first test tag',
                },
                {
                  id: 2,
                  tagName: 'second test tag',
                },
              ],
              flashcards: [
                {
                  id: 1,
                  question: 'first lesson flashcard',
                  answer: 'string',
                },
                {
                  id: 2,
                  question: 'second lesson flashcard',
                  answer: 'string',
                },
                {
                  id: 3,
                  question: 'third lesson flashcard',
                  answer: 'string',
                },
              ],
              comments: [],
            },
          ]);
        });
    });

    it('should return lessons with scores', async () => {
      return request(app.getHttpServer())
        .get('/lessons')
        .set('Authorization', `Bearer ${tokens.authToken}`)
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).toEqual([
            {
              id: 1,
              title: 'test lesson',
              description: 'string',
              iconPath: 'string',
              score: [
                {
                  id: 1,
                  score: 10,
                },
              ],
              creator: {
                id: 1,
                userName: 'test',
              },
              tags: [
                {
                  id: 1,
                  tagName: 'first test tag',
                },
                {
                  id: 2,
                  tagName: 'second test tag',
                },
              ],
              flashcards: [
                {
                  id: 1,
                  question: 'first lesson flashcard',
                  answer: 'string',
                },
                {
                  id: 2,
                  question: 'second lesson flashcard',
                  answer: 'string',
                },
                {
                  id: 3,
                  question: 'third lesson flashcard',
                  answer: 'string',
                },
              ],
              comments: [],
            },
          ]);
        });
    });

    // it('should return filtered lessons with scores', () => {})

    // it('should fail filters validation', () => {});
  });

  describe('/lessons/{id} (GET)', () => {
    it('should return lesson by id without score', async () => {
      return request(app.getHttpServer())
        .get('/lessons/1')
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).toEqual({
            id: 1,
            title: 'test lesson',
            description: 'string',
            iconPath: 'string',
            creator: {
              id: 1,
              userName: 'test',
            },
            tags: [
              {
                id: 1,
                tagName: 'first test tag',
              },
              {
                id: 2,
                tagName: 'second test tag',
              },
            ],
            flashcards: [
              {
                id: 1,
                question: 'first lesson flashcard',
                answer: 'string',
              },
              {
                id: 2,
                question: 'second lesson flashcard',
                answer: 'string',
              },
              {
                id: 3,
                question: 'third lesson flashcard',
                answer: 'string',
              },
            ],
            comments: [],
          });
        });
    });

    it('should return lesson by id with score', async () => {
      return request(app.getHttpServer())
        .get('/lessons/1')
        .set('Authorization', `Bearer ${tokens.authToken}`)
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).toEqual({
            id: 1,
            title: 'test lesson',
            description: 'string',
            iconPath: 'string',
            score: [
              {
                id: 1,
                score: 10,
              },
            ],
            creator: {
              id: 1,
              userName: 'test',
            },
            tags: [
              {
                id: 1,
                tagName: 'first test tag',
              },
              {
                id: 2,
                tagName: 'second test tag',
              },
            ],
            flashcards: [
              {
                id: 1,
                question: 'first lesson flashcard',
                answer: 'string',
              },
              {
                id: 2,
                question: 'second lesson flashcard',
                answer: 'string',
              },
              {
                id: 3,
                question: 'third lesson flashcard',
                answer: 'string',
              },
            ],
            comments: [],
          });
        });
    });

    it('should fail because lesson does not exist', async () => {
      const lessonId = '77';

      return request(app.getHttpServer())
        .get('/lessons/' + lessonId)
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
  });

  describe('/lessons/{id} (PUT)', () => {
    it('should update lesson data', async () => {
      return request(app.getHttpServer())
        .put('/lessons/1')
        .send({
          description: 'string',
          iconPath: 'string',
        })
        .set('Authorization', `Bearer ${tokens.authToken}`)
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).toEqual({
            id: 1,
            title: 'test lesson',
            description: 'string',
            iconPath: 'string',
            creator: {
              id: 1,
              userName: 'test',
            },
            tags: [
              {
                id: 1,
                tagName: 'first test tag',
              },
              {
                id: 2,
                tagName: 'second test tag',
              },
            ],
            flashcards: [
              {
                id: 1,
                question: 'first lesson flashcard',
                answer: 'string',
              },
              {
                id: 2,
                question: 'second lesson flashcard',
                answer: 'string',
              },
              {
                id: 3,
                question: 'third lesson flashcard',
                answer: 'string',
              },
            ],
            comments: [],
          });
        });
    });

    it('should fail because not authenticated', async () => {
      return request(app.getHttpServer())
        .put('/lessons/1')
        .send({
          description: 'string',
          iconPath: 'string',
        })
        .expect(HttpStatus.UNAUTHORIZED)
        .then((res) => {
          expect(res.body).toEqual({
            statusCode: 401,
            message: 'Unauthorized',
          });
        });
    });

    it('should fail because user not author', async () => {
      return request(app.getHttpServer())
        .put('/lessons/1')
        .send({
          description: 'string',
          iconPath: 'string',
        })
        .set('Authorization', `Bearer ${tokensNotAuthor.authToken}`)
        .expect(HttpStatus.FORBIDDEN)
        .then((res) => {
          expect(res.body).toEqual({
            error: 'Forbidden',
            message: 'Access denied.',
            statusCode: HttpStatus.FORBIDDEN,
          });
        });
    });

    it('should fail because lesson does not exist', async () => {
      const lessonId = '77';

      return request(app.getHttpServer())
        .put('/lessons/' + lessonId)
        .send({
          description: 'string',
          iconPath: 'string',
        })
        .set('Authorization', `Bearer ${tokensNotAuthor.authToken}`)
        .expect(HttpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body).toEqual({
            statusCode: HttpStatus.NOT_FOUND,
            message: `Could not find lesson with id: ${lessonId}.`,
            error: 'Not Found',
          });
        });
    });

    // it('should fail validation', () => {})
  });

  describe('/lessons/{id} (DELETE)', () => {
    it('should fail because not authenticated', async () => {
      return request(app.getHttpServer())
        .delete('/lessons/1')
        .expect(HttpStatus.UNAUTHORIZED)
        .then((res) => {
          expect(res.body).toEqual({
            statusCode: 401,
            message: 'Unauthorized',
          });
        });
    });

    it('should fail because user not author', async () => {
      return request(app.getHttpServer())
        .delete('/lessons/1')
        .set('Authorization', `Bearer ${tokensNotAuthor.authToken}`)
        .expect(HttpStatus.FORBIDDEN)
        .then((res) => {
          expect(res.body).toEqual({
            error: 'Forbidden',
            message: 'Access denied.',
            statusCode: HttpStatus.FORBIDDEN,
          });
        });
    });

    it('should delete lesson and return data', async () => {
      return request(app.getHttpServer())
        .delete('/lessons/1')
        .set('Authorization', `Bearer ${tokens.authToken}`)
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).toEqual({
            title: 'test lesson',
            description: 'string',
            iconPath: 'string',
            score: [
              {
                id: 1,
                score: 10,
              },
            ],
            creator: {
              id: 1,
              userName: 'test',
            },
            tags: [
              {
                id: 1,
                tagName: 'first test tag',
              },
              {
                id: 2,
                tagName: 'second test tag',
              },
            ],
            flashcards: [
              {
                id: 1,
                question: 'first lesson flashcard',
                answer: 'string',
              },
              {
                id: 2,
                question: 'second lesson flashcard',
                answer: 'string',
              },
              {
                id: 3,
                question: 'third lesson flashcard',
                answer: 'string',
              },
            ],
            comments: [],
          });
        });
    });

    it("should fail because lesson don't exist", async () => {
      const lessonId = '1';

      return request(app.getHttpServer())
        .delete('/lessons/' + lessonId)
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
  });
});
