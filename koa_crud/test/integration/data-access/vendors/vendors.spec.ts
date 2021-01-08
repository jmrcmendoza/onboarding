/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import chaiAsPromised from 'chai-as-promised';
import server from '../../../../src';
import vendorsDB from '../../../../src/data-access/vendors';

chai.use(chaiHttp);
chai.use(chaiAsPromised);

before(function () {
  this.request = () => chai.request(server);
});

describe('Vendor Data Access', () => {
  describe('Create a Vendor', async () => {
    context('Given values are incorrect', () => {
      it('should throw a validation error for empty vendor name', async () => {
        const data = {
          name: '',
          type: 'SEAMLESS',
        };

        await expect(vendorsDB.createVendor(data)).to.eventually.rejected;
      });

      it('should throw a validation error for empty vendor type', async () => {
        const data = {
          name: 'Data Access Vendor 1',
          type: '',
        };

        await expect(vendorsDB.createVendor(data)).to.eventually.rejected;
      });

      it('should throw a validation error for invalid vendor type', async () => {
        const data = {
          name: 'Data Access Vendor 2',
          type: 'Test Type',
        };

        await expect(vendorsDB.createVendor(data)).to.eventually.rejected;
      });
    });

    context('Given the values are correct', () => {
      it('should insert vendor and return the values', async () => {
        const data = {
          name: 'Data Access Vendor 3',
          type: 'TRANSFER',
        };

        const result = await vendorsDB.createVendor(data);

        expect(result).to.exist;
        expect(result).to.be.an('object');
      });
    });
  });

  describe('List Vendors', () => {
    it('should retrieve all vendors', async () => {
      const result = await vendorsDB.listVendors();

      expect(result).to.be.an('array');
      expect(result).has.length.greaterThan(0);
    });

    it('should retrieve one vendor', async () => {
      const data = {
        name: 'Data Access Vendor 4',
        type: 'SEAMLESS',
      };

      const vendor = await vendorsDB.createVendor(data);

      const result = await vendorsDB.selectOneVendor(vendor._id);

      expect(result).to.exist;
      expect(result).to.be.an('object');
      expect(result).to.have.property('name', data.name);
    });
  });
});
