import { type MetaFunction } from "@remix-run/node";
import { ActionBar } from "~/components/ActionBar";
import { CoachCalendar } from "~/components/CoachCalendar";
import { RoleSwitchFooter } from "~/components/RoleSwitchFooter";
import { type HydratedTimeSlot } from "./coach";
import { useEffect, useState } from "react";
import { type Event } from "react-big-calendar";

import { TimeSlotModal } from "~/components/TimeSlotModal";

export const meta: MetaFunction = () => {
  return [
    { title: "Student Dashboard" },
    { name: "description", content: "Student Dashboard" },
  ];
};

export default function Student() {
  const thisUserId = 1;
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [timeSlots, setTimeSlots] = useState<HydratedTimeSlot[]>([
    {
      id: 1,
      duration: 2,
      startTime: new Date(new Date().setSeconds(0, 0)),
      status: "booked",
      bookedBy: {
        id: 1,
        name: "Neo",
      },
    },
    {
      id: 2,
      duration: 2,
      startTime: new Date(
        new Date().setHours(
          new Date().getHours() + 3,
          new Date().getMinutes(),
          0,
          0
        )
      ),
      status: "available",
      hasConflict: false,
    },
  ]);

  const handleSlotClick = (event: Event) => {
    setSelectedSlot(event);
    setModalOpen(true);
  };

  const handleTimeSlotUpdate = (
    id: number,
    notes?: string,
    satisfaction?: string,
    studentBooking?: boolean
  ) => {
    if (studentBooking) {
      // // hit backend to update the booked by based on id of the student
      // // refetch the timeslots via an endpoint
      // // save new timeslots to savedState - for now just find id and update slot
      const newSlots = timeSlots.map((slot) => {
        if (slot.id === id)
          return { ...slot, bookedBy: { id: thisUserId, name: "Tony" } };
        return slot;
      });
      setTimeSlots(newSlots);
    }
  };

  useEffect(() => {
    const eventsArr: Event[] = timeSlots
      .filter(
        (slot) =>
          (slot.status === "booked" && slot.bookedBy?.id === thisUserId) ||
          (slot.status === "available" && !slot.hasConflict)
      )
      .map((slot) => {
        const start = new Date(slot.startTime);
        const end = new Date(start.getTime() + slot.duration * 60 * 60 * 1000);
        return {
          title: slot.bookedBy ? `Booked by You` : "Available",
          start,
          end,
          resource: {
            status: slot.status,
          },
        };
      });
    setEvents(eventsArr);
  }, [timeSlots]);

  return (
    <>
      <ActionBar isCoach={false} />
      <CoachCalendar events={events} handleSlotClick={handleSlotClick} />
      {selectedSlot && (
        <TimeSlotModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(!isModalOpen)}
          userType="student"
          event={selectedSlot}
          updateTimeSlot={handleTimeSlotUpdate}
        />
      )}

      <RoleSwitchFooter userRole={"student"} />
    </>
  );
}
