import { json, type ActionFunctionArgs } from "@remix-run/node";
import db from "../db.server";

export interface TimeSlotCreateData {
  date: Date;
  duration?: number;
  startTime: Date;
  coachId: number;
  status?: string;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const { date, duration, startTime, coachId, status }: TimeSlotCreateData =
    await request.json();

  try {
    const newTimeSlot = await db.timeSlot.create({
      data: {
        date: new Date(date!),
        startTime: new Date(startTime!),
        createdBy: Number(coachId),
        ...(duration && { duration: Number(duration) }),
        ...(status && { status: status }),
      },
    });
    return json({
      newTimeSlot,
    });
  } catch (error) {
    console.error("Error saving time slot to DB: ", error);
    throw error;
  }
};
