import express from "express";
import { conn } from "../dbconn";
export const router = express.Router();
export const mysql = require('mysql');



//-----Movies------//
router.get("/movie", (req, res) => {
    conn.query('select * from Movie', (err, result, fields) => {
        res.json(result);
    });
});

router.post('/addmovie', (req, res) => {
    const movie = req.body;
    const sql = 'INSERT INTO `Movie` (`name`, `description`, `rating`, `release_date`, `gene`, `img`) VALUES (?, ?, ?, ?, ?, ?)';
    conn.query(sql, [movie.name, movie.description, movie.rating, movie.release_date, movie.gene, movie.img], (err, result) => {
        if (err) {
            console.error('Error inserting movie:', err);
            res.status(500).json({
                status: 'error',
                message: 'Error inserting movie',
                error: err
            });
        } else {
            res.json({
                status: 'success',
                message: 'Movie added successfully',
                data: movie
            });
        }
    });
});

router.delete('/deletemovie', (req, res) => {
    const { movie_id } = req.body;
    const sql = 'DELETE FROM `Movie` WHERE `movie_id` = ?';

    conn.query(sql, [movie_id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error deleting mmovie');
        } else {
            res.send('Movie deleted successfully');
        }
    });
});

//-----Person------//
router.get("/getperson", (req, res) => {
    conn.query('select * from Person', (err, result, fields) => {
        res.json(result);
    });
});

router.post('/addperson', (req, res) => {
    const person = req.body;
    const sql = 'INSERT INTO `Person`(`Fullname`,`birth_date`,`profile`,`personal`) VALUES (?,?,?,?)';
    conn.query(sql, [person.Fullname, person.birth_date, person.profile, person.personal], (err, result) => {
        if (err) {
            console.error('Error inserting movie:', err);
            res.status(500).json({
                status: 'error',
                message: 'Error inserting person',
                error: err
            });
        } else {
            res.json({
                status: 'success',
                message: 'Person added successfully',
                data: person
            });
        }
    })
});

// {
//     "Fullname":"",
//     "birth_date":"",
//     "profile":"",
//     "personal":""
// }

//http://localhost:3000/trip/deleteperson
router.delete('/deleteperson', (req, res) => {
    const { person_id } = req.body;
    const sql = 'DELETE FROM `Person` WHERE `person_id` = ?';

    conn.query(sql, [person_id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error deleting person');
        } else {
            res.send('Person deleted successfully');
        }
    });
});

//-----Stars------//

//http://localhost:3000/trip/addstar
router.post('/addstar', (req, res) => {
    const star = req.body;
    const sql = 'INSERT INTO `Stars`(`movie_id`,`person_id`) VALUES (?,?)';
    conn.query(sql, [star.movie_id, star.person_id], (err, result) => {
        if (err) {
            console.error('Error insert Stars:', err);
            res.status(500).json({
                status: 'error',
                message: 'Error inserting Stars',
                error: err
            })
        } else {
            res.json({
                status: 'success',
                message: 'Stars added successfully',
                data: star
            })
        }
    })
});


//http://localhost:3000/trip/deletestar
router.delete('/deletestar', (req, res) => {
    const { movie_id, person_id } = req.body;
    const sql = 'DELETE FROM `Stars` WHERE `movie_id` = ? AND `person_id` = ?';

    conn.query(sql, [movie_id, person_id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error deleting star');
        } else {
            res.send('Star deleted successfully');
        }
    });
});


//-----Creators------//

//http://localhost:3000/trip/addcreator
router.post('/addcreator', (req, res) => {
    const creator = req.body;
    const sql = 'INSERT INTO `Creator`(`movie_id`,`person_id`,`role`) VALUES (?,?,?)';
    conn.query(sql, [creator.movie_id, creator.person_id, creator.role], (err, result) => {
        if (err) {
            console.error('Error insert Creator:', err);
            res.status(500).json({
                status: 'error',
                message: 'Error inserting Creator',
                error: err
            })
        } else {
            res.json({
                status: 'success',
                message: 'Creator added successfully',
                data: creator
            })
        }
    })
});


// Director Writers Editor

// {
//     "movie_id": ,
//     "person_id": ,
//     "role":" "
// }

//http://localhost:3000/trip/deletecreator/?id=
router.delete('/deletecreator', (req, res) => {
    const { movie_id, person_id } = req.body;
    const sql = 'DELETE FROM `Creator` WHERE `movie_id` = ? AND `person_id` = ?';

    conn.query(sql, [movie_id, person_id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error deleting creator');
        } else {
            res.send('Creator deleted successfully');
        }
    });
});



//-----Search-----//
router.get('/searchmovie', (req, res) => {
    const { searchTerm } = req.query;
    const sql = `
    SELECT Movie.*, 
           GROUP_CONCAT(DISTINCT StarsPerson.Fullname ORDER BY StarsPerson.Fullname ASC SEPARATOR ', ') AS stars, 
           GROUP_CONCAT(DISTINCT CreatorPerson.Fullname ORDER BY CreatorPerson.Fullname ASC SEPARATOR ', ') AS creators
    FROM Movie
    LEFT JOIN Stars ON Movie.movie_id = Stars.movie_id
    LEFT JOIN Person AS StarsPerson ON Stars.person_id = StarsPerson.person_id
    LEFT JOIN Creator ON Movie.movie_id = Creator.movie_id
    LEFT JOIN Person AS CreatorPerson ON Creator.person_id = CreatorPerson.person_id
    WHERE Movie.name LIKE ?
    GROUP BY Movie.movie_id
    `;

    conn.query(sql, [`%${searchTerm}%`], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error searching movie');
        } else {
            res.json(result);
        }
    });
});


//http://localhost:3000/trip/searchmovie/?searchTerm=


        // "name": "Top Gun: Maverick",
        // "description": "After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN's elite graduates on a mission",
        // "rating": "8.2",
        // "img": "https://upload.wikimedia.org/wikipedia/en/1/13/Top_Gun_Maverick_Poster.jpg",
        // "release_date": "2022-05-26",
        // "gene": "Action Drama"