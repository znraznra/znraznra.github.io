---
title: GK Unplugged - Day 2
date: 2026-09-02T18:17:00
tags:
  - gk-unplugged
  - unity
  - csharp
  - json
  - vscode
excerpt: 'Day 2 update logs for the gacha revival project. Also giving it a name: GK-Unplugged.'
---

Update as of today, 9/2/26

- project is running and compiling, but the script references are missing. most likely due to the decompiling process or overwriting the Assembly-CSharp folder with the one extracted from ilspycmd -lv CSharp4
- made another AssetRipper export from the original apk/obb to cross-reference and update the .meta files to fix the issue
- updated NGUI shaders from Assets/Resources/Shaders to fix missing/glitchy rendered graphics when playing the game within Unity
- Updated some NGUI files along the way to resolve some build/asset loading issues.

Will try further fixes tomorrow as I've been encountering a lot of UIDrawCall errors. Will park for now.
