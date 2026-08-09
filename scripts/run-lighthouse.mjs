import { spawn } from "node:child_process";
import process from "node:process";

import { chromium } from "@playwright/test";

const command = process.platform === "win32" ? "lhci.cmd" : "lhci";
const lighthouse = spawn(command, ["autorun"], {
  env: {
    ...process.env,
    CHROME_PATH: process.env.CHROME_PATH ?? chromium.executablePath(),
  },
  stdio: "inherit",
});

lighthouse.on("error", (error) => {
  console.error(`Unable to start Lighthouse CI: ${error.message}`);
  process.exitCode = 1;
});

lighthouse.on("exit", (code, signal) => {
  if (signal) {
    console.error(`Lighthouse CI stopped after receiving ${signal}.`);
    process.exitCode = 1;
    return;
  }

  process.exitCode = code ?? 1;
});
