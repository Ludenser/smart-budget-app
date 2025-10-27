import { useRuntimeConfig } from '#imports';

type EventPayload = {
  event: string;
  payload: unknown;
};

const sockets = new Map<string, WebSocket>();

export const useRealtime = () => {
  const { status } = useAuth();
  const listeners = useState<Record<string, Set<(payload: unknown) => void>>>(
    'rt-listeners',
    () => ({})
  );

  const subscribe = (event: string, handler: (payload: unknown) => void) => {
    if (!listeners.value[event]) listeners.value[event] = new Set();
    listeners.value[event].add(handler);
  };

  const unsubscribe = (event: string, handler: (payload: unknown) => void) => {
    listeners.value[event]?.delete(handler);
  };

  const connect = () => {
    if (process.server || status.value !== 'authenticated') return;
    if (sockets.has('primary')) return;

    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const url = `${protocol}://${window.location.host}/api/rt`;
    const socket = new WebSocket(url);
    socket.onmessage = (message) => {
      try {
        const data = JSON.parse(message.data) as EventPayload;
        listeners.value[data.event]?.forEach((handler) => handler(data.payload));
      } catch (error) {
        console.warn('Realtime message parse error', error);
      }
    };
    socket.onclose = () => {
      sockets.delete('primary');
      setTimeout(connect, 2000);
    };
    sockets.set('primary', socket);
  };

  onMounted(connect);

  watch(
    () => status.value,
    (value) => {
      if (value === 'authenticated') connect();
    }
  );

  return { subscribe, unsubscribe };
};
