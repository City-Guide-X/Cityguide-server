import { Stay } from '@models';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const summarizeProperty = async (property: Partial<Stay>) => {
  const stay: any = { ...property };
  delete stay.avatar;
  delete stay.images;
  stay.accommodation.forEach((a: any) => {
    delete a.images;
  });
  const res = await openai.chat.completions.create({
    messages: [
      { role: 'user', content: `Summarize the following property object in an essay format: ${JSON.stringify(stay)}` },
    ],
    model: 'gpt-4o-mini',
  });
  return res.choices[0].message.content;
};
