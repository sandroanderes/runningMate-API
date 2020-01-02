/*
 * JS runningMate scripts
 *
 * Copyright (c) 2019 Sandro Anderes (https://sandroanderes.ch)
 *
 * By Sandro Anderes - https://sandroanderes.ch
 * Licensed under the MIT license.
 * #
 *
 * @link #
 * @author Sandro Anderes
 * @date 5.10.2019
 * @version 1.0.0
 */

/*************************
     Variable definition
***************************/

const express = require('express');
const router = express.Router();
const mysql = require('mysql');
var db = require('../db/connection');

/********************
    User handling
*********************/

//get a list of near users from the db
router.get('/usr/:id', function (req, res) {
    var id = req.params.id;
    var dist = 80;


    console.log(id + "," + dist)

    var record = [id]
    var record2 = [id, dist]

    var sql = "SELECT location.lat, location.lng, clubs.clubname, fitness.level INTO @lat, @lng, @clubname, @level FROM (((nodejs_app.location LEFT JOIN nodejs_app.members ON location.fk_members=members.memberID) LEFT JOIN nodejs_app.clubs ON members.fk_club=clubs.clubID) LEFT JOIN nodejs_app.fitness ON members.memberID=fitness.fk_members) WHERE members.memberID = ?;"
    var sql2 = "SELECT  members.memberID, members.username, members.email, clubs.clubname, fitness.distance, fitness.level ,(6371 * acos (cos (radians(@lat)) * cos(radians( location.lat)) * cos( radians(location.lng) - radians(@lng)) + sin (radians(@lat)) * sin( radians( location.lat)))) AS distance FROM (((nodejs_app.members LEFT JOIN nodejs_app.clubs ON members.fk_club=clubs.clubID) LEFT JOIN nodejs_app.location ON members.memberID=location.fk_members) LEFT JOIN nodejs_app.fitness ON members.memberID=fitness.fk_members) WHERE (clubs.clubname = @clubname OR clubs.clubname = 'Alle') AND members.memberID != ? HAVING distance < ? ORDER BY distance LIMIT 0 , 20;"
    
    db.query(sql, record, function (err, results, fields) {
        if (err) throw err;

        db.query(sql2, record2, function (err, results, fields) {
            if (err) throw err;
            console.log(results);

            return res.send({
                type: 'GET',
                error: false,
                data: results,
                message: 'List of closesd members could be selected successfully'
            });
        });
    });
});

//add a new user to the db
router.post('/app', function (req, res) {
    var usrname = req.body.name;
    var usrstatus = req.body.status;
    var type = req.body.type;
    var lat = req.body.lat;
    var lng = req.body.lng;
    if (!usrname || !usrstatus) {
        console.log('Please provide name or status');
        return res.status(400).send({
            error: true,
            message: 'Please provide name or status'
        });
    }

    var record = {
        name: usrname,
        status: usrstatus,
        type: type,
        lat: lat,
        lng: lng
    }
    var sql = "INSERT INTO nodejs_app.users SET ? ";

    db.query(sql, record, function (err, results, fields) {
        if (err) throw err;
        console.log(usrname + ' has been created as ' + usrstatus + ' with type ' + type + ' and coordinates ' + lat + "," + lng + ' successfully.');
        return res.send({
            type: 'POST',
            err: false,
            data: results,
            message: usrname + ' has been created as ' + usrstatus + ' with type ' + type + ' and coordinates ' + lat + "," + lng + ' successfully.'
        });
    });
});

/********************
    Club handling
*********************/

//get a list of clubs from the db
router.get('/clubs', function (req, res) {
    var sql = 'SELECT * FROM nodejs_app.clubs ORDER BY clubID ASC'
    db.query(sql, function (err, results, fields) {
        if (err) throw err;
        console.log(results);

        return res.send({
            type: 'GET',
            error: false,
            data: results,
            message: 'list of clubs'
        });
    });
});

//get a club of member with id
router.get('/memberclub/:id', function (req, res) {
    var id = req.params.id;

    console.log(id);

    var record = [id];
    
    var sql = 'SELECT username, clubname, clubID FROM nodejs_app.members LEFT JOIN nodejs_app.clubs ON members.fk_club = clubs.clubID WHERE members.memberID = ?';

    db.query(sql,record, function (err, results, fields) {
        if (err) throw err;
        console.log(results);

        return res.send({
            type: 'GET',
            error: false,
            data: results,
            message: 'list of clubs'
        });
    });
});

