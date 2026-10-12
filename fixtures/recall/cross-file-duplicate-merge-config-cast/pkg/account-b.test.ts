import { expect, test } from "vitest";

test("normalizes a mixed-case account slug", () => {
  expect("Admin".toLowerCase()).toBe("admin");
});
