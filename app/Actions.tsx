"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import Modal from "@/ui/Modal";

import { useRouter } from "next/navigation";

export default function Actions({ id }: { id: number }) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  async function handleSubmit() {
    // TODO: Add loading state

    // Cancel event
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/timeslots/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attendeeId: "" }),
    });

    // Refresh the current route and fetch new data from the server without
    // losing client-side browser or React state.
    router.refresh();

    setIsOpen(false);
    toast.success("Appointment cancelled");
  }

  function handleCancel() {
    setIsOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="font-medium text-red-600 opacity-100 focus-within:opacity-100 hover:text-red-900 group-hover:opacity-100 sm:opacity-0"
      >
        Cancel
      </button>
      <Modal
        title="Cancel your appointment?"
        isOpen={isOpen}
        cancelText="Nevermind"
        submitText="Cancel appointment"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      >
        <p className="text-sm text-gray-500">
          This appointment will be cancelled, but you can always book a new one.
        </p>
      </Modal>
    </>
  );
}
