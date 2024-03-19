const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors"); // Add this line for CORS

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST','PUT'],
        credentials: true
    }
});

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("Connection error", error);
        process.exit(1);
    }
};

// Middleware to enable CORS
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Define a schema for artists
const artistSchema = new mongoose.Schema({
    name: String,
    image: String,
    votes: { type: Number, default: 0 },
});
const Artist = mongoose.model("Artist", artistSchema);

// Route to get all artists
app.get("/artists", async (req, res) => {
    const artists = await Artist.find();
    res.json(artists);
});

// Route to add a new artist
// app.post("/artists", async (req, res) => {
//     const { name, image } = req.body;
//     const artist = new Artist({ name, image, votes: 0 }); 
//     try {
//         await artist.save();
//         res.status(201).json(artist);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// Route to handle votes
app.post("/vote/:artistName", async (req, res) => {
    const artistName = req.params.artistName;
    const artist = await Artist.findOneAndUpdate({ name: artistName }, { $inc: { votes: 1 } }, { new: true });
    io.emit("voteUpdate", artist);
    res.sendStatus(200);
});

// Route to get all votes
app.get("/admin/votes", async (req, res) => {
    const votes = await Artist.find({}, { name: 1, votes: 1, _id: 0 });
    res.json(votes);
});

// Route to add a new artist
app.post("/admin/artists", async (req, res) => {
    const { name, image } = req.body;
    const artist = new Artist({ name, image, votes: 0 });
    try {
        await artist.save();
        io.emit("artistChange", { type: "add", artist });
        res.status(201).json(artist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to update an existing artist
app.put("/admin/artists/:id", async (req, res) => {
    const { name, image } = req.body;
    try {
        const updatedArtist = await Artist.findByIdAndUpdate(req.params.id, { name, image }, { new: true });
        io.emit("artistChange", { type: "update", artist: updatedArtist });
        res.json(updatedArtist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to delete an artist
app.delete("/admin/artists/:id", async (req, res) => {
    try {
        const deletedArtist = await Artist.findByIdAndDelete(req.params.id);
        io.emit("artistChange", { type: "delete", artist: deletedArtist });
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to increase an artist's votes
app.post("/admin/artists/:name/increase-votes", async (req, res) => {
    // console.log("Increase votes route hit");
    const artistName = decodeURIComponent(req.params.name);
    try {
        const updatedArtist = await Artist.findOneAndUpdate({ name: artistName }, { $inc: { votes: 1 } }, { new: true });
        // console.log("Updated artist:", updatedArtist);
        io.emit("artistChange", { type: "update", artist: updatedArtist });
        res.json(updatedArtist);
    } catch (error) {
        // console.error("Error in increase votes route:", error);
        res.status(500).json({ message: error.message });
    }
});

// Route to decrease an artist's votes
app.post("/admin/artists/:name/decrease-votes", async (req, res) => {
    // console.log("Decrease votes route hit");
    const artistName = decodeURIComponent(req.params.name);
    try {
        const updatedArtist = await Artist.findOneAndUpdate({ name: artistName }, { $inc: { votes: -1 } }, { new: true });
        // console.log("Updated artist:", updatedArtist);
        io.emit("artistChange", { type: "update", artist: updatedArtist });
        res.json(updatedArtist);
    } catch (error) {
        // console.error("Error in decrease votes route:", error);
        res.status(500).json({ message: error.message });
    }
});

// Start the server
server.listen(process.env.PORT, () => {
	connectDB();
	console.log("app is running on port " + process.env.PORT);
});
