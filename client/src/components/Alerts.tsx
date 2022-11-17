import React from 'react';
import { Button, Container, Notification } from 'react-bulma-components'
import { useAlert } from '../hooks/Alert';


export const Alerts = () => {
  const { alerts, removeAlert } = useAlert();
  return ( 
      <Container>
      {alerts.map((alert, index) => (
          <Notification
            style={{animation: "fade 0.5s", WebkitAnimation: "fade 0.5s"}}
            key={index}
            color={alert.type}
            onClick={() => {
              removeAlert(index);
            }}
            className="mt-2"
          >
            {alert.message}
          <Button remove />
          </Notification>
      ))}
      </Container>
      );
}

