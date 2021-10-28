import { Request, Response } from 'express';

import { CreateMessageService } from '../services/CreateMessage.service';

export class CreateMessageController {
  async handle(req: Request, res: Response) {
    const { message } = req.body;
    const { user_id } = req;

    const service = new CreateMessageService();

    try {
      const result = await service.execute(message, user_id);

      return res.json(result);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  }
}