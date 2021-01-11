import { VendorDocument } from '../../models/vendor';

export default function listVendorsController({
  listVendors,
}: {
  listVendors: () => Promise<VendorDocument>;
}) {
  return async function getListVendors(): Promise<Record<string, any>> {
    try {
      const result = await listVendors();

      return {
        headers: {
          'Content-Type': 'application/json',
        },
        status: 200,
        body: result,
      };
    } catch (e) {
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        status: e.status ? e.status : 400,
        body: { errorMsg: e.message },
      };
    }
  };
}
