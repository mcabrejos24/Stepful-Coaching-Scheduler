import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { ActionBar } from "~/components/ActionBar";
import { CoachCalendar } from "~/components/CoachCalendar";
import { RoleSwitchFooter } from "~/components/RoleSwitchFooter";
import { type HydratedTimeSlot } from "./coach.$id";
import { useEffect, useState } from "react";
import { type Event } from "react-big-calendar";
import { TimeSlotModal } from "~/components/TimeSlotModal";
import db from "../db.server";
import { useLoaderData } from "@remix-run/react";
import { TimeSlot } from "@prisma/client";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  // get student id from path param
  try {
    const studentData = await db.student.findUnique({
      where: { id: Number(params.id) },
      include: {
        coach: true,
      },
    });
    const timeSlotsData = await db.timeSlot.findMany({
      where: {
        createdBy: studentData?.coachId,
        OR: [{ bookedBy: Number(params.id) }, { bookedBy: null }],
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

  const handleTimeSlotUpdate = async (
    id: number,
    notes?: string,
    satisfaction?: string,
    studentBooking?: boolean
  ) => {
    if (studentBooking) {
      try {
        const response = await fetch(`/api/time-slot/${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookedBy: studentData.id,
            status: "booked",
          }),
        });
        const {
          updatedSlotItem,
        }: {
          updatedSlotItem: TimeSlot;
        } = await response.json();
        const newSlot: HydratedTimeSlot = {
          id: updatedSlotItem.id,
          duration: updatedSlotItem.duration / 60,
          startTime: updatedSlotItem.startTime,
          status: updatedSlotItem.status,
          bookedBy: studentData,
        };
        const updateTimeSlots = timeSlots.map((slot) =>
          slot.id === newSlot.id ? newSlot : slot
        );
        setTimeSlots(updateTimeSlots);
      } catch (error) {
        console.error("Failed POST request: ", error);
      }
      // // hit backend to update the booked by based on id of the student
      // // refetch the timeslots via an endpoint
      // // save new timeslots to savedState - for now just find id and update slot
      // const newSlots = timeSlots.map((slot) => {
      //   if (slot.id === id)
      //     return { ...slot, bookedBy: { id: studentData.id, name: "Tony" } };
      //   return slot;
      // });
      // setTimeSlots(newSlots);
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
          id: slot.id,
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

      <RoleSwitchFooter userRole={`student`} />
    </>
  );
}
