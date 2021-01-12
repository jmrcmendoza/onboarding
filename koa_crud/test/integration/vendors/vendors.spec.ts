/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import Chance from 'chance';
import R from 'ramda';
import { VendorType } from '../../../src/models/vendor';

const chance = new Chance();

chai.use(chaiHttp);

describe('Vendors', () => {
  describe('Add vendor', () => {
    it('should return error for null vendor name', async function () {
      const data = {
        name: undefined,
        type: VendorType.Seamless,
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
        name: chance.name(),
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
        name: chance.name(),
        type: VendorType.Seamless,
      };

      const response = await chai
        .request('http://localhost:3000')
        .post('/api/vendors')
        .type('json')
        .send(data);

      expect(response.status).to.equal(201);
      expect(response.body).to.exist;
      expect(response.body).to.be.true;
    });
  });

  describe('List vendors', () => {
    it('should return all vendors', async function () {
      const response = await chai
        .request('http://localhost:3000')
        .get('/api/vendors');

      expect(response.body).to.exist;
      expect(response.body).to.be.an('array').that.has.length.greaterThan(0);
    });

    it('should return one vendor', async function () {
      const vendors = await chai
        .request('http://localhost:3000')
        .get('/api/vendors');

      const lastVendorId = R.compose(R.prop('_id'), R.last)(vendors.body);

      const response = await chai
        .request('http://localhost:3000')
        .get(`/api/vendors/${lastVendorId}`);

      expect(response.body).to.exist;
      expect(response.body).to.be.an('object');
    });
  });

  describe('Edit vendor', () => {
    it('should return error for null vendor name', async function () {
      const vendors = await chai
        .request('http://localhost:3000')
        .get('/api/vendors');

      const lastVendor = R.last(vendors.body);

      const data = {
        name: '',
        type: lastVendor.type,
      };

      const response = await chai
        .request('http://localhost:3000')
        .put(`/api/vendors/${lastVendor._id}`)
        .send(data);

      expect(response.status).to.equal(400);
      expect(response.body.errorMsg).to.equal('Vendor name must be provided.');
    });

    it('should return error for null vendor type', async function () {
      const vendors = await chai
        .request('http://localhost:3000')
        .get('/api/vendors');

      const lastVendor = R.last(vendors.body);

      const data = {
        name: lastVendor.name,
        type: '',
      };

      const response = await chai
        .request('http://localhost:3000')
        .put(`/api/vendors/${lastVendor._id}`)
        .send(data);

      expect(response.status).to.equal(400);
      expect(response.body.errorMsg).to.equal('Vendor type must be provided.');
    });

    it('should update vendor type', async function () {
      const vendors = await chai
        .request('http://localhost:3000')
        .get('/api/vendors');

      const lastVendor = R.last(vendors.body);

      const data = {
        name: lastVendor.name,
        type: VendorType.Transfer,
      };

      const response = await chai
        .request('http://localhost:3000')
        .put(`/api/vendors/${lastVendor._id}`)
        .send(data);

      expect(response.status).to.equal(200);
      expect(response.body).to.exist;
      expect(response.body).to.be.true;
    });
  });

  describe('Delete vendor', () => {
    it('should delete one vendor', async function () {
      const vendors = await chai
        .request('http://localhost:3000')
        .get('/api/vendors');

      const lastVendorId = R.compose(R.prop('_id'), R.last)(vendors.body);

      const response = await chai
        .request('http://localhost:3000')
        .delete(`/api/vendors/${lastVendorId}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.exist;
      expect(response.body).to.be.true;
    });
  });
});
