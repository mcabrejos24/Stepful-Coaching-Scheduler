import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { ActionBar } from "~/components/ActionBar";
import { CoachCalendar } from "~/components/CoachCalendar";
import { RoleSwitchFooter } from "~/components/RoleSwitchFooter";
import { type HydratedTimeSlot } from "./coach";
import { useEffect, useState } from "react";
import { type Event } from "react-big-calendar";
import { TimeSlotModal } from "~/components/TimeSlotModal";
import db from "../db.server";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // get student id from path param
  try {
    const studentId = 1;
    const studentData = await db.student.findUnique({
      where: { id: studentId },
      include: {
        coach: true,
      },
    });
    const timeSlotsData = await db.timeSlot.findMany({
      where: {
        createdBy: studentData?.coachId,
        OR: [{ bookedBy: studentId }, { bookedBy: null }],
      },
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
      studentData,
      hydratedTimeSlotsData,
    });
  } catch (error) {
    console.error("Error fetching scheudlar data: ", error);
    throw error;
  }
};

export const meta: MetaFunction = () => {
  return [
    { title: "Student Dashboard" },
    { name: "description", content: "Student Dashboard" },
  ];
};

export default function Student() {
  const { studentData, hydratedTimeSlotsData } = useLoaderData<any>();
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [timeSlots, setTimeSlots] = useState<HydratedTimeSlot[]>(
    hydratedTimeSlotsData
  );

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
          return { ...slot, bookedBy: { id: studentData.id, name: "Tony" } };
        return slot;
      });
      setTimeSlots(newSlots);
    }
  };

  useEffect(() => {
    const eventsArr: Event[] = timeSlots.map((slot) => {
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
      <CoachCalendar
        events={events}
        handleSlotClick={handleSlotClick}
        userType="student"
      />
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
