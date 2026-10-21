import assert from "node:assert/strict";
import { after, before, beforeEach, test } from "node:test";

import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";

import { createApp } from "../src/app.js";

const app = createApp();
let mongo: MongoMemoryServer;

before(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

after(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

beforeEach(async () => {
  const collections = mongoose.connection.collections;

  for (const collection of Object.values(collections)) {
    await collection.deleteMany({});
  }
});

test("POST /exercises rejects a name shorter than 2 characters", async () => {
  const response = await request(app).post("/exercises").send({ name: "A" });

  assert.equal(response.status, 400);
  assert.equal(response.body.message, "Invalid request");
  assert.deepEqual(response.body.issues, [
    {
      path: "name",
      message: "Name must be between 2 and 120 characters.",
    },
  ]);

  const list = await request(app).get("/exercises");

  assert.equal(list.status, 200);
  assert.deepEqual(list.body, []);
});

test("PUT /exercises rejects a too-short name and keeps the stored exercise", async () => {
  const created = await request(app).post("/exercises").send({ name: "Supino" });

  assert.equal(created.status, 201);

  const response = await request(app)
    .put(`/exercises/${created.body._id}`)
    .send({ name: "A" });

  assert.equal(response.status, 400);
  assert.equal(response.body.message, "Invalid request");
  assert.deepEqual(response.body.issues, [
    {
      path: "name",
      message: "Name must be between 2 and 120 characters.",
    },
  ]);

  const stored = await request(app).get(`/exercises/${created.body._id}`);

  assert.equal(stored.status, 200);
  assert.equal(stored.body.name, "Supino");
});

test("GET /exercises rejects an id that is not an ObjectId", async () => {
  const response = await request(app).get("/exercises/not-an-id");

  assert.equal(response.status, 400);
  assert.equal(response.body.message, "Invalid request");
  assert.deepEqual(response.body.issues, [
    {
      path: "id",
      message: "Invalid id.",
    },
  ]);
});

test("GET /exercises reports a missing exercise", async () => {
  const response = await request(app).get("/exercises/000000000000000000000001");

  assert.equal(response.status, 404);
  assert.deepEqual(response.body, {
    message: "Exercise not found",
  });
});

test("POST /workout-plans rejects a name shorter than 2 characters", async () => {
  const response = await request(app).post("/workout-plans").send({ name: "A" });

  assert.equal(response.status, 400);
  assert.equal(response.body.message, "Invalid request");
  assert.deepEqual(response.body.issues, [
    {
      path: "name",
      message: "Name must be between 2 and 120 characters.",
    },
  ]);

  const list = await request(app).get("/workout-plans");

  assert.equal(list.status, 200);
  assert.deepEqual(list.body, []);
});

test("POST /workout-plans rejects maxReps below minReps", async () => {
  const exercise = await request(app).post("/exercises").send({ name: "Agachamento" });

  assert.equal(exercise.status, 201);

  const response = await request(app)
    .post("/workout-plans")
    .send({
      name: "Semana A",
      days: [
        {
          weekday: "Monday",
          exercises: [
            {
              exercise: exercise.body._id,
              order: 0,
              sets: 3,
              minReps: 10,
              maxReps: 6,
            },
          ],
        },
      ],
    });

  assert.equal(response.status, 400);
  assert.equal(response.body.message, "Invalid request");
  assert.deepEqual(response.body.issues, [
    {
      path: "days.0.exercises.0.maxReps",
      message: "maxReps must be greater than or equal to minReps.",
    },
  ]);
});

test("POST /workout-plans stores a valid week and returns the exercise", async () => {
  const exercise = await request(app).post("/exercises").send({ name: "  Supino  " });

  assert.equal(exercise.status, 201);
  assert.equal(exercise.body.name, "Supino");
  assert.equal(exercise.body.description, "");
  assert.equal(exercise.body.equipment, "");
  assert.equal(exercise.body.active, true);
  assert.deepEqual(exercise.body.muscleGroups, []);

  const response = await request(app)
    .post("/workout-plans")
    .send({
      name: "Semana A",
      days: [
        {
          weekday: "Monday",
          name: "Peito",
          exercises: [
            {
              exercise: exercise.body._id,
              order: 0,
              sets: 4,
              minReps: 6,
              maxReps: 8,
              targetWeight: 40,
              restSeconds: 90,
            },
          ],
        },
      ],
    });

  assert.equal(response.status, 201);
  assert.equal(response.body.name, "Semana A");
  assert.equal(response.body.days[0].weekday, "Monday");
  assert.equal(response.body.days[0].exercises[0].sets, 4);
  assert.equal(response.body.days[0].exercises[0].minReps, 6);
  assert.equal(response.body.days[0].exercises[0].maxReps, 8);
  assert.equal(response.body.days[0].exercises[0].exercise.name, "Supino");
});

test("POST /exercises rejects malformed JSON", async () => {
  const response = await request(app)
    .post("/exercises")
    .set("Content-Type", "application/json")
    .send("{");

  assert.equal(response.status, 400);
  assert.deepEqual(response.body, {
    message: "Invalid request",
    issues: [
      {
        path: "body",
        message: "Request body must be JSON.",
      },
    ],
  });
});

test("GET /exercises does not leak internal errors", async () => {
  const writeError = console.error;
  console.error = () => {};
  await mongoose.disconnect();

  try {
    const response = await request(app).get("/exercises");

    assert.equal(response.status, 500);
    assert.deepEqual(response.body, {
      message: "Error fetching exercises",
    });
  } finally {
    console.error = writeError;
    await mongoose.connect(mongo.getUri());
  }
});

test("GET /workout-plans reports a missing plan", async () => {
  const response = await request(app).get("/workout-plans/000000000000000000000001");

  assert.equal(response.status, 404);
  assert.deepEqual(response.body, {
    message: "Workout plan not found",
  });
});

test("POST /workout-plans rejects an unknown weekday", async () => {
  const response = await request(app)
    .post("/workout-plans")
    .send({
      name: "Semana A",
      days: [{ weekday: "Funday" }],
    });

  assert.equal(response.status, 400);
  assert.equal(response.body.message, "Invalid request");
  assert.deepEqual(response.body.issues, [
    {
      path: "days.0.weekday",
      message: "Weekday must be a day of the week.",
    },
  ]);
});

test("PUT /workout-plans rejects a week where maxReps is below minReps", async () => {
  const exercise = await request(app).post("/exercises").send({ name: "Agachamento" });

  assert.equal(exercise.status, 201);

  const created = await request(app)
    .post("/workout-plans")
    .send({
      name: "Semana A",
      days: [
        {
          weekday: "Monday",
          exercises: [
            {
              exercise: exercise.body._id,
              order: 0,
              sets: 3,
              minReps: 8,
              maxReps: 12,
            },
          ],
        },
      ],
    });

  assert.equal(created.status, 201);

  const response = await request(app)
    .put(`/workout-plans/${created.body._id}`)
    .send({
      days: [
        {
          weekday: "Monday",
          exercises: [
            {
              exercise: exercise.body._id,
              order: 0,
              sets: 3,
              minReps: 10,
              maxReps: 6,
            },
          ],
        },
      ],
    });

  assert.equal(response.status, 400);
  assert.equal(response.body.issues[0].path, "days.0.exercises.0.maxReps");
  assert.equal(
    response.body.issues[0].message,
    "maxReps must be greater than or equal to minReps.",
  );

  const stored = await request(app).get(`/workout-plans/${created.body._id}`);

  assert.equal(stored.status, 200);
  assert.equal(stored.body.days[0].exercises[0].maxReps, 12);
});

test("PUT /workout-plans rejects a too-short name and keeps the stored plan", async () => {
  const created = await request(app).post("/workout-plans").send({ name: "Semana A" });

  assert.equal(created.status, 201);

  const response = await request(app)
    .put(`/workout-plans/${created.body._id}`)
    .send({ name: "A" });

  assert.equal(response.status, 400);
  assert.deepEqual(response.body.issues, [
    {
      path: "name",
      message: "Name must be between 2 and 120 characters.",
    },
  ]);

  const stored = await request(app).get(`/workout-plans/${created.body._id}`);

  assert.equal(stored.status, 200);
  assert.equal(stored.body.name, "Semana A");
});

test("POST /workout-plans rejects a repeated weekday", async () => {
  const response = await request(app)
    .post("/workout-plans")
    .send({
      name: "Semana A",
      days: [
        { weekday: "Monday", exercises: [] },
        { weekday: "Monday", exercises: [] },
      ],
    });

  assert.equal(response.status, 400);
  assert.equal(response.body.message, "Invalid request");
  assert.deepEqual(response.body.issues, [
    {
      path: "days",
      message: "A workout plan cannot contain the same weekday more than once.",
    },
  ]);
});
