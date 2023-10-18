import { json, type ActionFunctionArgs } from "@remix-run/node";
import db from "../db.server";

interface MeetingNotesCreateData {
  timeSlotId: number;
  notes: string;
  satisfaction: string;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const { timeSlotId, notes, satisfaction }: MeetingNotesCreateData =
    await request.json();

  try {
    await db.meetingNotes.create({
      data: {
        timeSlotId,
        notes,
        satisfaction,
      },
    });

    const updatedSlotItem = await db.timeSlot.update({
      where: { id: timeSlotId },
      data: {
        status: "complete",
      },
      include: {
        student: true,
        meetingNotes: true,
      },
    });

    return json({
      updatedSlotItem,
    });
  } catch (error) {
    console.error("Error saving time slot to DB: ", error);
    throw error;
  }
};
