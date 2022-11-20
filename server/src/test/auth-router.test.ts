import app, { server } from "..";
import pool from "../mysql-pool";
import userService from "../services/user-service";
import { initTest } from "../utils/initdb";
import { axs, jar } from "./mock-utils";
import { testUsers, testUserProfiles } from "./mock-utils";
import { loginUser } from "./mock-utils";

const PORT = Number(process.env.PORT) || 3000;

axs.defaults.baseURL = `http://localhost:${PORT}/api/`;
axs.defaults.withCredentials = true;

beforeAll((done) => {
  // Clear the database
  initTest()
    // Register the admin user
    .then(() => userService.findOrCreate(testUserProfiles[1]))
    .then(() => userService.setAdmin(testUserProfiles[1].id, true))

    .then(() => done());
});

// Stop web server and close connection to MySQL server
afterAll((done) => {
  server.close();
  pool.end();
  done();
});

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
    loginUser(testUserProfiles[0]).then((response) => {
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
