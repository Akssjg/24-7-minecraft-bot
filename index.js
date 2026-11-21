const bedrock = require('bedrock-protocol');

let isReconnecting = false;

function scheduleReconnect() {
  if (isReconnecting) return;
  isReconnecting = true;
  console.log('Reconnecting in 15 seconds...');
  setTimeout(() => {
    isReconnecting = false;
    createBot();
  }, 15000);
}

function createBot() {
  const client = bedrock.createClient({
    host: 'blackestheads.mcsh.gg',
    port: 19132,
    username: 'AFK_Bedrock',
    offline: true
  });

  client.on('spawn', () => {
    console.log('Bedrock bot joined blackestheads.mcsh.gg:17242!');
  });

  client.on('respawn', (packet) => {
    if (packet.state === 1) {
      client.write('respawn', {
        position: packet.position,
        state: 2,
        runtime_entity_id: client.entityId
      });
      console.log('Bedrock bot respawned!');
    }
  });

  client.on('disconnect', (packet) => {
    console.log('Disconnected:', packet);
    scheduleReconnect();
  });

  client.on('error', (err) => {
    console.log('Client error:', err.message);
    scheduleReconnect();
  });
}

process.on('uncaughtException', (err) => {
  console.log('Uncaught exception:', err.message);
  scheduleReconnect();
});

process.on('unhandledRejection', (err) => {
  console.log('Unhandled rejection:', err);
});

createBot();
