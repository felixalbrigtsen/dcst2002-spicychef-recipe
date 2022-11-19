import { strategy } from "../routers/auth-router";

import type { User } from "../models/User";
import type { UserProfile } from "../models/UserProfile";
import axios, { Axios, AxiosResponse } from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";

export const jar = new CookieJar();
export const axs = wrapper(axios.create({ jar }));

// Users for testing. 0 - normal user, 1 - admin user, 2 - invalid user
export const testUsers: User[] = [
  { googleId: "29130921380099", name: "testUser", email: "testuser@example.com", picture: "image1.jpg", isadmin: false, likes: [], shoppingList: [] },
  { googleId: "89327493284798", name: "testAdmin", email: "testadmin@example.com", picture: "image2.jpg", isadmin: true, likes: [], shoppingList: [] },
  { googleId: "-1", name: "invalid user", email: "", picture: "", isadmin: false, likes: [], shoppingList: [] }, // Automatically fails login because of the special googleId
];

export const testUserProfiles: UserProfile[] = testUsers.map(
  (user) =>
    ({
      id: user.googleId,
      displayName: user.name,
      emails: [{ value: user.email }],
      photos: [{ value: user.picture }],
    } as UserProfile)
);

export function loginUser(profile: UserProfile) {
  // Signs a user in, using the given profile
  return new Promise<AxiosResponse>((resolve, reject) => {
    strategy.setProfile(profile);
    axs
      .get("/auth/google/callback")
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
