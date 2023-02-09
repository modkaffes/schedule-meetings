import { use } from "react";

type User = {
  id: number;
  type: "organizer" | "attendee";
};

async function fetchUser({ id, type }: User) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${type}s/${id}`);

  // TODO: Add server component error and loading states
  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }

  return res.json();
}

export default function UserName({ id, type }: User) {
  const { name } = use(fetchUser({ type, id }));

  return name;
}
