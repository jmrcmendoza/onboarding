/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);

describe('Vendors', () => {
  describe('Add vendor', () => {
    it('should return error for null vendor name', async function () {
      const data = {
        name: undefined,
        type: 'SEAMLESS',
      };

      const response = await chai
        .request('http://localhost:3000')
        .post('/api/vendors')
        .type('json')
        .send(data);

      expect(response.status).to.equal(400);
      expect(response.body.errorMsg).to.equal('Vendor name must be provided.');
    });

    it('should return error for null vendor type', async function () {
      const data = {
        name: 'Vendor 2',
        type: undefined,
      };

      const response = await chai
        .request('http://localhost:3000')
        .post('/api/vendors')
        .type('json')
        .send(data);

      expect(response.status).to.equal(400);
      expect(response.body.errorMsg).to.equal('Vendor type must be provided.');
    });

    it('should insert new vendor', async function () {
      const data = {
        name: 'Vendor 1',
        type: 'SEAMLESS',
      };

      const response = await chai
        .request('http://localhost:3000')
        .post('/api/vendors')
        .type('json')
        .send(data);

      expect(response.status).to.equal(201);
      expect(response.body.result).to.exist;
      expect(response.body.result).to.be.an('object');
    });
  });

  describe('List vendors', () => {
    it('should return all vendors', async function () {
      const response = await chai
        .request('http://localhost:3000')
        .get('/api/vendors');

      expect(response.body.vendors).to.exist;
      expect(response.body.vendors)
        .to.be.an('array')
        .that.has.length.greaterThan(0);
    });

    it('should return one vendor', async function () {
      const id = '5ff679a79de0a13d142d9fce';

      const response = await chai
        .request('http://localhost:3000')
        .get(`/api/vendors/${id}`);

      expect(response.body.vendor).to.exist;
      expect(response.body.vendor).to.be.an('object');
    });
  });

  describe('Edit vendor', () => {
    it('should return error for null vendor name', async function () {
      let data = {
        name: 'Vendor 2',
        type: 'SEAMLESS',
      };

      const createResponse = await chai
        .request('http://localhost:3000')
        .post('/api/vendors')
        .type('json')
        .send(data);

      data = {
        name: '',
        type: 'SEAMLESS',
      };

      const response = await chai
        .request('http://localhost:3000')
        .put(`/api/vendors/${createResponse.body.result._id}`)
        .send(data);

      expect(response.status).to.equal(400);
      expect(response.body.errorMsg).to.equal('Vendor name must be provided.');
    });

    it('should return error for null vendor type', async function () {
      let data = {
        name: 'Vendor 3',
        type: 'SEAMLESS',
      };

      const createResponse = await chai
        .request('http://localhost:3000')
        .post('/api/vendors')
        .type('json')
        .send(data);

      data = {
        name: 'Vendor 3',
        type: '',
      };

      const response = await chai
        .request('http://localhost:3000')
        .put(`/api/vendors/${createResponse.body.result._id}`)
        .send(data);

      expect(response.status).to.equal(400);
      expect(response.body.errorMsg).to.equal('Vendor type must be provided.');
    });

    it('should update vendor type', async function () {
      let data = {
        name: 'Vendor 4',
        type: 'SEAMLESS',
      };

      const createResponse = await chai
        .request('http://localhost:3000')
        .post('/api/vendors')
        .type('json')
        .send(data);

      data = {
        name: 'Vendor 4',
        type: 'TRANSFER',
      };

      const response = await chai
        .request('http://localhost:3000')
        .put(`/api/vendors/${createResponse.body.result._id}`)
        .send(data);

      expect(response.status).to.equal(200);
      expect(response.body.result).to.exist;
      expect(response.body.result).to.be.an('object');
    });
  });

  describe('Delete vendor', () => {
    it('should delete one vendor', async function () {
      const data = {
        name: 'Vendor 5',
        type: 'TRANSFER',
      };

      const createResponse = await chai
        .request('http://localhost:3000')
        .post('/api/vendors')
        .type('json')
        .send(data);

      const response = await chai
        .request('http://localhost:3000')
        .delete(`/api/vendors/${createResponse.body.result._id}`);

      expect(response.status).to.equal(200);
      expect(response.body.result).to.exist;
      expect(response.body.result).to.be.an('object');
      expect(response.body.result).to.eqls({
        n: 1,
        ok: 1,
        deletedCount: 1,
      });
    });
  });
});