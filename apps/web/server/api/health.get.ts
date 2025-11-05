export default defineEventHandler(() => {
  return {
    ok: true,
    timestamp: new Date().toISOString(),
    message: 'Server API is working',
  };
});
