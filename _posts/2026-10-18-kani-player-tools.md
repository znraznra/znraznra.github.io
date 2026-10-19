---
title: Kani | Guides, full screen, clip replace and saved text styles
date: 2026-10-18T12:00:00
tags:
  - kani
  - rust
  - video-editing
  - linux
  - windows
  - devlog
excerpt: Rulers and guides, full screen preview, replacing a clip by dragging media onto it, a hardware decoding check, and saved text styles.
published: true
---

Five days in. This round was a pile of small things that add up to the editor feeling a lot less like a prototype.

## The Player

The preview got a menu of its own:

- **Rulers, grid and guides.** Drag a guide out of the ruler, drag it to move, drag it back to remove. Guides are saved with the project, and you can lock them.
- **Full screen preview** with `F11` or a double-click. A small toast tells you how to get out, and the bottom bar (play, position, time, exit) hides itself after 3 seconds of no mouse movement.
- **Click to select.** Clicking on the preview picks the topmost clip under the pointer and lets you drag it right away. Clicking empty space deselects.
- **Fit** resets the zoom.

Elsewhere on the timeline:

- Clicking anywhere moves the playhead. Clicking a clip also selects it.
- `Ctrl+A` selects everything.
- **Replace a clip by dropping media on it.** Photos replace right away. A longer video opens a small picker where you drag a window over the file's filmstrip to choose which part to use, with frame-step and play buttons. A shorter one is refused with the reason.
- The Captions track only holds generated captions now. Text and media go on other tracks.

## Playback settings that actually do something now

The Settings rows that were greyed out a few days ago mostly work now:

- Create proxies automatically, with a choice of 640 / 960 / 1280 px
- Preview resolution (480 / 960 / 1440 / 1920 px), export isn't affected
- Decode with the graphics chip (on or off)
- Play sound while dragging the playhead, also a speaker button on the timeline toolbar
- **Remux on import** for formats GStreamer gets cranky about:

```text
.ts .mts .m2ts .flv .f4v .wmv .asf .mpg .mpeg .vob .3gp .3g2
  →  re-wrapped into .mkv in the project's media folder (no re-encoding)
```

## Is my GPU actually decoding?

I wanted a straight answer to this, so there's a check for it now. Settings > Playback > **Check hardware decoding**, or right-click any file in the library.

It decodes the start of a real file twice, once with the graphics chip allowed and once on the processor only, then tells you which decoder actually ran, pictures per second, how much CPU it used, and a plain-words verdict. There's a Copy report button for when I need to send it somewhere.

The preview can also be put together on the graphics chip now, on its own thread so the window never waits for it. With several stacked morph layers it still lags a little in the Player (renders are fine), so the console now prints where the time goes when you pause:

```text
kani: preview on the graphics chip: N pictures, X layers each;
      per picture A ms uploading and drawing, B ms reading back; slowest C ms
```

## Saved text styles

The last thing I always missed: save a text look once and reuse it. There's a **Saved style** dropdown with a save button in the Text section, and a **My styles** list in the Text library. Click one and it adds a text clip with that look. Applying a style keeps your words, only the look changes.

## The home screen

Cleaned up too. A sidebar with Projects, Recents and Brand Kits (that one's a placeholder for Phase 8), the app name and version at the bottom, and icon buttons instead of text everywhere. The logo in About now credits that it was hand-drawn by me.

That was the morning batch. It all tested fine on the ThinkPad, so the afternoon went into tracks, snapping and the Windows sound bug. That's the next post.
