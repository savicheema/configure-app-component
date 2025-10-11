import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { RenderResult } from "vitest-browser-react";
import { render } from "vitest-browser-react";

import MyComponent from "../src/index.tsx";

describe("MobileNavigation", () => {
  it("should have MobileNavigation in document", () => {
    const screen: RenderResult = render(
      <MyComponent person={{ name: "goo", age: 24 }} />
    );

    const mobileNavigation = screen.getByTestId("my-component");

    expect(mobileNavigation).toBeInTheDocument();
  });
});
