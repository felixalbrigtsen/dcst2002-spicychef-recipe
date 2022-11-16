/**
 * UserProfile for Passport authentication
 * @alias UserProfile
 */
export type UserProfile = {
  id: number;
  displayName: string;
  emails: { value: string }[];
  photos: { value: string }[];
  _json?: any
};
