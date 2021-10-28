import { Request, Response } from 'express';

import { GetLastThreeMessagesService } from '../services/GetLastThreeMessages.service';

export class GetLastThreeMessagesController {
  async handle(req: Request, res: Response) {
    const service = new GetLastThreeMessagesService();

    try {
      const result = await service.execute();

      return res.json(result);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  }
}