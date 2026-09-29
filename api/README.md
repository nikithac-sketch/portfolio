# 🚀 GPT-6 Astra Integration

A production-ready, zero-dependency Python API client and lightweight local server for **OpenAI's GPT-6 Astra** frontier model.

---

## 📁 Files Included

| File | Purpose |
|------|---------|
| `gpt6_astra.py` | Core Python client (standard library only, zero pip dependencies). Supports chat completions, real-time streaming, and tool calls. |
| `server.py` | Local HTTP backend with CORS and SSE support to query GPT-6 Astra from web browsers, portfolio widgets, or local apps. |
| `test_client.py` | CLI test runner to send test prompts and stream output from your terminal. |
| `.env.example` | Environment configuration template for API keys and endpoints. |

---

## ⚡ Quick Start

### 1. Configure Your API Key
Copy the template and set your OpenAI API Key:

```bash
cp api/.env.example api/.env
```

Edit `api/.env`:
```env
OPENAI_API_KEY=sk-...your-key...
OPENAI_MODEL=gpt-6-astra
```

Alternatively, export it directly in your shell:
```bash
export OPENAI_API_KEY="your-key-here"
```

---

### 2. Run the CLI Test Script

Send a one-shot prompt:
```bash
python3 api/test_client.py -p "Summarize the primary pillars of the Hurrey Library UX project."
```

Stream responses token-by-token:
```bash
python3 api/test_client.py --stream -p "Write a 3-bullet executive summary of GPT-6 Astra."
```

---

### 3. Use in Python Code

```python
from api.gpt6_astra import GPT6AstraClient

client = GPT6AstraClient()

# One-shot text generation
reply = client.generate(
    prompt="Suggest three user research methods for a library catalog overhaul.",
    system_prompt="You are a senior UX research strategist."
)
print(reply)

# Streaming response
for token in client.stream_chat_completion(
    messages=[{"role": "user", "content": "Explain machine-readable cataloging (MARC)."}]
):
    print(token, end="", flush=True)
```

---

### 4. Run the Local HTTP Server

Start the local API bridge:
```bash
python3 api/server.py
```

The server listens on `http://127.0.0.1:5050` with CORS enabled:

* **Health Check**:
  ```bash
  curl http://127.0.0.1:5050/api/health
  ```

* **Chat Endpoint (POST /api/chat)**:
  ```bash
  curl -X POST http://127.0.0.1:5050/api/chat \
    -H "Content-Type: application/json" \
    -d '{"prompt": "Hello GPT-6 Astra!"}'
  ```

* **Streaming Endpoint (POST /api/stream)**:
  Server-Sent Events (SSE) streaming tokens directly to web applications.

---

### 5. Frontend / Browser Fetch Example

You can query this server directly from JavaScript in your website:

```javascript
async function askGPT6Astra(prompt) {
  const response = await fetch("http://127.0.0.1:5050/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: prompt })
  });
  const data = await response.json();
  console.log(data.choices[0].message.content);
}
```
