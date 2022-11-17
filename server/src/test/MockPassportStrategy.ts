import passport from 'passport';
import express from 'express';
import { UserProfile } from '../models/UserProfile';
import { User } from '../models/User';

class MockPassportStrategy extends passport.Strategy {
    profile: UserProfile;
    name: string = "google";

    verify: (req: express.Request, _accessToken: any, _refreshToken: any, profile: UserProfile, done: ()=>void ) => void;

    constructor(_googleSettings: object, verify: (req: express.Request, _accessToken: any, _refreshToken: any, profile: UserProfile, done: ()=>void ) => void) {
        super();
        this.verify = verify;
        this.profile = {
            id: -1,
            displayName: "Invalid User",
            emails: [{ value: ""}],
            photos: [{ value: ""}]
        } as UserProfile;
    }

    public authenticate(req: express.Request, _options: object) {
        console.log("AUTHENTICATING");
        // Profile id -1 represents a failed login
        // All other profiles are automatically logged in
        if (this.profile.id === -1) {
            this.fail();
            return;
        }
        this.verify(req, null, null, this.profile, ()=>{console.log("MockAuth done"); console.log(req.session.user); req.session.user && this.success(req.session.user);});
    }

    // Use this method in tests to set the profile id to a valid user
    public setProfile(profile: UserProfile) {
        this.profile = profile;
    }
}

export default MockPassportStrategy;