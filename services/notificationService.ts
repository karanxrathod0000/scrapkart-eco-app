// services/notificationService.ts

type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

const emitter = {
  events: {} as Record<string, Function[]>,
  dispatch(event: string, data: any) {
    if (!this.events[event]) return;
    this.events[event].forEach(callback => callback(data));
  },
  subscribe(event: string, callback: Function) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
    return () => {
        this.events[event] = this.events[event].filter(cb => cb !== callback);
    };
  },
};

let toastIdCounter = 0;

const notificationService = {
  // --- In-App Toast Notifications ---
  showToast(message: string, type: ToastType = 'info'): void {
    emitter.dispatch('addtoast', {
      id: toastIdCounter++,
      message,
      type,
    });
  },

  onToast(callback: (toast: ToastMessage) => void): () => void {
    return emitter.subscribe('addtoast', callback);
  },
  
  // --- Browser Push Notifications ---
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.error('This browser does not support desktop notification');
      return 'denied';
    }
    return Notification.requestPermission();
  },

  showSystemNotification(title: string, options?: NotificationOptions): void {
    if (Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(title, options);
      });
    } else if (Notification.permission !== 'denied') {
      this.requestPermission().then(permission => {
        if (permission === 'granted') {
           navigator.serviceWorker.ready.then(registration => {
                registration.showNotification(title, options);
           });
        }
      });
    }
  },
};

export default notificationService;
