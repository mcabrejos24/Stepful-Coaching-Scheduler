import { type MeetingNotes, type Student } from "@prisma/client";
import { type MetaFunction } from "@remix-run/react";
import { useEffect, useState } from "react";
import { type Event } from "react-big-calendar";
import { ActionBar } from "~/components/ActionBar";
import { AddAvailabilityModal } from "~/components/AddAvailabilityModal";
import { CoachCalendar } from "~/components/CoachCalendar";
import { RoleSwitchFooter } from "~/components/RoleSwitchFooter";
import { TimeSlotModal } from "~/components/TimeSlotModal";

export const meta: MetaFunction = () => {
  return [
    { title: "Coach Dashboard" },
    { name: "description", content: "Coach Dashboard" },
  ];
};

export interface HydratedTimeSlot {
  id: number;
  duration: number;
  startTime: Date;
  status: string;
  bookedBy?: Partial<Student>;
  hasConflict?: boolean;
  meetingNotes?: Partial<MeetingNotes>;
}

export default function Coach() {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isSlotModalOpen, setSlotModalOpen] = useState(false);
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
      startTime: new Date(new Date().setSeconds(0, 0)),
      status: "available",
      hasConflict: true,
    },
    {
      id: 3,
      duration: 2,
      startTime: new Date(
        new Date(new Date().setDate(new Date().getDate() + 1)).setHours(
          10,
          0,
          0,
          0
        )
      ),
      status: "available",
      hasConflict: false,
    },
    {
      id: 4,
      duration: 2,
      startTime: new Date(
        new Date(new Date().setDate(new Date().getDate() - 1)).setHours(
          2,
          0,
          0,
          0
        )
      ),
      status: "incomplete",
      hasConflict: false,
      bookedBy: {
        id: 1,
        name: "Neo",
      },
    },
    {
      id: 5,
      duration: 2,
      startTime: new Date(
        new Date(new Date().setDate(new Date().getDate() - 1)).setHours(
          6,
          0,
          0,
          0
        )
      ),
      status: "complete",
      hasConflict: false,
      bookedBy: {
        id: 1,
        name: "Neo",
      },
      meetingNotes: {
        notes: "Good meetings. Talked a lot.",
        satisfaction: "1",
      },
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
    const status = dateObject < new Date() ? "incomplete" : "availabile";
    // TODO: if filling out for a previous date, include logic to add the student they met with
    // TODO: possibly an option to fill out feedback here as well
    const newSlot: HydratedTimeSlot = {
      id: 3,
      duration: 2,
      startTime: dateObject,
      status: status,
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

  const handleSlotClick = (event: Event) => {
    setSelectedSlot(event);
    setSlotModalOpen(true);
  };

  const handleTimeSlotUpdate = (
    id: number,
    notes?: string,
    satisfaction?: string,
    studentBooking?: boolean
  ) => {
    // hit backend to update the id
    // refetch the timeslots via an endpoint
    // save new timeslots to savedState - for now just find id and update slot
    const newSlots = timeSlots.map((slot) => {
      if (slot.id === id)
        return { ...slot, meetingNotes: { notes, satisfaction } };
      return slot;
    });
    setTimeSlots(newSlots);
  };

  useEffect(() => {
    const eventsArr: Event[] = timeSlots.map((slot) => {
      const start = new Date(slot.startTime);
      const end = new Date(start.getTime() + slot.duration * 60 * 60 * 1000);
      return {
        title: slot.bookedBy
          ? `Booked by ${slot.bookedBy.name}`
          : slot.hasConflict
          ? "Has conflict"
          : "Available",
        start,
        end,
        resource: {
          id: slot.id,
          status: slot.status,
          ...(slot?.hasConflict && { hasConflict: slot.hasConflict }),
          ...(slot?.meetingNotes?.notes && { notes: slot.meetingNotes.notes }),
          ...(slot?.meetingNotes?.satisfaction && {
            satisfaction: slot.meetingNotes.satisfaction,
          }),
        },
      };
    });
    setEvents(eventsArr);
  }, [timeSlots]);

  return (
    <>
      <ActionBar isCoach={true} onAddAvailability={() => setModalOpen(true)} />
      <AddAvailabilityModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onAddAvailability={handleAddAvailability}
      />
      <CoachCalendar events={events} handleSlotClick={handleSlotClick} />
      {selectedSlot && (
        <TimeSlotModal
          isOpen={isSlotModalOpen}
          onClose={() => {
            setSlotModalOpen(!isSlotModalOpen);
            setSelectedSlot(null);
          }}
          userType="coach"
          event={selectedSlot}
          updateTimeSlot={handleTimeSlotUpdate}
        />
      )}
      <RoleSwitchFooter userRole={"coach"} />
    </>
  );
}
