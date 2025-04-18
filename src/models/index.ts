export * from './establishment.model';
export * from './nightlife.model';
export * from './notification.model';
export * from './reservation.model';
export * from './restaurant.model';
export * from './review.model';
export * from './stay.model';
export * from './user.model';
export * from './vtu.models';

export const privateFields = [
  '__v',
  'password',
  'refreshToken',
  'otp',
  'creditCardToken',
  'payReference',
  'recipientCode',
  'deletedAt',
];
export const privateUserFields = [
  ...privateFields,
  'dateOfBirth',
  'emailIsVerified',
  'favouriteProperties',
  'isSocial',
  'isPartner',
  'cancellationPolicy',
  'paymentAuth',
  'createdAt',
  'updatedAt',
];
export const privateEstablishmentFields = [...privateFields, 'emailIsVerified', 'createdAt', 'updatedAt'];
export const privatePartnerFields = [...privateUserFields, ...privateEstablishmentFields];
export const privatePaymentAuthFields = [
  'authorization_code',
  'channel',
  'signature',
  'reusable',
  'country_code',
  'account_name',
  'email',
  'amount',
];
export const privateReservationFields = [...privateFields, 'paymentAuth'];
export const privateVTUFields = [...privateFields, 'paymentAuth', 'user'];