//update or add a club from member in the db
router.put('/club/:id', function (req, res) {
    var id = req.params.id;
    console.log(id);
    var clubID = req.body.clubID;
    console.log(clubID);

    var sql = 'UPDATE nodejs_app.members SET members.fk_club = ? WHERE members.memberID= ?'
    var record = [clubID, id]

    db.query(sql, record, (err, results, fields) => {
        if (err) throw err;
        /* console.log(`Changed ${results.changedRows} row(s) from ${usrstatus, usrname} with id ${id}, type ${type} and coordinates ${lat},${lng}`); */
        return res.send({
            type: 'PUT',
            err: false,
            data: results,
            message: `Changes were made successfully`
        });
    });
});

//create new club
router.post('/club', function (req, res) {
    var clubname = req.body.clubname;
    console.log(clubname);

    var sql = 'INSERT INTO nodejs_app.clubs (clubname) VALUES (?)'
    var record = [clubname]

    db.query(sql, record, (err, results, fields) => {
        if (err) throw err;
        /* console.log(`Changed ${results.changedRows} row(s) from ${usrstatus, usrname} with id ${id}, type ${type} and coordinates ${lat},${lng}`); */
        return res.send({
            type: 'PUT',
            err: false,
            data: results,
            message: `Club was added successfully`
        });
    });
});


/************************
    Location handling
*************************/

//update a user location via fk in the db
router.put('/loc/:id', function (req, res) {
    var id = req.params.id;
    console.log(id);
    var lat = req.body.lat;
    console.log(lat);
    var lng = req.body.lng;
    console.log(lng);

    var sql = 'REPLACE nodejs_app.location SET location.lat = ?, location.lng = ?, location.fk_members = ?';
    var record = [lat, lng, id]

    db.query(sql, record, (err, results, fields) => {
        if (err) throw err;
        /* console.log(`Changed ${results.changedRows} row(s) from ${usrstatus, usrname} with id ${id}, type ${type} and coordinates ${lat},${lng}`); */
        return res.send({
            type: 'PUT',
            err: false,
            data: results,
            message: `Location changes were made successfully`
        });
    });
});

//delete a user from the db
router.delete('/app/:id', function (req, res) {
    var id = req.params.id;
    var sql = 'DELETE FROM nodejs_app.users WHERE id = ?'

    db.query(sql, id, (err, result, fields) => {
        if (err) throw err;
        console.log(`Deleted ${result.affectedRows} row(s)`);
        return res.send({
            type: 'DELETE',
            data: result,
            message: `Deleted ${result.affectedRows} row(s)`
        });
    });
});

/**********************
    Profile handling
***********************/

//get a list of profile information from specified user
router.get('/profile/:id', function (req, res) {
    var id = req.params.id;
    var sql = 'SELECT fitness.distance, fitness.level, fitness.goal FROM nodejs_app.fitness WHERE fitness.fk_members = ?';
    var record = [id];

    db.query(sql, record, function (err, results, fields) {
        if (err) throw err;
        console.log(results);

        return res.send({
            type: 'GET',
            error: false,
            data: results,
            message: `Profile information of userid ${id} selected successfully`
        });
    });
});

//save profile information from specified user
router.put('/profile/:id', function (req, res) {
    var id = req.params.id;
    console.log(id)
    var distance = req.body.distance;
    console.log(distance)
    var fitness = req.body.fitness;
    console.log(fitness)
    var goal = req.body.goal;
    console.log(goal)
    var sql = 'REPLACE nodejs_app.fitness SET fitness.distance = ?, fitness.level = ?, fitness.goal= ?, fitness.fk_members= ?';
    console.log(sql);
    var record = [distance, fitness, goal, id];

    db.query(sql, record, function (err, results, fields) {
        if (err) throw err;
        console.log(results);

        return res.send({
            type: 'GET',
            error: false,
            data: results,
            message: `Profile information from userid ${id} were updated successfully`
        });
    });
});


module.exports = router;