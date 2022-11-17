import pool from '../mysql-pool';
import { RowDataPacket, QueryError } from 'mysql2';
import type { User } from '../models/User';
import type { UserProfile } from '../models/UserProfile';

export class UserService {
  getUser(googleId: string): Promise<User> {
    return new Promise((resolve, reject) => {
      pool.query(`SELECT * FROM user WHERE user.googleId = ?`, [googleId],
        async (err: QueryError | null | null, results: RowDataPacket[]) => {
          if (err) {
            return reject(err);
          }
          const user = results[0] as User;

          if (user) {
            user.isadmin = user.isadmin;
            user.likes = await this.getLikes(googleId);
            user.shoppingList = await this.getShoppingList(googleId);
            return resolve(user);
          }

          reject(new Error('User not found'));
        });
    });
  }

  getLikes(googleId: string): Promise<number[]> {
    return new Promise((resolve, reject) => {
      pool.query(
        'SELECT * FROM user_like WHERE googleId = ?',
        [googleId],
        (err: QueryError | null | null, results: RowDataPacket[]) => {
          if (err) {
            return reject(err);
          }

          resolve(results.map((row) => row.recipeId));
        });
    });
  }

  getShoppingList(googleId: string): Promise<number[]> {
    return new Promise((resolve, reject) => {
      pool.query(`SELECT * FROM list_ingredient WHERE googleId = ?`, [googleId], (err: QueryError | null | null, results: RowDataPacket[]) => {
        if (err) {
          return reject(err);
        }

        resolve(results.map((row) => row.ingredientId));
      });
    });
  }

  createUser(user: User): Promise<User> {
    return new Promise((resolve, reject) => {
      pool.query(
        'INSERT INTO user SET ?',
        user,
        (err: QueryError | null | null, _results: RowDataPacket[]) => {
          if (err) {
            return reject(err);
          }

          resolve(user);
        });
    });
  }

  findOrCreate(profile: UserProfile): Promise<User> {
    return new Promise((resolve, reject) => {
      this.getUser(profile.id)
        .then(user => resolve(user))
        .catch(err => {
          if (err.message === 'User not found') {
            const newUser = {
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
              picture: profile.photos[0].value,
              isadmin: false,
            } as User;
            
            this.createUser(newUser)
              .then(user => resolve(user))
              .catch(err => reject(err));

          } else {
            reject(err);
          }
        });
    });
  }

  setAdmin(googleId: string, isAdmin: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
      pool.query(
        'UPDATE user SET isadmin = ? WHERE googleId = ?',
        [isAdmin, googleId],
        (err: QueryError | null, _result: RowDataPacket[]) => {
          if (err) {
            return reject(err);
          }
          return resolve();
        });
    });
  }

  deleteUser(googleId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      pool.query(
        'DELETE FROM user WHERE googleId = ?',
        [googleId],
        (err: QueryError | null, result: RowDataPacket[]) => {
          if (err) {
            return reject(err);
          }

          resolve();
        });
    });
  }

  isAdmin(googleId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      pool.query(
        'SELECT * FROM user WHERE googleId = ?',
        [googleId],
        (err: QueryError | null | null, rows: RowDataPacket[]) => {
          if (err) {
            return reject(err);
          }
          const user = rows[0] as User;

          if (user) {
            return resolve(user.isadmin);
          }

          reject(new Error('User not found'));
        });
    });
  }

}

const userService = new UserService();
export default userService;
