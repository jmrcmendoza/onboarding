/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import Chance from 'chance';
import R from 'ramda';
import { PromoTemplate } from '../../../../src/models/promo';

const chance = new Chance();

chai.use(chaiHttp);

describe('Promos Graphql', function () {
  before(function () {
    this.request = () => chai.request('http://localhost:3000');
  });

  describe('Add Promo', () => {
    context('Given incorrect values', () => {
      it('should return error for empty name', async function () {
        const data = {
          query: `mutation { createPromo(input:{name: "", template: ${
            PromoTemplate.Deposit
          }, title: "${chance.word()}", description: "${chance.sentence()}", minimumBalance: ${chance.prime()} }) }`,
        };

        const result = await this.request().post('/graphql').send(data);

        expect(result.body).to.have.property('errors');

        const error = R.head(result.body.errors);

        expect(error.message).to.equal('Promo name must be provided.');
      });

      it('should return error for empty template', async function () {
        const data = {
          query: `mutation { createPromo(input:{name: "${chance.name()}",
           title: "${chance.word()}", description: "${chance.sentence()}", minimumBalance: ${chance.prime()} }) }`,
        };

        const result = await this.request().post('/graphql').send(data);

        expect(result.body).to.have.property('errors');
      });

      it('should return error for invalid template', async function () {
        const data = {
          query: `mutation { createPromo(input:{name: "${chance.name()}", template: "Test"
           title: "${chance.word()}", description: "${chance.sentence()}", minimumBalance: ${chance.prime()} }) }`,
        };

        const result = await this.request().post('/graphql').send(data);

        expect(result.body).to.have.property('errors');
      });

      it('should return error for empty title', async function () {
        const data = {
          query: `mutation { createPromo(input:{name: "${chance.name()}", template: ${
            PromoTemplate.Deposit
          }
           title: "", description: "${chance.sentence()}", minimumBalance: ${chance.prime()} }) }`,
        };

        const result = await this.request().post('/graphql').send(data);

        expect(result.body).to.have.property('errors');

        const error = R.head(result.body.errors);

        expect(error.message).to.equal('Promo title must be provided');
      });

      it('should return error for empty description', async function () {
        const data = {
          query: `mutation { createPromo(input:{name: "${chance.name()}", template: ${
            PromoTemplate.Deposit
          }
           title: "${chance.word()}", description: "", minimumBalance: ${chance.prime()} }) }`,
        };

        const result = await this.request().post('/graphql').send(data);

        expect(result.body).to.have.property('errors');

        const error = R.head(result.body.errors);

        expect(error.message).to.equal('Description must be provided.');
      });

      it('should return error for empty minimum balance given template is deposit', async function () {
        const data = {
          query: `mutation { createPromo(input:{name: "${chance.name()}", template: ${
            PromoTemplate.Deposit
          }
           title: "${chance.word()}", description: "${chance.sentence()}", minimumBalance: null }) }`,
        };

        const result = await this.request().post('/graphql').send(data);

        expect(result.body).to.have.property('errors');

        const error = R.head(result.body.errors);

        expect(error.message).to.equal('Minimum balance must be provided.');
      });

      it('should return error for empty promo fields given template is sign up', async function () {
        const data = {
          query: `mutation { createPromo(input:{name: "${chance.name()}", template: ${
            PromoTemplate.SignUp
          }
           title: "${chance.word()}", description: "${chance.sentence()}", requiredMemberFields: null }) }`,
        };

        const result = await this.request().post('/graphql').send(data);

        expect(result.body).to.have.property('errors');

        const error = R.head(result.body.errors);

        expect(error.message).to.equal('Members fields must be provided.');
      });

      it('should return error for invalid promo fields given template is sign up', async function () {
        const data = {
          query: `mutation { createPromo(input:{name: "${chance.name()}", template: ${
            PromoTemplate.SignUp
          }
           title: "${chance.word()}", description: "${chance.sentence()}", requiredMemberFields: [ "Test" ] }) }`,
        };

        const result = await this.request().post('/graphql').send(data);

        expect(result.body).to.have.property('errors');

        const error = R.head(result.body.errors);

        expect(error.message).to.equal('Test is an invalid field.');
      });

      it('should return error for invalid status', async function () {
        const data = {
          query: `mutation { createPromo(input:{name: "${chance.name()}", template: ${
            PromoTemplate.SignUp
          }
           title: "${chance.word()}", description: "${chance.sentence()}", requiredMemberFields: [ "REAL_NAME" ], status: "Test"}) }`,
        };

        const result = await this.request().post('/graphql').send(data);

        expect(result.body).to.have.property('errors');
      });
    });

    context('Given correct values', () => {
      it('should insert promo', async function () {
        const data = {
          query: `mutation { createPromo(input:{name: "${chance.name()}", template: ${
            PromoTemplate.Deposit
          }, title: "${chance.word()}", description: "${chance.sentence()}", minimumBalance: ${chance.prime()} }) }`,
        };

        const result = await this.request().post('/graphql').send(data);

        expect(result.body.data.createPromo).to.be.true;
      });
    });
  });

  describe('List Promos', () => {
    it('should return all promos', async function () {
      const data = {
        query: `{ promos { 
          id
          name
          template
          title
          description
          ...on SignUpPromo {
            requiredMemberFields
         }    
          ...on DepositPromo{
            minimumBalance
          }
          status  } }`,
      };

      const response = await this.request().post('/graphql').send(data);

      expect(response.body.data).to.exist;
      expect(response.body.data.promos)
        .to.be.an('array')
        .that.has.length.greaterThan(0);
    });

    it('should return one promo', async function () {
      let data = {
        query: `{ promos { 
          id
          name
          template
          title
          description
          status  
        }
      }`,
      };

      const promos = await this.request().post('/graphql').send(data);

      const lastPromoId = R.compose(
        R.prop('id'),
        R.last,
      )(promos.body.data.promos);

      data = {
        query: `{ promo(id:"${lastPromoId}") {   
          id
          name
          template
          title
          description
          ...on SignUpPromo {
            requiredMemberFields
         }    
          ...on DepositPromo{
            minimumBalance
          }
          status  
        }
       }`,
      };

      const response = await this.request().post('/graphql').send(data);

      expect(response.body.data.promo).to.exist;
      expect(response.body.data.promo).to.be.an('object');
    });
  });
});
