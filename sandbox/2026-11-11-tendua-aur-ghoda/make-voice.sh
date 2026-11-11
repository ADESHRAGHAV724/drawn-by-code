#!/bin/sh
# Re-times the ElevenLabs voice-over (private/voice-elevenlabs.mp3, not committed): 0.5 s of air
# before the first line, padded to 68.5 s so the moral can be read → private/voice.wav.
# Then writes mouth.js: the voice's loudness per drawing (12 a second), which drives the
# speaking character's mouth. Line timings (measured with silencedetect) are in brief.md.
cd "$(dirname "$0")" || exit 1
ffmpeg -loglevel error -y -i private/voice-elevenlabs.mp3 -af "adelay=500:all=1,apad=whole_dur=68.5,aresample=44100,aformat=channel_layouts=stereo" -t 68.5 private/voice.wav
ffmpeg -loglevel error -i private/voice.wav -ac 1 -ar 12000 -f s16le - | python3 -c '
import sys, struct, math
raw = sys.stdin.buffer.read()
n = len(raw) // 2
s = struct.unpack("<%dh" % n, raw)
win = 1000  # 12000 Hz / 12 drawings a second
env = []
for i in range(0, n, win):
    c = s[i:i + win]
    env.append(math.sqrt(sum(v * v for v in c) / max(1, len(c))))
pk = sorted(env)[int(len(env) * 0.97)] or 1
print("// Loudness of the voice-over per drawing (12/s), 0..1: made by make-voice.sh.")
print("const MOUTH = [" + ",".join("%.2f" % min(1, v / pk) for v in env) + "];")
' > mouth.js
