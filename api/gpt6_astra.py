"""
GPT-6 Astra Client
==================
A zero-dependency Python client for OpenAI's GPT-6 Astra frontier model.
Uses Python's standard library (urllib.request, json) so it runs out-of-the-box
without requiring external pip dependencies, while also supporting standard
OpenAI API interfaces.

Features:
- Standard chat completions
- Streaming token responses
- Function/tool calling payload support
- Configurable model, temperature, max_tokens, and system prompt
- Graceful error handling for authentication, rate limits, and network errors
"""

import json
import os
import sys
import urllib.error
import urllib.request
from typing import Any, Dict, Generator, List, Optional, Union


def _load_env_file(filepath: str) -> None:
    """Minimal .env file loader using standard library only."""
    if not os.path.exists(filepath):
        return
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                key, val = line.split("=", 1)
                key = key.strip()
                val = val.strip().strip("\"'")
                if key and key not in os.environ:
                    os.environ[key] = val
    except Exception:
        pass


# Attempt to read local .env if present
_env_path = os.path.join(os.path.dirname(__file__), ".env")
_load_env_file(_env_path)


class GPT6AstraError(Exception):
    """Custom exception class for GPT-6 Astra API errors."""

    def __init__(self, message: str, status_code: Optional[int] = None, response_body: Optional[str] = None):
        super().__init__(message)
        self.status_code = status_code
        self.response_body = response_body


class GPT6AstraClient:
    """Client for interacting with OpenAI's GPT-6 Astra model."""

    DEFAULT_MODEL = "gpt-6-astra"
    DEFAULT_BASE_URL = "https://api.openai.com/v1"

    def __init__(
        self,
        api_key: Optional[str] = None,
        base_url: Optional[str] = None,
        default_model: Optional[str] = None,
        timeout: int = 60,
    ):
        """
        Initialize the GPT-6 Astra Client.

        Args:
            api_key: OpenAI API key. Defaults to OPENAI_API_KEY environment variable.
            base_url: Custom API endpoint (e.g. for proxies or Azure/Bedrock endpoints).
            default_model: Model name to use (default: 'gpt-6-astra').
            timeout: HTTP request timeout in seconds (default: 60s).
        """
        self.api_key = api_key or os.environ.get("OPENAI_API_KEY")
        self.base_url = (base_url or os.environ.get("OPENAI_BASE_URL") or self.DEFAULT_BASE_URL).rstrip("/")
        self.default_model = default_model or os.environ.get("OPENAI_MODEL") or self.DEFAULT_MODEL
        self.timeout = timeout

    def _get_headers(self) -> Dict[str, str]:
        if not self.api_key:
            raise GPT6AstraError(
                "Missing OpenAI API key. Please pass 'api_key' to GPT6AstraClient or set the OPENAI_API_KEY environment variable."
            )
        return {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}",
            "User-Agent": "Antigravity-GPT6-Astra-Client/1.0",
        }

    def chat_completion(
        self,
        messages: List[Dict[str, Any]],
        model: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        tools: Optional[List[Dict[str, Any]]] = None,
        response_format: Optional[Dict[str, Any]] = None,
        extra_body: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Send a chat completion request to GPT-6 Astra.

        Args:
            messages: List of message dictionaries with 'role' ('system', 'user', 'assistant') and 'content'.
            model: Model identifier override (defaults to client's default_model).
            temperature: Sampling temperature between 0 and 2.
            max_tokens: Maximum tokens to generate.
            tools: Optional list of tools (functions) available to the model.
            response_format: Optional format specification (e.g. {"type": "json_object"}).
            extra_body: Optional additional parameters to pass in the request body.

        Returns:
            Dictionary containing the full API response.
        """
        endpoint = f"{self.base_url}/chat/completions"
        payload: Dict[str, Any] = {
            "model": model or self.default_model,
            "messages": messages,
            "temperature": temperature,
            "stream": False,
        }

        if max_tokens is not None:
            payload["max_tokens"] = max_tokens
        if tools:
            payload["tools"] = tools
        if response_format:
            payload["response_format"] = response_format
        if extra_body:
            payload.update(extra_body)

        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(endpoint, data=data, headers=self._get_headers(), method="POST")

        try:
            with urllib.request.urlopen(req, timeout=self.timeout) as resp:
                resp_body = resp.read().decode("utf-8")
                return json.loads(resp_body)
        except urllib.error.HTTPError as e:
            err_body = e.read().decode("utf-8", errors="replace")
            err_msg = f"HTTP Error {e.code}: {e.reason}"
            try:
                err_json = json.loads(err_body)
                if "error" in err_json and "message" in err_json["error"]:
                    err_msg += f" - {err_json['error']['message']}"
            except Exception:
                err_msg += f" - {err_body}"
            raise GPT6AstraError(err_msg, status_code=e.code, response_body=err_body) from e
        except urllib.error.URLError as e:
            raise GPT6AstraError(f"Network connection failed: {e.reason}") from e

    def stream_chat_completion(
        self,
        messages: List[Dict[str, Any]],
        model: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        extra_body: Optional[Dict[str, Any]] = None,
    ) -> Generator[str, None, None]:
        """
        Stream token deltas from GPT-6 Astra in real time.

        Yields:
            Token text chunks as they arrive from the API.
        """
        endpoint = f"{self.base_url}/chat/completions"
        payload: Dict[str, Any] = {
            "model": model or self.default_model,
            "messages": messages,
            "temperature": temperature,
            "stream": True,
        }
        if max_tokens is not None:
            payload["max_tokens"] = max_tokens
        if extra_body:
            payload.update(extra_body)

        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(endpoint, data=data, headers=self._get_headers(), method="POST")

        try:
            with urllib.request.urlopen(req, timeout=self.timeout) as resp:
                for line in resp:
                    line_str = line.decode("utf-8").strip()
                    if not line_str or line_str.startswith(":"):
                        continue
                    if line_str == "data: [DONE]":
                        break
                    if line_str.startswith("data: "):
                        data_str = line_str[6:]
                        try:
                            chunk = json.loads(data_str)
                            delta = chunk.get("choices", [{}])[0].get("delta", {})
                            content = delta.get("content", "")
                            if content:
                                yield content
                        except json.JSONDecodeError:
                            continue
        except urllib.error.HTTPError as e:
            err_body = e.read().decode("utf-8", errors="replace")
            raise GPT6AstraError(f"HTTP Error {e.code}: {e.reason} - {err_body}", status_code=e.code, response_body=err_body) from e
        except urllib.error.URLError as e:
            raise GPT6AstraError(f"Stream network error: {e.reason}") from e

    def generate(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        model: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
    ) -> str:
        """
        Convenience method to generate a response from a simple text prompt.

        Args:
            prompt: User message prompt string.
            system_prompt: Optional system instruction prompt.
            model: Optional model override.
            temperature: Sampling temperature.
            max_tokens: Maximum tokens to generate.

        Returns:
            The text response from GPT-6 Astra.
        """
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        response = self.chat_completion(
            messages=messages,
            model=model,
            temperature=temperature,
            max_tokens=max_tokens,
        )
        try:
            return response["choices"][0]["message"]["content"]
        except (KeyError, IndexError) as e:
            raise GPT6AstraError(f"Unexpected response structure: {response}") from e


if __name__ == "__main__":
    # Quick self-test
    client = GPT6AstraClient()
    print(f"GPT-6 Astra Client initialized.")
    print(f"Model: {client.default_model}")
    print(f"Endpoint: {client.base_url}")
    print(f"API Key present: {'Yes' if client.api_key else 'No (set OPENAI_API_KEY)'}")
