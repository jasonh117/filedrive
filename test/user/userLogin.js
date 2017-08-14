import test from 'ava';
import request from 'supertest';
import HTTPStatus from 'http-status';
import app from '../../app';
import { errorCodes } from '../../lib/error';
import { user1 } from '../data/user';

test('userLogin:missingEmail', async (t) => {
  const res = await request(app)
    .post('/user/login');
  t.is(res.status, HTTPStatus.BAD_REQUEST);
  t.deepEqual(res.body.error, errorCodes.MISSING_EMAIL);
});

test('userLogin:invalidEmail', async (t) => {
  const res = await request(app)
    .post('/user/login')
    .send({
      email: 'hue'
    });
  t.is(res.status, HTTPStatus.BAD_REQUEST);
  t.deepEqual(res.body.error, errorCodes.INVALID_EMAIL);
});

test('userLogin:missingPassword', async (t) => {
  const res = await request(app)
    .post('/user/login')
    .send({
      email: user1.email
    });
  t.is(res.status, HTTPStatus.BAD_REQUEST);
  t.deepEqual(res.body.error, errorCodes.MISSING_PASSWORD);
});

test('userLogin:invalidPassword', async (t) => {
  const res = await request(app)
    .post('/user/login')
    .send({
      email: user1.email,
      password: {}
    });
  t.is(res.status, HTTPStatus.BAD_REQUEST);
  t.deepEqual(res.body.error, errorCodes.INVALID_PASSWORD);
});

test('userLogin:login', async (t) => {
  const res = await request(app)
    .post('/user/login')
    .send(user1);
  t.is(res.status, HTTPStatus.OK);
});

test('userLogin:userNotFound', async (t) => {
  const res = await request(app)
    .post('/user/login')
    .send({
      email: 'huehue@gmail.com',
      password: 'blah'
    });
  t.is(res.status, HTTPStatus.BAD_REQUEST);
  t.deepEqual(res.body.error, errorCodes.USER_NOT_FOUND);
});

test('userLogin:userNotFound', async (t) => {
  const res = await request(app)
    .post('/user/login')
    .send({
      email: user1.email,
      password: 'blah'
    });
  t.is(res.status, HTTPStatus.BAD_REQUEST);
  t.deepEqual(res.body.error, errorCodes.USER_INVALID_CREDENTIALS);
});
