export default function makeSelectVendor(vendorsDB) {
  return async function selectVendor(_id: string): Promise<any> {
    const vendor = await vendorsDB.selectOneVendor(_id);

    const data = {
      message: 'Successfull..',
      vendor,
    };

    return data;
  };
}