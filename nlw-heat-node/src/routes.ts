import { Router } from 'express';

import { AuthenticateUserController } from './controllers/AuthenticateUser.controller';
import { CreateMessageController } from './controllers/CreateMessage.controller';
import { GetLastThreeMessagesController } from './controllers/GetLastThreeMessages.controller';
import { ProfileUserController } from './controllers/ProfileUser.controller';
import { ensureAuth } from './middleware/ensureAuth';

export const router = Router();

const authUserController = new AuthenticateUserController();
const createMessageController = new CreateMessageController();
const getLastController = new GetLastThreeMessagesController();
const profileUserController = new ProfileUserController();

router.post('/authenticate', authUserController.handle);
router.get('/messages/lasts', getLastController.handle);
router.use(ensureAuth);
router.post('/messages', createMessageController.handle);
router.get('/profile', profileUserController.handle);