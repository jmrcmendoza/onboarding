import { Connection, paginate } from '@helpers/pagination';
import VendorModel, { VendorDocument } from '@models/vendor';
import { _FilterQuery } from 'mongoose';

export type VendorQueries = {
  listVendors: (
    limit: number | null,
    cursor: string | null,
    filter: string | null,
  ) => Promise<Connection<Record<string, any>>>;
  selectOneVendor: (id: string) => Promise<VendorDocument>;
  createVendor: (document: VendorDocument) => Promise<boolean>;
  updateVendor: (id: string, document: VendorDocument) => Promise<boolean>;
  deleteVendor: (id: string) => Promise<boolean>;
};

export default function ({
  vendors,
}: {
  vendors: typeof VendorModel;
}): VendorQueries {
  return Object.freeze({
    listVendors(
      limit: number | null,
      cursor: string | null,
      filter: string | null,
    ) {
      const filters: _FilterQuery<any> = filter
        ? { $or: [{ name: filter }, { type: filter }] }
        : {};

      return paginate(vendors, limit, cursor, null, filters);
    },
    selectOneVendor(id: string) {
      return vendors.findById(id).lean({ virtuals: true });
    },
    async createVendor(vendorInfo: VendorDocument) {
      const result = await vendors.create(vendorInfo);

      return !!result;
    },
    async updateVendor(id: string, vendorInfo: VendorDocument) {
      const result = await vendors.findByIdAndUpdate(id, vendorInfo, {
        useFindAndModify: false,
      });

      return !!result;
    },
    async deleteVendor(id: string) {
      const result = await vendors.findByIdAndDelete(id);

      return !!result;
    },
  });
}
