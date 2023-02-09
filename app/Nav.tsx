"use client";

import { classNames } from "@/utils/classNames";

import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";

export default function Nav() {
  const [selectedLayoutSegments] = useSelectedLayoutSegments();
  return (
    <nav className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <Link href="/" className="py-4">
          <h1 className="text-2xl font-semibold text-green-600">
            Meeting Scheduler
          </h1>
        </Link>
        <span
          className={classNames(
            selectedLayoutSegments === "organizer" && "text-blue-600",
            selectedLayoutSegments === "attendee" && "text-green-600",
            "font-semibold"
          )}
        >
          {selectedLayoutSegments && selectedLayoutSegments.toUpperCase()}
        </span>
      </div>
    </nav>
  );
}
