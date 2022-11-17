import React from "react";
import { Button, Container, Notification } from "react-bulma-components";
import { useAlert } from "../hooks/Alert";
import "../styles/alert.css";

export const Alerts = () => {
  const { alerts, removeAlert } = useAlert();
  return (
    <Container className="alert-container">
      {alerts.map((alert, index) => (
        <Notification
          key={index}
          color={alert.type}
          onClick={() => {
            removeAlert(index);
          }}
          className="alert-animation"
        >
          {alert.message}
          <Button remove />
        </Notification>
      ))}
    </Container>
  );
};
