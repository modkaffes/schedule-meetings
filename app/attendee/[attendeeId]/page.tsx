import Calendar from "./Calendar";
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

async function getTimeSlots() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/timeslots?_expand=organizer`
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
  const timeslots = await getTimeSlots();

  return (
    <>
      <h1 className="text-xl font-semibold text-gray-900">
        Hello, {name}!
        <br />
        Select a date and time for your meeting:
      </h1>
      <Calendar timeslots={timeslots} />
      <UpcomingAppointments userId={attendeeId} />
    </>
  );
}
