import db from "../app/db.server.js";
import moment from "moment";
async function main() {
  const coach = await db.coach.create({
    data: {
      name: "Deion Sanders",
      email: "primetime@stepful.com",
    },
  });
  const student1 = await db.student.create({
    data: {
      name: "Johnny Appleseed",
      email: "jseed@stepful.com",
      coachId: coach.id,
    },
  });
  const student2 = await db.student.create({
    data: {
      name: "Albert Einstein",
      email: "einstein@stepful.com",
      coachId: coach.id,
    },
  });
  // Two completed timeslots from last week
  const completedTimeSlot1 = await db.timeSlot.create({
    data: {
      createdBy: coach.id,
      date: moment().subtract(1, "weeks").toDate(),
      startTime: moment()
        .subtract(1, "weeks")
        .set({ hour: 10, minute: 0, second: 0 })
        .toDate(),
      status: "completed",
      bookedBy: student1.id,
    },
  });
  const completedTimeSlot2 = await db.timeSlot.create({
    data: {
      createdBy: coach.id,
      date: moment().subtract(1, "weeks").add(1, "days").toDate(),
      startTime: moment()
        .subtract(1, "weeks")
        .add(1, "days")
        .set({ hour: 14, minute: 0, second: 0 })
        .toDate(),
      status: "completed",
      bookedBy: student2.id,
    },
  });
  // Incomplete timeslot from last week
  await db.timeSlot.create({
    data: {
      createdBy: coach.id,
      date: moment().subtract(1, "weeks").add(2, "days").toDate(),
      startTime: moment()
        .subtract(1, "weeks")
        .add(2, "days")
        .set({ hour: 16, minute: 0, second: 0 })
        .toDate(),
      status: "incomplete",
    },
  });
  // Upcoming timeslot for the day after
  await db.timeSlot.create({
    data: {
      createdBy: coach.id,
      date: moment().add(1, "days").toDate(),
      startTime: moment()
        .add(1, "days")
        .set({ hour: 12, minute: 0, second: 0 })
        .toDate(),
      status: "available",
    },
  });
  // MeetingNotes data for the two completed timeslots
  await db.meetingNotes.create({
    data: {
      timeSlotId: completedTimeSlot1.id,
      notes: "First completed session notes.",
      satisfaction: "4",
    },
  });
  await db.meetingNotes.create({
    data: {
      timeSlotId: completedTimeSlot2.id,
      notes: "Second completed session notes.",
      satisfaction: "5",
    },
  });
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
