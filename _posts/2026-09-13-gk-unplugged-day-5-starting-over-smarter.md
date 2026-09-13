---
title: GK Unplugged - Starting Over, Smarter
date: 2026-09-13T17:24:00
tags:
  - gk-unplugged
  - unity
  - json
  - csharp
excerpt: Just had the time to get back to this. Documenting what I've done so far.
---

Today was a restart day. A while back, a broad, automated GUID-relinking pass (meant to fix a couple of stray "missing script" errors) went wrong and corrupted the project — likely from its filename-fallback matching mismatching generic-named assets across folders. Rather than fight the corruption, I restored from backup and rebuilt from a fresh AssetRipper export, this time with the lessons from that mistake already in hand.

**The good news:** since every fix from the first pass was documented, re-deriving them was fast. Here's what today's progress covered, roughly in the order it came up.

## Compile-time cleanup

A few small but blocking issues on the way to a clean build:

- **Duplicate `AssemblyInfo.cs`** — two copies existed (one under `Assembly-CSharp`, one under legacy `Assembly-UnityScript` boilerplate), which C# doesn't allow. Deleted the redundant one.
- **Decompiler false alarms** — ILSpy occasionally reconstructs valid logic in a shape the C# compiler's definite-assignment checker can't quite follow, throwing `CS0165: Use of unassigned local variable` even though the code always assigns the variable before it's read. Hit this twice — once in a low-level `ByteReader.cs` line-parsing loop, once in a `DialoguerEditor` theme-naming utility with a gnarly `(array2 = array)[num = i] = ...` compound-assignment pattern. Fix in both cases: just give the variable a default value at declaration (`= 0`, `= null`). Doesn't change behavior, just satisfies the compiler.

## Runtime: the Android-only landmines, again

Getting Play mode working meant re-clearing the same category of issue as the first pass: code that assumes it's running on an actual Android device.

- **The permission-check plugin** (`net.sanukin.OverrideUnityActivity`, wired through `M00_Init.cs`) crashes hard on Windows since there's no native Android JNI bridge underneath it. Guarded both `Setup()` and `CheckPermissionProcess()` (the latter gets called from _two_ different places — the boot sequence and `OnApplicationPause` — so the guard has to live inside the method itself, not at each call site) with `Application.platform == RuntimePlatform.Android` checks.
- **The Adjust SDK** (mobile analytics, whose servers don't exist to report to anyway) was the bigger project today. Instead of guarding each of its \~20 public methods one at a time as they surfaced as separate crashes — which is how it went last time — I went through the whole file and guarded every method in one pass. Then, since every guarded method's _entire remaining body_ is now permanently unreachable dead code, I went a step further and rebuilt the file as a minimal stub: same public API surface, zero actual native-call logic. **550 lines became 61.** Nothing else in the codebase needed to change, since every method signature stayed identical — it just does nothing now, correctly, instead of doing nothing after crashing first.

## The UIRoot race condition

Hit a `List<UIRoot>` index-out-of-range error the moment the WorldMap scene loads — `UIManager`'s `World` class was reading `UIRoot.list[0]` in a field initializer, which runs the instant the object gets constructed, with no guarantee `UIRoot` had registered itself into that static list yet. Converted it to a lazy property instead, deferring the lookup until something actually needs it. By that point in the game's lifecycle, `UIRoot` is definitely there.

## Shaders, again

The recurring theme of this whole project: **AssetRipper doesn't reliably extract shader assets from a compiled build.** Every fresh export needs the same fix — pull NGUI's `Shaders` folder from the actual GitHub source and drop it into `Assets/Resources/Shaders`. Skip this step and you get both broken-looking UI _and_ invisible text, since NGUI's rendering and text drawing both depend on it. Did it again today; both symptoms cleared in one move, same as last time.

One shader-related `NullReferenceException` turned out to be a red herring — it only fires from the Editor's **Scene view** trying to render NGUI's `[ExecuteInEditMode]` panels, not from the actual Game window. Confirmed gameplay itself is unaffected and parked it rather than chasing an editor-only cosmetic quirk.

## Where things stand

Play mode is clean again — booting, UI rendering, no crashes — at roughly the same point the first attempt reached before the GUID mishap. The difference this time: every fix is captured, the mistake that caused the corruption is documented and avoided, and the whole restart took a fraction of the time the original debugging did, since there was a real playbook to follow instead of discovering everything from scratch.

Next up: getting back to an actual Windows Build, and — this time — being much more careful about how any future GUID relinking gets done.
