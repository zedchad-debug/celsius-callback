const https = require("https");
exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Allow-Methods": "POST" }, body: "" };
  const body = JSON.parse(event.body);
  const apiKey = process.env.OPENAI_API_KEY;
  const messages = body.system ? [{ role: "system", content: body.system }, ...body.messages] : body.messages;
  const payload = JSON.stringify({ model: "gpt-4o", max_tokens: 800, messages });
  return new Promise((resolve) => {
    const req = https.request({ hostname: "api.openai.com", path: "/v1/chat/completions", method: "POST", headers: { "Content-Type": "application/json", "Authorization": "Bearer " + apiKey } }, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => resolve({ statusCode: 200, headers: { "Access-Control-Allow-Origin": "*" }, body: data }));
    });
    req.on("error", (e) => resolve({ statusCode: 500, body: e.message }));
    req.write(payload);
    req.end();
  });
};