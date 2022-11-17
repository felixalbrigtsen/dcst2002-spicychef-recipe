/**
 * UserProfile for Passport authentication
 * @alias UserProfile
 */
export type UserProfile = {
  id: string;
  displayName: string;
  emails: { value: string }[];
  photos: { value: string }[];
  _json?: any
};
