import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';

export function useNotifications() {
    const { state, dispatch } = useApp();
    const [permission, setPermission] = useState<NotificationPermission>('default');

    useEffect(() => {
        if ('Notification' in window) {
            setPermission(Notification.permission);
        }
    }, []);

    const requestPermission = async () => {
        if (!('Notification' in window)) {
            alert('This browser does not support desktop notifications.');
            return false;
        }

        try {
            const result = await Notification.requestPermission();
            setPermission(result);

            if (result === 'granted') {
                dispatch({ type: 'UPDATE_SETTINGS', payload: { dailyReminders: true } });

                // Show a test notification to prove it works
                new Notification('🐼 Kaori-Panda', {
                    body: "It's time to practice Japanese! 🗣️",
                    icon: '/vite.svg',
                });
                return true;
            } else {
                dispatch({ type: 'UPDATE_SETTINGS', payload: { dailyReminders: false } });
                return false;
            }
        } catch (err) {
            console.error('Failed to request notification permission', err);
            return false;
        }
    };

    const toggleReminders = async (enabled: boolean) => {
        if (enabled && permission !== 'granted') {
            await requestPermission();
        } else {
            // Just save the preference
            dispatch({ type: 'UPDATE_SETTINGS', payload: { dailyReminders: enabled } });
        }
    };

    return {
        permission,
        isRemindersEnabled: !!state.settings.dailyReminders,
        toggleReminders,
    };
}
