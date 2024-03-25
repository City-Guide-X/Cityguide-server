import { createUserHandler, loginUserHandler, socialAuthHandler } from '@controllers';
import { validateSchema } from '@middlewares';
import { createUserSchema, loginUserSchema } from '@schemas';
import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.post('/signup', validateSchema(createUserSchema), createUserHandler);
router.post('/login', validateSchema(loginUserSchema), loginUserHandler);
router.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/login/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/login/google/callback', passport.authenticate('google', { session: false }), socialAuthHandler);
router.get('/login/facebook/callback', passport.authenticate('facebook', { session: false }), socialAuthHandler);

export default router;
