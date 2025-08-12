import { SetMetadata } from '@nestjs/common';
import { USER_ROLES_ENUM } from '../../common/enums/user-roles.enum';

export const Roles = (...roles: USER_ROLES_ENUM[]) => SetMetadata('roles', roles);
