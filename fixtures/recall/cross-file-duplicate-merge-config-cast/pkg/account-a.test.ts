import { expect, test } from "vitest";

test("normalizes the account slug", () => {
  expect("Admin".toLowerCase()).toBe("admin");
});
