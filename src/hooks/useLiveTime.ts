"use client";
// ============================================================
//  hooks/useLiveTime.ts
//  Returns a live-updating time string for display in the navbar.
//  Updates every second with no memory leaks.
// ============================================================
import { useState, useEffect } from "react";

interface LiveTime {
  timeString: string;  // "5:07 PM"
  tzString:   string;  // "GMT+5:30"
  isNightOwl: boolean; // true between 00:00 and 05:00
}

export function useLiveTime(timezone?: string): LiveTime {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    // Update every second
    const id = setInterval(() => setNow(new Date()), 1_000);
    return () => clearInterval(id);
  }, []);

  const tz = timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;

  const timeString = now.toLocaleTimeString("en-US", {
    timeZone: tz,
    hour:     "numeric",
    minute:   "2-digit",
    hour12:   true,
  });

  // e.g. "(GMT+5:30)" → "GMT+5:30"
  const tzString = now.toLocaleTimeString("en-US", {
    timeZone:     tz,
    timeZoneName: "shortOffset",
  })
    .split(" ")
    .slice(-1)[0]         // grab "GMT+5:30"
    .replace("GMT", "IST +");

  const hour = now.getHours();
  const isNightOwl = hour >= 0 && hour < 5;

  return { timeString, tzString, isNightOwl };
}
