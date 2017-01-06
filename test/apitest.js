'use strict';

process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

// test case for getall movei api call
describe('/GET Movie', () => {
	it('it should GET all the movies', (done) => {
		chai.request(server)
            .get('/location')
            .end((err, res) => {
	res.should.have.status(200);
	res.body.should.be.a('array');
	res.body.length.should.be.eql(19);
	done();
});
	});
});

// test case for get movie by name api call
describe('/GET/:name movie', () => {
	it('it should GET a movie by the given name', (done) => {
		chai.request(server)
            .get('/location/A Night Full of Rain')
            .end((err, res) => {
	res.should.have.status(200);
	res.body.should.be.a('object');
	res.body.should.have.property('title');
	res.body.should.have.property('release_year');
	res.body.should.have.property('production_company');
	res.body.should.have.property('actor_1');
	res.body.should.have.property('actor_2');
	res.body.should.have.property('director');
	res.body.should.have.property('distributor');
	res.body.should.have.property('fun_facts');
	res.body.should.have.property('locations');
	done();
});
	});
});
