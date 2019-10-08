const express = require("@feathersjs/express");
const feathers = require("@feathersjs/feathers");
const socketio = require("@feathersjs/socketio");
const moment = require("moment");

//Idea Service
class IdeasService {
  constructor() {
    this.ideas = [];
  }

  async find() {
    return this.ideas;
  }

  async create(data) {
    const idea = {
      id: this.ideas.length,
      text: data.text,
      tech: data.tech,
      viewer: data.viewer
    };
    idea.time = moment().format("h:mm:ss a");

    this.ideas.push(idea);
    return idea;
  }
}

const app = express(feathers());

//Parse JSON
app.use(express.json());

//Config Socket.io realTime APIs
app.configure(socketio());

//Enable REST services
app.configure(express.rest());

//Register services
app.use("/ideas", new IdeasService());

//New Connection connect to stream channel
app.on("connection", conn => app.channel("stream").join(conn));

//Publish event to stream
app.publish(data => app.channel("stream"));

//Server
const PORT = process.env.PORT || 3030;
app
  .listen(PORT)
  .on("listening", () =>
    console.log(`RealTime server running on port ${PORT}`)
  );

// app.service("ideas").create({
//   text: "Build a cool app",
//   tech: "Node.js",
//   viewer: "John Doe",
//   time: moment().format("h:mm:ss a")
// });
