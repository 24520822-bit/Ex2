import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import App from "./App";

it("filters, deletes while moving focus, and restores the original directory", async () => {
  const user = userEvent.setup();
  render(<App />);

  const search = screen.getByRole("searchbox", { name: /search by name/i });
  expect(search.id).toBeTruthy();
  expect(document.querySelector(`label[for="${search.id}"]`)).not.toBeNull();

  await user.type(search, "Johann Goethe");
  expect(screen.getByRole("status").textContent).toContain("1 person");

  const person = screen.getByRole("article");
  const deleteButton = within(person).getByRole("button", { name: "Delete Johann Goethe" });
  await user.click(deleteButton);

  expect(screen.getByRole("status").textContent).toContain("0 people");
  expect(document.activeElement).toBe(screen.getByRole("button", { name: "Reset directory" }));

  await user.click(screen.getByRole("button", { name: "Reset directory" }));
  expect(screen.getByRole("status").textContent).toContain("12 people");
  expect(screen.getByRole("article", { name: "Johann Goethe" })).not.toBeNull();
});

it("keeps other cards stable and focuses the next delete control after removing Goethe", async () => {
  const user = userEvent.setup();
  render(<App />);

  const einsteinCard = screen.getByRole("article", { name: "Albert Einstein" });
  await user.click(screen.getByRole("button", { name: "Delete Johann Goethe" }));

  expect(screen.getByRole("article", { name: "Albert Einstein" })).toBe(einsteinCard);
  expect(document.activeElement).toBe(screen.getByRole("button", { name: "Delete Katherine Johnson" }));
});

it("applies the numeric IQ threshold and sorts the visible people by age", async () => {
  const user = userEvent.setup();
  render(<App />);

  const minimumIq = screen.getByRole("spinbutton", { name: "Minimum IQ" });
  await user.type(minimumIq, "200");
  expect(screen.getByRole("status").textContent).toContain("1 person");
  expect(screen.getByRole("article", { name: "Johann Goethe" })).not.toBeNull();

  await user.clear(minimumIq);
  await user.selectOptions(screen.getByRole("combobox", { name: "Sort by" }), "age");
  expect(screen.getAllByRole("article")[0].getAttribute("aria-label")).toBe("Ada Lovelace");
});
