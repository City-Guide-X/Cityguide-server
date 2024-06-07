import { NotFoundError } from '@errors';
import { privateFields } from '@models';
import { createNightLifeInput, getNightLifeDetailInput, updateNightLifeInput } from '@schemas';
import { createNightLife, getNightLifeById, updateNightLife } from '@services';
import { asyncWrapper } from '@utils';
import { Request, Response } from 'express';
import { omit } from 'lodash';

export const createNightLifeHandler = asyncWrapper(
  async (req: Request<{}, {}, createNightLifeInput>, res: Response) => {
    const { id } = res.locals.user;
    const data = { ...req.body, establishment: id };
    const nightlife = await createNightLife(data);
    return res.status(201).json({ nightlife: omit(nightlife.toJSON(), privateFields) });
  }
);

export const getNightLifeDetailHandler = asyncWrapper(async (req: Request<getNightLifeDetailInput>, res: Response) => {
  const { nightLifeId } = req.params;
  const nightlife = await getNightLifeById(nightLifeId);
  if (!nightlife) throw new NotFoundError('NightLife not found');
  return res.status(200).json({ nightlife: omit(nightlife.toJSON(), privateFields) });
});

export const updateNightLifeHandler = asyncWrapper(
  async (req: Request<updateNightLifeInput['params'], {}, updateNightLifeInput['body']>, res: Response) => {
    const { id } = res.locals.user;
    const {
      body,
      params: { nightLifeId },
    } = req;
    const nightlife = await updateNightLife(nightLifeId, id, body);
    if (!nightlife) throw new NotFoundError('NightLife not found');
    return res.sendStatus(204);
  }
);
