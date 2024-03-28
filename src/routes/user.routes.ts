import {
  createUserHandler,
  getEstablishmentHandler,
  getEstablishmentsHandler,
  getUserProfileHandler,
  loginUserHandler,
  socialAuthHandler,
  updateUserHandler,
} from '@controllers';
import { requireAuth, validateSchema } from '@middlewares';
import {
  createUserSchema,
  getEstablishmentSchema,
  getEstablishmentsSchema,
  loginUserSchema,
  updateUserSchema,
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
router.use(requireAuth);
router.get('/profile', getUserProfileHandler);
router.patch('/update', validateSchema(updateUserSchema), updateUserHandler);
router.get('/establishments', validateSchema(getEstablishmentsSchema), getEstablishmentsHandler);
router.get('/establishment/:id', validateSchema(getEstablishmentSchema), getEstablishmentHandler);

export default router;
