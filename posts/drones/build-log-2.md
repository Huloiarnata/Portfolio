---
title: "Drone Build Log — Part 2: Wiring, ESCs, Flight Controller"
date: 2026-08-12
tags: [hardware, drones, build-log, electronics]
---

Part 2 of the drone build. Part 1 was mostly excitement and unboxing. Part 2 is soldering, which humbled me.

## The wiring diagram

Here's what I ended up with — four ESC signal lines routed to the FC's motor pins, XT60 to the ESC power pads, telemetry line for RPM feedback:

<svg viewBox="0 0 680 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Wiring diagram: 4-in-1 ESC to flight controller">
  <text x="340" y="22" fill="#9ba2a8" font-size="11" text-anchor="middle">4-in-1 ESC → Flight Controller signal + power</text>

  <!-- Battery -->
  <rect x="30" y="90" width="90" height="50" rx="4" fill="none" stroke="#48d597" stroke-width="1.5"/>
  <text x="75" y="118" fill="#48d597" font-size="11" text-anchor="middle" font-weight="600">4S 1500mAh</text>

  <!-- ESC -->
  <rect x="220" y="70" width="150" height="90" rx="4" fill="none" stroke="currentColor" stroke-width="1.2"/>
  <text x="295" y="95" fill="currentColor" font-size="11" text-anchor="middle" font-weight="600">4-in-1 ESC</text>
  <text x="295" y="112" fill="currentColor" font-size="9" opacity="0.6" text-anchor="middle">BLHeli_32 · 45A</text>
  <circle cx="245" cy="140" r="3" fill="#fbbf24"/>
  <circle cx="275" cy="140" r="3" fill="#fbbf24"/>
  <circle cx="315" cy="140" r="3" fill="#fbbf24"/>
  <circle cx="345" cy="140" r="3" fill="#fbbf24"/>
  <text x="295" y="153" fill="#fbbf24" font-size="8" text-anchor="middle">M1  M2  M3  M4</text>

  <!-- FC -->
  <rect x="470" y="70" width="180" height="90" rx="4" fill="none" stroke="currentColor" stroke-width="1.2"/>
  <text x="560" y="95" fill="currentColor" font-size="11" text-anchor="middle" font-weight="600">SpeedyBee F7 V3</text>
  <text x="560" y="112" fill="currentColor" font-size="9" opacity="0.6" text-anchor="middle">F722 · gyro ICM-42688-P</text>
  <circle cx="495" cy="140" r="3" fill="#60a5fa"/>
  <circle cx="525" cy="140" r="3" fill="#60a5fa"/>
  <circle cx="595" cy="140" r="3" fill="#60a5fa"/>
  <circle cx="625" cy="140" r="3" fill="#60a5fa"/>
  <text x="560" y="153" fill="#60a5fa" font-size="8" text-anchor="middle">S1  S2  S3  S4</text>

  <!-- Battery → ESC -->
  <line x1="120" y1="115" x2="220" y2="115" stroke="#f87171" stroke-width="1.5"/>
  <text x="170" y="108" fill="#f87171" font-size="9" text-anchor="middle">XT60 +/-</text>

  <!-- ESC → FC signals -->
  <line x1="245" y1="140" x2="495" y2="140" stroke="#60a5fa" stroke-width="0.8" stroke-dasharray="2,2"/>
  <line x1="275" y1="140" x2="525" y2="140" stroke="#60a5fa" stroke-width="0.8" stroke-dasharray="2,2"/>
  <line x1="315" y1="140" x2="595" y2="140" stroke="#60a5fa" stroke-width="0.8" stroke-dasharray="2,2"/>
  <line x1="345" y1="140" x2="625" y2="140" stroke="#60a5fa" stroke-width="0.8" stroke-dasharray="2,2"/>

  <text x="435" y="200" fill="#9ba2a8" font-size="9" text-anchor="middle">4 PWM signal lines + shared ground</text>
</svg>

## The three things I got wrong the first time

1. **Motor order.** I wired M1 through M4 in the order that felt natural, which is not the order Betaflight wants. Reordering in the configurator is easier than resoldering — I recommend saving your sanity and doing it in software.

2. **Prop direction.** Half the motors need to spin clockwise, half counter-clockwise. Getting this wrong means the drone will simply flip on the workbench the moment you throttle up. Ask me how I know.

3. **Telemetry.** I skipped wiring RPM telemetry on the first pass because the ESC will "still work without it." True. But without RPM feedback, the PID loops guess, and guessing gets expensive when the guess is 2400 W of thrust.

## Betaflight config

The default rates felt sluggish, but rate tuning is Part 3. For now:

```
set rc_smoothing = ON
set rc_smoothing_type = FILTER
set gyro_lowpass_hz = 250
set dyn_notch_min_hz = 100
set dyn_notch_max_hz = 500
save
```

Everything spins. Everything is where the configurator expects it. No smoke.

Onwards to Part 3, where I'll try to fly it.
