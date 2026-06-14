"use client";
import { useEffect, useState } from "react";
import { Settings } from "@/types";
import { API_URLS } from "@/lib/api";

const defaultSettings: Settings = { platformName: "QuizApp", platformDescription: "Test your web dev knowledge" };

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  useEffect(() => {
    fetch(API_URLS.settings)
      .then((r) => r.json())
      .then((d) => setSettings({ ...defaultSettings, ...d }))
      .catch(() => {});
  }, []);
  return { settings };
}