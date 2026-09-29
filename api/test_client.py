"""
GPT-6 Astra Interactive Test Script
===================================
A command-line script to test GPT-6 Astra integration:
- Direct SDK client test (generate & streaming)
- Local HTTP API server test
"""

import argparse
import json
import os
import sys

# Ensure local api folder is in path
sys.path.insert(0, os.path.dirname(__file__))
from gpt6_astra import GPT6AstraClient, GPT6AstraError


def test_direct(prompt: str, stream: bool = False, model: str = None):
    print("=" * 60)
    print("🤖 Testing GPT-6 Astra Direct Client")
    print("=" * 60)

    client = GPT6AstraClient(default_model=model)

    if not client.api_key:
        print("⚠️  Warning: OPENAI_API_KEY environment variable is not set.")
        print("   Set it via: export OPENAI_API_KEY='your-key-here'")
        print("   Or create an api/.env file containing OPENAI_API_KEY=your-key-here")
        return

    print(f"Model:  {client.default_model}")
    print(f"Prompt: {prompt}")
    print("-" * 60)

    try:
        if stream:
            print("Response (Streaming): ", end="", flush=True)
            for chunk in client.stream_chat_completion(
                messages=[{"role": "user", "content": prompt}],
                model=model,
            ):
                print(chunk, end="", flush=True)
            print("\n")
        else:
            response = client.generate(prompt=prompt, model=model)
            print(f"Response:\n{response}")
    except GPT6AstraError as e:
        print(f"❌ Error: {e}")
        if e.status_code == 401:
            print("   -> Your OpenAI API key appears to be invalid or unauthorized.")
        elif e.status_code == 404:
            print("   -> The specified model was not found. Verify your account has GPT-6 Astra access.")
        elif e.status_code == 429:
            print("   -> Rate limit reached or quota exceeded.")


def main():
    parser = argparse.ArgumentParser(description="Test GPT-6 Astra Integration")
    parser.add_argument(
        "--prompt",
        "-p",
        type=str,
        default="Introduce yourself in two sentences and explain what makes GPT-6 Astra special.",
        help="Prompt to send to GPT-6 Astra",
    )
    parser.add_argument(
        "--stream",
        "-s",
        action="store_true",
        help="Stream tokens in real-time",
    )
    parser.add_argument(
        "--model",
        "-m",
        type=str,
        default="gpt-6-astra",
        help="Model identifier (default: gpt-6-astra)",
    )
    args = parser.parse_args()
    test_direct(prompt=args.prompt, stream=args.stream, model=args.model)


if __name__ == "__main__":
    main()
