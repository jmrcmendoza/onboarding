/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import chaiAsPromised from 'chai-as-promised';
import R from 'ramda';
import Chance from 'chance';
import server from '../../../../src';
import {
  insertMember,
  listMembers,
  selectMember,
  updateMember,
  deleteMember,
} from '../../../../src/use-cases/members';

const chance = new Chance();

chai.use(chaiHttp);
chai.use(chaiAsPromised);

describe('Member Use Case', () => {
  before(function () {
    this.request = () => chai.request(server);
  });

  describe('Add Member', () => {
    context('Given incorrect values', () => {
      it('should throw an error for empty username', async () => {
        const data = {
          username: '',
          password: chance.string({ lenght: 5 }),
          realName: chance.name(),
        };

        await expect(insertMember(data)).to.eventually.rejectedWith(
          'Username must be provided.',
        );
      });

      it('should throw an error for empty password', async () => {
        const data = {
          username: chance.last(),
          password: '',
          realName: chance.name(),
        };

        await expect(insertMember(data)).to.eventually.rejectedWith(
          'Password must be provided.',
        );
      });
    });

    context('Given correct values', () => {
      it('should insert member and return true', async () => {
        const data = {
          username: chance.last(),
          password: chance.string({ lenght: 5 }),
          realName: chance.name(),
        };

        const result = await insertMember(data);

        expect(result).to.exist;
        expect(result).to.be.true;
      });

      it('should throw error for duplicate username', async () => {
        const members = await listMembers();

        const lastMember = R.last(members);

        const data = {
          username: lastMember.username,
          password: chance.string({ lenght: 5 }),
          realName: chance.name(),
        };

        await expect(insertMember(data)).to.eventually.rejected;
      });
    });
  });

  describe('List Members', () => {
    it('should return all members', async () => {
      const result = await listMembers();

      expect(result).to.exist;
      expect(result).to.be.an('array');
      expect(result).to.have.length.greaterThan(0);
    });

    it('should return one member', async () => {
      const member = await listMembers();

      const lastMemberId = R.compose(R.prop('_id'), R.last)(member);

      const result = await selectMember(lastMemberId);

      expect(result).to.exist;
      expect(result).to.be.an('object');
    });
  });

  describe('Edit Member', () => {
    context('Given incorrect values', () => {
      it('should throw an error for empty username', async () => {
        const members = await listMembers();

        const lastMember = R.last(members);

        const data = {
          username: '',
          password: lastMember.password,
          realName: lastMember.realName,
        };

        await expect(
          updateMember(lastMember._id, data),
        ).to.eventually.rejectedWith('Username must be provided.');
      });

      it('should throw an error for empty password', async () => {
        const members = await listMembers();

        const lastMember = R.last(members);

        const data = {
          username: lastMember.username,
          password: '',
          realName: lastMember.realName,
        };

        await expect(
          updateMember(lastMember._id, data),
        ).to.eventually.rejectedWith('Password must be provided.');
      });
    });

    context('Given correct values', () => {
      it('should update member and return true', async () => {
        const members = await listMembers();

        const lastMember = R.last(members);

        const data = {
          username: lastMember.username,
          password: chance.string({ lenght: 5 }),
          realName: lastMember.realName,
        };

        const result = await updateMember(lastMember._id, data);

        expect(result).to.be.true;
      });

      it('should throw error for duplicate username', async () => {
        let data = {
          username: chance.last(),
          password: chance.string({ lenght: 5 }),
          realName: chance.name(),
        };

        const members = await listMembers();

        const firstMember = R.last(members);
        const lastMember = R.last(members);

        data = {
          username: firstMember.username,
          password: lastMember.password,
          realName: lastMember.realName,
        };

        await expect(updateMember(lastMember._id, data)).to.eventually.rejected;
      });
    });
  });

  describe('Delete Member', () => {
    it('should delete one vendor', async () => {
      const members = await listMembers();

      const lastMemberId = R.compose(R.prop('_id'), R.last)(members);

      const result = await deleteMember(lastMemberId);

      expect(result).to.be.true;
    });
  });
});