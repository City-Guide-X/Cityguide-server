import { DocumentType, getModelForClass, index, modelOptions, pre, prop, Severity } from '@typegoose/typegoose';
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

  @prop()
  description: string;

  @prop({ required: true, unique: true })
  phoneNumber!: string;

  @prop({ lowercase: true, required: true, unique: true })
  email!: string;

  @prop({ required: true })
  password!: string;

  @prop()
  refreshToken?: string;

  @prop({ default: false })
  emailIsVerified: boolean;

  @prop({ default: verifyCode })
  otp: number;

  @prop({ default: 0.0 })
  rating: number;

  @prop({ default: null })
  imgUrl: string | null;

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
