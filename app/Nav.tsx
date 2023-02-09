"use client";

import Link from "next/link";

export default function Nav() {
  return (
    <nav className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <Link href="/" className="py-4">
          <h1 className="text-2xl font-semibold text-green-600">
            Meeting Scheduler
          </h1>
        </Link>
      </div>
    </nav>
  );
}
