require('dotenv').config();
const { Jikan4 } = require("node-myanimelist");
const fastify = require('fastify')();
const fs = require('fs');
const path = require('path');

var _anime;

fastify.register(require('@fastify/static'), {
    root: path.join(__dirname, 'public'),
    prefix: '/public/',
});

fastify.register(require("@fastify/view"), {
  engine: {
    eta: require("eta"),
  },
});

fastify.get('/', async (request, reply) => { 
    reply.view("views/home.eta");
});

fastify.get('/api/get_versus', async (request, reply) =>
{
    var FirstAnime = GetRandomAnime();
    var SecondAnime = GetRandomAnime(FirstAnime);
    return [FirstAnime, SecondAnime];
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function GetRandomAnime(exclude)
{
    _pick = _anime[Math.floor(Math.random() * _anime.length)];
    if (exclude != undefined)
    {
        if (_pick == exclude)
            return GetRandomAnime(exclude);
    }
    return _pick;
}

async function GetAnimeList(pages)
{
    if (pages < 1) throw new Exception('You must get at least 1 page.');
    console.log('Getting anime list... This will take approximately ' + (pages * 3.5) + ' seconds.');
    var animelist = [];
    for (i = 0; i < pages; i++)
    {
        var tempAnime = await Jikan4.topAnime({ page: i + 1 });
        Array.prototype.push.apply(animelist, tempAnime.data.map(x => {
            return {
                mal_id: x.mal_id,
                title: x.title,
                images: x.images,
                source: x.source,
                rank: x.rank,
                score: x.score,
                scored_by: x.scored_by,
                year: x.year,
                synopsis: x.synopsis
            };
        }));
        await sleep(3500);
    }
    return animelist;
}

async function SyncDataToFile(data, file)
{
    fs.writeFileSync(file, JSON.stringify(data));
}

async function RunServer(port)
{
    if (port == undefined) port = 3000;
    try
    {
        console.log("Server is running at port " + port);
        await fastify.listen({ port: port });
    } catch (err)
    {
        fastify.log.error(err);
        console.warn("Restarting the server due to an unexpected error.");
        RunServer(port);
    }
}

(async () => {
    _anime = await GetAnimeList(process.env.ANIME_PAGES);
    await SyncDataToFile({ "last_updated": Date.now(), "list": _anime }, 'anime.json');
    
    await RunServer(process.env.HTTP_PORT);
})().catch((e) => { console.log(e); });