// Notification helper for web notifications and in-app alerts
import { soundEngine } from './audio';

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export function sendLocalNotification(title: string, body: string, icon: string = '/pwa-icon.svg') {
  // Play alert chime
  soundEngine.playChime('break');

  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon,
        badge: icon,
        vibrate: [200, 100, 200],
      } as NotificationOptions);
    } catch {
      // Fallback
    }
  }
}
