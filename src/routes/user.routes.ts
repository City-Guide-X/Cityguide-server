import {
  addFavouritePropertyHandler,
  createUserHandler,
  getUserProfileHandler,
  loginUserHandler,
  removeFavouritePropertyHandler,
  socialAuthHandler,
  updateUserHandler,
  upgradeUserToPartnerHandler,
} from '@controllers';
import { requireAuth, userOnly, validateSchema } from '@middlewares';
import {
  addFavouritePropertySchema,
  createUserSchema,
  loginUserSchema,
  removeFavouritePropertySchema,
  updateUserSchema,
  upgradeUserToPartnerSchema,
} from '@schemas';
import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.post('/signup', validateSchema(createUserSchema), createUserHandler);
router.post('/login', validateSchema(loginUserSchema), loginUserHandler);
router.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/login/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/login/google/callback', passport.authenticate('google', { session: false }), socialAuthHandler);
router.get('/login/facebook/callback', passport.authenticate('facebook', { session: false }), socialAuthHandler);
router.use(requireAuth, userOnly);
router.get('/profile', getUserProfileHandler);
router.patch('/update', validateSchema(updateUserSchema), updateUserHandler);
router.patch('/favproperty/add', validateSchema(addFavouritePropertySchema), addFavouritePropertyHandler);
router.patch('/favproperty/remove', validateSchema(removeFavouritePropertySchema), removeFavouritePropertyHandler);
router.patch('/upgrade-to-partner', validateSchema(upgradeUserToPartnerSchema), upgradeUserToPartnerHandler);

export default router;
