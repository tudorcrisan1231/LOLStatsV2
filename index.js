// SERVER SIDE WITH NODE.JS

const { request } = require('express');
const express = require('express');  //pentru pornirea serverului in nodejs
const fetch = require("node-fetch"); //pr a functiona functia fetch in nodejs
require('dotenv').config(); //pt securizarea api key ului


const app = express();
const port = process.env.PORT || 2000;
app.listen(port, ()=> console.log('listening at 2000'));
app.use(express.static('public')); //asta e fisierul pe care il afisez/randez cu serverul de node
app.use(express.json({ limit: '1mb' }));

const api_key = process.env.API_KEY;


//  CHAMPION-V3   rotatia campionilor free
app.get('/champion-v3', async (request, response) => {
    const link = `https://eun1.api.riotgames.com/lol/platform/v3/champion-rotations?api_key=${api_key}`;
    const fetch_response = await fetch(link);
    const data = await fetch_response.json();
    response.json(data);
});


//  SUMMONER-V4    statusurile contului ID, accountID, puuid, lvl, iconID  dupa numele contului
app.get('/summoner-v4/:region/:name', async (request, response) => {
    const name = request.params.name;
    const region = request.params.region;
    console.log(name);

    const link = `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?api_key=${api_key}`;
    const fetch_response = await fetch(link);
    const data = await fetch_response.json();
    response.json(data);
});


// MATCH-V5   istoricul meciurilor dupa Account id si detalii pt fiecare meci in parte

app.get('/match-v5-list-by-puuid/:region/:puuid', async (request, response) => {
    const puuid = request.params.puuid;
    const region = request.params.region;
    console.log(puuid);

    const link = `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=10&api_key=${api_key}`;
    const fetch_response = await fetch(link);
    const data = await fetch_response.json();
    response.json(data);
});



app.get('/match-v4-listCustom-by-accountId/:region/:accountId/:queue', async (request, response) => {
    const accountId = request.params.accountId;
    const region = request.params.region;
    const queue = request.params.queue;
    

    const link = `https://${region}.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}?queue=${queue}&endIndex=5&api_key=${api_key}`;
    const fetch_response = await fetch(link);
    const data = await fetch_response.json();
    response.json(data);
});


app.get('/match-v5-listCustom-by-puuid/:region/:puuid/:queue', async (request, response) => {
    const puuid = request.params.puuid;
    const region = request.params.region;
    const queue = request.params.queue;
    

    const link = `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?queue=${queue}&start=0&count=10&api_key=${api_key}`;
    const fetch_response = await fetch(link);
    const data = await fetch_response.json();
    response.json(data);
});


app.get('/match-v5-game-by-gameID/:region/:gameID', async (request, response) => {
    const gameID = request.params.gameID;
    const region = request.params.region;
    console.log(gameID);

    const link = `https://${region}.api.riotgames.com/lol/match/v5/matches/${gameID}?api_key=${api_key}`;
    const fetch_response = await fetch(link);
    const data = await fetch_response.json();
    response.json(data);
});

app.get('/match-v5-timeline/:region/:matchID', async (request,response) => {
    const matchID = request.params.matchID;
    const region = request.params.region;

    const link = `https://${region}.api.riotgames.com/lol/match/v5/matches/${matchID}/timeline?api_key=${api_key}`;
    const fetch_response = await fetch(link);
    const data = await fetch_response.json();
    response.json(data);
});

// SPECTATOR-V4   datele din meciul live

app.get('/spectator-v4/:region/:summonerID', async (request, response) => {
    const summonerID = request.params.summonerID;
    const region = request.params.region;
    //console.log(summonerID);

    const link = `https://${region}.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${summonerID}?api_key=${api_key}`;
    const fetch_response = await fetch(link);
    const data = await fetch_response.json();
    response.json(data);
});

//LEAGUE-V4    date despre rank dupa summoner id

app.get('/league-v4/:region/:summonerID', async (request, response) => {
    const summonerID = request.params.summonerID;
    const region = request.params.region;
    //console.log(summonerID);

    const link = `https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerID}?api_key=${api_key}`;
    const fetch_response = await fetch(link);
    const data = await fetch_response.json();
    response.json(data);
});


//CHAMPION-MASTERY-V4  date despre lvl si exp de pe un anumut campion

app.get('/champion-mastery-v4/:region/:summonerID/:champID', async (request, response) => {
    const summonerID = request.params.summonerID;
    const region = request.params.region;
    const champID = request.params.champID;
    //console.log(summonerID);

    const link = `https://${region}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${summonerID}/by-champion/${champID}?api_key=${api_key}`;
    const fetch_response = await fetch(link);
    const data = await fetch_response.json();
    response.json(data);
});

app.get('/champion-mastery-v4-allChamp/:region/:summonerID', async (request, response) => {
    const summonerID = request.params.summonerID;
    const region = request.params.region;
    //console.log(summonerID);

    const link = `https://${region}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${summonerID}?api_key=${api_key}`;
    const fetch_response = await fetch(link);
    const data = await fetch_response.json();
    response.json(data);
});