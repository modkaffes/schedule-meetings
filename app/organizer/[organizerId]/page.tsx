import { CalendarIcon } from "@heroicons/react/24/solid";

import Actions from "app/Actions";
import UserName from "app/UserName";
import { format, parseISO } from "date-fns";

import Availability from "./Availability";

async function fetchData({ userId }: { userId: number }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/organizers/${userId}?_embed=timeslots`
  );

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function Page({
  params,
}: {
  params: { organizerId: string };
}) {
  const { organizerId } = params;

  const data = await fetchData({ userId: parseInt(organizerId) });

  const availableTimeslots: Timeslot[] = [];
  const bookedTimeslots: Timeslot[] = [];

  // Split timeslots into available and booked
  data.timeslots.reduce((_: any, timeslot: Timeslot) => {
    if (timeslot.attendeeId === "") {
      availableTimeslots.push(timeslot);
    } else {
      bookedTimeslots.push(timeslot);
    }

    return _;
  }, []);

  return (
    <>
      <h1 className="text-xl font-semibold text-gray-900">
        Hello, {data.name}!
        <br />
        Add your availability:
      </h1>

      <Availability organizerId={organizerId} />

      <div className="mt-12">
        <h2 className="font-semibold text-gray-900">Available timeslots</h2>
        {availableTimeslots.length > 0 ? (
          <ol className="mt-4 divide-y divide-gray-200 text-sm leading-6 text-gray-500">
            {availableTimeslots.map((appointment: Timeslot) => (
              <li
                key={appointment.id}
                className="group flex flex-col gap-1 py-3 sm:flex-row sm:gap-6"
              >
                <div className="flex items-center gap-2">
                  <CalendarIcon
                    className="inline-flex h-5 w-5"
                    aria-hidden="true"
                  />
                  <div>
                    <time
                      dateTime={appointment.startDateTime}
                      className="w-32 flex-none"
                    >
                      {format(
                        parseISO(appointment.startDateTime),
                        "LLLL do, yyyy"
                      )}
                    </time>
                    {" at "}
                    <time dateTime={appointment.startDateTime}>
                      {format(parseISO(appointment.startDateTime), "HH:mm")}
                    </time>
                    {" - "}
                    <time dateTime={appointment.endDateTime}>
                      {format(parseISO(appointment.endDateTime), "HH:mm")}
                    </time>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-3 text-sm text-gray-500">
            {bookedTimeslots.length > 0
              ? "All your available timeslots are booked."
              : "Add your availability above."}
          </p>
        )}
      </div>

      <div className="mt-12">
        <h2 className="font-semibold text-gray-900">Upcoming appointments</h2>
        {bookedTimeslots.length > 0 ? (
          <ol className="mt-4 divide-y divide-gray-200 text-sm leading-6 text-gray-500">
            {bookedTimeslots.map((appointment: Timeslot) => (
              <li
                key={appointment.id}
                className="group flex flex-col gap-1 py-3 sm:flex-row sm:gap-6"
              >
                <div className="flex w-56 items-center gap-2">
                  <CalendarIcon
                    className="inline-flex h-5 w-5"
                    aria-hidden="true"
                  />
                  <div>
                    <time
                      dateTime={appointment.startDateTime}
                      className="w-32 flex-none"
                    >
                      {format(
                        parseISO(appointment.startDateTime),
                        "LLLL do, yyyy"
                      )}
                    </time>
                    {" at "}
                    <time dateTime={appointment.startDateTime}>
                      {format(parseISO(appointment.startDateTime), "HH:mm")}
                    </time>
                  </div>
                </div>
                <div className="font-semibold text-gray-900">
                  <UserName type="attendee" id={appointment.organizerId} />
                </div>
                <div className="sm:ml-auto">
                  <Actions id={appointment.id} />
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-3 text-sm text-gray-500">
            You don’t have any upcoming appointments. When an attendee books you
            for a session, it will show up here.
          </p>
        )}
      </div>
    </>
  );
}
