#!/bin/sh
# Re-times the ElevenLabs voice-over (private/voice-elevenlabs.mp3, not committed) to the film:
# 0.6 s of air before the first line, a 2.6 s silence for the cut after line 11 (the voice
# file has only 0.27 s there), and 2 s after the moral to read it. → private/voice.wav
# Line timings measured with silencedetect are in brief.md.
cd "$(dirname "$0")/private" || exit 1
ffmpeg -loglevel error -y -i voice-elevenlabs.mp3 -filter_complex "\
[0:a]atrim=0:36.65,asetpts=PTS-STARTPTS,adelay=600:all=1[a];\
[0:a]atrim=36.65,asetpts=PTS-STARTPTS,adelay=0:all=1[b];\
anullsrc=r=44100:cl=mono,atrim=0:2.6[gap];\
[a][gap][b]concat=n=3:v=0:a=1,apad=whole_dur=54,aresample=44100,aformat=channel_layouts=stereo[out]" \
-map "[out]" -t 54 voice.wav
