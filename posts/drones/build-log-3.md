---
title: "Drone Build Log — Part 3: PID Tuning, First Flight, Regrets"
date: 2026-08-14
tags: [hardware, drones, build-log, control-systems]
---

This is the part where the drone flies. Or crashes. Or, in my case, both.

## PID tuning without a proper starting point

The whole reason you tune PID gains on a quad is that no two builds have the same mass distribution, motor response, or propeller inertia. Copy someone's tune from the internet and you get, at best, a wobbly hover; at worst, an oscillating wobble that shakes the frame apart in six seconds.

I started with the Betaflight defaults for 5-inch and adjusted from there:

<svg viewBox="0 0 680 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="PID tuning: response over three iterations">
  <text x="340" y="20" fill="#9ba2a8" font-size="11" text-anchor="middle">Roll axis step response — 3 tuning passes</text>

  <!-- axes -->
  <line x1="60" y1="180" x2="640" y2="180" stroke="#5e6b73" stroke-width="0.8"/>
  <line x1="60" y1="40" x2="60" y2="180" stroke="#5e6b73" stroke-width="0.8"/>
  <text x="60" y="200" fill="#5e6b73" font-size="9" text-anchor="middle">t=0</text>
  <text x="640" y="200" fill="#5e6b73" font-size="9" text-anchor="middle">t=400ms</text>
  <text x="55" y="45" fill="#5e6b73" font-size="9" text-anchor="end">target</text>

  <!-- target -->
  <line x1="60" y1="60" x2="640" y2="60" stroke="#5e6b73" stroke-width="0.6" stroke-dasharray="3,3"/>

  <!-- Pass 1: sluggish -->
  <path d="M 60 180 Q 200 160 340 120 T 640 90" fill="none" stroke="#f87171" stroke-width="1.6"/>
  <text x="500" y="105" fill="#f87171" font-size="10">Pass 1 — sluggish, undershoot</text>

  <!-- Pass 2: overshoot / oscillation -->
  <path d="M 60 180 L 140 45 L 200 90 L 260 55 L 320 75 L 380 62 L 440 68 L 640 65" fill="none" stroke="#fbbf24" stroke-width="1.6"/>
  <text x="500" y="45" fill="#fbbf24" font-size="10">Pass 2 — overshoot, oscillating</text>

  <!-- Pass 3: clean -->
  <path d="M 60 180 Q 130 90 220 65 T 640 60" fill="none" stroke="#48d597" stroke-width="1.8"/>
  <text x="500" y="150" fill="#48d597" font-size="10">Pass 3 — clean settle</text>
</svg>

The green trace on the third pass is what I was after: rise fast, settle without ringing. Getting there from Pass 2 (yellow, oscillating) meant dropping D gain from 42 to 28 and increasing the D-term low-pass filter cutoff by 20 Hz. All done in five minutes hovering ten inches above the workbench, watching the Blackbox log stream past.

## The first flight

I took the drone to a small park. It was empty at 7 AM on a Saturday except for two kids and their father, who wanted to see "the machine."

I flew for about four minutes. It handled cleanly. Then I got cocky, tried a split-S I had absolutely no business attempting, and the drone met a hedge from about 40 feet up.

## Damage report

- One prop cracked (of course)
- Frame arm nicked but structural
- Motor bell got a wobble I can't quite feel with my hand — will replace
- Every screw is now finger-tight because they backed out from the impact

Total repair cost: about $18 in parts, an hour of soldering to reseat the front-right motor, and an evening of ego repair.

## Regrets, in order

1. Doing the maiden flight in a park with children present. Nobody was in danger — I flew well away from them — but the *perception* of a stranger arriving with a spinning-blade contraption at 7 AM is not what I want to project.
2. Attempting the split-S. The whole point of a first flight is *feel it out*. I did not feel it out.
3. Not putting a GoPro on it. This whole crash is a story now, but a story with footage would be a *better* story.

## What I'd tell past-me

- Fly boring for the first ten batteries.
- Buy more props than you think you need. Then buy more.
- The moment the frame is airworthy is the moment to *slow down*, not speed up.

Series over. Next drone build starts in a few months — hopefully with fewer hedges.
