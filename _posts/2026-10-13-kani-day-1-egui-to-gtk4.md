---
title: "Day 1: egui, broken drag and drop, and jumping ship to GTK4"
date: 2026-10-13T23:30:00
tags:
  - kani
  - rust
  - gtk4
  - gstreamer
  - egui
  - devlog
excerpt: "The first foundation of the editor went fine. The first UI didn't. Why I threw out egui halfway through Phase 2 and rebuilt on GTK4 + GStreamer."
published: false
---

Phase 1 was the boring-but-important part. The timeline model, the project folder format, and the platform contracts. Nothing to look at, just tests.

All of them passed on the ThinkPad on the first run (17 + 17 + 24). I'll take it.

## The one rule I didn't want to break

Every change to the timeline goes through an `Edit`, and every `Edit` knows how to undo itself. Moves, trims, splits, text changes, all of it. Multi-part changes get wrapped into one batch so they undo in one step.

```rust
// Simplified. The real enum has a lot more variants.
pub enum Edit {
    MoveClip { clip: ClipId, from: Ticks, to: Ticks },
    SplitClip { clip: ClipId, at: Ticks },
    SetClipVolume { clip: ClipId, old: u32, new: u32 },
    Batch(Vec<Edit>), // one undo step
}

impl Edit {
    pub fn apply(&self, tl: &mut Timeline) -> Result<Edit, EditError> {
        // returns the inverse, which goes on the undo stack
        todo!()
    }
}
```

It sounds strict, but this is exactly what saved me later when group editing and "Apply to all captions" came in. Undo never lies.

Here's roughly how the workspace ended up split:

![Kani crate architecture](/assets/images/uploads/kani/kani-architecture.png)

## Phase 2 on egui: it opened, and that's about it

The first app shell was on egui. It opened on both machines, which was nice. Then the problems started piling up:

- The theme came out light on Windows instead of dark. (Fixed, but it made me want a proper dark/light choice anyway.)
- Dragging files from the file manager into the app just... didn't work. Not on Windows, not on GNOME Wayland, not even with X11 turned on. No hover event at all.
- Closing a project closed the whole app instead of going back to a home screen.
- Dialogs couldn't be dragged around like real windows.

I went through four egui drops trying to make it behave (2.1, 2.2, 2.2.1, 2.3). The drag-and-drop thing is what really killed it. For a video editor, dragging footage in is not optional.

## So I jumped ship

Unfortunately, I've decided to just rip out the UI and rebuild on **GTK4 + GStreamer**, still all Rust. Native drag and drop, real movable windows, and a media pipeline that has been battle-tested for years.

First GTK build on Linux: windowing, creating projects, importing, file drag and drop, splitting, undo, close and reopen. All working. Clipboard paste didn't, but that got fixed in the next round.

The second round added the stuff that makes it feel like an editor:

- All unmuted clips under the playhead get mixed together.
- A neutral area around the preview so you can actually see the video's edge.
- An About window (icon, name, version, system info) instead of a bare System Information page.
- Drag clips onto a track, or onto a brand-new one.
- Drop a video onto an audio track and it's treated as audio only.
- Paste at the playhead, onto the same track if there's room or a new one if not.

I guess it won't hurt to say it plainly: dropping egui cost me a day, but it would've cost me a lot more if I'd tried to keep fighting it.
