#!/usr/bin/env python3
"""Generate sprites for Andres World using Retro Diffusion API.

Usage: python3 scripts/generate-sprites.py
Requires RETRO_DIFFUSION_API_KEY in .env
"""

import base64
import json
import os
import sys
import time
from pathlib import Path

import requests

# Load .env
env_path = Path(__file__).parent.parent / ".env"
if env_path.exists():
    for line in env_path.read_text().splitlines():
        if "=" in line and not line.startswith("#"):
            k, v = line.split("=", 1)
            os.environ[k.strip()] = v.strip()

API_KEY = os.environ.get("RETRO_DIFFUSION_API_KEY")
if not API_KEY:
    print("ERROR: RETRO_DIFFUSION_API_KEY not set")
    sys.exit(1)

API_URL = "https://api.retrodiffusion.ai/v1/inferences"
SPRITES_DIR = Path(__file__).parent.parent / "public" / "assets" / "sprites"

HEADERS = {
    "X-RD-Token": API_KEY,
    "Content-Type": "application/json",
}


def generate(prompt: str, style: str, width: int = 32, height: int = 32,
             remove_bg: bool = True, return_spritesheet: bool = False) -> list[bytes]:
    """Call Retro Diffusion API and return list of PNG byte arrays."""
    payload = {
        "prompt": prompt,
        "width": width,
        "height": height,
        "model": "RD_CLASSIC",
        "prompt_style": style,
        "num_images": 1,
        "remove_bg": remove_bg,
    }
    if return_spritesheet:
        payload["return_spritesheet"] = True

    resp = requests.post(API_URL, headers=HEADERS, json=payload, timeout=60)
    resp.raise_for_status()
    data = resp.json()

    print(f"  cost: ${data.get('balance_cost', '?')} | remaining: ${data.get('remaining_balance', '?')}")

    images = []
    for b64 in data.get("base64_images", []):
        images.append(base64.b64decode(b64))
    return images


def save_png(data: bytes, path: Path):
    """Save raw PNG bytes to file."""
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)
    print(f"  saved: {path} ({len(data)} bytes)")


# ─── Player Spritesheet ──────────────────────────────────────────────

def generate_player():
    print("\n=== PLAYER SPRITESHEET ===")
    prompt = (
        "young latino man wearing dark hoodie and laptop backpack, "
        "top-down RPG character, walking animation, pixel art, "
        "clean simple style, dark hair"
    )
    images = generate(
        prompt=prompt,
        style="animation__small_sprites",
        width=32,
        height=32,
        remove_bg=True,
        return_spritesheet=True,
    )
    if images:
        save_png(images[0], SPRITES_DIR / "player-retrodiffusion-raw.png")
        print("  NOTE: Raw spritesheet saved. Post-processing needed to arrange into PIPOYA order.")
    return len(images) > 0


# ─── NPC Sprites ─────────────────────────────────────────────────────

NPC_PROMPTS = {
    "paul-graham": (
        "older man with glasses and receding hairline, thoughtful expression, "
        "simple shirt, pixel art portrait, front facing, top-down RPG NPC"
    ),
    "marc-andreessen": (
        "tall bald man with large head, confident smile, dark suit, "
        "pixel art portrait, front facing, top-down RPG NPC"
    ),
    "michael-seibel": (
        "young black man with short hair, friendly expression, casual shirt, "
        "pixel art portrait, front facing, top-down RPG NPC"
    ),
    "keri": (
        "young woman with long dark hair, warm smile, casual clothing, "
        "pixel art portrait, front facing, top-down RPG NPC, co-founder"
    ),
    "brian-chesky": (
        "man with curly brown hair, athletic build, casual t-shirt, "
        "pixel art portrait, front facing, top-down RPG NPC"
    ),
    "dalton-caldwell": (
        "man with beard and glasses, thoughtful look, casual shirt, "
        "pixel art portrait, front facing, top-down RPG NPC"
    ),
    "john-collison": (
        "young man with light brown hair, slim build, button-up shirt, "
        "pixel art portrait, front facing, top-down RPG NPC"
    ),
    "dario-amodei": (
        "man with dark curly hair, serious expression, collared shirt, "
        "pixel art portrait, front facing, top-down RPG NPC"
    ),
    "dog-1": (
        "small brown dachshund dog, cute wiener dog, pixel art, "
        "front facing, top-down RPG style, tiny pet"
    ),
}

# dog-2 reuses dog-1 sprite (both are dachshunds)
DOG_CLONE = ("dog-2", "dog-1")


def generate_npcs():
    print("\n=== NPC SPRITES ===")
    for npc_id, prompt in NPC_PROMPTS.items():
        print(f"\n--- {npc_id} ---")
        try:
            images = generate(
                prompt=prompt,
                style="rd_plus__classic",
                width=32,
                height=32,
                remove_bg=True,
            )
            if images:
                save_png(images[0], SPRITES_DIR / f"npc-{npc_id}.png")
            time.sleep(0.5)  # Be nice to the API
        except Exception as e:
            print(f"  ERROR: {e}")

    # Clone dog-2 from dog-1
    src = SPRITES_DIR / f"npc-{DOG_CLONE[1]}.png"
    dst = SPRITES_DIR / f"npc-{DOG_CLONE[0]}.png"
    if src.exists():
        import shutil
        shutil.copy2(src, dst)
        print(f"\n  cloned: {dst} (from {src.name})")


# ─── Main ────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("Retro Diffusion Sprite Generator for Andres World")
    print(f"Output dir: {SPRITES_DIR}")

    # Check balance first
    print("\nChecking balance with a minimal query...")

    generate_player()
    generate_npcs()

    print("\n=== DONE ===")
    print("Next steps:")
    print("1. Review generated sprites in public/assets/sprites/")
    print("2. Post-process player spritesheet into PIPOYA row order (Down/Left/Right/Up)")
    print("3. Run: npx vitest run tests/sprite-format.test.ts")
