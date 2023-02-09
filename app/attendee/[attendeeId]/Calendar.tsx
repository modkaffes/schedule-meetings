"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import { classNames } from "@/utils/classNames";
import { CalendarIcon, ClockIcon } from "@heroicons/react/24/outline";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";

import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isAfter,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  parseISO,
  startOfToday,
} from "date-fns";
import { useRouter } from "next/navigation";

export default function Calendar({
  timeslots,
  attendeeId,
}: {
  timeslots: (Timeslot & { organizer: Organizer })[];
  attendeeId: string;
}) {
  const router = useRouter();

  const today = startOfToday();
  const [selectedDay, setSelectedDay] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  const [selectedTimeslot, setSelectedTimeslot] = useState<
    (Timeslot & { organizer: Organizer }) | undefined
  >();

  const days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  function previousMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  const selectedDayTimeslots = timeslots.filter((timeslot) =>
    isSameDay(parseISO(timeslot.startDateTime), selectedDay)
  );

  async function handleConfirm({
    attendeeId,
    timeslotId,
  }: {
    attendeeId: number;
    timeslotId: number;
  }) {
    // TODO: Add loading state

    // Confirm event
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/timeslots/${timeslotId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attendeeId }),
    });

    // Refresh the current route and fetch new data from the server without
    // losing client-side browser or React state.
    router.refresh();

    setSelectedTimeslot(undefined);
    toast.success("Appointment confirmed!");
  }

  return (
    <div className="mt-12 md:grid md:grid-cols-2 md:divide-x md:divide-gray-200">
      <div className="md:pr-14">
        <div className="flex w-full items-center">
          <h2 className="flex-auto font-semibold text-gray-900">
            {format(firstDayCurrentMonth, "MMMM yyyy")}
          </h2>
          <button
            type="button"
            onClick={previousMonth}
            className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Previous month</span>
            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            onClick={nextMonth}
            type="button"
            className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Next month</span>
            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-10 grid grid-cols-7 text-center text-xs leading-6 text-gray-500">
          <div>S</div>
          <div>M</div>
          <div>T</div>
          <div>W</div>
          <div>T</div>
          <div>F</div>
          <div>S</div>
        </div>
        <div className="mt-2 grid grid-cols-7 text-sm">
          {days.map((day, dayIdx) => (
            <div
              key={day.toString()}
              className={classNames(
                dayIdx === 0 && colStartClasses[getDay(day)],
                "py-1.5"
              )}
            >
              <button
                type="button"
                onClick={() => {
                  // Deselect possibly selected timeslot on day change
                  setSelectedTimeslot(undefined);
                  setSelectedDay(day);
                }}
                className={classNames(
                  isEqual(day, selectedDay) && "text-white",
                  !isEqual(day, selectedDay) &&
                    isToday(day) &&
                    "text-green-600",
                  !isEqual(day, selectedDay) &&
                    !isToday(day) &&
                    isSameMonth(day, firstDayCurrentMonth) &&
                    "text-gray-900",
                  !isEqual(day, selectedDay) &&
                    !isToday(day) &&
                    !isSameMonth(day, firstDayCurrentMonth) &&
                    "text-gray-400",
                  isEqual(day, selectedDay) && isToday(day) && "bg-green-600",
                  isEqual(day, selectedDay) && !isToday(day) && "bg-gray-900",
                  !isEqual(day, selectedDay) && "hover:bg-gray-200",
                  (isEqual(day, selectedDay) || isToday(day)) &&
                    "font-semibold",
                  "mx-auto flex h-8 w-8 items-center justify-center rounded-full"
                )}
              >
                <time dateTime={format(day, "yyyy-MM-dd")}>
                  {format(day, "d")}
                </time>
              </button>

              <div className="mx-auto mt-1 h-1 w-1">
                {/* Indication for day with available slots and is in the future */}
                {timeslots.some(
                  (timeslot) =>
                    timeslot.attendeeId === "" &&
                    isAfter(parseISO(timeslot.startDateTime), new Date()) &&
                    isSameDay(parseISO(timeslot.startDateTime), day)
                ) && (
                  <div className="mt-1 h-1 w-1 rounded-full bg-green-500"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 md:mt-0 md:pl-14">
        <h2 className="font-semibold text-gray-900">
          Available times for{" "}
          <time dateTime={format(selectedDay, "yyyy-MM-dd")}>
            {format(selectedDay, "MMM dd, yyy")}
          </time>
        </h2>

        {selectedDayTimeslots.length > 0 ? (
          <ol className="mt-4 grid grid-cols-4 gap-4">
            {selectedDayTimeslots.map(
              (timeslot) =>
                // Only show timeslots that are not booked and are in the future
                isAfter(parseISO(timeslot.startDateTime), new Date()) &&
                timeslot.attendeeId === "" && (
                  <li key={timeslot.id}>
                    <button
                      onClick={() => setSelectedTimeslot(timeslot)}
                      type="button"
                      className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      <time dateTime={timeslot.startDateTime}>
                        {format(parseISO(timeslot.startDateTime), "HH:mm ")}
                      </time>
                    </button>
                  </li>
                )
            )}
          </ol>
        ) : (
          <p className="mt-4 text-sm text-gray-500">
            No available timeslots for this day
          </p>
        )}

        {selectedTimeslot && (
          <div className="mt-8 rounded-xl bg-green-50 p-4">
            <h2 className="font-semibold text-gray-900">Appointment details</h2>
            <div className="flex flex-col gap-2 py-4  ">
              <div className="flex items-center gap-2">
                <UserCircleIcon className="h-5 w-5" aria-hidden="true" />
                {selectedTimeslot.organizer.name}
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" aria-hidden="true" />
                <div>
                  <time
                    dateTime={selectedTimeslot.startDateTime}
                    className="w-32 flex-none"
                  >
                    {format(
                      parseISO(selectedTimeslot.startDateTime),
                      "LLLL do, yyyy"
                    )}
                  </time>
                  {" at "}
                  <time dateTime={selectedTimeslot.startDateTime}>
                    {format(parseISO(selectedTimeslot.startDateTime), "HH:mm")}
                  </time>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="h-5 w-5" aria-hidden="true" />
                30 minutes
              </div>
            </div>

            <div className="sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                onClick={() => {
                  handleConfirm({
                    attendeeId: parseInt(attendeeId),
                    timeslotId: selectedTimeslot.id,
                  });
                }}
              >
                Confirm
              </button>
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                onClick={() => setSelectedTimeslot(undefined)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];
