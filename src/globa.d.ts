import { WithId } from 'mongodb';
import { SimpleUser } from './types/auth.types'

declare global {
    namespace Express {
      export interface Request {
        user?: WithId<SimpleUser> | null;
      }
    }
}
