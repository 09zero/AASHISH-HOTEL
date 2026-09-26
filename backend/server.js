const express = require("express");
const cors = require("cors");

const app = express();

const PORT = 5001;

app.use(cors());

app.use(express.json());


app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "AASHISH HOTEL backend is running.",
        port: PORT
    });

});


app.post("/api/bookings", (req, res) => {

    const booking = req.body;

    console.log("NEW BOOKING RECEIVED:");
    console.log(booking);

    res.status(201).json({

        success: true,

        message: "Booking received successfully.",

        booking: booking

    });

});


app.listen(PORT, () => {

    console.log(
        `AASHISH HOTEL backend running on port ${PORT}`
    );

});