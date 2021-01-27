import { PromoQueries } from '@dataAccess/promos/promos';

export default function makeListPromos(promosDB: PromoQueries) {
  return async function listPromos(
    limit: number | null,
    cursor: string | null,
  ): Promise<any> {
    return promosDB.listPromos(limit, cursor);
  };
}
