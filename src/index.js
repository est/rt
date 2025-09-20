// worker.js
export default {
  async fetch(req, env) {
    if (req.method !== "POST") return new Response("only POST", { status: 405 });
    const { sdp } = await req.json();

    // 1. Create connection in Cloudflare Realtime
    const resp = await fetch(`https://api.cloudflare.com/client/v4/accounts/${env.ACCOUNT_ID}/realtime/connections`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.CF_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sdp }),
    });
    const data = await resp.json();

    const answer = data.result.answer.sdp;
    const connId = data.result.id;

    // 2. Immediately send "hello" into the default DataChannel
    // (Cloudflare Realtime delivers this once the browser's channel is open)
    await fetch(`https://api.cloudflare.com/client/v4/accounts/${env.ACCOUNT_ID}/realtime/connections/${connId}/datachannels`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.CF_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        label: "chat",      // must match DataChannel label in browser
        data: "hello",      // message payload
      }),
    });

    return new Response(JSON.stringify({ sdp: answer }), {
      headers: { "Content-Type": "application/json" },
    });
  },
};