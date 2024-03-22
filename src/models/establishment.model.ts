import {
  DocumentType,
  getModelForClass,
  index,
  modelOptions,
  pre,
  prop,
  Severity,
} from '@typegoose/typegoose';
import { EstablishmentType, IAddress, IAvailability, IRoomMenu } from '@types';
import { verifyCode } from '@utils';
import bcrypt from 'bcrypt';

@pre<Establishment>('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
  return;
})
@modelOptions({
  schemaOptions: { timestamps: true },
  options: { allowMixed: Severity.ALLOW },
})
@index(
  { createdAt: -1 },
  {
    expireAfterSeconds: 3600,
    partialFilterExpression: { emailIsVerified: false },
  }
)
export class Establishment {
  @prop({ required: true })
  name!: string;

  @prop({ required: true })
  description!: string;

  @prop({ required: true, _id: false })
  address!: IAddress;

  @prop({ required: true, unique: true })
  phoneNumber!: string;

  @prop({ lowercase: true, required: true, unique: true })
  email!: string;

  @prop({ required: true, select: false })
  password!: string;

  @prop({ select: false })
  refreshToken?: string;

  @prop({ default: false })
  phoneIsVerified: boolean;

  @prop({ default: false })
  emailIsVerified: boolean;

  @prop({ default: verifyCode, select: false })
  otp: number;

  @prop({ enum: EstablishmentType, required: true, type: String })
  type: EstablishmentType;

  @prop({ default: 0.0 })
  rating: number;

  @prop({ _id: false, default: null })
  availability: IAvailability[] | null;

  @prop({ default: null })
  imgUrl: string | null;

  @prop({ default: null, _id: false })
  menu: IRoomMenu[] | null;

  @prop({ default: null })
  deliveryFee: number | null;

  @prop({ default: null })
  facilities: string[] | null;

  @prop({ default: null, _id: false })
  rooms: IRoomMenu[] | null;

  @prop({ default: null })
  price: number | null;

  @prop({ select: false })
  __v?: number;

  async validatePassword(this: DocumentType<Establishment>, password: string) {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (err) {
      return false;
    }
  }

  public createdAt: Date;
  public updatedAt: Date;
}

export const EstablishmentModel = getModelForClass(Establishment);
