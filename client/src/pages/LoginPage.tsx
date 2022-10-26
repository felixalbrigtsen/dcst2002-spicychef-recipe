import * as React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes,
  Link
} from 'react-router-dom';

import { Image, Container, Card } from 'react-bulma-components'
import Footer from '../components/Footer';

export default function LoginPage() {
    return (
        <Container>
          <Card className={'has-text-centered'}>
            <Card.Content>
                <Link to={'/api/auth/login'}>
                  <img alt="Google Login" src="/btn_google_signing_dark.png" />
                </Link>
            </Card.Content>
            <Card.Content>
              You need to log in to use the app. If you don't have an account, one will be created when you log in with Google. 
            </Card.Content>
          </Card>
        </Container>
    );
}