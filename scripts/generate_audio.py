#!/usr/bin/env python3
import os
import re
import subprocess
import tempfile
import shutil

def slugify(text: str) -> str:
    cleaned = re.sub(r'[\(\)\[\]\{\}\/\\,\.\:\;\!\?]', ' ', text.lower()).strip()
    slug = re.sub(r'\s+', '_', cleaned)
    return slug

def main():
    print("=== Generating Offline MP3 Audio Files for All Lessons ===")
    work_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    public_audio = os.path.join(work_dir, "public", "audio")
    os.makedirs(public_audio, exist_ok=True)

    data_file = os.path.join(work_dir, "src", "data", "learningData.ts")
    with open(data_file, "r", encoding="utf-8") as f:
        content = f.read()

    # Collect all words and their spoken phrases
    tasks = [] # list of (slug, spoken_text)

    # 1. Letters A to Z
    for code in range(ord('A'), ord('Z') + 1):
        letter = chr(code)
        # letter pronunciation: "A", "B", etc.
        tasks.append((letter.lower(), letter))
        tasks.append((f"{letter.lower()}{letter.lower()}", letter)) # 'aa', 'bb'

    # 2. Numbers 1 to 10
    num_words = [
        ('1', 'One'), ('2', 'Two'), ('3', 'Three'), ('4', 'Four'), ('5', 'Five'),
        ('6', 'Six'), ('7', 'Seven'), ('8', 'Eight'), ('9', 'Nine'), ('10', 'Ten')
    ]
    for num, word in num_words:
        tasks.append((num, word))
        tasks.append((word.lower(), word))

    # 3. Words from learningData.ts
    for m in re.finditer(r'word:\s*[\'\"]([^\'\"]+)[\'\"]', content):
        w = m.group(1).strip()
        slug = slugify(w)
        tasks.append((slug, w))

    for m in re.finditer(r'nameEnglish:\s*[\'\"]([^\'\"]+)[\'\"]', content):
        w = m.group(1).strip()
        slug = slugify(w)
        # Clean phrases like "Diamond / Rhombus"
        spoken = w.replace('/', ' or ')
        tasks.append((slug, spoken))
        # If it has slashes, also add the parts individually
        if '/' in w:
            for part in w.split('/'):
                p = part.strip()
                tasks.append((slugify(p), p))

    # 4. Family members specifically
    family_members = [
        'father', 'mother', 'brother', 'sister', 'grandfather', 'grandmother',
        'son', 'daughter', 'baby', 'family', 'parents', 'uncle', 'aunt'
    ]
    for fam in family_members:
        tasks.append((fam, fam.capitalize()))

    # Deduplicate by slug
    unique_tasks = {}
    for slug, spoken in tasks:
        if slug and slug not in unique_tasks:
            unique_tasks[slug] = spoken

    print(f"Total unique audio files to generate: {len(unique_tasks)}")

    with tempfile.TemporaryDirectory() as tmpdir:
        count = 0
        for slug, spoken in unique_tasks.items():
            out_mp3 = os.path.join(public_audio, f"{slug}.mp3")
            if os.path.exists(out_mp3) and os.path.getsize(out_mp3) > 100:
                continue

            wav_path = os.path.join(tmpdir, f"{slug}.wav")
            # Generate speech WAV with clear English accent and child-friendly speed
            # -v en-us, -s 130 (words per minute), -p 60 (pitch)
            cmd_espeak = ["espeak-ng", "-v", "en-us", "-s", "130", "-p", "55", spoken, "-w", wav_path]
            try:
                subprocess.run(cmd_espeak, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                # Convert to high-quality lightweight MP3
                cmd_ffmpeg = ["ffmpeg", "-y", "-i", wav_path, "-b:a", "64k", out_mp3]
                subprocess.run(cmd_ffmpeg, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                count += 1
            except Exception as e:
                print(f"Error generating {slug} ({spoken}): {e}")

        print(f"Successfully generated {count} new MP3 audio files in public/audio/!")

        # Sync to dist/audio if dist exists
        dist_audio = os.path.join(work_dir, "dist", "audio")
        if os.path.exists(os.path.join(work_dir, "dist")):
            os.makedirs(dist_audio, exist_ok=True)
            for f in os.listdir(public_audio):
                if f.endswith('.mp3'):
                    shutil.copy2(os.path.join(public_audio, f), os.path.join(dist_audio, f))
            print(f"Synced {len(os.listdir(public_audio))} audio files to dist/audio/")

if __name__ == "__main__":
    main()
