---
title: "Drone Build Log — Part 1: Frame, Motors, First Bench Test"
date: 2026-08-10
tags: [hardware, drones, build-log]
---

I've been meaning to build a 5-inch racing drone for two years. This week the parts finally showed up, and this is the first entry in what I hope becomes a **complete build log**: frame, motors, ESCs, flight controller, PID tuning, first flight, first crash, all of it.

## Why 5-inch, why now

Five inches is the sweet spot for FPV racing quads:

- Motors are widely available in the 2207 / 1900 KV range
- Props are dirt cheap
- The frame is small enough to be forgiving of my mediocre soldering, big enough to fly in a park

I was also drawn to the idea that everything on the airframe is a *tradeoff you can see*: weight vs. thrust, torque vs. RPM, propeller pitch vs. current draw. Nothing is hidden behind an abstraction.

## The parts list

```
Frame     : GEP-Mark4 5"
Motors    : 4× iFlight XING 2207 1900KV
ESCs      : 4-in-1 45A BLHeli_32
FC        : SpeedyBee F7 V3
Battery   : 4S 1500mAh 100C
Props     : HQProp T5.1x3.1x3 (spare set of 4 in the drawer)
```

Total came out to just under $260, which is roughly what I expected for a
first build where I haven't yet figured out what I can compromise on.

## First bench test

With just the ESCs, flight controller, and one motor at a time, I set up
Betaflight and ran the motor test.

> The first time all four motors spun in the correct direction on the same
> command was, I'll admit, more emotional than I expected. Two years of
> "someday" collapsing into ten seconds of angry buzzing on the workbench.

I did **not** put props on for this. Please do not put props on for this.

## What's next

Part 2 covers wiring the four ESC signal lines cleanly, hooking up the flight
controller, and my first real Betaflight configurator session. Part 3 (if all
goes well) will be the first flight.

If the flight goes poorly, Part 3 will still exist — just with more of the
airframe on the ground.
