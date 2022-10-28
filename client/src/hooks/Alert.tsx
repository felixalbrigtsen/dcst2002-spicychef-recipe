import React from 'react';
import type { AlertMessage } from '../models/AlertMessage';

const ALERT_TIMEOUT = 5000;

const AlertContext = React.createContext({
  alerts: [] as AlertMessage[],
  appendAlert: (message: string, type: string) => {},
  removeAlert: (index: number) => {},
})

interface AlertProviderChildren {
  children: React.ReactNode | React.ReactNode[];
}

export const AlertProvider = ({ children }: AlertProviderChildren) => {
  const [alerts, setAlerts] = React.useState<AlertMessage[]>([]);

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
export default AlertProvider
