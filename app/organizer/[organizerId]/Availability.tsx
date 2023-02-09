"use client";

import toast from "react-hot-toast";

import { useRouter } from "next/navigation";

export default function Availability({ organizerId }: { organizerId: string }) {
  const router = useRouter();

  async function createTimeslot() {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/timeslots`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        organizerId: parseInt(organizerId),
        attendeeId: "",
        //TODO: Add real dates
        startDateTime: "2023-02-20T10:00:00.000Z",
        endDateTime: "2023-02-20T10:30:00.000Z",
      }),
    });

    router.refresh();

    toast.success("Timeslots created");
  }

  return (
    <div className="mt-12">
      {/* TODO: Add availability functionality here*/}
      <button
        className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
        onClick={createTimeslot}
      >
        Create timeslots
      </button>
    </div>
  );
}
