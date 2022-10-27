import React from 'react';
import { Button, Container, Notification } from 'react-bulma-components'

type Message = {
    message: string;
    type: string;
};

interface AlertProps {
    messages: Message[];
    setMessages: (messages: Message[]) => void;
}

function Alerts(props: AlertProps) {
    return ( 
        <Container>
            {props.messages.map((message, index) => (
                <Notification
                    key={index}
                    color={message.type}
                    onClick={() => {
                        props.setMessages(props.messages.filter((_, i) => i !== index));
                    }}
                    className="mt-2"
                >
                    {message.message}
                    <Button remove />
                </Notification>
            ))}
        </Container>
    );

    function error(text: string): void {
        let message = { message: text, type: 'danger' };
        props.setMessages([...props.messages, message]);
        setTimeout(
            () => props.setMessages(props.messages.filter((_, i) => i !== props.messages.length - 1)),
            5000
        )
    }
};

export default Alerts;