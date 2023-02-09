import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl pt-20 pb-32 sm:pt-48 sm:pb-40">
      <h1 className="text-4xl font-bold tracking-tight sm:text-center sm:text-6xl">
        Meeting Scheduler
      </h1>
      <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-center">
        Use the app as an attendee or as an organizer.
        <br /> You can impersonate all available users.
      </p>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
        <Link
          href="/attendee/0"
          className="inline-block rounded-lg bg-green-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-green-600 hover:bg-green-700 hover:ring-green-700"
        >
          Attendee{" "}
          <span className="text-green-200" aria-hidden="true">
            &rarr;
          </span>
        </Link>
        <Link
          href="/organizer/0"
          className="inline-block rounded-lg bg-blue-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-blue-600 hover:bg-blue-700 hover:ring-blue-700"
        >
          Organizer{" "}
          <span className="text-blue-200" aria-hidden="true">
            &rarr;
          </span>
        </Link>
      </div>
    </div>
  );
}
