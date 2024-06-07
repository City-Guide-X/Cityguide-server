import { privateFields } from '@models';
import { createNightLifeInput, deleteNightLifeInput, getNightLifeDetailInput, updateNightLifeInput } from '@schemas';
import { createNightLife, deleteNightLife, getNightLifeById, updateNightLife } from '@services';
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
  return res.status(200).json({ nightlife: omit(nightlife?.toJSON(), privateFields) });
});

export const updateNightLifeHandler = asyncWrapper(
  async (req: Request<updateNightLifeInput['params'], {}, updateNightLifeInput['body']>, res: Response) => {
    const { id } = res.locals.user;
    const {
      body,
      params: { nightLifeId },
    } = req;
    await updateNightLife(nightLifeId, id, body);
    return res.sendStatus(204);
  }
);

export const deleteNightLifeHandler = asyncWrapper(async (req: Request<deleteNightLifeInput>, res: Response) => {
  const { id } = res.locals.user;
  const { nightLifeId } = req.params;
  await deleteNightLife(nightLifeId, id);
  return res.sendStatus(204);
});
