export * from './establishment.model';
export * from './nightlife.model';
export * from './notification.model';
export * from './reservation.model';
export * from './restaurant.model';
export * from './review.model';
export * from './stay.model';
export * from './user.model';

export const privateFields = ['__v', 'password', 'refreshToken', 'otp'];
export const privateUserFields = [
  ...privateFields,
  'dateOfBirth',
  'emailIsVerified',
  'favouriteProperties',
  'isSocial',
  'isPartner',
  'cancellationPolicy',
  'deletedAt',
  'createdAt',
  'updatedAt',
];
