#!/usr/bin/env python3
import os
import re
import asyncio
import tempfile
import subprocess
import shutil
import edge_tts

VOICE = "en-US-AnaNeural"
RATE = "-12%"  # Slightly slower for kid-friendly learning and clear enunciation

# Enhanced audio filter:
# 1. silenceremove: removes leading dead air and trailing silence from synthesized speech
# 2. apad: soft 0.1s natural decay padding
# 3. loudnorm: standard broadcast audio loudness normalization across all files
AUDIO_FILTER = (
    "silenceremove=start_periods=1:start_duration=0.01:start_threshold=-45dB:"
    "stop_periods=1:stop_duration=0.12:stop_threshold=-38dB,"
    "apad=pad_dur=0.10,"
    "loudnorm=I=-16:TP=-1.5:LRA=11"
)

NUM_MAP = {
    '1': 'One', '2': 'Two', '3': 'Three', '4': 'Four', '5': 'Five',
    '6': 'Six', '7': 'Seven', '8': 'Eight', '9': 'Nine', '10': 'Ten'
}

SPECIAL_WORDS = {
    'diamond_rhombus': 'Diamond or Rhombus',
    'autumn_fall': 'Autumn or Fall',
    'ice_cream': 'Ice cream',
    'police_officer': 'Police officer',
    'fire_truck': 'Fire truck',
    'traffic_light': 'Traffic light',
}

async def generate_file(slug: str, spoken_text: str, out_file: str, tmp_dir: str, sem: asyncio.Semaphore):
    async with sem:
        raw_mp3 = os.path.join(tmp_dir, f"raw_{slug}.mp3")
        norm_mp3 = out_file

        for attempt in range(4):
            try:
                # 1. Synthesize using Microsoft Edge Neural TTS
                comm = edge_tts.Communicate(spoken_text, VOICE, rate=RATE)
                await comm.save(raw_mp3)

                # 2. Trim silence and normalize audio volume equally
                cmd = [
                    "ffmpeg", "-y", "-i", raw_mp3,
                    "-af", AUDIO_FILTER,
                    "-b:a", "64k",
                    norm_mp3
                ]
                proc = await asyncio.create_subprocess_exec(
                    *cmd,
                    stdout=asyncio.subprocess.DEVNULL,
                    stderr=asyncio.subprocess.DEVNULL
                )
                await proc.communicate()
                return True
            except Exception as e:
                if attempt == 3:
                    print(f"Failed {slug} after 4 attempts: {e}")
                    if os.path.exists(raw_mp3):
                        shutil.copy2(raw_mp3, norm_mp3)
                        return True
                    return False
                await asyncio.sleep(1 + attempt)
        return False

async def main():
    print(f"=== Generating 253 Kid Neural Audio Files (Trimmed & Balanced) with {VOICE} ({RATE}) ===")
    work_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    public_audio = os.path.join(work_dir, "public", "audio")
    os.makedirs(public_audio, exist_ok=True)

    all_files = sorted([f for f in os.listdir(public_audio) if f.endswith(".mp3")])
    print(f"Found {len(all_files)} audio files to synthesize.")

    tasks = []
    with tempfile.TemporaryDirectory() as tmp_dir:
        sem = asyncio.Semaphore(5)  # 5 concurrent connections
        for f in all_files:
            slug = f[:-4]
            out_path = os.path.join(public_audio, f)

            if slug in NUM_MAP:
                spoken = NUM_MAP[slug]
            elif slug in SPECIAL_WORDS:
                spoken = SPECIAL_WORDS[slug]
            elif len(slug) == 1 and slug.isalpha():
                spoken = f"{slug.upper()}."
            elif len(slug) == 2 and slug[0] == slug[1] and slug[0].isalpha():
                spoken = f"{slug[0].upper()}."
            else:
                spoken = slug.replace('_', ' ').title()

            tasks.append(generate_file(slug, spoken, out_path, tmp_dir, sem))

        results = await asyncio.gather(*tasks)
        success_count = sum(1 for r in results if r)
        print(f"🎉 Successfully generated {success_count}/{len(all_files)} neural audio files with {VOICE}!")

        # Sync directly to dist/audio
        dist_audio = os.path.join(work_dir, "dist", "audio")
        if os.path.exists(os.path.join(work_dir, "dist")):
            os.makedirs(dist_audio, exist_ok=True)
            for f in all_files:
                src = os.path.join(public_audio, f)
                dst = os.path.join(dist_audio, f)
                shutil.copy2(src, dst)
            print(f"Synced {len(all_files)} files to dist/audio/")

if __name__ == "__main__":
    asyncio.run(main())
