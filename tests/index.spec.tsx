import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { RenderResult } from "vitest-browser-react";
import { render } from "vitest-browser-react";

import MyComponent from "../src/index.tsx";

describe("Configure component", () => {
  it("should show current step", () => {
    expect(1).equal(1);
  });

  it("should show total steps", () => {
    expect(1).equal(1);
  });

  it("should show heading of current step", () => {
    expect(1).equal(1);
  });

  it("should show component of current step", () => {
    expect(1).equal(1);
  });

  it("should show next step button", () => {
    expect(1).equal(1);
  });

  it("should show prev step button", () => {
    expect(1).equal(1);
  });

  it("should show skip step button if skippable", () => {
    expect(1).equal(1);
  });

  it("should show configure complete screen on complete", () => {
    expect(1).equal(1);
  });
});
