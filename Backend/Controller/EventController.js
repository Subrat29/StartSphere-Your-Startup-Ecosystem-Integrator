const Event = require("../Models/Event");
const Profile = require("../Models/Profile");

// Create a new event
const createEvent = async (req, res) => {
  try {
    // fetch data from the request body
    const {
      Name,
      Date,
      Time,
      Venue,
      Description,
      Image,
      Link,
      isFree,
      price,
      Organizer,
      Speakers,
      Attendees,
    } = req.body;

    //   Validate Data..!
    if (
      !Name ||
      !Date ||
      !Time ||
      !Venue ||
      !Description ||
      !Image ||
      !Link ||
      !Organizer ||
      !Speakers ||
      !Attendees ||
      typeof isFree !== "boolean"
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!isFree && !price) {
      return res.status(400).json({ message: "Price is required" });
    }

    // Validate Attendees
    if (Attendees && Attendees.length > 0) {
      const validAttendees = await Profile.find({ _id: { $in: Attendees } });
      if (validAttendees.length !== Attendees.length) {
        return res.status(400).json({ message: "Some attendees are not valid" });
      }
    }

    //   Create a new event
    const newEvent = new Event({
      Name,
      Date,
      Time,
      Venue,
      Description,
      Image,
      Link,
      isFree,
      price: isFree ? 0 : price,
      Organizer,
      Speakers,
      Attendees,
    });

    const savedEvent = await newEvent.save();
    res
      .status(201)
      .json({ success: true, message: "Event created successfully", event: savedEvent });
  } catch (error) {
    console.log("Error", error.message);
    res.status(500).json({ message: "Server error", error });
  }
};
// Update the Event by ID
const updateEvent = async (req, res) => {
  const eventId = req.params.id;
  const eventData = req.body;

  try {
    const updatedEvent = await Event.findByIdAndUpdate(eventId, eventData, { new: true });

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res
      .status(200)
      .json({ message: "Event updated successfully", event: updatedEvent });
  } catch (error) {
    console.error("Error updating event:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// Delete the Event by ID
const deleteEvent = async (req, res) => {
  const eventId = req.params.id;

  try {
    const deletedEvent = await Event.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.status(200).json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// Fetch all Events
const fetchAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("Attendees", "Name Email");

    return res
      .status(200)
      .json({ success: true, events: events, message: "Events fetched successfully" });
  } catch (error) {
    console.error("Error fetching events:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// Fetch Event by Name
const fetchEventByName = async (req, res) => {
  const eventName = req.params.name;

  try {
    const event = await Event.findOne({ Name: eventName }).populate(
      "Attendees",
      "Name Email"
    );
    return res
      .status(200)
      .json({ success: true, event: event, message: "Event fetched successfully" });
  } catch (error) {
    console.error("Error fetching event:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Fetch a single event by ID
const fetchEventById = async (req, res) => {
  const eventId = req.params.id;

  try {
    const event = await Event.findById(eventId).populate("Attendees", "Name Email");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res
      .status(200)
      .json({ success: true, event: event, message: "Event fetched successfully" });
  } catch (error) {
    console.error("Error fetching event:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createEvent,
  updateEvent,
  deleteEvent,
  fetchAllEvents,
  fetchEventByName,
  fetchEventById,
};
