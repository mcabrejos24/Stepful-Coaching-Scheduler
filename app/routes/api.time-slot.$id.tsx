import { json, type ActionFunctionArgs } from "@remix-run/node";
import db from "../db.server";

export interface TimeSlotUpdateData {
  date?: Date;
  duration?: number;
  startTime?: Date;
  status?: string;
  bookedBy?: number;
}

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const { date, duration, startTime, status, bookedBy }: TimeSlotUpdateData =
    await request.json();
  try {
    const updatedSlotItem = await db.timeSlot.update({
      where: { id: Number(params.id) },
      data: {
        ...(date && { date: new Date(date!) }),
        ...(duration && { duration: Number(duration) }),
        ...(startTime && { startTime: new Date(startTime!) }),
        ...(status && { status: status }),
        ...(bookedBy && { bookedBy: bookedBy }),
      },
    });
    return json({
      updatedSlotItem,
    });
  } catch (error) {
    console.error("Error updating time slot: ", error);
    throw error;
  }
};
