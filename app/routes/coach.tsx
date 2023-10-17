import { type MetaFunction } from "@remix-run/react";
import { useState } from "react";
import { type Event } from "react-big-calendar";
import { ActionBar } from "~/components/ActionBar";
import { AddAvailabilityModal } from "~/components/AddAvailabilityModal";
import { CoachCalendar } from "~/components/CoachCalendar";
import { RoleSwitchFooter } from "~/components/RoleSwitchFooter";

export const meta: MetaFunction = () => {
  return [
    { title: "Coach Dashboard" },
    { name: "description", content: "Coach Dashboard" },
  ];
};

interface HydratedTimeSlot {
  duration: number;
  startTime: Date;
  status: string;
  bookedBy?: string;
  hasConflict?: boolean;
}

export default function Coach() {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [timeSlots, setTimeSlots] = useState<HydratedTimeSlot[]>([
    {
      duration: 2,
      startTime: new Date(),
      status: "booked",
      bookedBy: "Neo",
    },
    {
      duration: 2,
      startTime: new Date(),
      status: "available",
      hasConflict: true,
    },
  ]);

  const events: Event[] = timeSlots.map((slot) => {
    const start = new Date(slot.startTime);
    const end = new Date(start.getTime() + slot.duration * 60 * 60 * 1000);
    return {
      title: slot.bookedBy
        ? `Booked by ${slot.bookedBy}`
        : slot.hasConflict
        ? "Has conflict"
        : "Available",
      start,
      end,
      resource: {
        status: slot.status,
        hasConflict: slot.hasConflict,
      },
    };
  });

  return (
    <>
      <ActionBar isCoach={true} onAddAvailability={() => setModalOpen(true)} />
      <AddAvailabilityModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />
      <CoachCalendar events={events} />
      <RoleSwitchFooter />
    </>
  );
}
