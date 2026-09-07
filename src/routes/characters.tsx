import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/characters")({
  beforeLoad: () => {
    throw redirect({ to: "/library" });
  },
  component: () => null,
});
