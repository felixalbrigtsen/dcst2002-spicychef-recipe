import * as React from 'react';

import { Modal, Button } from 'react-bulma-components';
import { useState, useEffect } from 'react';

interface ConfirmationDialogueProps {
    active: boolean;
}

function ConfirmationDialogue (props: ConfirmationDialogueProps) {

    let [ active, setActive ] = React.useState<boolean>(props.active);

    return (
        <Modal show={props.active} onClose={() => {}}>
            <Modal.Card>
                <Modal.Card.Header>
                    <Modal.Card.Title>Do you really want to delete this recipe?</Modal.Card.Title>
                </Modal.Card.Header>
                <Modal.Card.Footer>
                    <Button color="danger" onClick={() => console.log(active)}>Yes, Delete</Button>
                    <Button onClick={() => setActive(!active)}>Cancel</Button>
                </Modal.Card.Footer>
            </Modal.Card>
        </Modal>
    );
}

export default ConfirmationDialogue;