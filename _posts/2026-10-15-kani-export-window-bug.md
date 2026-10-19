---
title: Kani | The Export window that kept coming back from the dead
date: 2026-10-15T21:30:00
tags:
  - kani
  - rust
  - gtk4
  - debugging
  - export
  - devlog
excerpt: Phase 5 finally started. Export worked on the first try, but the window greyed out my screen and later refused to close. The cause was a Rust reference cycle.
published: true
---

Back to Phase 5. Export.

The first export build (0.5.1, build 37) honestly went better than I expected. Presets exported, the files played back fine, cancelling mid-render left no junk files behind, and it picked the Intel VA-API encoder by itself.

![Export pipeline](/assets/images/uploads/kani/kani-export-pipeline.png)

The file is written as `name.exporting.mp4` and only renamed at the very end. If anything fails or you cancel, it's deleted. I've had too many half-written renders sitting in folders to accept anything else.

## Then the bug

If the Kani window wasn't maximized, clicking Export greyed out the screen and... nothing. No window. I had to kill the app from the console.

The next build added a watchdog that retries after 3 seconds, and console lines so I could see what was going on. Here's what came back:

```text
kani: opening the Export window
kani: the Export window did not appear within 3 s; closing it
Gtk-WARNING: A window is shown after it has been destroyed
```

And then it got worse. I reported back that the Export panel kept popping up, and close and exit didn't do anything.

## The actual cause

It wasn't GNOME. It wasn't Wayland. It was a reference cycle.

![Reference cycle bug](/assets/images/uploads/kani/kani-rc-cycle.png)

The dialog was kept in a global slot so `Ctrl+E` could bring an existing window to the front instead of opening a second one. But its own signal handlers held strong `Rc` references back to it. So it never got dropped, even after GTK had destroyed the window.

Every time I pressed Export after that, `active()` handed back the dead dialog, and the app called `present()` on a window that no longer existed.

The fix is small (simplified a bit here):

```rust
struct Dialog {
    window: gtk::Window,
    gone: Cell<bool>,
    // ...
}

thread_local! {
    static ACTIVE: RefCell<Option<Rc<Dialog>>> = RefCell::new(None);
}

pub fn active() -> Option<Rc<Dialog>> {
    ACTIVE.with(|a| a.borrow().clone()).filter(|d| !d.gone.get())
}

fn forget(d: &Dialog) {
    d.gone.set(true);
    ACTIVE.with(|a| a.borrow_mut().take());
}

// called on close() AND from connect_destroy
```

There's a regression check in the end-to-end test now, and I made sure it fails on the old code before trusting it.

Build 40: the window shows up every single time, maximized or not, and reopens fine after closing.

> Lesson for future me: never keep a dialog reachable through a global handle while its own handlers hold strong refs to it. Clear the handle on destroy.

## Side quest: first real Windows run

Same day, I finally built it on the Dell. Thankfully it compiled after installing LLVM and pointing `LIBCLANG_PATH` at it (Whisper's bindings need libclang on MSVC).

At first *nothing* worked. No import, 5-second placeholder clips, no playback. MSYS2 simply had no GStreamer decoder plugins installed. After adding the base/good/bad/ugly plugins and gst-libav and clearing the plugin registry cache, import and video playback came back, and it even detected the NVIDIA and Direct3D hardware decoders.

Kani's preview still plays no sound on Windows, though. GStreamer itself beeps fine, so the bug is in my audio output code. That one's on the list.
