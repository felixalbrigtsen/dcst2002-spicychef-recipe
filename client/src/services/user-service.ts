/* istanbul ignore file */

import axios from "axios";
import type { User } from "../models/User";

/**
 * @module
 * @name userService
 * @description
 * This module is a service for users from recipe.feal.no/api
 */

class UserService {
  /**
   * @function
   * @memberof userService
   * @name getSessionUser
   * @returns {Promise<User>}
   * @description
   * Fetch the current user in the active session
   */
  getSessionUser(): Promise<User> {
    return new Promise((resolve, reject) => {
      axios
        .get(process.env.REACT_APP_API_URL + "/auth/profile")
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

const userService = new UserService();
export default userService;
