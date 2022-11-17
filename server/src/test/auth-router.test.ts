import axios, { Axios, AxiosResponse } from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

import app, { server } from '..';
import userService from '../services/user-service';
import { initTest } from '../utils/initdb'
import { strategy } from '../routers/auth-router';

import type { User } from '../models/User';
import type { UserProfile } from '../models/UserProfile';

const PORT = Number(process.env.PORT) || 3000;

const jar = new CookieJar();
export const axs = wrapper(axios.create({ jar }));

// Users for testing. 0 - normal user, 1 - admin user, 2 - invalid user
export const testUsers: User[] = [
    {"googleId": "29130921380099" , "name": "testUser", "email": "testuser@example.com", "picture": "image1.jpg", "isadmin": false, "likes": [], "shoppingList": []},
    {"googleId": "89327493284798" , "name": "testAdmin", "email": "testadmin@example.com", "picture": "image2.jpg", "isadmin": true, "likes": [], "shoppingList": []},
    {"googleId": "-1" , "name": "invalid user", "email": "", "picture": "", "isadmin": false, "likes": [], "shoppingList": []}, // Automatically fails login because of the special googleId
]

export const testUserProfiles: UserProfile[] = testUsers.map(user =>
  ({
    id: user.googleId,
    displayName: user.name,
    emails: [{value: user.email}],
    photos: [{value: user.picture}]
  } as UserProfile)
);

axs.defaults.baseURL = `http://localhost:${PORT}/api/`;
axs.defaults.withCredentials = true;

beforeAll((done) => {
  // Clear the database
  initTest()
    // Register the admin user
    .then(() => userService.findOrCreate(testUserProfiles[1]))
    .then(() => userService.setAdmin(testUserProfiles[1].id, true))

    .then(() => done());
})

// Stop web server and close connection to MySQL server
afterAll((done) => {
  server.close()
  done()
});

export function loginUser(profile: UserProfile) {
  // Signs a user in, using the given profile
  return new Promise<AxiosResponse>((resolve, reject) => {
    strategy.setProfile(profile);
    axs.get('/auth/google/callback')
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

describe("Authenticate users", () => {

  test("GET /api/auth/profile without login (200 OK)", (done) => {
    jar.removeAllCookies();
    axs.get(`/auth/profile`).then((response) => {
        expect(response.status).toEqual(200);
        expect(response.data).toEqual(false);
        done();
    });
  });

  test("LOGIN: Register new test user", (done) => {
    jar.removeAllCookies();
    // Test a user that is not registered
    loginUser(testUserProfiles[0])
      .then((response) => {
        expect(response.status).toEqual(200);
        done();
    });
  });

  test("GET /api/auth/profile after login (200 OK)", (done) => {
    axs.get("/auth/profile").then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(testUsers[0]);
      done();
    });
  });

  test("LOGIN: Sign in with existing admin user", (done) => {
    jar.removeAllCookies();
    // Test an existing user and their admin status
    loginUser(testUserProfiles[1]).then(() => { 
      axs.get("/auth/profile").then((response) => {
        expect(response.status).toEqual(200);
        expect(response.data).toEqual(testUsers[1]);
        done();
      });
    });
  });

  test("LOGIN: Failed sign in invalid user (403)", (done) => {
    jar.removeAllCookies();
    // Test a user that is not registered, and is not allowed to sign in
    loginUser(testUserProfiles[2])
      .then(() => {
        // This state should not be reached
        done.fail("Should not be able to sign in with invalid user");
      })
    .catch((err) => {
      expect(err.response.status).toEqual(403);

      axs.get("/auth/profile").then((response) => {
        expect(response.status).toEqual(200);
        expect(response.data).toEqual(false);

        done();
      });
    });
  });

});