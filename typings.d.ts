type Organizer = {
  id: number;
  name: string;
};

type Attendee = {
  id: number;
  name: string;
};

type User = Attendee | Organizer;

type Timeslot = {
  id: number;
  organizerId: number;
  attendeeId: number | "";
  startDateTime: string;
  endDateTime: string;
};
