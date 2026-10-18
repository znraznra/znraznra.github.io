---
title: "Getting pictures to move: the media core and the compositor"
date: 2026-10-14T11:00:00
tags:
  - kani
  - rust
  - gstreamer
  - compositor
  - video-editing
  - devlog
excerpt: "Phases 3 and 4. Thumbnails, waveforms, proxies, real preview, then layers, transforms, keyframes and a CapCut-style restyle."
published: false
---

Once GTK was in, the editor finally had to deal with *actual* video. Phase 3 is the media core, Phase 4 is the compositor. Both are done now (on Linux at least), but they took a fair amount of back and forth.

## Phase 3: the media core

What went in:

- Probing files for length, size, codec and frame rate
- Thumbnails, filmstrips on clips, audio waveforms
- Real preview playback through GStreamer
- Stills (photos on the timeline)
- Proxies for heavy footage
- Scrub throttling, and a report of which decoder is being used

I tested it against my own footage, which is a mess on purpose: H.264 1080p at 29.97 and 23.976, AV1 1440x1080 with Opus audio, vertical 1080x1920, HEVC 10-bit and 4K vertical AV1. Big Buck Bunny was the fallback test file.

On the ThinkPad, AV1 shows up as `vaav1dec`, which means the Iris Xe is decoding it in hardware. Nice.

Some housekeeping also landed here because I kept tripping over it:

- Empty tracks get deleted automatically, except the default Video 1 and Audio 1.
- New projects start with only those two.
- The preview goes blank when nothing is under the playhead instead of freezing on the last frame.
- A proper right-click menu on clips and media, with cascading flyouts. Things that don't exist yet are greyed out instead of hidden.

There's still a tiny pause at cuts between clips. I spent a while on it, got it smaller, and decided to move on. It's on the list.

## Phase 4: the compositor

This is where clips stop being rectangles that play one after another and start being *layers*.

- Layers, position, scale, rotation, opacity
- Mirror and rotate
- Crossfades
- Keyframes (little diamonds you can drag at the top of a clip)
- Multi-select and group edits
- An on-canvas transform box
- Sliders you can drag, or click to type a value

All of it runs on the CPU for now, behind an interface that a GPU backend can fill in later. Spoiler: that "later" came a lot sooner than I expected.

Units are stored as whole numbers on purpose, so nothing drifts after a hundred undos:

```text
x / y       thousandths of the canvas
scale       thousandths (1000 = fit)
rotation    tenths of a degree
opacity     thousandths
volume      thousandths (1000 = as recorded, max 2000)
```

## The restyle

I also had the whole interface restyled to feel like the CapCut layout I'm used to. Not the assets, just the arrangement. It uses the Mahocommerce icon set (MIT) and the Inter font everywhere, with an Edit/Info pane on the right and a timeline scrollbar that also zooms.

That was the round where I picked the licence too: **GPL-3.0-or-later**.

The 0.4.x compositor builds ran from 0.4.1 all the way to 0.4.16. Version numbers here are `major.phase.iteration`, so the middle number tells you which phase I was working on.
