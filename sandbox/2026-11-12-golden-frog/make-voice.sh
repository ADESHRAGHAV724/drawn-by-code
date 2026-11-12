#!/bin/sh
# Re-times the ElevenLabs voice-over (private/voice-elevenlabs.mp3, not committed): 0.4 s of air
# before the first line, cut to 34 s → private/voice.wav. Line timings are in brief.md.
cd "$(dirname "$0")" || exit 1
ffmpeg -loglevel error -y -i private/voice-elevenlabs.mp3 -af "adelay=400:all=1,apad=whole_dur=34,aresample=44100,aformat=channel_layouts=stereo" -t 34 private/voice.wav
