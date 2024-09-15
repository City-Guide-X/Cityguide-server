import { ICreateNightlife, ICreateRestaurant, ICreateStay } from '@types';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const summarizeProperty = async (property: ICreateStay) => {
  const stay = JSON.parse(JSON.stringify(property));
  delete stay.avatar;
  delete stay.images;
  stay.accommodation.forEach((a: any) => {
    delete a.images;
  });
  try {
    const res = await openai.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `Summarize the following property object in an essay format in at most 3 concise paragraphs: ${JSON.stringify(
            stay
          )}`,
        },
      ],
      model: 'gpt-4o-mini',
    });
    return res.choices[0].message.content || '';
  } catch (err) {
    return '';
  }
};

export const summarizeRestaurant = async (property: ICreateRestaurant) => {
  const restaurant = JSON.parse(JSON.stringify(property));
  delete restaurant.avatar;
  delete restaurant.images;
  restaurant.menu.forEach((a: any) => {
    delete a.imgUrl;
  });
  try {
    const res = await openai.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `Summarize the following property object in an essay format in at most 3 concise paragraphs: ${JSON.stringify(
            restaurant
          )}`,
        },
      ],
      model: 'gpt-4o-mini',
    });
    return res.choices[0].message.content || '';
  } catch (err) {
    return '';
  }
};

export const summarizeNightlife = async (property: ICreateNightlife) => {
  const nightlife = JSON.parse(JSON.stringify(property));
  delete nightlife.avatar;
  delete nightlife.images;
  try {
    const res = await openai.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `Summarize the following property object in an essay format in at most 3 concise paragraphs: ${JSON.stringify(
            nightlife
          )}`,
        },
      ],
      model: 'gpt-4o-mini',
    });
    return res.choices[0].message.content || '';
  } catch (err) {
    return '';
  }
};
