import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';
import ejsMate from "ejs-mate";
import ExpressError from "./utils/ExpressError.js";
import session from "express-session";
import listings from "./routes/listing.js";
import reviews from "./routes/review.js";
import flash from "connect-flash";

const app = express();
const port = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static( path.join(__dirname, "/public")));
 
const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    Cookie: {
        expires: Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly: true,
    }
};

const MONGO_URL = "mongodb://127.0.0.1:27017/Stayzy";

app.get("/", (req, res)=>{
    res.send("Server is Runing");
});

app.use(session(sessionOptions));
app.use(flash());

main().then((res)=>{
    console.log("Connected to DB");
}) .catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.use("/listings", listings);
app.use ("/listings/:id/reviews", reviews);



// Error Handling Middleware
app.all("/{*any}",(req, res, next) =>{
    next( new ExpressError(404, "Page not found!"));
})

app.use((err, req, res, next) =>{
    let {statusCode = 500, message = "Somthing Went Wrong!"} = err;
    res.status(statusCode).render("listings/error.ejs", {message});
    // res.status(statusCode).send(message);
});

app.listen(port, ()=>{
    console.log(`Server is listning to port ${port}`); 
});


