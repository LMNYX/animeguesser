require('dotenv').config();
const { Jikan4 } = require("node-myanimelist");
const fastify = require('fastify');
const fs = require('fs');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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

(async () => {
    _anime = await GetAnimeList(10);
    await SyncDataToFile({"last_updated": Date.now(), "list": _anime}, 'anime.json');
})().catch((e) => { console.log(e); });