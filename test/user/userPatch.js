import test from 'ava';
import request from 'supertest';
import HTTPStatus from 'http-status';
import app from '../../app';
import { errorCodes } from '../../lib/error';
import { user1, user2 } from '../data/user';

let jwt = '';

test.before('getJWT', async (t) => {
  const res = await request(app)
    .post('/user/login')
    .send(user1);
  t.is(res.status, HTTPStatus.OK);
  jwt = `JWT ${res.body.data.jwt}`;
});

test('userPatch:invalidEmail', async (t) => {
  const res = await request(app)
    .patch('/user')
    .set('Authorization', jwt)
    .send({
      email: 'hue'
    });
  t.is(res.status, HTTPStatus.BAD_REQUEST);
  t.deepEqual(res.body.error, errorCodes.INVALID_EMAIL);
});

test('userPatch:invalidPassword', async (t) => {
  const res = await request(app)
    .patch('/user')
    .set('Authorization', jwt)
    .send({
      email: user1.email,
      password: {}
    });
  t.is(res.status, HTTPStatus.BAD_REQUEST);
  t.deepEqual(res.body.error, errorCodes.INVALID_PASSWORD);
});

test('userPatch:patch', async (t) => {
  const res = await request(app)
    .patch('/user')
    .set('Authorization', jwt)
    .send(user1);
  t.is(res.status, HTTPStatus.OK);
});

test('userPatch:userNotFound', async (t) => {
  const res = await request(app)
    .patch('/user')
    .set('Authorization', jwt)
    .send({
      email: user2.email
    });
  t.is(res.status, HTTPStatus.BAD_REQUEST);
  t.deepEqual(res.body.error, errorCodes.USER_EMAIL_TAKEN);
});
