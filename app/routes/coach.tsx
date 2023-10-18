import { TimeSlot, type MeetingNotes, type Student } from "@prisma/client";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, type MetaFunction } from "@remix-run/react";
import { useEffect, useState } from "react";
import { type Event } from "react-big-calendar";
import { ActionBar } from "~/components/ActionBar";
import { AddAvailabilityModal } from "~/components/AddAvailabilityModal";
import { CoachCalendar } from "~/components/CoachCalendar";
import { RoleSwitchFooter } from "~/components/RoleSwitchFooter";
import { TimeSlotModal } from "~/components/TimeSlotModal";
import db from "../db.server";

export interface HydratedTimeSlot {
  id: number;
  duration: number;
  startTime: Date;
  status: string;
  bookedBy?: Partial<Student>;
  hasConflict?: boolean;
  meetingNotes?: Partial<MeetingNotes>;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // get coach id from path param
  try {
    const coachId = 1;
    const coachData = await db.coach.findUnique({
      where: { id: coachId },
    });
    const timeSlotsData = await db.timeSlot.findMany({
      where: { createdBy: coachId },
      include: {
        meetingNotes: true,
        student: true,
      },
    });

    const hydratedTimeSlotsData = timeSlotsData.map((slot) => {
      return {
        id: slot.id,
        duration: slot.duration / 60,
        startTime: slot.startTime,
        status: slot.status,
        bookedBy: slot.student,
        meetingNotes: slot.meetingNotes,
        hasConflict: false,
      };
    });

    return json({
      coachData,
      hydratedTimeSlotsData,
    });
  } catch (error) {
    console.error("Error fetching scheudlar data: ", error);
    throw error;
  }
};

export const meta: MetaFunction = () => {
  return [
    { title: "Coach Dashboard" },
    { name: "description", content: "Coach Dashboard" },
  ];
};

export default function CoachPage() {
  const { coachData, hydratedTimeSlotsData } = useLoaderData<any>();
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isSlotModalOpen, setSlotModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [timeSlots, setTimeSlots] = useState<HydratedTimeSlot[]>(
    hydratedTimeSlotsData
  );

  const handleAddAvailability = async (
    selectedDate: string,
    selectedTime: string
  ) => {
    const dateObject = new Date(`${selectedDate}T${selectedTime}:00`);

    // TODO: if filling out for a previous date ` like status,
    // include logic to add the student they met with
    // possibly an option to fill out feedback here as well
    try {
      const response = await fetch("/api/time-slot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: dateObject,
          startTime: dateObject,
          coachId: coachData.id,
          ...(dateObject < new Date() && { status: "incomplete" }),
        }),
      });
      const { newTimeSlot }: { newTimeSlot: TimeSlot } = await response.json();

      const newSlot: HydratedTimeSlot = {
        id: newTimeSlot.id,
        duration: newTimeSlot.duration / 60,
        startTime: newTimeSlot.startTime,
        status: newTimeSlot.status,
        hasConflict: false,
      };
      setTimeSlots([...timeSlots, newSlot]);
    } catch (error) {
      console.error("Failed POST request: ", error);
    }

    // TODO: implement overlapping slot conflicts
    // const hasConflict = timeSlots.some((slot) => {
    //   if (slot.bookedBy) {
    //     const slotEndTime = new Date(
    //       slot.startTime.getTime() + slot.duration * 60 * 60 * 1000
    //     );
    //     const newSlotEndTime = new Date(
    //       newSlot.startTime.getTime() + newSlot.duration * 60 * 60 * 1000
    //     );

    //     return (
    //       (newSlot.startTime >= slot.startTime &&
    //         newSlot.startTime < slotEndTime) ||
    //       (slot.startTime >= newSlot.startTime &&
    //         slot.startTime < newSlotEndTime)
    //     );
    //   }
    //   return false;
    // });
    // if (hasConflict) {
    //   newSlot.hasConflict = true;
    // }
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
