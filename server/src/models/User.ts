/**
 * User
 * @alias User
 */
export type User = {
  googleId: number;
  name: string;
  email: string;
  picture: string;
  isadmin: boolean;
  /**
   * @type {Array.<number>}
   * @memberof User
   * @description List of liked recipe ids
   */
  likes?: number[];
  /**
   * @type {Array.<number>}
   * @memberof User
   * @description List of ingredient ids in users list
   */
  shoppingList?: number[];
};

