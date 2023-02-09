import { use } from "react";

import { CalendarIcon } from "@heroicons/react/24/solid";

import Actions from "app/Actions";
import UserName from "app/UserName";
import { format, parseISO } from "date-fns";

async function getTimeSlots({ userId }: { userId: string }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/attendees/${userId}?_embed=timeslots`
  );

  // TODO: handle errors
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default function UpcomingAppointments({ userId }: { userId: string }) {
  const { timeslots } = use(getTimeSlots({ userId }));

  return (
    <div className="mt-12">
      <h2 className="font-semibold text-gray-900">Upcoming appointments</h2>
      {timeslots.length > 0 ? (
        <ol className="mt-4 divide-y divide-gray-200 text-sm leading-6 text-gray-500">
          {timeslots.map((appointment: Timeslot) => (
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
                <UserName type="organizer" id={appointment.organizerId} />
              </div>
              <div className="sm:ml-auto">
                <Actions id={appointment.id} />
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-3 text-sm text-gray-500">
          You don’t have any upcoming appointments. You can book an available
          slot above.
        </p>
      )}
    </div>
  );
}
