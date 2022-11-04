import pool from '../mysql-pool';
import { RowDataPacket } from 'mysql2';
import type { User } from '../models/User';

export class UserService {
  getUser(googleId: number): Promise<User> {
    return new Promise((resolve, reject) => {
      pool.query(`SELECT * FROM user WHERE user.googleId = ?`, [googleId],
        async (err, rows: RowDataPacket[]) => {
          if (err) {
            return reject(err);
          }
          const user = rows[0] as User;

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

  getLikes(googleId: number): Promise<number[]> {
    return new Promise((resolve, reject) => {
      pool.query(
        'SELECT * FROM user_like WHERE googleId = ?',
        [googleId],
        (err, rows: RowDataPacket[]) => {
          if (err) {
            return reject(err);
          }

          resolve(rows.map((row) => row.recipeId));
        });
    });
  }

  getShoppingList(googleId: number): Promise<number[]> {
    return new Promise((resolve, reject) => {
      pool.query(`SELECT * FROM list_ingredient WHERE googleId = ?`, [googleId], (err, rows: RowDataPacket[]) => {
        if (err) {
          return reject(err);
        }

        resolve(rows.map((row) => row.ingredientId));
      });
    });
  }

  createUser(user: User): Promise<User> {
    return new Promise((resolve, reject) => {
      pool.query(
        'INSERT INTO user SET ?',
        user,
        (err, result) => {
          if (err) {
            return reject(err);
          }

          resolve(user);
        });
    });
  }

  findOrCreate(profile: any): Promise<User> {
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

  setAdmin(googleId: number, isAdmin: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
      pool.query(
        'UPDATE user SET isadmin = ? WHERE googleId = ?',
        [isAdmin, googleId],
        (err, _result) => {
          if (err) {
            return reject(err);
          }
          return resolve();
        });
    });
  }

  deleteUser(googleId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      pool.query(
        'DELETE FROM user WHERE googleId = ?',
        [googleId],
        (err, result) => {
          if (err) {
            return reject(err);
          }

          resolve();
        });
    });
  }

  isAdmin(googleId: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      pool.query(
        'SELECT * FROM user WHERE googleId = ?',
        [googleId],
        (err, rows: RowDataPacket[]) => {
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
