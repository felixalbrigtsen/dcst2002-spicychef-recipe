import React from 'react';
import { Button, Container, Notification } from 'react-bulma-components'

const ALERT_TIMEOUT = 5000;

type Message = {
  message: string;
  type: string;
};

const AlertContext = React.createContext({
  alerts: [] as Message[],
  appendAlert: (message: string, type: string) => {},
  removeAlert: (index: number) => {},
})

interface AlertProviderChildren {
  children: React.ReactNode | React.ReactNode[];
}

export const AlertProvider = ({ children }: AlertProviderChildren) => {
  const [alerts, setAlerts] = React.useState<Message[]>([]);

  const appendAlert = (message: string, type: string) => {
    console.log("Append alert: " + message);

    setAlerts([...alerts, { message, type }]);
    setTimeout(() => {
      removeAlert(0);
    }, ALERT_TIMEOUT);
  };

  const removeAlert = (index: number) => {
    setAlerts(alerts.filter((_, i) => i !== index));
  };

  return (
      <AlertContext.Provider 
        value={{ 
          alerts, 
          appendAlert, 
          removeAlert 
        }}>
      {children}
      </AlertContext.Provider>
      );
}

export const useAlert = () => React.useContext(AlertContext);

export const Alerts = () => {
  const { alerts, removeAlert } = useAlert();
  return ( 
      <Container>
      {alerts.map((alert, index) => (
          <Notification
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


export default AlertProvider
