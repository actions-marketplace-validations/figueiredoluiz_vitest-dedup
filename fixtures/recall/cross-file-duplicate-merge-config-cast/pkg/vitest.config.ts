import { defineConfig, mergeConfig } from "vitest/config";
import base from "../base";

export default mergeConfig(
  base,
  defineConfig({ test: { setupFiles: ["./setup.ts"] } }),
) as object;
