import test from 'ava';
import request from 'supertest';
import HTTPStatus from 'http-status';
import app from '../../app';
import { errorCodes } from '../../lib/error';
import { user1 } from '../data/user';

test('userCreate:missingEmail', async (t) => {
  const res = await request(app)
    .post('/user');
  t.is(res.status, HTTPStatus.BAD_REQUEST);
  t.deepEqual(res.body.error, errorCodes.MISSING_EMAIL);
});

test('userCreate:invalidEmail', async (t) => {
  const res = await request(app)
    .post('/user')
    .send({
      email: 'blah'
    });
  t.is(res.status, HTTPStatus.BAD_REQUEST);
  t.deepEqual(res.body.error, errorCodes.INVALID_EMAIL);
});

test('userCreate:missingPassword', async (t) => {
  const res = await request(app)
    .post('/user')
    .send({
      email: 'blah@gmail.com'
    });
  t.is(res.status, HTTPStatus.BAD_REQUEST);
  t.deepEqual(res.body.error, errorCodes.MISSING_PASSWORD);
});

test('userCreate:invalidPassword', async (t) => {
  const res = await request(app)
    .post('/user')
    .send({
      email: 'blah@gmail.com',
      password: {}
    });
  t.is(res.status, HTTPStatus.BAD_REQUEST);
  t.deepEqual(res.body.error, errorCodes.INVALID_PASSWORD);
});

test('userCreate:createUser', async (t) => {
  const res = await request(app)
    .post('/user')
    .send({
      email: 'blah@gmail.com',
      password: 'blah'
    });
  t.is(res.status, HTTPStatus.CREATED);
});

test('userCreate:emailTaken', async (t) => {
  const res = await request(app)
    .post('/user')
    .send(user1);
  t.is(res.status, HTTPStatus.BAD_REQUEST);
  t.deepEqual(res.body.error, errorCodes.USER_EMAIL_TAKEN);
});
