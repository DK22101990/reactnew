import { useState, useEffect } from 'react';
import { Prompt } from 'react-router-dom';

const useUnsavedChangesWarning = (message = 'Wait, You have unsaved changes?') => {
    const [isDirty, setDirty] = useState(false);
    useEffect(() => {
        // Detecting browser closing
        window.onbeforeunload = isDirty ? () => isDirty && !!message : null;
        return () => {
            window.removeEventListener('beforeunload', () => { });
        };
    }, [isDirty, message]);

    const routerPrompt = <Prompt when={isDirty} message={message} />;
    const onDirty = () => setDirty(true);
    const onPristine = () => setDirty(false);

    return [routerPrompt, onDirty, onPristine];
};

export default useUnsavedChangesWarning;
