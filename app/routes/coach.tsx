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
      startTime: new Date(new Date().setSeconds(0, 0)),
      status: "booked",
      bookedBy: "Neo",
    },
    {
      duration: 2,
      startTime: new Date(new Date().setSeconds(0, 0)),
      status: "available",
      hasConflict: true,
    },
  ]);

  const handleAddAvailability = async (
    selectedDate: string,
    selectedTime: string
  ) => {
    // call to database to save
    // hydrate timeslots
    // save to setTimeSlots
    // should rerender calendar
    const dateObject = new Date(`${selectedDate}T${selectedTime}:00`);

    const newSlot: HydratedTimeSlot = {
      duration: 2,
      startTime: dateObject,
      status: "available",
    };

    const hasConflict = timeSlots.some((slot) => {
      if (slot.bookedBy) {
        const slotEndTime = new Date(
          slot.startTime.getTime() + slot.duration * 60 * 60 * 1000
        );
        const newSlotEndTime = new Date(
          newSlot.startTime.getTime() + newSlot.duration * 60 * 60 * 1000
        );

        return (
          (newSlot.startTime >= slot.startTime &&
            newSlot.startTime < slotEndTime) ||
          (slot.startTime >= newSlot.startTime &&
            slot.startTime < newSlotEndTime)
        );
      }
      return false;
    });

    if (hasConflict) {
      newSlot.hasConflict = true;
    }
    setTimeSlots([...timeSlots, newSlot]);
  };

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
        onAddAvailability={handleAddAvailability}
      />
      <CoachCalendar events={events} />
      <RoleSwitchFooter />
    </>
  );
}
