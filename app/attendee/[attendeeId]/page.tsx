import UpcomingAppointments from "./UpcomingAppointments";

async function getUser({ attendeeId }: { attendeeId: string }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/attendees/${attendeeId}`
  );

  // TODO: handle errors
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function Page({
  params,
}: {
  params: { attendeeId: string };
}) {
  const { attendeeId } = params;

  const { name } = await getUser({ attendeeId });

  return (
    <>
      <h1 className="text-xl font-semibold text-gray-900">Hello, {name}!</h1>
      <UpcomingAppointments userId={attendeeId} />
    </>
  );
}
