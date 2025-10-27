import { getServerSession } from '#auth';

const channels = new Map<string, Set<any>>();

const broadcast = (userId: string, event: string, payload: unknown) => {
  const sockets = channels.get(userId);
  if (!sockets) return;
  for (const socket of sockets) {
    socket.send(JSON.stringify({ event, payload }));
  }
};

export const sendRealtimeEvent = broadcast;

export default defineWebSocketHandler({
  async open(peer) {
    // Type assertions for peer context
    const event = (peer as any).ctx?.event || (peer as any).event;
    const session = await getServerSession(event);
    const userId = (session?.user as any)?.id;
    if (!userId) {
      peer.close(4401, 'Unauthorized');
      return;
    }

    if (!channels.has(userId)) {
      channels.set(userId, new Set());
    }
    channels.get(userId)!.add(peer);
    peer.send(JSON.stringify({ event: 'connected' }));
  },
  close(peer) {
    for (const [userId, sockets] of channels.entries()) {
      sockets.delete(peer);
      if (!sockets.size) channels.delete(userId);
    }
  },
});
