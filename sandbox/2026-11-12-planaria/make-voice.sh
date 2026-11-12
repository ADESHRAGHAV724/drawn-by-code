#!/bin/sh
# The user's ElevenLabs voice (private/, never committed) with 0.4 s of air, padded to the film.
cd "$(dirname "$0")"
ffmpeg -v error -y -i private/voice-elevenlabs.mp3 -af "adelay=400:all=1,apad=whole_dur=59.6" -ar 44100 -ac 2 private/voice.wav
