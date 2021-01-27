import Router from 'koa-router';

import {
  getPromos,
  getOnePromo,
  postPromo,
  putPromo,
  delPromo,
} from '@Controllers/promos';

import { serialize } from '@Serialize';

const router = new Router();

router.get('/api/promos', serialize(getPromos));
router.get('/api/promos/:id', serialize(getOnePromo));
router.post('/api/promos/', serialize(postPromo));
router.put('/api/promos/:id', serialize(putPromo));
router.delete('/api/promos/:id', serialize(delPromo));

export default router;
