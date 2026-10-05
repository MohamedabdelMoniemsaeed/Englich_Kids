#!/usr/bin/env python3
import os
import glob
import subprocess
import tempfile
import shutil

def get_max_volume(file_path):
    cmd = ['ffmpeg', '-i', file_path, '-af', 'volumedetect', '-f', 'null', '-']
    res = subprocess.run(cmd, capture_output=True, text=True)
    for line in res.stderr.split('\n'):
        if 'max_volume:' in line:
            return float(line.split('max_volume:')[1].replace('dB', '').strip())
    return None

def main():
    audio_dir = 'public/audio'
    files = sorted(glob.glob(os.path.join(audio_dir, '*.mp3')))
    total = len(files)
    print(f"=== Studio Audio Peak Normalization for {total} files ===")
    
    target_peak = -1.0
    normalized_count = 0
    
    with tempfile.TemporaryDirectory() as tmpdir:
        for i, f in enumerate(files):
            basename = os.path.basename(f)
            max_vol = get_max_volume(f)
            
            if max_vol is None:
                continue
            
            gain = target_peak - max_vol
            # If the gain difference is greater than 0.3 dB, normalize it
            if abs(gain) > 0.3:
                tmp_out = os.path.join(tmpdir, basename)
                cmd = [
                    'ffmpeg', '-y', '-i', f,
                    '-af', f'volume={gain:.2f}dB',
                    '-ar', '24000',
                    '-b:a', '48k',
                    tmp_out
                ]
                res = subprocess.run(cmd, capture_output=True)
                if res.returncode == 0:
                    shutil.copy2(tmp_out, f)
                    normalized_count += 1
            
            if (i + 1) % 25 == 0 or i == total - 1:
                print(f"Progress: {i+1}/{total} processed...")

    print(f"🎉 Complete! Normalized {normalized_count}/{total} audio files to precisely {target_peak} dB peak.")

if __name__ == '__main__':
    main()
