import request from "supertest";
import express from "express";
import { jest } from "@jest/globals";


// MOCK AUTH (FIX 401 ERROR)

jest.mock("../src/middleware/auth.js", () => ({
  protect: (req, res, next) => {
    req.user = {
      email: "test@example.com",
      id: "user123",
    };
    next();
  },
}));


// MOCK DEPENDENCIES

jest.mock("../src/models/Registration.js");
jest.mock("../src/utils/eventServiceClient.js");
jest.mock("../src/utils/notificationServiceClient.js");

// Import AFTER mocks
import Registration from "../src/models/Registration.js";
import * as eventService from "../src/utils/eventServiceClient.js";
import * as notificationService from "../src/utils/notificationServiceClient.js";
import registrationRoutes from "../src/routes/registrationRoutes.js";


const app = express();
app.use(express.json());
app.use("/api/registrations", registrationRoutes);


describe("Registration Service API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // -------------------------
  // SUCCESS BOOKING
  // -------------------------
  test("POST /api/registrations - success booking", async () => {
    eventService.checkEventAvailability.mockResolvedValue({
      available: 10,
    });

    eventService.getEventDetails.mockResolvedValue({
      title: "Test Event",
    });

    Registration.findOne.mockResolvedValue(null);

    Registration.create.mockResolvedValue({
      _id: "reg123",
      eventId: "E1",
      ticketCount: 2,
    });

    eventService.updateEventCapacity.mockResolvedValue({});
    notificationService.sendBookingConfirmation.mockResolvedValue({});

    const res = await request(app)
      .post("/api/registrations")
      .send({
        eventId: "E1",
        ticketCount: 2,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Booking confirmed");
  });

  // -------------------------
  // MISSING EVENT ID
  // -------------------------
  test("POST missing eventId", async () => {
    const res = await request(app)
      .post("/api/registrations")
      .send({
        ticketCount: 2,
      });

    expect(res.statusCode).toBe(400);
  });

  // -------------------------
  // INVALID TICKET COUNT
  // -------------------------
  test("POST invalid ticketCount", async () => {
    const res = await request(app)
      .post("/api/registrations")
      .send({
        eventId: "E1",
        ticketCount: 20,
      });

    expect(res.statusCode).toBe(400);
  });

  // -------------------------
  // NOT ENOUGH CAPACITY
  // -------------------------
  test("POST not enough capacity", async () => {
    eventService.checkEventAvailability.mockResolvedValue({
      available: 1,
    });

    const res = await request(app)
      .post("/api/registrations")
      .send({
        eventId: "E1",
        ticketCount: 5,
      });

    expect(res.statusCode).toBe(400);
  });

  // -------------------------
  // DUPLICATE BOOKING
  // -------------------------
  test("POST duplicate booking", async () => {
    eventService.checkEventAvailability.mockResolvedValue({
      available: 10,
    });

    Registration.findOne.mockResolvedValue({ id: "existing" });

    const res = await request(app)
      .post("/api/registrations")
      .send({
        eventId: "E1",
        ticketCount: 2,
      });

    expect(res.statusCode).toBe(409);
  });

  // -------------------------
  // GET MY BOOKINGS
  // -------------------------
  test("GET /my-bookings", async () => {
    Registration.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue([
        { eventId: "E1", ticketCount: 2 },
      ]),
    });

    const res = await request(app).get("/api/registrations/my-bookings");

    expect(res.statusCode).toBe(200);
  });

  // -------------------------
  // GET EVENT PARTICIPANTS
  // -------------------------
  test("GET event participants", async () => {
    Registration.find.mockReturnValue({
      select: jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue([
          { userEmail: "test@example.com" },
        ]),
      }),
    });

    const res = await request(app).get("/api/registrations/event/E1");

    expect(res.statusCode).toBe(200);
  });

  // -------------------------
  // CANCEL BOOKING
  // -------------------------
  test("DELETE booking", async () => {
    Registration.findById.mockResolvedValue({
      userEmail: "test@example.com",
      save: jest.fn(),
    });

    const res = await request(app).delete("/api/registrations/123");

    expect(res.statusCode).toBe(200);
  });

  // -------------------------
  // HEALTH CHECK
  // -------------------------
  test("GET health", async () => {
    const res = await request(app).get("/api/registrations/health");

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});