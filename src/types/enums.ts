export enum EntityType {
  USER = 'User',
  ESTABLISHMENT = 'Establishment',
}

export enum PropertyType {
  STAY = 'Stay',
  RESTAURANT = 'Restaurant',
  NIGHTLIFE = 'NightLife',
}

export enum StayType {
  HOTEL = 'Hotel',
  HOSTEL = 'Hostel',
  RESORT = 'Resort',
  APARTMENT = 'Apartment',
  BnB = 'BnB',
  OTHERS = 'Others',
}

export enum NightLifeType {
  CLUB = 'Club',
  BAR = 'Bar',
  LOUNGE = 'Lounge',
  ATTRACTION = 'Attraction',
  OTHER = 'Other',
}

export enum Status {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  INHOUSE = 'In House',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

export enum HotelRating {
  NO_RATING,
  ONE,
  TWO,
  THREE,
  FOUR,
  FIVE,
}

export enum Rating {
  ZERO,
  ONE,
  TWO,
  THREE,
  FOUR,
  FIVE,
  SIX,
  SEVEN,
  EIGHT,
  NINE,
  TEN,
}

export enum Parking {
  FREE = 'Free',
  PAID = 'Paid',
  NO = 'No',
}

export enum MaxDays {
  DEFAULT = 28,
  QUARTER = 45,
  HALF = 60,
  FULL = 90,
}

export enum PriceRange {
  BUDGET = 'Budget-friendly',
  MODERATE = 'Mid-range',
  FINE = 'Fine-dining',
}

export enum DayOfWeek {
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
  SATURDAY = 'Saturday',
  SUNDAY = 'Sunday',
}

export enum NotificationType {
  RESERVATION = 'Reservation',
  REVIEW = 'Review',
  VTU = 'VTU',
}

export enum ISPs {
  MTN = 'MTN',
  GLO = 'GLO',
  AIRTEL = 'AIRTEL',
  ETISALAT = '9MOBILE',
}

export enum VTUTransactionStatus {
  CREATED = 'Created',
  PROCESSING = 'Processing',
  LOCAL_PROCESSING = 'Local Processing',
  SUCCESSFUL = 'Successful',
  FAILED = 'Failed',
}

export enum VTUStatus {
  IN_PROGRESS = 'In Progress',
  SUCCESSFUL = 'Successful',
  FAILED = 'Failed',
}

export enum VTUType {
  AIRTIME = 'Airtime',
  DATA = 'Data',
}

export enum Reviewer {
  FAMILY = 'Family',
  COUPLE = 'Couple',
  SOLO = 'Solo traveler',
  BUSINESS = 'Business traveler',
  FRIENDS = 'Group of friends',
}
