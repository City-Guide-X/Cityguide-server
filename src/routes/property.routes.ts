import { Router } from 'express';
import nightlifeRouter from './nightlife.routes';
import restaurantRouter from './restaurant.routes';
import stayRouter from './stay.routes';

const router = Router();

router.use('/stay', stayRouter);
router.use('/restaurant', restaurantRouter);
router.use('/nightlife', nightlifeRouter);

export default router;
