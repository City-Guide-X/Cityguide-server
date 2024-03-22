import {
  DocumentType,
  getModelForClass,
  index,
  modelOptions,
  pre,
  prop,
  Ref,
  Severity,
} from '@typegoose/typegoose';
import { verifyCode } from '@utils';
import bcrypt from 'bcrypt';
import { Establishment } from './establishment.model';

@pre<User>('save', async function () {
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
export class User {
  @prop({ required: true })
  firstName!: string;

  @prop({ required: true })
  lastName!: string;

  @prop()
  dateOfBirth: Date;

  @prop({ required: true, unique: true })
  phoneNumber!: string;

  @prop({ lowercase: true, required: true, unique: true })
  email!: string;

  @prop({ required: true })
  password!: string;

  @prop()
  refreshToken?: string;

  @prop({ default: false })
  phoneIsVerified: boolean;

  @prop({ default: false })
  emailIsVerified: boolean;

  @prop({ default: verifyCode })
  otp: number;

  @prop({ default: null })
  imgUrl: string | null;

  @prop({ default: [], ref: () => Establishment })
  favouriteEstablishments: Ref<Establishment>[];

  async validatePassword(this: DocumentType<User>, password: string) {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (err) {
      return false;
    }
  }

  public createdAt: Date;
  public updatedAt: Date;
}

export const UserModel = getModelForClass(User);
