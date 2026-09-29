"""
GPT-6 Astra Local API Server
============================
A lightweight HTTP server providing a REST API endpoint for GPT-6 Astra.
Built with Python's standard library http.server, supporting CORS so it can be
queried from web browsers, frontend applications, and local scripts.

Endpoints:
- GET  /api/health      -> Health check and client configuration status
- POST /api/chat        -> Standard chat completion JSON
- POST /api/stream      -> Server-Sent Events (SSE) streaming tokens
"""

import json
import os
import sys
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse

# Ensure local api folder is in import path
sys.path.insert(0, os.path.dirname(__file__))
from gpt6_astra import GPT6AstraClient, GPT6AstraError

HOST = os.environ.get("API_HOST", "127.0.0.1")
PORT = int(os.environ.get("API_PORT", 5050))


class GPT6AstraHTTPHandler(BaseHTTPRequestHandler):
    """HTTP request handler for GPT-6 Astra API endpoints."""

    def _set_cors_headers(self, content_type: str = "application/json"):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.send_header("Content-Type", content_type)

    def do_OPTIONS(self):
        """Handle CORS pre-flight requests."""
        self.send_response(HTTPStatus.NO_CONTENT)
        self._set_cors_headers()
        self.end_headers()

    def do_GET(self):
        """Handle GET requests for health check."""
        parsed = urlparse(self.path)
        if parsed.path == "/api/health":
            client = GPT6AstraClient()
            data = {
                "status": "healthy",
                "model": client.default_model,
                "has_api_key": bool(client.api_key),
            }
            body = json.dumps(data).encode("utf-8")
            self.send_response(HTTPStatus.OK)
            self._set_cors_headers("application/json")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        else:
            self.send_error(HTTPStatus.NOT_FOUND, "Not Found")

    def do_POST(self):
        """Handle POST requests for chat and streaming."""
        parsed = urlparse(self.path)
        content_len = int(self.headers.get("Content-Length", 0))
        raw_body = self.rfile.read(content_len)

        try:
            payload = json.loads(raw_body.decode("utf-8")) if raw_body else {}
        except json.JSONDecodeError:
            self.send_error(HTTPStatus.BAD_REQUEST, "Invalid JSON payload")
            return

        client = GPT6AstraClient()

        if parsed.path == "/api/chat":
            self._handle_chat(client, payload)
        elif parsed.path == "/api/stream":
            self._handle_stream(client, payload)
        else:
            self.send_error(HTTPStatus.NOT_FOUND, "Endpoint not found")

    def _handle_chat(self, client: GPT6AstraClient, payload: dict):
        messages = payload.get("messages")
        prompt = payload.get("prompt")
        model = payload.get("model")
        temperature = payload.get("temperature", 0.7)
        max_tokens = payload.get("max_tokens")

        if not messages and prompt:
            messages = [{"role": "user", "content": prompt}]

        if not messages:
            self.send_error(HTTPStatus.BAD_REQUEST, "Missing 'messages' or 'prompt'")
            return

        try:
            resp = client.chat_completion(
                messages=messages,
                model=model,
                temperature=temperature,
                max_tokens=max_tokens,
            )
            body = json.dumps(resp).encode("utf-8")
            self.send_response(HTTPStatus.OK)
            self._set_cors_headers("application/json")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        except GPT6AstraError as e:
            err_data = {"error": str(e), "status_code": e.status_code}
            body = json.dumps(err_data).encode("utf-8")
            self.send_response(e.status_code or HTTPStatus.INTERNAL_SERVER_ERROR)
            self._set_cors_headers("application/json")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

    def _handle_stream(self, client: GPT6AstraClient, payload: dict):
        messages = payload.get("messages")
        prompt = payload.get("prompt")
        model = payload.get("model")
        temperature = payload.get("temperature", 0.7)
        max_tokens = payload.get("max_tokens")

        if not messages and prompt:
            messages = [{"role": "user", "content": prompt}]

        if not messages:
            self.send_error(HTTPStatus.BAD_REQUEST, "Missing 'messages' or 'prompt'")
            return

        self.send_response(HTTPStatus.OK)
        self._set_cors_headers("text/event-stream")
        self.send_header("Cache-Control", "no-cache")
        self.send_header("Connection", "keep-alive")
        self.end_headers()

        try:
            for chunk in client.stream_chat_completion(
                messages=messages,
                model=model,
                temperature=temperature,
                max_tokens=max_tokens,
            ):
                event_data = f"data: {json.dumps({'content': chunk})}\n\n"
                self.wfile.write(event_data.encode("utf-8"))
                self.wfile.flush()

            self.wfile.write(b"data: [DONE]\n\n")
            self.wfile.flush()
        except GPT6AstraError as e:
            err_data = f"data: {json.dumps({'error': str(e)})}\n\n"
            self.wfile.write(err_data.encode("utf-8"))
            self.wfile.flush()


def run_server(host: str = HOST, port: int = PORT):
    server_addr = (host, port)
    httpd = ThreadingHTTPServer(server_addr, GPT6AstraHTTPHandler)
    print(f"==================================================")
    print(f"🚀 GPT-6 Astra Server running at http://{host}:{port}")
    print(f"Health check: http://{host}:{port}/api/health")
    print(f"Chat POST:    http://{host}:{port}/api/chat")
    print(f"Stream POST:  http://{host}:{port}/api/stream")
    print(f"==================================================")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server.")
        httpd.server_close()


if __name__ == "__main__":
    run_server()
