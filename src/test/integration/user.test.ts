import {expect} from 'chai';
import * as httpStatus from 'http-status';
import app from '../../config/express';
import UserModel from '../../api/user/user.model'
import 'mocha';
const request = require('supertest');
require('ts-mocha');

describe('USER', () => {
    beforeEach(function (done) {
        UserModel.deleteMany({}, (err) => {
            done()
        })
    });

    describe('GET /api/v1/users', () => {
        it('Should return all users in the DB', () => {
            return request(app)
                .get('/api/v1/users')
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.result)
                        .to
                        .be
                        .an('array');
                });
        });

    })

    describe('POST /api/v1/users ', () => {
        it('Should create a user in the db', () => {
            return request(app)
                .post('/api/v1/users')
                .send({username: 'perpz', password: 'miracle123'})
                .expect(httpStatus.CREATED)
                .then((res) => {
                    expect(res.body.data)
                        .to
                        .be
                        .an('object');
                    expect(res.body.data.token)
                        .to
                        .be
                        .an('string');
                })

        });
    })

    describe('PUT /api/v1/users/:username ', () => {

        it('Should update oauthId in users model', () => {
            let user = new UserModel({username: "freeman", password: "miracle123"});
            user.save((err, user) => {
               return request(app)
                    .put('/api/v1/users/' + user.username)
                    .send({oauthId: 200})
                    .expect(httpStatus.OK)
                    .then((res) => {
                        expect(res.body.message)
                            .to
                            .be
                            .a('string');
                        expect(res.body.result.oauthId)
                            .to
                            .be
                            .equal(200);
                        
                    })
            })
        })


        it('It should return, can not update user if error', () => {
            let user = new UserModel({username: "caleb", password: "miracle123"});
            return user.save((err, user) => {
                request(app)
                    .put('/api/v1/users/' + user.username)
                    .send({oauthId: 'hello'})
                    .expect(httpStatus.OK)
                    .then((res) => {
                        expect(res.body)
                            .to
                            .have
                            .property('err');
                        expect(res.body.message)
                            .to
                            .be
                            .equal('Could not update the user');
                        
                    })

            })
        })

    })

    describe('GET /api/v1/users/@username', ()=> {

        it('Should return a user from the db when passed the username as param', ()=> {
            const user = new UserModel({
              username: 'perpz',
              password: 'miracle123'
            })
            user.save(user =>{
            return request(app)
             .get('/api/v1/users/'+ user.username)
             .expect(httpStatus.OK)
             .then(res =>
                expect(res.body.result)
                .to
                .be
                .an('object')
             )
            })
         })
 
    })

    describe('POST /api/v1/users/authenticate', () => {
        it('it Should authenticate a valid user', () => {
            let user = new UserModel({username: "ogbiyoyosky", password: "miracle123"});
            user.save((user) => {
               return request(app)
                    .post('/api/v1/users/authenticate')
                    .send({username: "ogbiyoyosky", password: "miracle123"})
                    .expect(httpStatus.CREATED)
                    .then((res) => {
                        expect(res.body.data)
                            .to
                            .be
                            .an('object');
                        expect(res.body.data.token)
                            .to
                            .be
                            .a('string');
                    })
            })
        })

        it('it should return error when there is no password', () => {
            let user = new UserModel({username: "sirfreeman", password: "miracle123"});
            user.save((err, user) => {
               return request(app)
                    .post('/api/v1/users/authenticate')
                    .send({username: "sirfreeman"})
                    .then((res) => {
                        expect(res.body.errors)
                            .to
                            .be
                            .an('array');
                        expect(res.body.errors[0].detail)
                            .to
                            .be
                            .eql('No password specified');
                    })
            })
        })

        it('it should return error when password less than 6', () => {
            let user = new UserModel({username: "sirfreeman", password: "miracle123"});
            user.save((err, user) => {
               return request(app)
                    .post('/api/v1/users/authenticate')
                    .send({username: "sirfreeman", password: "mira"})
                    .then((res) => {
                        expect(res.body.errors)
                            .to
                            .be
                            .an('array');
                        expect(res.body.errors[0].detail)
                            .to
                            .be
                            .eql('Password must contain at least 6 characters');
                        
                    })
            })
        })

        it('it should return error if user does not exist', () => {
            return request(app)
                .post('/api/v1/users/authenticate')
                .send({username: "freemanity", password: "miracle123"})
                .then((res) => {
                    expect(res.body.errors)
                        .to
                        .be
                        .an('array');
                    expect(res.body.errors[0].detail)
                        .to
                        .be
                        .eql("The user doesn't exist in our records");
                    
                })
        })
    })

})
