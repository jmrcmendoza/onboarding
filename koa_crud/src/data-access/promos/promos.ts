/* eslint-disable no-param-reassign */
import PromoModel, { PromoDocument } from '../../models/promo';

export type PromoQueries = {
  listPromos: () => Promise<PromoDocument>;
  selectOnePromo: (id: string) => Promise<PromoDocument>;
  createPromo: (document: PromoDocument) => Promise<boolean>;
  updatePromo: (id: string, document: PromoDocument) => Promise<boolean>;
  deletePromo: (id: string) => Promise<boolean>;
};

export default function ({
  promo,
}: {
  promo: typeof PromoModel;
}): PromoQueries {
  return Object.freeze({
    listPromos() {
      return promo.find({}).lean({ virtuals: true });
    },
    async selectOnePromo(id: string) {
      const result = await promo
        .findById(id, { password: 0 })
        .lean({ virtuals: true });

      return result;
    },
    async createPromo(promoInfo: PromoDocument) {
      const result = await promo.create(promoInfo);

      return !!result;
    },
    async updatePromo(id: string, promoInfo: PromoDocument) {
      const result = await promo.findByIdAndUpdate(id, promoInfo, {
        useFindAndModify: false,
      });

      return !!result;
    },
    async deletePromo(id: string) {
      const result = await promo.findByIdAndDelete(id);

      return !!result;
    },
  });
}