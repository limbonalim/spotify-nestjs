import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';

export const PermitGard = (...roles: string[]): Type<CanActivate> => {
  class PermitAuthGuard implements CanActivate {
    constructor(
      @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();

      const headerValue = request.get('Authorization');

      if (!headerValue) {
        return false;
      }

      const [_, token] = headerValue.split(' ');

      if (!token) {
        return false;
      }

      const user = await this.userModel.findOne({ token });

      if (!user) {
        return false;
      }

      return !!roles.includes(user.role);
    }
  }
  return mixin(PermitAuthGuard);
};
