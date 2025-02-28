const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const app = express();
const Phonebook = require("./models/phonebook");

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

morgan.token("body", (req) => JSON.stringify(req.body));
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));

const errorHandler = (error, req, res, next) => {
    console.error(error.message);

    if (error.name === "CastError") {
        return res.status(400).send({ error: "malformatted id" });
    }
    next(error);
}

app.use(errorHandler)


app.get("/api/persons", (req, res) => {
    Phonebook.find({}).then(result => {
        res.json(result)
    })
});

app.get("/info", (req, res) => {
    const date = new Date();
    Phonebook.find({}).then(persons => {
        res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`);
    }
    )
});

app.get("/api/persons/:id", (req, res, next) => {
    Phonebook.findById(req.params.id).then(result => {
        if (result) {
            res.json(result);
        }
        else {
            res.status(404).end();
        }
    }).catch(error => next(error));
});

app.delete("/api/persons/:id", (req, res) => {
    Phonebook.findByIdAndDelete(req.params.id).then(result => {
        res.status(204).end();
    }).catch(error => next(error));
});

app.post("/api/persons", (req, res) => {
    const body = req.body;
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: "name or number missing"
        });
    }

    Phonebook.findOne({ name: body.name }).then(result => {
        if (result) {
            existingPerson.number = body.number;
            existingPerson.save().then(updatedPerson => {
                res.json(updatedPerson)}).catch(error => next(error));
        } else {
            const person = new Phonebook({
                name: body.name,
                number: body.number,
                id: String(Math.floor(Math.random() * 1000))
            });
            person.save().then(result => {
                res.json(result);
            })
        }
    });
});

app.put("/api/persons/:id", (req, res) => {
    const body = req.body;
    const person = {
        name: body.name,
        number: body.number
    };

    Phonebook.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(result => {
            res.json(result);
        }).catch(error => next(error));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});