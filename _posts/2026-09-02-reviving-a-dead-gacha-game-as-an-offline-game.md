---
title: Reviving a dead gacha game as an offline game - Day 1
date: 2026-09-02T11:40:00
tags:
  - gacha
  - goddess-kiss
  - json
  - unity
  - csharp
  - project
excerpt: ''
---

**Special thanks to insomnyawolf and realZenith for the CommanderCS project. If it wasn't for their efforts, this experiment wouldn't even have its starting ground.**

I'll be documenting my initial journey on this and my personal thoughts and motivations behind this, as well as giving a short background about the gacha game that I've since been longing to go back to before they even killed the game a few days from a server failure last 2021.

Here's how the first day went:

`9/1/26`

- `decompiled the apk and obb as a Unity project (5.6.5p1) using AssetRipper`
- `decompiled Assembly-CSharp.dll using ilspycmd and -lv CSharp4`
- `corrected most decompiled codes that are throwing errors`
- `removed Newtonsoft.Json folders in Assets/Script`
- `added Newtonsoft.Json.dll in Assets/Plugins as a replacement for badly decompiled Newtonsoft.Json cs files in Assets/Script`

`Most work done so far were just addressing any bad codes and thrown errors. Primary issues were from Newtonsoft.Json. Will run a test tomorrow if it even runs or compiles and I’ll send another update re: what happens from that point.`

Right now, at the time of this writing, I'm checking whether or not the game will be able to compile or be even interactive enough to play up to the intro/login screen. Should it work, here's going to be the next roadmap:

- `Hooking the game to the CommanderCS server.`
- `Publish the project as a Windows app for further testing.`
- `Look at the launcher angle similar to Revival:Side so that the user account management and server setup can be accessed and configured in one place.`
- `Research for a way to integrate the CommanderCS server as a part of the game itself instead of a separate entity.`
- `Upgrading the Unity project up to the latest version.`
- `Upgrading any backend dependencies that might break alongside the version upgrade. The codebase is expected to break in the process.`
- `Restoring and upscaling any image assets if possible.`
- `Optimizing any image assets (pngs, jpgs, or svgs) to a better compression.`
- `Recompile the whole project with the remastered assets.`
- `Do a final test.`
- `Integrate the app, CommanderCS and their dependencies in a centralized launcher package.`
- `Run a user test in Discord to gather as much game logic issues and bugs to fix and address.`
- `Create a repository for the Launcher.`

I'll be periodically updating this whole process from time to time. Hopefully this works to a degree that satisfies my needs.
