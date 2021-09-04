
////////////////////        transforma datele campionilor      //////////////////////////////////

//const { json } = require("express");

special_gameMode_queue = 1400 //Ultimate Spellbook games







let championByIdCache = {};
let championJson = {};

async function getLatestChampionDDragon(language = "en_US") {  //alege ultima versiune a lol ului

	if (championJson[language])
		return championJson[language];

	let response;
	let versionIndex = 0;
	do { // I loop over versions because 9.22.1 is broken
		const version = (await fetch("http://ddragon.leagueoflegends.com/api/versions.json").then(async(r) => await r.json()))[versionIndex++];
	
		response = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/${language}/champion.json`);
	}
	while (!response.ok)
	
	championJson[language] = await response.json();
	return championJson[language];
}

async function getChampionByKey(key, language = "en_US") {  //da inf despre campioni avand ca parametru key ul campionului

	// Setup cache
	if (!championByIdCache[language]) {
		let json = await getLatestChampionDDragon(language);

		championByIdCache[language] = {};
		for (var championName in json.data) {
			if (!json.data.hasOwnProperty(championName))
				continue;

			const champInfo = json.data[championName];
			championByIdCache[language][champInfo.key] = champInfo;
		}
	}

	return championByIdCache[language][key];
}

// NOTE: IN DDRAGON THE ID IS THE CLEAN NAME!!! It's also super-inconsistent, and broken at times.
// Cho'gath => Chogath, Wukong => Monkeyking, Fiddlesticks => Fiddlesticks/FiddleSticks (depending on what mood DDragon is in this patch)
async function getChampionByID(name, language = "en_US") { //da inf despre campioni avand ca parametru id ul campionului
	return await getLatestChampionDDragon(language)[name];
}


/////////////////////////////////////////////////////////////////////////////////////////















////////////////////////////////////// ms to h/m/s ////////////////////////////////////////////

function msToTime(duration) {
    var milliseconds = Math.floor((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
      days = Math.floor(duration / (24*60*60*1000));
  
    //hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
  
    if(duration <= 86399999) {
       return hours + " hours"/* + minutes + ":" + seconds*/;
    } else {
        
        if(duration > 86399999 && duration <= 172799999) {
            return  days+ " day";
        } else {
            return  days+ " days";
        }

    }
}

console.log(msToTime(89900000));

function msToMin_Sec(duration) {
    var milliseconds = Math.floor((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
  

    return minutes + "min" + " " + seconds + "s";

    
}


function msToMin_SecV2(duration) {
    var milliseconds = Math.floor((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
  

    return minutes + ":" + seconds;

    
}

function msToMin(duration) {
    var milliseconds = Math.floor((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
  

    return minutes;
}

////////////////////////////////////////////////////////////////////////////////////////////


function transformCapitalizeCase(str) {
    str = str.toLowerCase().split(' ');  //str - cuv/prop pe care o bag, prima data il fac tot cu litere mici,apoi il trnasform intr un vector
    for (var i = 0; i < str.length; i++) { //parcurg vectorul ce contine cuvintele 
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);   //iau fiecare cuvant in parte si il descompun in doua, prima litera,pe care o transform in litera mare + restul cuvantului pe care il atasez dupa
    }

    return str.join(' '); //returnez/afisez propozitia cu primele litere mari, funtia join transforma vectorul din nou intr-un sir
}






















async function getLatestVersion() {
    try {
        //const response = await fetch(`http://ddragon.leagueoflegends.com/api/versions.json`);
        //const data = await response.json();

        //console.log(data[0]);
        return `11.15.1`;   //AI PUN MANUAL ULTIMA VERSIUNE A JOCULUI, PT CA DACA O LAS AUTOMAT SE INGREUNEAZA SITE UL

    }catch(err) {
        console.error(err);
    }
}
getLatestVersion();















const sp = '%20';

const input_form = document.querySelector('.search_input');
const input_lol = document.querySelector('.search_bar');
const btn = document.querySelector('.search_btn');


////////////////////        GET DATA FROM SERVER      //////////////////////////////////

async function lolstats_free_champion() {
    const link = `/champion-v3`;
    const response = await fetch(link);
    const data = await response.json();
    console.log({data});
    //document.querySelector('.salut').textContent = data.freeChampionIds[0];
    return data;
}





async function lolstats_accout(region,name) {
    try {
        while(name.includes(" ")) {   //da remove la spatiul liber din username si il inlocuieste cu semn special pt spatiu
        let spaceSpot = name.indexOf(" ");
        name = name.substring(0, spaceSpot) + sp + name.substring(spaceSpot+1);
        }

        const link = `summoner-v4/${region}/${name}`;
        const response = await fetch(link);
        const data = await response.json();
        console.log(data);
        return data;  
    } catch(err) {
        console.error(err);
    }
}

//lolstats_accout('euw1','Hand Dipper Kano');



async function match_v5_list_by_puuid(region,puuid) {
    const link = `match-v5-list-by-puuid/${region}/${puuid}`;
    const response = await fetch(link);
    const data = await response.json();

    console.log(data);
    return data;
}


async function match_v4_listCustom_by_accountId(region,accountId,queue) {
    const link = `match-v4-listCustom-by-accountId/${region}/${accountId}/${queue}`;
    const response = await fetch(link);
    const data = await response.json();

    //console.log(data);
    return data;
}
//match_v4_listCustom_by_accountId('eun1','YyTQjU-urdrhp2PKehsIA64-dKaD-pJt8qV4DStlULZbqYY',440);



async function match_v5_listCustom_by_puuid(region,puuid,queue) {
    const link = `match-v5-listCustom-by-puuid/${region}/${puuid}/${queue}`;
    const response = await fetch(link);
    const data = await response.json();

    //console.log(data);
    return data;
}
//match_v5_listCustom_by_puuid('europe','izSa1Yd4Or1x2DWRI75mCFmqNfsyMP4doectsXbqIxrjsH4_kPL0w5L59rbX9Q_E-ghtH-Cs29qqFQ',440);




async function match_v5_game_by_gameID(region,gameID) {
    const link = `match-v5-game-by-gameID/${region}/${gameID}`;
    const response = await fetch(link);
    const data = await response.json();
    //console.log(data);
    return data;
}

async function match_v5_timeline(region,matchID) {
    const link = `match-v5-timeline/${region}/${matchID}`;
    const response = await fetch(link);
    const data = await response.json();
    //console.log(data);
    return data;
}

//match_v5_timeline('europe','EUN1_2858006543');







async function liveMatch(region,summonerID) {
    const link = `spectator-v4/${region}/${summonerID}`;
    const response = await fetch(link);
    const data = await response.json();
    console.log(data);
    return data;
}






async function summonerRank(region,summonerID) {
    try {
        const link = `league-v4/${region}/${summonerID}`;
        const response = await fetch(link);
        const data = await response.json();
        //console.log(data);
        return data;
    }catch(err) {
        console.error(err);
    }

}


//summonerRank('qo8s2_Y8PIVeciGxfIcEcXhmS8dmOMvZX3ZeBb3AI0bslnI');

async function summonerChampLvlExp(region,summonerID,champID) {
    try {
        const link = `champion-mastery-v4/${region}/${summonerID}/${champID}`;
        const response = await fetch(link);
        const data = await response.json();
        return data;
    }catch(err) {
        console.error(err);
    }
}


async function summpnerAllChampLvlExp(region,summonerID) {
    try {
        const link = `champion-mastery-v4-allChamp/${region}/${summonerID}`;
        const response = await fetch(link);
        const data = await response.json();
        return data;
        //console.log(data);
    }catch(err) {
        console.error(err);
    }
}

//summpnerAllChampLvlExp('eun1','qo8s2_Y8PIVeciGxfIcEcXhmS8dmOMvZX3ZeBb3AI0bslnI');




async function getMatchType(id) {
    try {
        const response = await fetch(`https://static.developer.riotgames.com/docs/lol/queues.json`);
        const data = await response.json();
        //console.log(data); 

        for(let i = 0; i < data.length; i++) {
            if(data[i].queueId === id)
            return data[i].description.substring(0, data[i].description.lastIndexOf(" "));
            //console.log(data[i].description.substring(0, data[i].description.lastIndexOf(" ")));
        }
    }catch(err) {
        console.error(err);
    }
}
//getMatchType(420);




async function spell(spellD, spellF) {
    const response = await fetch(`http://ddragon.leagueoflegends.com/cdn/${await getLatestVersion()}/data/en_US/summoner.json`);
    const data = await response.json();
    //console.log(Object.entries(data.data));
    const spells = Object.entries(data.data);
    //console.log(spells.length);

    for(let i = 0; i< spells.length; i++) {
        if(spells[i][1].key == spellD)
            return spells[i][1].id;
            //console.log(spells[i][1].id);
    }

    for(let j = 0; j< spells.length; j++) {
        if(spells[j][1].key == spellF)
            return spells[j][1].id;
            //console.log(spells[j][1].id);
    }
}

//spell(4, 11);

async function spell_description(spellD) {
    const response = await fetch(`http://ddragon.leagueoflegends.com/cdn/${await getLatestVersion()}/data/en_US/summoner.json`);
    const data = await response.json();
    const spells = Object.entries(data.data);
    //console.log(spells);

    for(let i = 0; i< spells.length; i++) {
        if(spells[i][1].key == spellD)
           // return `<p style="font-weight:bold">${spells[i][1].name}</p>
             //       <p>${spells[i][1].description}</p>`;
            //console.log(spells[i][1].name + " " + spells[i][1].description);
            return `<strong>${spells[i][1].name}</strong>` + "<br>" + spells[i][1].description;
    }
}
//spell_description(11);




async function item(item1) {
    const response = await fetch(`http://ddragon.leagueoflegends.com/cdn/${await getLatestVersion()}/data/en_US/item.json`);
    const data = await response.json();
    //console.log(data);
    const items = Object.entries(data.data);

    for(let i = 0; i < items.length; i++) {
        if(items[i][0] == item1) {
            return `<strong>${items[i][1].name}</strong>` + '<br>' + items[i][1].plaintext + '<br>' + items[i][1].description + '<br>' + `Cost: <strong>${items[i][1].gold.total}</strong>`;
            //console.log(items[i][1].name);
        } else if(item1 == 0) {
            return 'No item';
        }
    }
}
//item(3115);




async function getJSONforRune() {
    const response = await fetch(`http://ddragon.leagueoflegends.com/cdn/${await getLatestVersion()}/data/en_US/runesReforged.json`);
    const data = await response.json();
    return data;
}



async function runes(runeP, runeS) {
    const data = await getJSONforRune();

    let rune = [];

    for(let i = 0; i < data.length; i++) {
        for(let k = 0; k< data[i].slots[0].runes.length; k++) {
            if(data[i].slots[0].runes[k].id == runeP){
                rune.push(data[i].slots[0].runes[k].icon);
                //console.log(data[i].slots[0].runes[0].icon);
            }
        }

    }
    for(let j = 0; j < data.length; j++) {
        if(data[j].id.toString().substring(0,2) == runeS.toString().substring(0,2)){
            rune.push(data[j].icon);
            //console.log(data[j].icon);
        }
    }
    //console.log(data[0].id.toString().substring(0,2));
    //console.log(rune);
    return rune;
}
//runes('8128','8446');

async function runesSingle(runeP) {
    const data = await getJSONforRune();


    for(let i = 0; i < data.length; i++) {
        for(let j = 0; j < data[i].slots.length; j++) {
            for(let k = 0; k< data[i].slots[j].runes.length; k++) {
                if(data[i].slots[j].runes[k].id == runeP){
                    return data[i].slots[j].runes[k].icon;
                    //console.log(data[i].slots[j].runes[k].icon);
                }
            }
        }
    }
}
//runesSingle(8143);


async function runesDescription(runeP) {
    const data = await getJSONforRune();


    for(let i = 0; i < data.length; i++) {
        for(let j = 0; j < data[i].slots.length; j++) {
            for(let k = 0; k< data[i].slots[j].runes.length; k++) {
                if(data[i].slots[j].runes[k].id == runeP){
                    return `<div style="display:flex;"><img src="./img/${data[i].slots[j].runes[k].icon}" alt="runes" style="shape-outside: circle(); width:5rem; height:5rem; margin-right: 5px;"> <div> <p style="font-weight:bold;">${data[i].slots[j].runes[k].name}</p> <p>${data[i].slots[j].runes[k].shortDesc}</p></div></div>`;
                    //console.log(data[i].slots[j].runes[k].name + " " + data[i].slots[j].runes[k].shortDesc);
                }
            }
        }
    }
}
//runesDescription(8143);



async function runesDescription_noImg(runeP,runeS) {
    const data = await getJSONforRune();
    const rune = [];

    for(let i = 0; i < data.length; i++) {
        for(let j = 0; j < data[i].slots.length; j++) {
            for(let k = 0; k< data[i].slots[j].runes.length; k++) {
                if(data[i].slots[j].runes[k].id == runeP){
                    rune.push(`<strong>${data[i].slots[j].runes[k].name}</strong>` + "<br>" + data[i].slots[j].runes[k].shortDesc);
                    //console.log(data[i].slots[j].runes[k].name + " " + data[i].slots[j].runes[k].shortDesc); 
                }
            }
        }
    }

    for(let j = 0; j < data.length; j++) {
        if(data[j].id.toString().substring(0,2) == runeS.toString().substring(0,2)){
            rune.push(`<strong>${data[j].name}</strong>`);
            //console.log(data[j].icon);
        }
    }
    return rune;

}


async function getMapa(mapa) {
    const response = await fetch('http://static.developer.riotgames.com/docs/lol/maps.json');
    const data = await response.json();
    console.log(data);

    for(let i=0;i<data.length;i++) {
        if(data[i].mapId == mapa) {
            return data[i].mapName;
        }
    }
}
//getMapa(11);




async function getChampKey_ID(input) {
    try {
        const response = await fetch(`http://ddragon.leagueoflegends.com/cdn/${await getLatestVersion()}/data/en_US/champion/${input}.json`);
        const data = await response.json();
    
        return [data.data[input].id, data.data[input].key];
        //console.log([data.data[input].id, data.data[input].key]);
    } catch(err) {
        alert("Champion not found. Please check spelling");
        profile_container.style.cursor='url(https://cur.cursors-4u.net/games/gam-14/gam1340.cur), auto';
    }

}




async function getChampAbilities(input) {
    const response = await fetch(`http://ddragon.leagueoflegends.com/cdn/${await getLatestVersion()}/data/en_US/champion/${input}.json`);
    const data = await response.json();
    //console.log(data);

    const abilities = [];

    abilities.push([data.data[input].spells[0].name, data.data[input].spells[0].description, data.data[input].spells[0].cooldownBurn,data.data[input].spells[0].costBurn,data.data[input].spells[0].id],
    [data.data[input].spells[1].name, data.data[input].spells[1].description, data.data[input].spells[1].cooldownBurn,data.data[input].spells[1].costBurn,data.data[input].spells[1].id],
    [data.data[input].spells[2].name, data.data[input].spells[2].description, data.data[input].spells[2].cooldownBurn,data.data[input].spells[2].costBurn,data.data[input].spells[2].id],
    [data.data[input].spells[3].name, data.data[input].spells[3].description, data.data[input].spells[3].cooldownBurn,data.data[input].spells[3].costBurn,data.data[input].spells[3].id]);

    //console.log(abilities);
    return abilities;
}
//getChampAbilities('Ekko');
///////////////////////////////////////////////////////////////////////////////////////////////////////////













////////////////////        GET SELECTED REGION      //////////////////////////////////

function getSelectedRegion() {
    const regions = document.getElementById('search_region');

    function getSelectedOption(selected) {
        var aux;
        for ( var i = 0; i < selected.options.length; i++ ) {
            aux = selected.options[i];
            if ( aux.selected === true ) {
                break;
            }
        }
        return aux;
    }

    //console.log(getSelectedOption(regions).value);
    return getSelectedOption(regions).value;
}

/////////////////////////////////////////////////////////////////////////////////////////











//////////////////////////////// RENDER PROFILE STATS ////////////////////////////////////////

function getRegion_Name(input) {
    let arr = [];
    for(let i=0;i<input.length;i++) {
        if(input[i] == '/') {
            arr.push(input.substr(0,i), input.substr(i+1,input.lenght));
            break;
        }
    }
    return arr;
}


//if(localStorage.getItem('save') !== null && localStorage.getItem('recent') == null) {  //render SAVED PROFILES
    //if(JSON.parse(localStorage.getItem('save')).length !== 0 && localStorage.getItem('recent').length !== 0) {

        let location_profile = document.querySelector('.search_save');
        let location_profile_favorite = document.querySelector('.search_save_favorite');
        let location_profile_recent = document.querySelector('.search_save_recent');
        


        

        input_lol.addEventListener('focus', function() {
            console.log('valid');

            if(localStorage.getItem('save') == null && localStorage.getItem('recent') == null) {
                location_profile.classList.add('hidden_opacity');
            } else {
                if(localStorage.getItem('save') == null || JSON.parse(localStorage.getItem('save')).length == 0) {
                    location_profile_favorite.insertAdjacentHTML('beforeend',`
                    <div class="search_save_profile">
                        No favorite profile..
                    </div>
                `);
                }
                const recents = JSON.parse(localStorage.getItem('recent'));

                for(let i=recents.length-1;i>=0;i--) {
                    location_profile_recent.insertAdjacentHTML('beforeend', `
                        <div class="search_save_profile">
                            <a href="#${recents[i]}">- <span class="search_save_profile_name">${getRegion_Name(recents[i])[1]}</span>  <span style="font-weight:bold; margin-left:.6rem;">#${regionName(getRegion_Name(recents[i])[0])}</span></a>
                        </div>
                    `);
                }
    
                const saves = JSON.parse(localStorage.getItem('save'));
    
     
    
                location_profile.classList.remove('hidden_opacity');

                if(localStorage.getItem('save') !== null) {
                    for(let i=0;i<saves.length;i++) {
                        location_profile_favorite.insertAdjacentHTML('beforeend',`
                        <div class="search_save_profile">
                            <a href="#${saves[i]}">- <span class="search_save_profile_name">${getRegion_Name(saves[i])[1]}</span>   <span style="font-weight:bold; margin-left:.6rem;">#${regionName(getRegion_Name(saves[i])[0])}</span></a>
                        </div>
                    `);
                    }
                }
            }






        }, {once : true});
   // }
//}





async function render_basic_profile_stats(data) {
    const location_stats = document.querySelector('.profile_container__content__summary');
    location_stats.innerHTML="";
    //data.revisionDate = msToTime(data.revisionDate);

    let markup = `
    <div>
        <img src="http://ddragon.leagueoflegends.com/cdn/${await getLatestVersion()}/img/profileicon/${data.profileIconId}.png" alt="Summoner_icon" class="profile_container__content__summary--image" id="testTooltip"> 
    </div>
    <div>
        <h2 class="profile_container__content__summary--name">
            ${data.name}
            <svg class="profile_container__content__summary--name_svg empty" data-tippy-content="Add to favorite" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 16 16"><g fill="rgb(95,158,160)"><path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"/></g></svg>
            <svg class="profile_container__content__summary--name_svg full" data-tippy-content="Favorite" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 16 16"><g fill="rgb(95,158,160)"><path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/></g></svg>
        </h2>
        <h3 class="profile_container__content__summary--level">level: ${data.summonerLevel}</h3>
        <p class="profile_container__content__summary--ladder_rank">Last update: <span class="profile_container__content__summary--ladder_rank--nr">${msToTime(new Date().getTime() - data.revisionDate)}</span> ago</p>
    </div>`;




    location_stats.insertAdjacentHTML('afterbegin', markup);

    let save_empty = document.querySelector('.empty');
    let save_full = document.querySelector('.full');


    if(localStorage.getItem('save') !== null) {
        console.log(`${window.location.hash.substring(window.location.hash.lastIndexOf('#')+1, window.location.hash.lastIndexOf('/')) + '/'+data.name}`);
        if(JSON.parse(localStorage.getItem('save')).length !== 0) {
            
            for(let i=0;i<JSON.parse(localStorage.getItem('save')).length;i++) {
                if(JSON.parse(localStorage.getItem('save'))[i] === `${window.location.hash.substring(window.location.hash.lastIndexOf('#')+1, window.location.hash.lastIndexOf('/')) + '/'+data.name}`) {
                    save_empty.classList.add('hidden');
                    save_full.classList.remove('hidden');
                    break;

                } else {
                    save_empty.classList.remove('hidden');
                    save_full.classList.add('hidden');
                    
                }
            } 
        } else {
            save_empty.classList.remove('hidden');
            save_full.classList.add('hidden');
        }

    } else {
        save_empty.classList.remove('hidden');
        save_full.classList.add('hidden');
    }



    function save() { 
        let new_profile = this.window.location.hash.substring(this.window.location.hash.lastIndexOf('#')+1, this.window.location.hash.lastIndexOf('/')) + '/'+data.name;
        
        if(localStorage.getItem('save') == null) {
            localStorage.setItem('save', '[]');
        }

        let old_profile = JSON.parse(localStorage.getItem('save'));
        old_profile.push(new_profile);

        localStorage.setItem('save', JSON.stringify(old_profile));
    }


    save_empty.addEventListener('click', function() {
        save();
        save_empty.classList.add('hidden');
        save_full.classList.remove('hidden');
    });
    let saves = JSON.parse(localStorage.getItem('save'));
    save_full.addEventListener('click', function() {
        if(localStorage.getItem('save') !== null) {
            
            
            for(let i=0;i<saves.length;i++) {
                if(saves[i] === `${window.location.hash.substring(window.location.hash.lastIndexOf('#')+1, window.location.hash.lastIndexOf('/')) + '/'+data.name}`) {
                    saves.splice(i,1);
                }
            } 

            localStorage.setItem('save',JSON.stringify(saves));
            //console.log(JSON.parse(localStorage.getItem('save')));
        }
        save_empty.classList.remove('hidden');
        save_full.classList.add('hidden');
    });

    function recent() {
        let new_profile = this.window.location.hash.substring(this.window.location.hash.lastIndexOf('#')+1, this.window.location.hash.lastIndexOf('/')) + '/'+data.name;

        if(localStorage.getItem('recent') == null) {
            localStorage.setItem('recent', '[]');
        }

        let old_profile = JSON.parse(localStorage.getItem('recent'));
        old_profile.push(new_profile);

        localStorage.setItem('recent', JSON.stringify(old_profile));

        let recents = JSON.parse(localStorage.getItem('recent'));

        let recents_noDouble = [...new Set(recents)];
        
        if(recents_noDouble.length > 5) {
            recents_noDouble.splice(0,1);
        }
        
        localStorage.setItem('recent',JSON.stringify(recents_noDouble));
    }

    recent();

    tippy('[data-tippy-content]', {
        allowHTML: true,
    });

}








function render_rank_profile_stats(data) {
    const location_stats = document.querySelector('.profile_container__content__rank');
    location_stats.innerHTML="";



    let markup =``;

    if(data.length > 1) {
        data[0].tier = transformCapitalizeCase(data[0].tier);
        data[1].tier = transformCapitalizeCase(data[1].tier);
        if(data[0].queueType === 'RANKED_FLEX_SR') {

            data[1].queueType = "Ranked Solo/Duo";
            data[0].queueType = "Ranked Flex";
    
            markup = `
            <div class="profile_container__content__rank--solo-duo">
                <div>
                    <img src="./img/${data[1].tier}.png" alt="rank_icon" class="profile_container__content__rank--image">
                </div>
        
                <div>
                    <p class="profile_container__content__rank--name">${data[1].queueType}</p>
                    <h2 class="profile_container__content__rank--divizie">${data[1].tier} ${data[1].rank}</h2>
                    <p class="profile_container__content__rank--lp"><span class="profile_container__content__rank--lp-nr">${data[1].leaguePoints}lp</span> / ${data[1].wins}W ${data[1].losses}L</p>
                    <p class="profile_container__content__rank--wr">Win Ratio ${(data[1].wins / (data[1].wins+data[1].losses)).toFixed(2).toString().substr(-2)}%</p>
                </div>
            </div>
        
            <div class="profile_container__content__rank--flex">
                <div>
                    <img src="./img/${data[0].tier}.png" alt="rank icon" class="profile_container__content__rank--image">
                </div>
        
                <div>                         
                    <p class="profile_container__content__rank--name">${data[0].queueType}</p>
                    <h2 class="profile_container__content__rank--divizie">${data[0].tier} ${data[0].rank}</h2>
                    <p class="profile_container__content__rank--lp"><span class="profile_container__content__rank--lp-nr">${data[0].leaguePoints}lp</span> / ${data[0].wins}W ${data[0].losses}L</p>
                    <p class="profile_container__content__rank--wr">Win Ratio ${(data[0].wins / (data[0].wins+data[0].losses)).toFixed(2).toString().substr(-2)}%</p>
                </div>
            </div>
            `
        } else {
    
            data[0].queueType = "Ranked Solo/Duo";
            data[1].queueType = "Ranked Flex";
    
            markup = `
            <div class="profile_container__content__rank--flex">
                <div>
                    <img src="./img/${data[0].tier}.png" alt="rank icon" class="profile_container__content__rank--image">
                </div>
        
                <div>                         
                    <p class="profile_container__content__rank--name">${data[0].queueType}</p>
                    <h2 class="profile_container__content__rank--divizie">${data[0].tier} ${data[0].rank}</h2>
                    <p class="profile_container__content__rank--lp"><span class="profile_container__content__rank--lp-nr">${data[0].leaguePoints}lp</span> / ${data[0].wins}W ${data[0].losses}L</p>
                    <p class="profile_container__content__rank--wr">Win Ratio ${(data[0].wins / (data[0].wins+data[0].losses)).toFixed(2).toString().substr(-2)}%</p>
                </div>
            </div>
            <div class="profile_container__content__rank--solo-duo">
            <div>
                <img src="./img/${data[1].tier}.png" alt="rank_icon" class="profile_container__content__rank--image">
            </div>
    
            <div>
                <p class="profile_container__content__rank--name">${data[1].queueType}</p>
                <h2 class="profile_container__content__rank--divizie">${data[1].tier} ${data[1].rank}</h2>
                <p class="profile_container__content__rank--lp"><span class="profile_container__content__rank--lp-nr">${data[1].leaguePoints}lp</span> / ${data[1].wins}W ${data[1].losses}L</p>
                <p class="profile_container__content__rank--wr">Win Ratio ${(data[1].wins / (data[1].wins+data[1].losses)).toFixed(2).toString().substr(-2)}%</p>
            </div>
        </div>
            `
        }
    } else if(data.length === 1) {
        data[0].tier = transformCapitalizeCase(data[0].tier);
        
        if(data[0].queueType === 'RANKED_FLEX_SR') {
            data[0].queueType = "Ranked FLex";
            markup = `
            <div class="profile_container__content__rank--solo-duo">
                <div>
                    <img src="./img/unranked.png" alt="rank_icon" class="profile_container__content__rank--image">
                </div>
        
                <div>
                    <p class="profile_container__content__rank--name">Ranked Solo/Duo</p>
                    <h2 class="profile_container__content__rank--divizie">Unranked</h2>
                </div>
            </div>
        
            <div class="profile_container__content__rank--flex">
                <div>
                    <img src="./img/${data[0].tier}.png" alt="rank icon" class="profile_container__content__rank--image">
                </div>
        
                <div>                         
                    <p class="profile_container__content__rank--name">${data[0].queueType}</p>
                    <h2 class="profile_container__content__rank--divizie">${data[0].tier} ${data[0].rank}</h2>
                    <p class="profile_container__content__rank--lp"><span class="profile_container__content__rank--lp-nr">${data[0].leaguePoints}lp</span> / ${data[0].wins}W ${data[0].losses}L</p>
                    <p class="profile_container__content__rank--wr">Win Ratio ${(data[0].wins / (data[0].wins+data[0].losses)).toFixed(2).toString().substr(-2)}%</p>
                </div>
            </div>
            `
        } else if(data[0].queueType === 'RANKED_SOLO_5x5'){
            data[0].queueType = "Ranked Solo/Duo";
            markup = `
            <div class="profile_container__content__rank--solo-duo">
                <div>
                    <img src="./img/${data[0].tier}.png" alt="rank_icon" class="profile_container__content__rank--image">
                </div>
        
                <div>
                    <p class="profile_container__content__rank--name">${data[0].queueType}</p>
                    <h2 class="profile_container__content__rank--divizie">${data[0].tier} ${data[0].rank}</h2>
                    <p class="profile_container__content__rank--lp"><span class="profile_container__content__rank--lp-nr">${data[0].leaguePoints}lp</span> / ${data[0].wins}W ${data[0].losses}L</p>
                    <p class="profile_container__content__rank--wr">Win Ratio ${(data[0].wins / (data[0].wins+data[0].losses)).toFixed(2).toString().substr(-2)}%</p>
                </div>
            </div>
        
            <div class="profile_container__content__rank--flex">
                <div>
                    <img src="./img/unranked.png" alt="rank icon" class="profile_container__content__rank--image">
                </div>
        
                <div>                         
                    <p class="profile_container__content__rank--name">Ranked Flex</p>
                    <h2 class="profile_container__content__rank--divizie">Unranked</h2>
                </div>
            </div>
            `
        }
    } else if (data.length === 0) {
        markup = `
        <div class="profile_container__content__rank--solo-duo">
            <div>
                <img src="./img/unranked.png" alt="rank_icon" class="profile_container__content__rank--image">
            </div>
    
            <div>
                <p class="profile_container__content__rank--name">Rank Solo/Duo</p>
                <h2 class="profile_container__content__rank--divizie">Unranked</h2>
            </div>
        </div>
    
        <div class="profile_container__content__rank--flex">
            <div>
                <img src="./img/unranked.png" alt="rank_icon" class="profile_container__content__rank--image">
            </div>

            <div>
                <p class="profile_container__content__rank--name">Rank Flex</p>
                <h2 class="profile_container__content__rank--divizie">Unranked</h2>
            </div>
        </div>
        `
    }



    location_stats.insertAdjacentHTML('afterbegin', markup);
}




function render_match_error() {  //in caz ca nu sunt meciuri
    const location_stats = document.querySelector('.profile_container__content__match-history');
    const location_statsV2 = document.querySelector('.general');

    location_statsV2.innerHTML="";


    const markup = `
    <div class="match_error">
    <div>
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="6rem" height="6rem" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 36 36"><circle class="clr-i-outline clr-i-outline-path-1" cx="18" cy="26.06" r="1.33" fill="#626262"/><path class="clr-i-outline clr-i-outline-path-2" d="M18 22.61a1 1 0 0 1-1-1v-12a1 1 0 1 1 2 0v12a1 1 0 0 1-1 1z" fill="#626262"/><path class="clr-i-outline clr-i-outline-path-3" d="M18 34a16 16 0 1 1 16-16a16 16 0 0 1-16 16zm0-30a14 14 0 1 0 14 14A14 14 0 0 0 18 4z" fill="#626262"/></svg>
    </div> 
    <h1>No recently stats recorded</h1>
    </div>
    `;

    


    location_stats.insertAdjacentHTML('beforeend', markup);
}



async function render_match(data, player) {

    const location_stats = document.querySelector('.profile_container__content__match-history');
    //location_stats.innerHTML="";
            


    const matchType = await getMatchType(data.info.queueId);



    
    const getRegion = this.window.location.hash.substring(this.window.location.hash.lastIndexOf('#')+1, this.window.location.hash.lastIndexOf('/'));;

    let player_match = '';
    let win_lose = '';

    for(let i = 0; i < data.info.participants.length; i++) {
        if(data.info.participants[i].summonerName == player) {
           player_match = data.info.participants[i];
        }
    }


    if(data.info.gameDuration < 300000) {
        win_lose = 'Remake'
    } else {
        if(player_match.win === true) {
            win_lose = 'Victory';
        } else {
            win_lose = 'Defeat';
        }
    }


    //console.log(data.info.gameStartTimestamp);
    //console.log(msToTime(new Date().getTime() - data.info.gameStartTimestamp));

    const player_champ = await getChampionByKey(player_match.championId);

    //console.log(player_champ);

    const spellD = await spell(player_match.summoner1Id);
    const spellF = await spell(player_match.summoner2Id);
    //console.log(spellD,spellF);

    const spell1 = await spell_description(player_match.summoner1Id);
    const spell2 = await spell_description(player_match.summoner2Id);
    //console.log(spell1,spell2);

    const player_teamId = player_match.teamId;
    let total_kills_per_player_team = 0;

    for(let j = 0; j < data.info.participants.length; j++) {  //kill uriel echipe in care esti
        if(data.info.participants[j].teamId == player_teamId) {
            total_kills_per_player_team += data.info.participants[j].kills;
        }
    }
    //console.log(total_kills_per_player_team);
    
   
    const items = [player_match.item0, player_match.item1, player_match.item2, player_match.item3, player_match.item4, player_match.item5];
        

    async function iconLink(iconID) {
        if(iconID == 0) {
            return '/img/none.jpg';
        } else {
            return `http://ddragon.leagueoflegends.com/cdn/${await getLatestVersion()}/img/item/${iconID}.png`;
        }
    }


    const rune = await runes(player_match.perks.styles[0].selections[0].perk,player_match.perks.styles[1].style); //runele principale 
    
    const rune_desc = await runesDescription_noImg(player_match.perks.styles[0].selections[0].perk,player_match.perks.styles[1].style);

    function color_background(win_lose) {
        if(data.info.gameDuration < 300000) {
            return '128, 128, 128';
        } else {
            if(win_lose == true) {
                return '32,178,170';
            } else {
                return '240,128,128';
            }
        }
    }

    //green : '30, 215, 96';
    //blue: '30,144,255';

    /*
    //data.info.participants[0].summonerName
    for(let e = 0; e < data.info.participants.length; e++) {
        if(data.info.participants[e].summonerName.length > 9) {
            data.info.participants[e].summonerName = data.info.participants[e].summonerName.substring(0, 8) + "...";
        }
    }*/

    function team_win_lose() {
        let vec = [];
        for(let i = 0; i<data.info.participants.length; i++) {
            if(data.info.participants[0].teamId == 100 && data.info.participants[0].win == true) {
                vec.push('Victory');
            } else if(data.info.participants[0].teamId == 100 && data.info.participants[0].win == false) {
                vec.push('Defeat');
            }

            if(data.info.participants[5].teamId == 200 && data.info.participants[5].win == true) {
                vec.push('Victory');
            } else if(data.info.participants[5].teamId == 200 && data.info.participants[5].win == false) {
                vec.push('Defeat');
            }
        }

        return vec;
    }

    function team_win_lose_color() {
        const win_lose = team_win_lose();
        let vec = [];
        if(win_lose[0] == 'Victory') {
            vec.push('32,178,170');
        } else if(win_lose[0] == 'Defeat'){
            vec.push('255, 0, 0');
        }
        if(win_lose[1] == 'Victory') {
            vec.push('32,178,170');
        } else if(win_lose[1] == 'Defeat'){
            vec.push('255, 0, 0');
        }

        return vec;
    }


    //pun fiecare regiune pe continent
    if(getRegion === 'eun1' || getRegion === 'euw1' || getRegion === 'ru' || getRegion === 'tr1') {  
        continent = 'europe';
    }
    if(getRegion === 'br1' || getRegion === 'la1' || getRegion === 'la2' || getRegion === 'na1' || getRegion === 'oc1') {
        continent = 'americas';
    }
    if(getRegion === 'jp1' || getRegion === 'kr') {
        continent = 'asia';
    } 

    //console.log(data.metadata.matchId); 

    async function getDragon() {
        const timeline = await match_v5_timeline(continent, data.metadata.matchId);
        const dragon_blueTeam=[];
        const dragon_redTeam=[];
        const first_blood = [];

        let player_match_timeline;  //tine minte id participnatului ales (cel bagat in search bar)

        const player_items_build = [];
        const player_skills_build = [];

        for(a = 0; a < timeline.metadata.participants.length; a++) {
            if(player_match.puuid == timeline.metadata.participants[a]) {
                player_match_timeline = a+1;
            }
        }
        console.log( player_match_timeline);



        for(let d=0; d<timeline.info.frames.length;d++) {
            for(let f=0; f<timeline.info.frames[d].events.length;f++) {
                if(timeline.info.frames[d].events[f].type == "ELITE_MONSTER_KILL" && timeline.info.frames[d].events[f].monsterType == "DRAGON" && timeline.info.frames[d].events[f].killerTeamId == '100') {
                    dragon_blueTeam.push(timeline.info.frames[d].events[f].monsterSubType);
                } else if (timeline.info.frames[d].events[f].type == "ELITE_MONSTER_KILL" && timeline.info.frames[d].events[f].monsterType == "DRAGON" && timeline.info.frames[d].events[f].killerTeamId == '200') {
                    dragon_redTeam.push(timeline.info.frames[d].events[f].monsterSubType);
                }

                if(timeline.info.frames[d].events[f].type == "CHAMPION_SPECIAL_KILL" && timeline.info.frames[d].events[f].killType == "KILL_FIRST_BLOOD") {
                    first_blood.push(timeline.info.frames[d].events[f-1].killerId,timeline.info.frames[d].events[f-1].victimId, timeline.info.frames[d].events[f-1].timestamp);
                }

                if(timeline.info.frames[d].events[f].participantId == player_match_timeline && (timeline.info.frames[d].events[f].type == "ITEM_PURCHASED" || timeline.info.frames[d].events[f].type == "ITEM_SOLD")) {
                    player_items_build.push([timeline.info.frames[d].events[f].type, timeline.info.frames[d].events[f].timestamp,timeline.info.frames[d].events[f].itemId]);
                }
                if(timeline.info.frames[d].events[f].participantId == player_match_timeline && timeline.info.frames[d].events[f].type == "SKILL_LEVEL_UP" && timeline.info.frames[d].events[f].levelUpType == "NORMAL") {
                    player_skills_build.push([timeline.info.frames[d].events[f].type,timeline.info.frames[d].events[f].timestamp,timeline.info.frames[d].events[f].skillSlot])
                }
            }
        }
        //console.log(player_skills_build);
        

        if(dragon_blueTeam.length==0) {
            dragon_blueTeam.push('0 dragons killed');
        } else {
            for(let g=0;g<dragon_blueTeam.length;g++) {
                if(dragon_blueTeam[g]=='AIR_DRAGON') {
                    dragon_blueTeam[g] = `<img style="height:22px; width:22px;" src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-match-history/global/default/air-100.png">`;
                }
                if(dragon_blueTeam[g]=='FIRE_DRAGON') {
                    dragon_blueTeam[g] = '<img style="height:22px; width:22px;" src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-match-history/global/default/fire-100.png">';
                }
                if(dragon_blueTeam[g]=='EARTH_DRAGON') {
                    dragon_blueTeam[g] = '<img style="height:22px; width:22px;" src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-match-history/global/default/earth-100.png">';
                }
                if(dragon_blueTeam[g]=='WATER_DRAGON') {
                    dragon_blueTeam[g] = '<img style="height:22px; width:22px;" src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-match-history/global/default/water-100.png">';
                }
                if(dragon_blueTeam[g].length==0) {
                    dragon_blueTeam.push('0 dragons killed');
                }
            }
        }
        
        if(dragon_redTeam.length==0) {
            dragon_redTeam.push('0 dragons killed');
        } else {
            for(let g=0;g<dragon_redTeam.length;g++) {
                if(dragon_redTeam[g]=='AIR_DRAGON') {
                    dragon_redTeam[g] = '<img style="height:22px; width:22px;" src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-match-history/global/default/air-200.png">';
                }
                if(dragon_redTeam[g]=='FIRE_DRAGON') {
                    dragon_redTeam[g] = '<img style="height:22px; width:22px;" src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-match-history/global/default/fire-200.png">';
                }
                if(dragon_redTeam[g]=='EARTH_DRAGON') {
                    dragon_redTeam[g] = '<img style="height:22px; width:22px;" src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-match-history/global/default/earth-200.png">';
                }
                if(dragon_redTeam[g]=='WATER_DRAGON') {
                    dragon_redTeam[g] = '<img style="height:22px; width:22px;" src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-match-history/global/default/water-200.png">';
                }
            }
        }
        //console.log([dragon_blueTeam, dragon_redTeam]);
        return [dragon_blueTeam, dragon_redTeam, first_blood, player_items_build, player_skills_build];
    }

    const dragon_timeline = await getDragon();



    async function bans(input) {
        const aux = await getChampionByKey(input);
        if(input == -1) {
            return `<img src="./img/none1.png" data-tippy-content="No ban">`;
        } else {
            return `<img src="http://ddragon.leagueoflegends.com/cdn/${await getLatestVersion()}/img/champion/${aux.id}.png" alt="champ_icon" class="match__players--icon" data-tippy-content="${aux.name}">`;
        }
    }



    async function checkBansArray() {
        if(data.info.teams[0].bans.length == 0) {
            return `<h4 style="text-align:center;">No bans available for this game mode</h4>`;
        } else {
            return `
                <div class="match_extend_bans">
                    <div class="match_extend_bans_blue">
                        ${await bans(data.info.teams[0].bans[0].championId)}
                        ${await bans(data.info.teams[0].bans[1].championId)}
                        ${await bans(data.info.teams[0].bans[2].championId)}
                        ${await bans(data.info.teams[0].bans[3].championId)}
                        ${await bans(data.info.teams[0].bans[4].championId)}
                    </div>
                    <h3>: Bans :</h3>
                    <div class="match_extend_bans_red">
                        ${await bans(data.info.teams[1].bans[0].championId)}
                        ${await bans(data.info.teams[1].bans[1].championId)}
                        ${await bans(data.info.teams[1].bans[2].championId)}
                        ${await bans(data.info.teams[1].bans[3].championId)}
                        ${await bans(data.info.teams[1].bans[4].championId)}
                    </div>
                </div>
            `
        }
    }


    function checkSkill(input) {
        if(input == 1) {
            return '<span style="color:#B1B3B3FF; font-size:1.6rem; cursor: url(https://cur.cursors-4u.net/games/gam-14/gam1340.cur), auto !important;" class="tooltipQ">Q</span>';
        } else if(input == 2) {
            return '<span style="color:#B1B3B3FF; font-size:1.6rem; cursor: url(https://cur.cursors-4u.net/games/gam-14/gam1340.cur), auto !important;">W</span>';
        } else if(input == 3) {
            return '<span style="color:#B1B3B3FF; font-size:1.6rem; cursor: url(https://cur.cursors-4u.net/games/gam-14/gam1340.cur), auto !important;">E</span>';
        } else if(input == 4) {
            return '<span style="color:brown; font-size:1.6rem; cursor: url(https://cur.cursors-4u.net/games/gam-14/gam1340.cur), auto !important;">R</span>';
        }
    }


    const getChampAbilitiesVar = await getChampAbilities(player_match.championName);
    async function renderTooltipAbilities(index) {
        return `<div style="display:flex; align-items:center; margin-bottom:.5rem;"><img style="width:3rem; height:3rem;" src="https://ddragon.leagueoflegends.com/cdn/${await getLatestVersion()}/img/spell/${getChampAbilitiesVar[index][4]}.png">
                <h3 style="margin-left:10px">${getChampAbilitiesVar[index][0]}  (${checkSkill(index+1)})</h3></div>

                <div>
                    <h4 style="margin-bottom:.3rem; color:#B1B3B3FF">Cooldown: ${getChampAbilitiesVar[index][2]}</h4>
                    <h4 style="margin-bottom:.3rem;color:#B1B3B3FF;">Cost: ${getChampAbilitiesVar[index][3]}</h4>
                    <p style="margin-bottom:1rem;">${getChampAbilitiesVar[index][1]}</p>
                </div>
        `
    }






    function matchHoursAgo() {
        if(new Date().getTime() - (data.info.gameCreation + data.info.gameDuration) < 3600000) {
            return `${msToMin(new Date().getTime() - (data.info.gameCreation + data.info.gameDuration))} min`;
        } else {
            return msToTime(new Date().getTime() - (data.info.gameCreation + data.info.gameDuration));
        }
    }

    const lvl = await summonerChampLvlExp(getRegion,player_match.summonerId,player_match.championId);
    //console.log(lvl);

    function checkChampPoints(input) {
        if(input.championPoints < 1000000) {
            return `${(input.championPoints/1000).toFixed(0)}K`;
        } else {
            return `${(input.championPoints/1000000).toFixed(2)}mil`;
        }
    }
    function checkChampLvl(input) {
        if(input.championLevel == 7) {
            return `<span style="color:inherit">7</span>`
        } else if(input.championLevel == 6) {
            return `<span style="color:inherit">6</span>`
        } else if(input.championLevel == 5) {
            return `<span style="color:inherit">5</span>`
        } else {
            return `<span style="color:inherit">${input.championLevel}</span>`
        }
    }

    

    const markup = `
    <div class="match" style="background-image:linear-gradient(to left,rgba(${color_background(player_match.win)}, .7), rgba(${color_background(player_match.win)}, .1)) "> 
    
    <div class="match__type"> 
        <p class="match__type--name">${matchType}</p>
        <p class="match__type--time">${matchHoursAgo()} ago</p>
        <p class="match__type--result" style="color:rgba(${color_background(player_match.win)}, 1)">${win_lose}</p>
        <p class="match__type--duration">${msToMin_Sec(data.info.gameDuration)}</p>
    </div>

    <div class="match__champ">
        <p class="match__champ--name">${(await getChampionByKey(player_match.championId)).name}</p>
        <div class="match__champ--icons">
            <img src="http://ddragon.leagueoflegends.com/cdn/${await getLatestVersion()}/img/champion/${player_champ.id}.png" alt="champ_icon" class="match__champ--icon">
            <img class="match__champ--banner" src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-postgame/global/default/banner-mastery-small-lvl${lvl.championLevel}.png" data-tippy-content = "Level ${lvl.championLevel}: ${checkChampPoints(lvl)}">
        </div>

    </div>

    <div class="match__utility">
        <div class="match__utility__spell">
            <img src="http://ddragon.leagueoflegends.com/cdn/${await getLatestVersion()}/img/spell/${spellD}.png" alt="spell1" class="match__utility__spell--icon1" data-tippy-content="${spell1}">
            <img src="http://ddragon.leagueoflegends.com/cdn/${await getLatestVersion()}/img/spell/${spellF}.png" alt="spell2" class="match__utility__spell--icon2" data-tippy-content="${spell2}">
        </div>

        <div class="match__utility__runes">
            <img src="./img/${rune[0]}" alt="runes1" class="match__utility__runes--icon1" data-tippy-content = "${rune_desc[0]}">
            <img src="./img/${rune[1]}" alt="runes2" class="match__utility__runes--icon2" data-tippy-content = "${rune_desc[1]}">
        </div>         
    </div>

    <div class="match__score">
        <p class="match__score--nr">${player_match.kills} / ${player_match.deaths} / ${player_match.assists}</p>
        <p class="match__score--kda">${((player_match.kills + player_match.assists) / player_match.deaths).toFixed(2)} KDA</p>
    </div>

    <div class="match__stats">
        <p class="match__stats--level">Level ${player_match.champLevel}</p>
        <p class="match__stats--cs">${player_match.neutralMinionsKilled + player_match.totalMinionsKilled} (${((player_match.neutralMinionsKilled + player_match.totalMinionsKilled) / msToMin(data.info.gameDuration)).toFixed(1)}/min) CS</p>
        <p class="match__stats--kp">P/Kill ${Math.round(((player_match.kills + player_match.assists) /total_kills_per_player_team)*100)}%</p>
    </div>

    <div class="match__items">
        <div class="match__items--line1">
            <p class="match__items-item match__items--item1" data-tippy-content = "${await item(items[0])}"><img src="${await iconLink(items[0])}" class="match__items--img"></p>
            <p class="match__items-item match__items--item1" data-tippy-content = "${await item(items[1])}"><img src="${await iconLink(items[1])}" class="match__items--img"></p>
            <p class="match__items-item match__items--item3" data-tippy-content = "${await item(items[2])}"><img src="${await iconLink(items[2])}" class="match__items--img"></p>

        </div>
        
        <div class="match__items--line2">
            <p class="match__items-item match__items--item4" data-tippy-content = "${await item(items[3])}"><img src="${await iconLink(items[3])}" class="match__items--img"></p>
            <p class="match__items-item match__items--item5" data-tippy-content = "${await item(items[4])}"><img src="${await iconLink(items[4])}" class="match__items--img"></p>
            <p class="match__items-item match__items--item6" data-tippy-content = "${await item(items[5])}"><img src="${await iconLink(items[5])}" class="match__items--img"></p>
            <p class="match__items-item match__items--item-ward"><img src="${await iconLink(player_match.item6)}" style="border-radius: 50%;" data-tippy-content = "${await item(player_match.item6)}"></p>

        </div>

        
        <p class="match__items--control-ward">Vision score: ${player_match.visionScore}</p>
    </div>

    <div class="match__players">
        <div class="match__players--blue">
            <a class="match__players--player match__players--1" href="${location.origin}/#${getRegion}/${data.info.participants[0].summonerName}" target='_blank'>
                <img src="http://ddragon.leagueoflegends.com/cdn/${await getLatestVersion()}/img/champion/${(await getChampionByKey(data.info.participants[0].championId)).id}.png" alt="champ_icon" class="match__players--icon" data-tippy-content="${(await getChampionByKey(data.info.participants[0].championId)).name}">
                <p class="match__players--name" data-tippy-content="View '${data.info.participants[0].summonerName}' profile">${data.info.participants[0].summonerName}</p>
            </a>
            <a class="match__players--player match__players--2" href="${location.origin}/#${getRegion}/${data.info.participants[1].summonerName}" target='_blank'>
                <img src="http://ddragon.leagueoflegends.com/cdn/${await getLatestVersion()}/img/champion/${(await getChampionByKey(data.info.participants[1].championId)).id}.png" alt="champ_icon" class="match__players--icon" data-tippy-content="${(await getChampionByKey(data.info.participants[1].championId)).name}">
                <p class="match__players--name" data-tippy-content="View '${data.info.participants[1].summonerName}' profile">${data.info.participants[1].summonerName}</p>
            </a>
            <a class="match__players--player match__players--3" href="${location.origin}/#${getRegion}/${data.info.participants[2].summonerName}" target='_blank'>
                <img src="http://ddragon.leagueoflegends.com/cdn/${await getLatestVersion()}/img/champion/${(await getChampionByKey(data.info.participants[2].championId)).id}.png" alt="champ_icon" class="match__players--icon" data-tippy-content="${(await getChampionByKey(data.info.participants[2].championId)).name}">
                <p class="match__players--name" data-tippy-content="View '${data.info.participants[2].summonerName}' profile">${data.info.participants[2].summonerName}</p>
            </a>
            <a class="match__players--player match__players--4" href="${location.origin}/#${getRegion}/${data.info.participants[3].summonerName}" target='_blank'>
                <img src="http://ddragon.leagueoflegends.com/cdn/${await getLatestVersion()}/img/champion/${(await getChampionByKey(data.info.participants[3].championId)).id}.png" alt="champ_icon" class="match__players--icon" data-tippy-content="${(await getChampionByKey(data.info.participants[3].championId)).name}">
                <p class="match__players--name" data-tippy-content="View '${data.info.participants[3].summonerName}' profile">${data.info.participants[3].summonerName}</p>
            </a>
            <a class="match__players--player match__players--5" href="${location.origin}/#${getRegion}/${data.info.participants[4].summonerName}" target='_blank'>
                <img src="http://ddragon.leagueoflegends.com/cdn/${await getLatestVersion()}/img/champion/${(await getChampionByKey(data.info.participants[4].championId)).id}.png" alt="champ_icon" class="match__players--icon" data-tippy-content="${(await getChampionByKey(data.info.participants[4].championId)).name}">
                <p class="match__players--name" data-tippy-content="View '${data.info.participants[4].summonerName}' profile">${data.info.participants[4].summonerName}</p>
            </a>
        </div>
        
        <div class="match__players--red">
            <a class="match__players--player match__players--6" href="${location.origin}/#${getRegion}/${data.info.participants[5].summonerName}" target='_blank'>
                <img src="http://ddragon.leagueoflegends.com/cdn/${await getLatestVersion()}/img/champion/${(await getChampionByKey(data.info.participants[5].championId)).id}.png" alt="champ_icon" class="match__players--icon" data-tippy-content="${(await getChampionByKey(data.info.participants[5].championId)).name}">
                <p class="match__players--name" data-tippy-content="View '${data.info.participants[5].summonerName}' profile">${data.info.participants[5].summonerName}</p>
            </a>
            <a class="match__players--player match__players--7" href="${location.origin}/#${getRegion}/${data.info.participants[6].summonerName}" target='_blank'>
                <img src="http://ddragon.leagueoflegends.com/cdn/${await getLatestVersion()}/img/champion/${(await getChampionByKey(data.info.participants[6].championId)).id}.png" alt="champ_icon" class="match__players--icon" data-tippy-content="${(await getChampionByKey(data.info.participants[6].championId)).name}">
                <p class="match__players--name" data-tippy-content="View '${data.info.participants[6].summonerName}' profile">${data.info.participants[6].summonerName}</p>
            </a>
            <a class="match__players--player match__players--8" href="${location.origin}/#${getRegion}/${data.info.participants[7].summonerName}" target='_blank'>
                <img src="http://ddragon.leagueoflegends.com/cdn/${await getLatestVersion()}/img/champion/${(await getChampionByKey(data.info.participants[7].championId)).id}.png" alt="champ_icon" class="match__players--icon" data-tippy-content="${(await getChampionByKey(data.info.participants[7].championId)).name}">
                <p class="match__players--name" data-tippy-content="View '${data.info.participants[7].summonerName}' profile">${data.info.participants[7].summonerName}</p>
            </a>
            <a class="match__players--player match__players--9" href="${location.origin}/#${getRegion}/${data.info.participants[8].summonerName}" target='_blank'>
                <img src="http://ddragon.leagueoflegends.com/cdn/${await getLatestVersion()}/img/champion/${(await getChampionByKey(data.info.participants[8].championId)).id}.png" alt="champ_icon" class="match__players--icon" data-tippy-content="${(await getChampionByKey(data.info.participants[8].championId)).name}">
                <p class="match__players--name" data-tippy-content="View '${data.info.participants[8].summonerName}' profile">${data.info.participants[8].summonerName}</p>
            </a>
            <a class="match__players--player match__players--10" href="${location.origin}/#${getRegion}/${data.info.participants[9].summonerName}" target='_blank'>
                <img src="http://ddragon.leagueoflegends.com/cdn/${await getLatestVersion()}/img/champion/${(await getChampionByKey(data.info.participants[9].championId)).id}.png" alt="champ_icon" class="match__players--icon" data-tippy-content="${(await getChampionByKey(data.info.participants[9].championId)).name}">
                <p class="match__players--name" data-tippy-content="View '${data.info.participants[9].summonerName}' profile">${data.info.participants[9].summonerName}</p>
            </a>
        </div>

    </div>
    <button class="match__extend" style="background-color:rgba(${color_background(player_match.win)}, .6)">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M6 7l6 6l6-6l2 2l-8 8l-8-8z" fill="#626262" fill-rule="evenodd"/></svg>
    </button>

    <div class="match_extend_content hidden" style="background-color:rgba(${color_background(player_match.win)}, .1)">
        <div class="match_extend_buttons">
            <button class="match_extend_button match_extend_buttons_1 match_extend_buttons_active">Overview</button>
            <button class="match_extend_button match_extend_buttons_2">Builds</button>
            <button class="match_extend_button match_extend_buttons_3">Advanced</button>
            <button class="match_extend_button match_extend_buttons_4">Breakdown</button>
        </div>
        <div class="match_extend_overview">
            <div class="match_extend_blueTeam" style="background-image:linear-gradient(to left,rgba(${color_background(player_match.win)}, .3), rgba(${color_background(player_match.win)}, .1))">
                <div class = "match_extend_summary">
                    <div class="match_extend_title"><h3 style = "color: rgb(${team_win_lose_color()[0]})">${team_win_lose()[0]}</h3> <h4>(Blue Team)</h4></div>
                    <div class="match_extend_teamScore">${data.info.participants[0].kills + data.info.participants[1].kills + data.info.participants[2].kills + data.info.participants[3].kills + data.info.participants[4].kills} / ${data.info.participants[0].deaths + data.info.participants[1].deaths + data.info.participants[2].deaths + data.info.participants[3].deaths + data.info.participants[4].deaths} / ${data.info.participants[0].assists + data.info.participants[1].assists + data.info.participants[2].assists + data.info.participants[3].assists + data.info.participants[4].assists}</div>

                    <div class="match_extend_th">
                        <p data-tippy-content = "Turrets killed"><img src = "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-match-history/global/default/tower_building_blue.png" class = "img_obj"> ${data.info.teams[0].objectives.tower.kills}</p>
                        <p data-tippy-content = "Inhibitors killed"><img src = "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-match-history/global/default/inhibitor-100.png" class = "img_obj"> ${data.info.teams[0].objectives.inhibitor.kills}</p>
                    </div>

                    <div class="match_extend_bhd">
                        <p data-tippy-content = "Barons killed"><img src = "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-match-history/global/default/baron-100.png" class = "img_obj">${data.info.teams[0].objectives.baron.kills}</p>
                        <p data-tippy-content = "Rift Heralds killed"><img src = "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-match-history/global/default/herald-100.png" class = "img_obj">${data.info.teams[0].objectives.riftHerald.kills}</p>
                        <p class="dragons"><img src = "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-match-history/global/default/dragon-100.png" class = "img_obj">${data.info.teams[0].objectives.dragon.kills}</p>
                        <div style="display:none" class="dragons_img">${dragon_timeline[0]}</div>
                    </div>

                    <div class="match_extend_totalGold">
                        <p data-tippy-content = "Total team Gold"><img src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-match-history/global/default/icon_gold.png" class = "img_obj">${((data.info.participants[0].goldEarned + data.info.participants[1].goldEarned + data.info.participants[2].goldEarned + data.info.participants[3].goldEarned + data.info.participants[4].goldEarned)/1000).toFixed(1)}K</p>
                    </div>
                </div>
                <div class="match_extend_blueTeamPlayers"></div>
            </div>

            <div class="match_extend_redTeam" style="background-image:linear-gradient(to left,rgba(${color_background(player_match.win)}, .3), rgba(${color_background(player_match.win)}, .1))">
                <div class = "match_extend_summary">
                    <div class="match_extend_title"><h3 style = "color: rgb(${team_win_lose_color()[1]}">${team_win_lose()[1]}</h3> <h4>(Red Team)</h4></div>
                    <div class="match_extend_teamScore">${data.info.participants[5].kills + data.info.participants[6].kills + data.info.participants[7].kills + data.info.participants[8].kills + data.info.participants[9].kills} / ${data.info.participants[5].deaths + data.info.participants[6].deaths + data.info.participants[7].deaths + data.info.participants[8].deaths + data.info.participants[9].deaths} / ${data.info.participants[5].assists + data.info.participants[6].assists + data.info.participants[7].assists + data.info.participants[8].assists + data.info.participants[9].assists}</div>

                    <div class="match_extend_th">
                        <p data-tippy-content = "Turrets killed"><img src = "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-match-history/global/default/tower_building_red.png" class = "img_obj"> ${data.info.teams[1].objectives.tower.kills}</p>
                        <p data-tippy-content = "Inhibitors killed"><img src = "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-match-history/global/default/inhibitor-200.png" class = "img_obj"> ${data.info.teams[1].objectives.inhibitor.kills}</p>
                    </div>

                    <div class="match_extend_bhd">
                        <p data-tippy-content = "Barons killed"><img src = "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-match-history/global/default/baron-200.png" class = "img_obj">${data.info.teams[1].objectives.baron.kills}</p>
                        <p data-tippy-content = "Rift Heralds killed"><img src = "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-match-history/global/default/herald-200.png" class = "img_obj">${data.info.teams[1].objectives.riftHerald.kills}</p>
                        <p class="dragons"><img src = "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-match-history/global/default/dragon-200.png" class = "img_obj">${data.info.teams[1].objectives.dragon.kills}</p>
                        <div style="display:none" class="dragons_img">${dragon_timeline[1]}</div>
                    </div>

                    <div class="match_extend_totalGold">
                        <p data-tippy-content = "Total team Gold"><img src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-match-history/global/default/icon_gold.png" class = "img_obj">${((data.info.participants[5].goldEarned + data.info.participants[6].goldEarned + data.info.participants[7].goldEarned + data.info.participants[8].goldEarned + data.info.participants[9].goldEarned)/1000).toFixed(1)}K</p>
                    </div>
                </div>
                <div class="match_extend_redTeamPlayers"></div>
            </div>

            ${await checkBansArray()}
        </div>


        <div class="match_extend_builds hidden">
            
            <h3 class="match_extend_builds_title">Item Builds</h3>
            <div class="match_extend_builds_item">
                
            </div>


            <h3 class="match_extend_builds_title">Item Skill</h3>
            <div class="match_extend_builds_skills">
                <div class="match_extend_builds_skill_description">
                    <h3 style="margin-bottom: 1rem;">${(await getChampionByKey(player_match.championId)).name}'s Abilities:</h3>
                    <div class="match_extend_builds_skill_img">
                        <div>${await renderTooltipAbilities(0)}</div>
                        <div>${await renderTooltipAbilities(1)}</div>
                        <div>${await renderTooltipAbilities(2)}</div>
                        <div>${await renderTooltipAbilities(3)}</div>
                    </div>
                </div>
                <div class="match_extend_builds_skill">

                </div>
            </div>
            <p class="breakdown_note">*Note that UNDO and CONSUMED items don't count here*</p>
        </div>

        
        <div class="match_extend_breakdown hidden">

        </div>

        <div class="match_extend_advanced hidden">
            <div class="advanced">


                <div class="advanced_name">
                    <div class="advanced_champions">
                        <p class="advanced_champions_saMearga">just for grid to work</p>
                    </div>

                    <h4 class="advanced_details title">Combat</h4>
                    <div class="advanced_details kda"><span class="border">KDA</span></div>
                    <div class="advanced_details lks"><span class="border">Largest Killing Spree</span></div>
                    <div class="advanced_details lmk"><span class="border">Largest Multi Kill</span></div>
                    <div class="advanced_details fb"><span class="border">First Blood</span></div>

                    <h4 class="advanced_details title">Damage Dealt</h4>
                    <div class="advanced_details tdc"><span class="border">Total Damage to Champions</span></div>
                    <div class="advanced_details pdc"><span class="border">Physical Damage to Champions</span></div>
                    <div class="advanced_details mdc"><span class="border">Magic Damage to Champions</span></div>
                    <div class="advanced_details tdc1"><span class="border">True Damage to Champions</span></div>
                    <div class="advanced_details tdd"><span class="border">Total Damage Dealt</span></div>
                    <div class="advanced_details pdd"><span class="border">Physical Damage Dealt</span></div>
                    <div class="advanced_details mdd"><span class="border">Magic Damage Dealt</span></div>
                    <div class="advanced_details tdd1"><span class="border">True Damage Dealt</span></div>
                    <div class="advanced_details lcs"><span class="border">Largest Critical Strike</span></div>
                    <div class="advanced_details tdo"><span class="border">Total Damage to Objectives</span></div>
                    <div class="advanced_details tdt"><span class="border">Total Damage to Turrets</span></div>

                    <h4 class="advanced_details title">Damage Taken & Healed</h4>
                    <div class="advanced_details dh"><span class="border">Damage Healed</span></div>
                    <div class="advanced_details dt"><span class="border">Damage Taken</span></div>
                    <div class="advanced_details pdt"><span class="border">Physical Damage Taken</span></div>
                    <div class="advanced_details mdt"><span class="border">Magic Damage Taken</span></div>
                    <div class="advanced_details tdt1"><span class="border">True Damage Taken</span></div>

                    <h4 class="advanced_details title">Wards</h4>
                    <div class="advanced_details wp"><span class="border">Wards Placed</span></div>
                    <div class="advanced_details wd"><span class="border">Wards Destroyed</span></div>
                    <div class="advanced_details swp"><span class="border">Stealth Wards Purchased</span></div>
                    <div class="advanced_details cwp"><span class="border">Control Wards Purchased</span></div>

                    <h4 class="advanced_details title">Income</h4>
                    <div class="advanced_details ge"><span class="border">Total Gold Earned</span></div>
                    <div class="advanced_details gs"><span class="border">Total Gold Spent</span></div>
                    <div class="advanced_details mk"><span class="border">Minions Killed</span></div>
                    <div class="advanced_details nmk"><span class="border">Neutral Minions Killed</span></div>
                <div>
            </div>
        </div>

    </div>


    </div>
    `
    function getBestPlayer() {
        let vec_gold=[];
        let vec_cs=[];
        let vec_dmg=[];
        let vec_kda=[];
        let vec_vision=[];

        let vec_mvp_data = [];
        let vec_mvp_score = [];

        let maxim_gold = 0,part_gold, maxim_cs = 0, part_cs, maxim_dmg = 0, part_dmg, maxim_kda = 0, part_kda, maxim_vision = 0, part_vision,champ_gold,champ_cs,champ_dmg, champ_kda,champ_vision, maxim_mvp=0,part_mvp,champ_mvp;

        let max_gold = [], max_cs = [], max_dmg = [], max_kda = [], max_vision= [], max_mvp=[];

        let max_all = [];

        for(let i = 0; i < data.info.participants.length; i++) {
            vec_gold.push(data.info.participants[i].goldEarned);
            vec_cs.push(data.info.participants[i].neutralMinionsKilled + data.info.participants[i].totalMinionsKilled);
            vec_dmg.push(data.info.participants[i].totalDamageDealtToChampions);
            vec_kda.push((data.info.participants[i].kills + data.info.participants[i].assists) / data.info.participants[i].deaths);
            vec_vision.push(data.info.participants[i].visionScore);
            vec_mvp_data.push([data.info.participants[i].kills, data.info.participants[i].deaths , data.info.participants[i].assists]);
        }
        console.log(vec_mvp_data);

        for(a = 0; a < vec_mvp_data.length; a++) {
            vec_mvp_score.push((vec_mvp_data[a][0]*1) + (vec_mvp_data[a][2]*0.75) - (vec_mvp_data[a][1] * 0.5));
        }
        for(a = 0; a < vec_mvp_score.length; a++) {
            if(maxim_mvp < vec_mvp_score[a]) {
                maxim_mvp = vec_mvp_score[a];
                part_mvp = data.info.participants[a].summonerName;
                champ_mvp = data.info.participants[a].championId;
            }
        }
        max_mvp.push(maxim_mvp,part_mvp,champ_mvp);
        console.log(vec_mvp_score);

        for(a = 0; a < vec_gold.length; a++) {
            if(vec_gold[a] > maxim_gold) {
                maxim_gold = vec_gold[a];
                part_gold = data.info.participants[a].summonerName;
                champ_gold = data.info.participants[a].championId;
            }
        }
        max_gold.push(maxim_gold,part_gold,champ_gold);

        for(a = 0; a < vec_cs.length; a++) {
            if(vec_cs[a] > maxim_cs) {
                maxim_cs = vec_cs[a];
                part_cs = data.info.participants[a].summonerName;
                champ_cs = data.info.participants[a].championId;
            }
        }
        max_cs.push(maxim_cs,part_cs,champ_cs);

        for(a = 0; a < vec_dmg.length; a++) {
            if(vec_dmg[a] > maxim_dmg) {
                maxim_dmg = vec_dmg[a];
                part_dmg = data.info.participants[a].summonerName;
                champ_dmg = data.info.participants[a].championId;
            }
        }
        max_dmg.push(maxim_dmg,part_dmg,champ_dmg);

        for(a = 0; a < vec_kda.length; a++) {
            if(vec_kda[a] > maxim_kda) {
                maxim_kda = vec_kda[a];
                part_kda = data.info.participants[a].summonerName;
                champ_kda = data.info.participants[a].championId;
            }
        }
        max_kda.push(maxim_kda,part_kda, champ_kda);

        for(a = 0; a < vec_vision.length; a++) {
            if(vec_vision[a] > maxim_vision) {
                maxim_vision = vec_vision[a];
                part_vision = data.info.participants[a].summonerName;
                champ_vision = data.info.participants[a].championId;
            }
        }
        if(maxim_vision == 0) {
            max_vision.push(maxim_vision,`-_-`,`-1`);
        } else {
            max_vision.push(maxim_vision,part_vision,champ_vision);
        }
        

        max_all.push(max_gold,max_cs,max_dmg,max_kda,max_vision, max_mvp);

        //console.log(max_all);
        return max_all;
    }


    async function render_advancedStats(poz) {
        const location_stats_champ = document.querySelectorAll('.advanced_champions');
        const location_stats_breakdown = document.querySelectorAll('.match_extend_breakdown');
        const location_stats_build = document.querySelectorAll('.match_extend_builds_item');
        const location_stats_skill = document.querySelectorAll('.match_extend_builds_skill');
        const bestPlayer = getBestPlayer();

        location_stats_breakdown[poz].innerHTML = "";

        console.log(bestPlayer);

        for(let i = 0; i < data.info.participants.length; i++) {

            function markLine() {
                if(data.info.participants[i].summonerName == player_match.summonerName) {
                    return `style="color: rgb(95,158,160);"`;
                } else {
                    return `style="color: inherit;"`;
                }
            }


            const lvl1 = await summonerChampLvlExp(getRegion,data.info.participants[i].summonerId,data.info.participants[i].championId);

            location_stats_champ[poz].insertAdjacentHTML('beforeend', `
                <div class="advanced_champion""><img src="http://ddragon.leagueoflegends.com/cdn/${await getLatestVersion()}/img/champion/${(await getChampionByKey(data.info.participants[i].championId)).id}.png" alt="champ_icon" class="advanced_champions--icon" data-tippy-content="${(await getChampionByKey(data.info.participants[i].championId)).name}">
                <div class="advanced_champion_lvl"><span>Level ${checkChampLvl(lvl1)}</span><span> ${checkChampPoints(lvl1)}</span></div>
                </div>
            `);

            document.querySelectorAll('.lks')[poz].insertAdjacentHTML('beforeend', `
                <div ${markLine()} data-tippy-content="${(await getChampionByKey(data.info.participants[i].championId)).name}">${data.info.participants[i].largestKillingSpree}</div>
            `);

            document.querySelectorAll('.kda')[poz].insertAdjacentHTML('beforeend', `
            <div ${markLine()} data-tippy-content="${(await getChampionByKey(data.info.participants[i].championId)).name}">${data.info.participants[i].kills}/${data.info.participants[i].deaths}/${data.info.participants[i].assists}</div>
            `);

            document.querySelectorAll('.lmk')[poz].insertAdjacentHTML('beforeend', `
            <div ${markLine()} data-tippy-content="${(await getChampionByKey(data.info.participants[i].championId)).name}">${data.info.participants[i].largestMultiKill}</div>
            `);

            document.querySelectorAll('.fb')[poz].insertAdjacentHTML('beforeend', `
            <div ${markLine()} data-tippy-content="${(await getChampionByKey(data.info.participants[i].championId)).name}">${data.info.participants[i].firstBloodKill}</div>
            `);

            document.querySelectorAll('.tdc')[poz].insertAdjacentHTML('beforeend', `
            <div ${markLine()} data-tippy-content="${(await getChampionByKey(data.info.participants[i].championId)).name}">${(data.info.participants[i].totalDamageDealtToChampions/1000).toFixed(1)}K</div>
            `);

            document.querySelectorAll('.pdc')[poz].insertAdjacentHTML('beforeend', `
            <div ${markLine()} data-tippy-content="${(await getChampionByKey(data.info.participants[i].championId)).name}">${(data.info.participants[i].physicalDamageDealtToChampions/1000).toFixed(1)}K</div>
            `);

            document.querySelectorAll('.mdc')[poz].insertAdjacentHTML('beforeend', `
            <div ${markLine()} data-tippy-content="${(await getChampionByKey(data.info.participants[i].championId)).name}">${(data.info.participants[i].magicDamageDealtToChampions/1000).toFixed(1)}K</div>
            `);

            document.querySelectorAll('.tdc1')[poz].insertAdjacentHTML('beforeend', `
            <div ${markLine()} data-tippy-content="${(await getChampionByKey(data.info.participants[i].championId)).name}">${(data.info.participants[i].trueDamageDealtToChampions/1000).toFixed(1)}K</div>
            `);

            document.querySelectorAll('.tdd')[poz].insertAdjacentHTML('beforeend', `
            <div ${markLine()} data-tippy-content="${(await getChampionByKey(data.info.participants[i].championId)).name}">${(data.info.participants[i].totalDamageDealt/1000).toFixed(1)}K</div>
            `);

            document.querySelectorAll('.pdd')[poz].insertAdjacentHTML('beforeend', `
            <div ${markLine()} data-tippy-content="${(await getChampionByKey(data.info.participants[i].championId)).name}">${(data.info.participants[i].physicalDamageDealt/1000).toFixed(1)}K</div>
            `);

            document.querySelectorAll('.mdd')[poz].insertAdjacentHTML('beforeend', `
            <div ${markLine()} data-tippy-content="${(await getChampionByKey(data.info.participants[i].championId)).name}">${(data.info.participants[i].magicDamageDealt/1000).toFixed(1)}K</div>
            `);

            document.querySelectorAll('.tdd1')[poz].insertAdjacentHTML('beforeend', `
            <div ${markLine()} data-tippy-content="${(await getChampionByKey(data.info.participants[i].championId)).name}">${(data.info.participants[i].trueDamageDealt/1000).toFixed(1)}K</div>
            `);
            
            document.querySelectorAll('.lcs')[poz].insertAdjacentHTML('beforeend', `
            <div ${markLine()} data-tippy-content="${(await getChampionByKey(data.info.participants[i].championId)).name}">${data.info.participants[i].largestCriticalStrike}</div>
            `);

            document.querySelectorAll('.tdo')[poz].insertAdjacentHTML('beforeend', `
            <div ${markLine()} data-tippy-content="${(await getChampionByKey(data.info.participants[i].championId)).name}">${(data.info.participants[i].damageDealtToObjectives/1000).toFixed(1)}K</div>
            `);

            document.querySelectorAll('.tdt')[poz].insertAdjacentHTML('beforeend', `
            <div ${markLine()} data-tippy-content="${(await getChampionByKey(data.info.participants[i].championId)).name}">${(data.info.participants[i].damageDealtToTurrets/1000).toFixed(1)}K</div>
            `);

            document.querySelectorAll('.dh')[poz].insertAdjacentHTML('beforeend', `
            <div ${markLine()} data-tippy-content="${(await getChampionByKey(data.info.participants[i].championId)).name}">${(data.info.participants[i].totalHeal/1000).toFixed(1)}K</div>
            `);

            document.querySelectorAll('.dt')[poz].insertAdjacentHTML('beforeend', `
            <div ${markLine()} data-tippy-content="${(await getChampionByKey(data.info.participants[i].championId)).name}">${(data.info.participants[i].totalDamageTaken/1000).toFixed(1)}K</div>
            `);

            document.querySelectorAll('.pdt')[poz].insertAdjacentHTML('beforeend', `
            <div ${markLine()} data-tippy-content="${(await getChampionByKey(data.info.participants[i].championId)).name}">${(data.info.participants[i].physicalDamageTaken/1000).toFixed(1)}K</div>
            `);

            document.querySelectorAll('.mdt')[poz].insertAdjacentHTML('beforeend', `
            <div ${markLine()} data-tippy-content="${(await getChampionByKey(data.info.participants[i].championId)).name}">${(data.info.participants[i].magicDamageTaken/1000).toFixed(1)}K</div>
            `);

            document.querySelectorAll('.tdt1')[poz].insertAdjacentHTML('beforeend', `
            <div ${markLine()} data-tippy-content="${(await getChampionByKey(data.info.participants[i].championId)).name}">${(data.info.participants[i].trueDamageTaken/1000).toFixed(1)}K</div>
            `);

            document.querySelectorAll('.wp')[poz].insertAdjacentHTML('beforeend', `
            <div ${markLine()} data-tippy-content="${(await getChampionByKey(data.info.participants[i].championId)).name}">${data.info.participants[i].wardsPlaced}</div>
            `);

            document.querySelectorAll('.wd')[poz].insertAdjacentHTML('beforeend', `
            <div ${markLine()} data-tippy-content="${(await getChampionByKey(data.info.participants[i].championId)).name}">${data.info.participants[i].wardsKilled}</div>
            `);

            document.querySelectorAll('.swp')[poz].insertAdjacentHTML('beforeend', `
            <div ${markLine()} data-tippy-content="${(await getChampionByKey(data.info.participants[i].championId)).name}">${data.info.participants[i].sightWardsBoughtInGame}</div>
            `);

            document.querySelectorAll('.cwp')[poz].insertAdjacentHTML('beforeend', `
            <div ${markLine()} data-tippy-content="${(await getChampionByKey(data.info.participants[i].championId)).name}">${data.info.participants[i].visionWardsBoughtInGame}</div>
            `);

            document.querySelectorAll('.ge')[poz].insertAdjacentHTML('beforeend', `
            <div ${markLine()} data-tippy-content="${(await getChampionByKey(data.info.participants[i].championId)).name}">${(data.info.participants[i].goldEarned/1000).toFixed(1)}K</div>
            `);

            document.querySelectorAll('.gs')[poz].insertAdjacentHTML('beforeend', `
            <div ${markLine()} data-tippy-content="${(await getChampionByKey(data.info.participants[i].championId)).name}">${(data.info.participants[i].goldSpent/1000).toFixed(1)}K</div>
            `);

            document.querySelectorAll('.mk')[poz].insertAdjacentHTML('beforeend', `
            <div ${markLine()} data-tippy-content="${(await getChampionByKey(data.info.participants[i].championId)).name}">${data.info.participants[i].totalMinionsKilled}</div>
            `);

            document.querySelectorAll('.nmk')[poz].insertAdjacentHTML('beforeend', `
            <div ${markLine()} data-tippy-content="${(await getChampionByKey(data.info.participants[i].championId)).name}">${data.info.participants[i].neutralMinionsKilled}</div>
            `);
        }

        //render brakdown


        async function checkChampIconSplash(input) {
            if(input == '-1') {
                return `<img src="./img/none1.png">`;
            } else {
                return `src="http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${(await getChampionByKey(input)).id}_0.jpg"`;
            }
        }

        async function checkChampIconProfile(input) {
            if(input == '-1') {
                return `<img src="./img/none1.png">`;
            } else {
                return `src="http://ddragon.leagueoflegends.com/cdn/${await getLatestVersion()}/img/champion/${(await getChampionByKey(input)).id}.png"`;
            }
        }

        location_stats_breakdown[poz].insertAdjacentHTML('beforeend', `
        <div class="breakdown_container">
            <div class="breakdown">
                <div class="breakdown_mvp">
                    <div class="breakdown_overlay"><img class="breakdown_imgP" src="http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${(await getChampionByKey(bestPlayer[5][2])).id}_0.jpg"></div>
                    <div class="breakdown_inf">
                        <h3 class="breakdown_inf_name breakdown_mvp_title">MVP</h3>
                        <h4 class="breakdown_inf_propName">Player of the game</h4>
                        
                        <div class="breakdown_inf_nameFlex">
                            <img class="breakdown_inf_img" src="http://ddragon.leagueoflegends.com/cdn/${await getLatestVersion()}/img/champion/${(await getChampionByKey(bestPlayer[5][2])).id}.png">
                            <h4 class="breakdown_inf_name">${bestPlayer[5][1]}</h4>
                        </div>
                    </div>
                </div>
                <div class="breakdown_cs">
                    <div class="breakdown_overlay"><img class="breakdown_imgP" src="http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${(await getChampionByKey(bestPlayer[1][2])).id}_0.jpg"></div>
                    <div class="breakdown_inf">
                        <h4 class="breakdown_inf_propName">Highest CS</h4>
                        <h2 class="breakdown_inf_prop">${bestPlayer[1][0]}</h2>
                        <div class="breakdown_inf_nameFlex">
                            <img class="breakdown_inf_img" src="http://ddragon.leagueoflegends.com/cdn/${await getLatestVersion()}/img/champion/${(await getChampionByKey(bestPlayer[1][2])).id}.png">
                            <h4 class="breakdown_inf_name">${bestPlayer[1][1]}</h4>
                        </div>
                    </div>
                </div>
                <div class="breakdown_dmg">
                    <div class="breakdown_overlay"><img class="breakdown_imgP" src="http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${(await getChampionByKey(bestPlayer[2][2])).id}_0.jpg"></div>
                    <div class="breakdown_inf">
                        <h4 class="breakdown_inf_propName">Highest DMG</h4>
                        <h2 class="breakdown_inf_prop">${check_dmg(bestPlayer[2][0])}</h2>
                        <div class="breakdown_inf_nameFlex">
                            <img class="breakdown_inf_img" src="http://ddragon.leagueoflegends.com/cdn/${await getLatestVersion()}/img/champion/${(await getChampionByKey(bestPlayer[2][2])).id}.png">
                            <h4 class="breakdown_inf_name">${bestPlayer[2][1]}</h4>
                        </div>
                    </div>
                </div>
                <div class="breakdown_gold">
                    <div class="breakdown_overlay"><img class="breakdown_imgP" src="http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${(await getChampionByKey(bestPlayer[0][2])).id}_0.jpg"></div>
                    <div class="breakdown_inf">
                        <h4 class="breakdown_inf_propName">Best Gold</h4>
                        <h2 class="breakdown_inf_prop">${check_dmg(bestPlayer[0][0])}</h2>
                        <div class="breakdown_inf_nameFlex">
                            <img class="breakdown_inf_img" src="http://ddragon.leagueoflegends.com/cdn/${await getLatestVersion()}/img/champion/${(await getChampionByKey(bestPlayer[0][2])).id}.png">
                            <h4 class="breakdown_inf_name">${bestPlayer[0][1]}</h4>
                        </div>
                    </div>
                </div>
                <div class="breakdown_vision">
                    <div class="breakdown_overlay"><img class="breakdown_imgP" ${await checkChampIconSplash(bestPlayer[4][2])}></div>
                    <div class="breakdown_inf">
                        <h4 class="breakdown_inf_propName">Best Vision Score</h4>
                        <h2 class="breakdown_inf_prop">${bestPlayer[4][0]}</h2>
                        <div class="breakdown_inf_nameFlex">
                            <img class="breakdown_inf_img" ${await checkChampIconProfile(bestPlayer[4][2])}>
                            <h4 class="breakdown_inf_name">${bestPlayer[4][1]}</h4>
                        </div>
                    </div>
                </div>
                <div class="breakdown_kda">
                    <div class="breakdown_overlay"><img class="breakdown_imgP" src="http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${(await getChampionByKey(bestPlayer[3][2])).id}_0.jpg"></div>
                    <div class="breakdown_inf">
                        <h4 class="breakdown_inf_propName">Highest KDA</h4>
                        <h2 class="breakdown_inf_prop">${(bestPlayer[3][0]).toFixed(1)}</h2>
                        <div class="breakdown_inf_nameFlex">
                            <img class="breakdown_inf_img" src="http://ddragon.leagueoflegends.com/cdn/${await getLatestVersion()}/img/champion/${(await getChampionByKey(bestPlayer[3][2])).id}.png">
                            <h4 class="breakdown_inf_name">${bestPlayer[3][1]}</h4>
                        </div>
                    </div>
                </div>
                <div class="breakdown_firstBlood">
                    <h4 class="breakdown_inf_propName breakdown_firstBlood_title">First Blood Kill</h4>
                    <h3 class="breakdown_inf_prop breakdown_firstBlood_time">${msToMin_Sec(dragon_timeline[2][2])}</h3>
                    <img class="breakdown_firstBlood_fightImg" src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-match-history/global/default/kills.png">
                    
                    <div class="breakdown_firstBlood_kill">
                        <div class="breakdown_overlay"><img class="breakdown_imgP" src="http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${(await getChampionByKey(data.info.participants[(dragon_timeline[2][0])-1].championId)).id}_0.jpg"></div>
                    </div>

                    <div class="breakdown_firstBlood_death">
                        <div class="breakdown_overlay"><img class="breakdown_imgP" src="http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${(await getChampionByKey(data.info.participants[(dragon_timeline[2][1])-1].championId)).id}_0.jpg"></div>
                    </div>
                </div>
            </div>
            <p class="breakdown_note">*Note that MVP is based only on KDA*</p>
        </div>
        `);


        //render builds

        for(a = 0; a<dragon_timeline[3].length; a++) {

            function checkItem() {
                if(dragon_timeline[3][a][0] == "ITEM_SOLD") {
                    return `style="filter: grayscale(100%);filter: brightness(0.2);" class="sold"`
                } else {
                    return `style="filter: none;"`
                }
            }
            const sold = document.querySelectorAll('.sold');
            for(let h=0;h<sold.length;h++) {
                tippy(sold[h], {
                    content: `<h3 style="color:red;">SOLD</h3>`,
                    allowHTML: true,
                });
            }

            location_stats_build[poz].insertAdjacentHTML('beforeend', `
                <div data-tippy-content = "${await item(dragon_timeline[3][a][2])}" class="match_extend_builds_item_items">
                    <div style="display:flex;flex-direction:column; align-items:center;">
                        <img ${checkItem()} src="${await iconLink(dragon_timeline[3][a][2])}">
                        <h5>${msToMin_SecV2(dragon_timeline[3][a][1])}</h5>
                    </div>
                    <svg class="match_extend_builds_item_icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path  d="M9 6l6 6l-6 6"/></svg>
                </div>
            `);
        }


        // render skills
        console.log(await getChampAbilities(player_match.championName));
        let vec_Q = 0, vec_W = 0, vec_E = 0;
        for(a = 0; a < dragon_timeline[4].length; a++) {  
            if(dragon_timeline[4][a][2] == 1) {
                vec_Q++;
            } else if(dragon_timeline[4][a][2] == 2) {
                vec_W++;
            } else if(dragon_timeline[4][a][2] == 3) {
                vec_E++; 
            }          
        }
        console.log(vec_Q,vec_W,vec_E);

        for(a = 0; a < dragon_timeline[4].length; a++) {            

            function equalText() {
                if(a+1 < 10) {
                    return `${a+1}<span style="opacity:0;">0</span>`
                } else {
                    return a+1;
                }
            }
           

            location_stats_skill[poz].insertAdjacentHTML('beforeend', `
            <div class="match_extend_builds_skill_table">
                <p>Level <span style="color:#B1B3B3FF; margin-right: .3rem;">${equalText()}</span>: <span style="margin-right: .3rem; margin-left: .3rem;">${checkSkill(dragon_timeline[4][a][2])}</span> level UP! at <span style="margin-left: .3rem; color:grey;">${msToMin_SecV2(dragon_timeline[4][a][1])}<span></p>
            </div>
        `);

        }

        function checkMaxAbilities(input) {
            if(input == 5) {
                return `${input} <span style="color:brown;">(max)</span>`;
            } else if(input !== 5) {
                return `${input}`;
            }
            
        }

        location_stats_skill[poz].insertAdjacentHTML('beforeend', `
        <div>
        <h4>Q Points: ${checkMaxAbilities(vec_Q)}</h4>
        <h4>W Points: ${checkMaxAbilities(vec_W)}</h4>
        <h4>E Points: ${checkMaxAbilities(vec_E)}</h4>
        </div>

    `);
        
        
            



        tippy('[data-tippy-content]', {
            allowHTML: true,
        });
    }
//<div class="breakdown_firstBlood_img"></div>

    function check_dmg(input) {
        if(input < 1000) {
            return input;
        } else {
            return ((input)/1000).toFixed(3);
        }
    }


    async function render_blueTeam(poz) {
        console.log('renderTUODR',poz);
        const location_stats = document.querySelectorAll('.match_extend_blueTeamPlayers');
        location_stats[poz].innerHTML="";
        for(let i = 0; i < data.info.participants.length-5; i++) {
        console.log((await runes(data.info.participants[i].perks.styles[0].selections[0].perk, data.info.participants[i].perks.styles[1].style))[0]);

            //for(let j = 0; j < location_stats.length; j++) {
                location_stats[poz].insertAdjacentHTML('beforeend', `
                <div class="match_extend_details">
                    <div class = "match_extend_principal">
                        <div class="match_extend_champ_lvl">
                            <div class="match_extend_champ"><img src="http://ddragon.leagueoflegends.com/cdn/${await getLatestVersion()}/img/champion/${(await getChampionByKey(data.info.participants[i].championId)).id}.png" alt="champ_icon" class="match__players--icon" data-tippy-content="${(await getChampionByKey(data.info.participants[i].championId)).name}"></div>
                            <div class="match_extend_lvl">${data.info.participants[i].champLevel}</div>
                        </div>
                        
                        <div class="match_extend_spells">
                            <img class="match_extend_spell match_extend_spell1" src="http://ddragon.leagueoflegends.com/cdn/${await getLatestVersion()}/img/spell/${await spell(data.info.participants[i].summoner1Id)}.png" data-tippy-content="${await spell_description(data.info.participants[i].summoner1Id)}">
                            <img class="match_extend_spell match_extend_spell2" src="http://ddragon.leagueoflegends.com/cdn/${await getLatestVersion()}/img/spell/${await spell(data.info.participants[i].summoner2Id)}.png" data-tippy-content="${await spell_description(data.info.participants[i].summoner2Id)}">
                        </div>

                        <div class="match_extend_runes">
                            <img src="./img/${(await runes(data.info.participants[i].perks.styles[0].selections[0].perk, data.info.participants[i].perks.styles[1].style))[0]}" alt="runes1" class="match_extend_runes--icon1 runes_P">

                            <img src="./img/${(await runes(data.info.participants[i].perks.styles[0].selections[0].perk, data.info.participants[i].perks.styles[1].style))[1]}" alt="runes2" class="match_extend_runes--icon2 runes_S">


                            <div class="match_extend_runesFULL_P" style="display:none">
                                <div class = "match_extend_runesFULL_P_part">
                                    <img src="./img/${await runesSingle(data.info.participants[i].perks.styles[0].selections[0].perk)}" style="height:42px; width:42px;"><p>${(await runesDescription_noImg(data.info.participants[i].perks.styles[0].selections[0].perk, data.info.participants[i].perks.styles[1].style))[0]}</p>
                                </div>

                                <div class = "match_extend_runesFULL_P_part">
                                    <img src="./img/${await runesSingle(data.info.participants[i].perks.styles[0].selections[1].perk)}" style="height:42px; width:42px;"><p>${(await runesDescription_noImg(data.info.participants[i].perks.styles[0].selections[1].perk, data.info.participants[i].perks.styles[1].style))[0]}</p>
                                </div>

                                <div class = "match_extend_runesFULL_P_part">
                                    <img src="./img/${await runesSingle(data.info.participants[i].perks.styles[0].selections[2].perk)}" style="height:42px; width:42px;"><p>${(await runesDescription_noImg(data.info.participants[i].perks.styles[0].selections[2].perk, data.info.participants[i].perks.styles[1].style))[0]}</p>
                                </div>

                                <div class = "match_extend_runesFULL_P_part">
                                    <img src="./img/${await runesSingle(data.info.participants[i].perks.styles[0].selections[3].perk)}" style="height:42px; width:42px;"><p>${(await runesDescription_noImg(data.info.participants[i].perks.styles[0].selections[3].perk, data.info.participants[i].perks.styles[1].style))[0]}</p>
                                </div>
                            </div>


                            <div class="match_extend_runesFULL_S" style="display:none">
                                <div class = "match_extend_runesFULL_S_part match_extend_runesFULL_S_name">
                                    <img src="./img/${(await runes(data.info.participants[i].perks.styles[0].selections[0].perk, data.info.participants[i].perks.styles[1].style))[1]}" style="height:42px; width:42px;"><p>${(await runesDescription_noImg(data.info.participants[i].perks.styles[0].selections[0].perk, data.info.participants[i].perks.styles[1].style))[1]}</p>
                                </div>

                                <div class = "match_extend_runesFULL_S_part">
                                    <img src="./img/${await runesSingle(data.info.participants[i].perks.styles[1].selections[0].perk)}" style="height:42px; width:42px;"><p>${(await runesDescription_noImg(data.info.participants[i].perks.styles[1].selections[0].perk, data.info.participants[i].perks.styles[1].style))[0]}</p>
                                </div>

                                <div class = "match_extend_runesFULL_S_part">
                                    <img src="./img/${await runesSingle(data.info.participants[i].perks.styles[1].selections[1].perk)}" style="height:42px; width:42px;"><p>${(await runesDescription_noImg(data.info.participants[i].perks.styles[1].selections[1].perk, data.info.participants[i].perks.styles[1].style))[0]}</p>
                                </div>

                                <div class = "match_extend_runesFULL_S_part>
                                    <img src="./img/perk-images/StatMods/${data.info.participants[i].perks.statPerks.offense}.png">
                                    <img src="./img/perk-images/StatMods/${data.info.participants[i].perks.statPerks.offense}.png">

                                    <img src="./img/perk-images/StatMods/${data.info.participants[i].perks.statPerks.flex}.png">
                                    <img src="./img/perk-images/StatMods/${data.info.participants[i].perks.statPerks.defense}.png">
                                    
                                </div>

                            </div>
                        </div>
                        <a class="match_extend_name" data-tippy-content = "View '${data.info.participants[i].summonerName}' profile" href="${location.origin}/#${getRegion}/${data.info.participants[i].summonerName}" target='_blank'>${data.info.participants[i].summonerName}</a>
                    </div>

                    <div class = "match_extend_kda">
                        <p class="match_extend_kda_kda">${((data.info.participants[i].kills + data.info.participants[i].assists) / data.info.participants[i].deaths).toFixed(2)} KDA</p>
                        <div class = "match_extend_kda_score-kp">
                            <p class="match_extend_kda_score">${data.info.participants[i].kills} / ${data.info.participants[i].deaths} / ${data.info.participants[i].assists} &nbsp;</p>
                            <p class="match_extend_kda_kp" data-tippy-content = "Kill Participation">(${Math.round(((data.info.participants[i].kills + data.info.participants[i].assists) / (data.info.participants[0].kills+data.info.participants[1].kills+data.info.participants[2].kills+data.info.participants[3].kills+data.info.participants[4].kills))*100)}%)</p>
                        </div>
                    </div>

                    <div class = "match_extend_cs">
                        <p class = "match_extend_cs_cs"><span style="font-weight:bold">${data.info.participants[i].neutralMinionsKilled + data.info.participants[i].totalMinionsKilled}</span> CS</p>
                        <p class = "match_extend_cs_cs-min">${((data.info.participants[i].neutralMinionsKilled + data.info.participants[i].totalMinionsKilled) / msToMin(data.info.gameDuration)).toFixed(1)}/min</p>
                    </div>

                    <div class="match_extend_dmg">
                        <p data-tippy-content="Damage Dealt To Champions"><span>${check_dmg(data.info.participants[i].totalDamageDealtToChampions)}</span> <span>DMG</span></p>
                    </div>

                    <div class = "match_extend_items">
                        <p class="match_extend-item match_extend--item1" data-tippy-content = "${await item(data.info.participants[i].item0)}"><img src="${await iconLink(data.info.participants[i].item0)}" class="match_extend--img"></p>
                        <p class="match_extend-item match_extend--item1" data-tippy-content = "${await item(data.info.participants[i].item1)}"><img src="${await iconLink(data.info.participants[i].item1)}" class="match_extend--img"></p>
                        <p class="match_extend-item match_extend--item3" data-tippy-content = "${await item(data.info.participants[i].item2)}"><img src="${await iconLink(data.info.participants[i].item2)}" class="match_extend--img"></p>
                        <p class="match_extend-item match_extend--item4" data-tippy-content = "${await item(data.info.participants[i].item3)}"><img src="${await iconLink(data.info.participants[i].item3)}" class="match_extend--img"></p>
                        <p class="match_extend-item match_extend--item5" data-tippy-content = "${await item(data.info.participants[i].item4)}"><img src="${await iconLink(data.info.participants[i].item4)}" class="match_extend--img"></p>
                        <p class="match_extend-item match_extend--item6" data-tippy-content = "${await item(data.info.participants[i].item5)}"><img src="${await iconLink(data.info.participants[i].item5)}" class="match_extend--img"></p>
                        <p class="match_extend-item match_extend--item-ward"><img src="${await iconLink(data.info.participants[i].item6)}" style="border-radius: 50%;" data-tippy-content = "${await item(data.info.participants[i].item6)}"></p>
                    </div>
                </div>
                
                `);
            //}
            let test = document.querySelectorAll('.runes_P');
            let test2 = document.querySelectorAll('.match_extend_runesFULL_P');

            for(let r = 0; r < test.length; r++) {
                tippy(test[r], {
                    content: test2[r].innerHTML,
                    allowHTML: true,
                    //interactive: true,
                });
            }


            let testV2 = document.querySelectorAll('.runes_S');
            let test2V2 = document.querySelectorAll('.match_extend_runesFULL_S');

            for(let r = 0; r < testV2.length; r++) {
                tippy(testV2[r], {
                    content: test2V2[r].innerHTML,
                    allowHTML: true,
                    //interactive: true,
                });
            }
        }
        tippy('[data-tippy-content]', {
            allowHTML: true,
        });
        btn_extend[poz].disabled = false;
        btn_extend[poz].style.cursor = 'url(https://cur.cursors-4u.net/games/gam-14/gam1340.cur), auto';
    }


    async function render_redTeam(poz) {
        const location_stats = document.querySelectorAll('.match_extend_redTeamPlayers');
        location_stats[poz].innerHTML="";
        for(let i = data.info.participants.length-5; i < data.info.participants.length; i++) {
            //for(let j = 0; j < location_stats.length; j++) {
                location_stats[poz].insertAdjacentHTML('beforeend', `
                <div class="match_extend_details">
                    <div class = "match_extend_principal">
                        <div class="match_extend_champ_lvl">
                            <div class="match_extend_champ"><img src="http://ddragon.leagueoflegends.com/cdn/${await getLatestVersion()}/img/champion/${(await getChampionByKey(data.info.participants[i].championId)).id}.png" alt="champ_icon" class="match__players--icon" data-tippy-content="${(await getChampionByKey(data.info.participants[i].championId)).name}"></div>
                            <div class="match_extend_lvl">${data.info.participants[i].champLevel}</div>
                        </div>
                        
                        <div class="match_extend_spells">
                            <img class="match_extend_spell match_extend_spell1" src="http://ddragon.leagueoflegends.com/cdn/${await getLatestVersion()}/img/spell/${await spell(data.info.participants[i].summoner1Id)}.png" data-tippy-content="${await spell_description(data.info.participants[i].summoner1Id)}">
                            <img class="match_extend_spell match_extend_spell2" src="http://ddragon.leagueoflegends.com/cdn/${await getLatestVersion()}/img/spell/${await spell(data.info.participants[i].summoner2Id)}.png" data-tippy-content="${await spell_description(data.info.participants[i].summoner2Id)}">
                        </div>

                        <div class="match_extend_runes">
                            <img src="./img/${(await runes(data.info.participants[i].perks.styles[0].selections[0].perk, data.info.participants[i].perks.styles[1].style))[0]}" alt="runes1" class="match_extend_runes--icon1 runes_P">
                            <img src="./img/${(await runes(data.info.participants[i].perks.styles[0].selections[0].perk, data.info.participants[i].perks.styles[1].style))[1]}" alt="runes2"class="match_extend_runes--icon2 runes_S">
                        </div>
                        <a class="match_extend_name" data-tippy-content = "View '${data.info.participants[i].summonerName}' profile" href="${location.origin}/#${getRegion}/${data.info.participants[i].summonerName}" target='_blank'>${data.info.participants[i].summonerName}</a>
                    </div>


                    <div class="match_extend_runesFULL_P" style="display:none">
                        <div class = "match_extend_runesFULL_P_part">
                            <img src="./img/${await runesSingle(data.info.participants[i].perks.styles[0].selections[0].perk)}" style="height:42px; width:42px;"><p>${(await runesDescription_noImg(data.info.participants[i].perks.styles[0].selections[0].perk, data.info.participants[i].perks.styles[1].style))[0]}</p>
                        </div>

                        <div class = "match_extend_runesFULL_P_part">
                            <img src="./img/${await runesSingle(data.info.participants[i].perks.styles[0].selections[1].perk)}" style="height:42px; width:42px;"><p>${(await runesDescription_noImg(data.info.participants[i].perks.styles[0].selections[1].perk, data.info.participants[i].perks.styles[1].style))[0]}</p>
                        </div>

                        <div class = "match_extend_runesFULL_P_part">
                            <img src="./img/${await runesSingle(data.info.participants[i].perks.styles[0].selections[2].perk)}" style="height:42px; width:42px;"><p>${(await runesDescription_noImg(data.info.participants[i].perks.styles[0].selections[2].perk, data.info.participants[i].perks.styles[1].style))[0]}</p>
                        </div>

                        <div class = "match_extend_runesFULL_P_part">
                            <img src="./img/${await runesSingle(data.info.participants[i].perks.styles[0].selections[3].perk)}" style="height:42px; width:42px;"><p>${(await runesDescription_noImg(data.info.participants[i].perks.styles[0].selections[3].perk, data.info.participants[i].perks.styles[1].style))[0]}</p>
                        </div>
                    </div>


                    <div class="match_extend_runesFULL_S" style="display:none">
                        <div class = "match_extend_runesFULL_S_part match_extend_runesFULL_S_name">
                            <img src="./img/${(await runes(data.info.participants[i].perks.styles[0].selections[0].perk, data.info.participants[i].perks.styles[1].style))[1]}" style="height:42px; width:42px;"><p>${(await runesDescription_noImg(data.info.participants[i].perks.styles[0].selections[0].perk, data.info.participants[i].perks.styles[1].style))[1]}</p>
                        </div>

                        <div class = "match_extend_runesFULL_S_part">
                            <img src="./img/${await runesSingle(data.info.participants[i].perks.styles[1].selections[0].perk)}" style="height:42px; width:42px;"><p>${(await runesDescription_noImg(data.info.participants[i].perks.styles[1].selections[0].perk, data.info.participants[i].perks.styles[1].style))[0]}</p>
                        </div>

                        <div class = "match_extend_runesFULL_S_part">
                            <img src="./img/${await runesSingle(data.info.participants[i].perks.styles[1].selections[1].perk)}" style="height:42px; width:42px;"><p>${(await runesDescription_noImg(data.info.participants[i].perks.styles[1].selections[1].perk, data.info.participants[i].perks.styles[1].style))[0]}</p>
                        </div>

                        <div class = "match_extend_runesFULL_S_part>
                            <img src="./img/perk-images/StatMods/${data.info.participants[i].perks.statPerks.offense}.png">
                            <img src="./img/perk-images/StatMods/${data.info.participants[i].perks.statPerks.offense}.png">

                            <img src="./img/perk-images/StatMods/${data.info.participants[i].perks.statPerks.flex}.png">
                            <img src="./img/perk-images/StatMods/${data.info.participants[i].perks.statPerks.defense}.png">
                            
                        </div>

                    </div>

                    <div class = "match_extend_kda">
                        <p class="match_extend_kda_kda">${((data.info.participants[i].kills + data.info.participants[i].assists) / data.info.participants[i].deaths).toFixed(2)} KDA</p>
                        <div class = "match_extend_kda_score-kp">
                            <p class="match_extend_kda_score">${data.info.participants[i].kills} / ${data.info.participants[i].deaths} / ${data.info.participants[i].assists} &nbsp;</p>
                            <p class="match_extend_kda_kp" data-tippy-content = "Kill Participation">(${Math.round(((data.info.participants[i].kills + data.info.participants[i].assists) / (data.info.participants[5].kills+data.info.participants[6].kills+data.info.participants[7].kills+data.info.participants[8].kills+data.info.participants[9].kills))*100)}%)</p>
                        </div>
                    </div>

                    <div class = "match_extend_cs">
                        <p class = "match_extend_cs_cs"><span style="font-weight:bold">${data.info.participants[i].neutralMinionsKilled + data.info.participants[i].totalMinionsKilled}</span> CS</p>
                        <p class = "match_extend_cs_cs-min">${((data.info.participants[i].neutralMinionsKilled + data.info.participants[i].totalMinionsKilled) / msToMin(data.info.gameDuration)).toFixed(1)}/min</p>
                    </div>

                    <div class="match_extend_dmg">
                        <p data-tippy-content="Damage Dealt To Champions"><span>${check_dmg(data.info.participants[i].totalDamageDealtToChampions)}</span> <span>DMG</span></p>
                    </div>

                    <div class = "match_extend_items">
                        <p class="match_extend-item match_extend--item1" data-tippy-content = "${await item(data.info.participants[i].item0)}"><img src="${await iconLink(data.info.participants[i].item0)}" class="match_extend--img"></p>
                        <p class="match_extend-item match_extend--item1" data-tippy-content = "${await item(data.info.participants[i].item1)}"><img src="${await iconLink(data.info.participants[i].item1)}" class="match_extend--img"></p>
                        <p class="match_extend-item match_extend--item3" data-tippy-content = "${await item(data.info.participants[i].item2)}"><img src="${await iconLink(data.info.participants[i].item2)}" class="match_extend--img"></p>
                        <p class="match_extend-item match_extend--item4" data-tippy-content = "${await item(data.info.participants[i].item3)}"><img src="${await iconLink(data.info.participants[i].item3)}" class="match_extend--img"></p>
                        <p class="match_extend-item match_extend--item5" data-tippy-content = "${await item(data.info.participants[i].item4)}"><img src="${await iconLink(data.info.participants[i].item4)}" class="match_extend--img"></p>
                        <p class="match_extend-item match_extend--item6" data-tippy-content = "${await item(data.info.participants[i].item5)}"><img src="${await iconLink(data.info.participants[i].item5)}" class="match_extend--img"></p>
                        <p class="match_extend-item match_extend--item-ward"><img src="${await iconLink(data.info.participants[i].item6)}" style="border-radius: 50%;" data-tippy-content="${await item(data.info.participants[i].item6)}"></p>
                    </div>
                </div>

                `);

            //}

            let test = document.querySelectorAll('.runes_P');
            let test2 = document.querySelectorAll('.match_extend_runesFULL_P');

            for(let r = 0; r < test.length; r++) {
                tippy(test[r], {
                    content: test2[r].innerHTML,
                    allowHTML: true,
                    //interactive: true,
                });
            }


            let testV2 = document.querySelectorAll('.runes_S');
            let test2V2 = document.querySelectorAll('.match_extend_runesFULL_S');

            for(let r = 0; r < testV2.length; r++) {
                tippy(testV2[r], {
                    content: test2V2[r].innerHTML,
                    allowHTML: true,
                    //interactive: true,
                });
            }

        }
        tippy('[data-tippy-content]', {
            allowHTML: true,
        });
        console.log('sf');

        btn_extend[poz].disabled = false;
        btn_extend[poz].style.cursor = 'url(https://cur.cursors-4u.net/games/gam-14/gam1340.cur), auto';
    }








  
    location_stats.insertAdjacentHTML('beforeend', markup);
    
    //render_blueTeam();
    //render_redTeam();

    tippy('[data-tippy-content]', {
        allowHTML: true,
    });  



    const dragons = document.querySelectorAll('.dragons');
    const dragons_img = document.querySelectorAll('.dragons_img');

    for(let r = 0; r < dragons.length; r++) {
        tippy(dragons[r], {
            content: dragons_img[r].innerHTML,
            allowHTML: true,
            //interactive: true,
        });
    }




    function change_inf() {
        //console.log(buttons.length);
        //console.log(buttons_div.length); 
        const buttons_div = document.querySelectorAll('.match_extend_buttons');
        const buttons = document.querySelectorAll('.match_extend_button');

        const overview = document.querySelectorAll('.match_extend_overview');
        const build = document.querySelectorAll('.match_extend_builds');
        const advanced = document.querySelectorAll('.match_extend_advanced');
        const breakdown = document.querySelectorAll('.match_extend_breakdown');


        for(let b = buttons_div.length-1; b<buttons_div.length; b++) {
            for(let a = buttons.length-1; a<buttons.length; a++) {
                buttons[a].addEventListener('click', function() {
                    const curent = document.querySelectorAll('.match_extend_buttons_active');
                    for(let s=0;s<curent.length;s++) {
                        curent[s].className = curent[s].className.replace(' match_extend_buttons_active','');
                    }
                    this.className += ' match_extend_buttons_active';


                    overview[b].classList.add('hidden');
                    build[b].classList.add('hidden');
                    advanced[b].classList.add('hidden');
                    breakdown[b].classList.remove('hidden');
                });
            }


            for(let a = buttons.length-2; a<buttons.length-1; a++) {
                buttons[a].addEventListener('click', function() {
                    const curent = document.querySelectorAll('.match_extend_buttons_active');
                    for(let s=0;s<curent.length;s++) {
                        curent[s].className = curent[s].className.replace(' match_extend_buttons_active','');
                    }
                    this.className += ' match_extend_buttons_active';
    
                    
                    overview[b].classList.add('hidden');
                    build[b].classList.add('hidden');
                    advanced[b].classList.remove('hidden');
                    breakdown[b].classList.add('hidden');
                });
            }
            for(let a = buttons.length-3; a<buttons.length-2; a++) {
                buttons[a].addEventListener('click', function() {
                    const curent = document.querySelectorAll('.match_extend_buttons_active');
                    for(let s=0;s<curent.length;s++) {
                        curent[s].className = curent[s].className.replace(' match_extend_buttons_active','');
                    }
                    this.className += ' match_extend_buttons_active';
    
                    overview[b].classList.add('hidden');
                    build[b].classList.remove('hidden');
                    advanced[b].classList.add('hidden');
                    breakdown[b].classList.add('hidden');
                });
            }
            for(let a = buttons.length-4; a<buttons.length-3; a++) {
                buttons[a].addEventListener('click', function() {
                    const curent = document.querySelectorAll('.match_extend_buttons_active');
                    for(let s=0;s<curent.length;s++) {
                        curent[s].className = curent[s].className.replace(' match_extend_buttons_active','');
                    }
                    this.className += ' match_extend_buttons_active';
    
                    overview[b].classList.remove('hidden');
                    build[b].classList.add('hidden');
                    advanced[b].classList.add('hidden');
                    breakdown[b].classList.add('hidden');
                });
            }

        }

    }

    change_inf();


    let btn_extend = document.querySelectorAll('.match__extend');
    let content_extend = document.querySelectorAll('.match_extend_content');


    for(let q = btn_extend.length-1; q<btn_extend.length; q++) {
        if(win_lose == 'Remake') {
            btn_extend[q].disabled = true;
        } else {
            btn_extend[q].addEventListener('click',function() {
                render_blueTeam(q);
                render_redTeam(q);
                render_advancedStats(q);
            }, {once : true});   //face ca functia din addEventListener sa se execute numai odata
        
            btn_extend[q].addEventListener('click',function(){
                content_extend[q].classList.toggle('hidden');
                console.log(q);
            });
        }
    }

    
}


//functii ajutatoare pt a randa mastery la champ
function checkChampPoints(input) {
    if(input < 1000000) {
        return `${(input/1000).toFixed(1)}K`;
    } else {
        return `${(input/1000000).toFixed(2)}mil`;
    }
}
function matchHoursAgo(input) {
    if(new Date().getTime() - (input) < 3600000) {
        return `${msToMin(new Date().getTime() - (input))} min`;
    } else {
        return msToTime(new Date().getTime() - (input));
    }
}

function check_chest(input) {
    if(input==true) {
        return `<img src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-collections/global/default/images/item-element/hextech-chest.png" alt="chest" class="champ_mastery_chest" data-tippy-content="Chest acquired">`
    } else {
        return '';
    }
}
////////////////////////////////////////////


async function render_camph_mastery(region, accountId) {
    const location_stats = document.querySelector('.profile_container__content__champion_champ_auto');

    location_stats_manual.innerHTML = "";

    location_stats.innerHTML = "";

    const allChampsMastery = await summpnerAllChampLvlExp(region, accountId);
    //console.log(allChampsMastery);

    let champsMastery = [], champsMasteryAfter=[];
    let size; //atatia campioni se vor afisa dupa dimensiunea ecranului, <500px 5champs    >500px 10champs
    
    function getChampsMastery() {
        if (window.matchMedia("(max-width: 500px)").matches) { // If media query matches
          size=5;
        } else {
         size=10;
        }
    }
    

    getChampsMastery();

    for(let i=0; i<size;i++) {
        if(allChampsMastery[i] !== undefined) {
            champsMastery.push(allChampsMastery[i]);
        } else {
            break;
        }
        
    }
    console.log(size);



    console.log(champsMastery);


    for(let i=0;i<champsMastery.length;i++) {
        champsMasteryAfter.push([(await getChampionByKey(champsMastery[i].championId)).name, (await getChampionByKey(champsMastery[i].championId)).id, champsMastery[i].championLevel, checkChampPoints(champsMastery[i].championPoints), champsMastery[i].chestGranted, matchHoursAgo(champsMastery[i].lastPlayTime)]);

    }

    console.log(champsMasteryAfter);

    for(let i=0;i<champsMasteryAfter.length;i++) {



        location_stats.insertAdjacentHTML('beforeend', `
            <div class="champ_mastery">
                <div class="champ_mastery_image">
                    <img src="http://ddragon.leagueoflegends.com/cdn/${await getLatestVersion()}/img/champion/${champsMasteryAfter[i][1]}.png" alt="champ_icon" class="champ_mastery_img">
                    <img src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-champion-details/global/default/cdp-prog-mastery-${champsMasteryAfter[i][2]}.png" alt="champ_icon" class="champ_mastery_border">
                    ${check_chest(champsMasteryAfter[i][4])}
                </div>

                <div class="champ_mastery_info">
                    <div class="champ_mastery_info_left">
                        <div class="champ_mastery_info_name">
                            <p>${champsMasteryAfter[i][0]}</p>
                        </div>
                    
                        <div class="champ_mastery_info_lvl">
                            <p>Level: ${champsMasteryAfter[i][2]}</p>
                        </div>

                        <div class="champ_mastery_info_points">
                            <img src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-champion-details/global/default/mastery-icon-unowned.png">
                            <p><span class="champ_mastery_info_points_pts">${champsMasteryAfter[i][3]}</span> pts</p>
                        </div>
                    </div>

                    <div class="champ_mastery_info_right">
                        <p data-tippy-content="Last time played">${champsMasteryAfter[i][5]} ago*</p>
                    </div>
                </div>
            </div>
        `);
    }


    tippy('[data-tippy-content]', {
        allowHTML: true,
    });
    
}


const champ_value = document.querySelector('.profile_container__content__champion_search_input');
const champ_btn = document.querySelector('.profile_container__content__champion_search_btn');
const location_stats_manual = document.querySelector('.profile_container__content__champion_champ_manual');


async function addChampForMastery() {
    let input_value = champ_value.value.replace(/\s+/g, '');  //elimina spatiile

    //console.log(input_value);

    if(champ_value.value !== '') {
        profile_container.style.cursor='wait';  

        const getRegion = this.window.location.hash.substring(this.window.location.hash.lastIndexOf('#')+1, this.window.location.hash.lastIndexOf('/'));

        let champ = await getChampKey_ID(input_value.charAt(0).toUpperCase() + input_value.slice(1));
        
        
 
        let champ_details = await summonerChampLvlExp(getRegion,(await lolstats_accout(getRegion,encodeURI(window.location.hash.slice(1+getRegion.length+1)))).id,champ[1]);
 
        let champ_detailsAfter = [(await getChampionByKey(champ[1])).name, (await getChampionByKey(champ[1])).id, champ_details.championLevel, checkChampPoints(champ_details.championPoints), champ_details.chestGranted, matchHoursAgo(champ_details.lastPlayTime)];
 
        console.log(champ_detailsAfter);
 
        let markup;
 
         if(champ_detailsAfter[2] === undefined) {
             markup = `
             <div class="champ_mastery">
                 <div class="champ_mastery_image">
                     <img src="http://ddragon.leagueoflegends.com/cdn/${await getLatestVersion()}/img/champion/${champ_detailsAfter[1]}.png" alt="champ_icon" class="champ_mastery_img">
                     <img src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-champion-details/global/default/cdp-prog-mastery-0.png" alt="champ_icon" class="champ_mastery_border">
                 </div>
     
                 <div class="champ_mastery_info">
                 <div class="champ_mastery_info_left">
                 <div class="champ_mastery_info_name">
                     <p>${champ_detailsAfter[0]}</p>
                 </div>
             
                 <div class="champ_mastery_info_lvl">
                     <p>Level: -</p>
                 </div>
 
                 <div class="champ_mastery_info_points">
                     <img src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-champion-details/global/default/mastery-icon-unowned.png">
                     <p><span class="champ_mastery_info_points_pts">0</span> pts</p>
                 </div>
             </div>
 
             <div class="champ_mastery_info_right">
                 <p data-tippy-content="Last time played">Never played*</p>
             </div>
                 </div>
             </div>
             `
         } else {
             markup = `
             <div class="champ_mastery">
                 <div class="champ_mastery_image">
                     <img src="http://ddragon.leagueoflegends.com/cdn/${await getLatestVersion()}/img/champion/${champ_detailsAfter[1]}.png" alt="champ_icon" class="champ_mastery_img">
                     <img src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-champion-details/global/default/cdp-prog-mastery-${champ_detailsAfter[2]}.png" alt="champ_icon" class="champ_mastery_border">
                     ${check_chest(champ_detailsAfter[4])}
                 </div>
     
                 <div class="champ_mastery_info">
                     <div class="champ_mastery_info_left">
                         <div class="champ_mastery_info_name">
                             <p>${champ_detailsAfter[0]}</p>
                         </div>
                     
                         <div class="champ_mastery_info_lvl">
                             <p>Level: ${champ_detailsAfter[2]}</p>
                         </div>
     
                         <div class="champ_mastery_info_points">
                             <img src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-champion-details/global/default/mastery-icon-unowned.png">
                             <p><span class="champ_mastery_info_points_pts">${champ_detailsAfter[3]}</span> pts</p>
                         </div>
                     </div>
     
                     <div class="champ_mastery_info_right">
                         <p data-tippy-content="Last time played">${champ_detailsAfter[5]} ago*</p>
                     </div>
                 </div>
             </div>
            `
         }
 
        location_stats_manual.insertAdjacentHTML('afterbegin',markup);
 
        profile_container.style.cursor='url(https://cur.cursors-4u.net/games/gam-14/gam1340.cur), auto';  
 
        champ_value.value = '';
    }



   tippy('[data-tippy-content]', {
    allowHTML: true,
    });
}

champ_btn.addEventListener('click', function() {
    addChampForMastery();

});
champ_value.addEventListener("keyup", event => {
    if (event.keyCode === 13) {
        addChampForMastery();
    }
});



async function render_general_status(data,name) {
    const location_stats = document.querySelector('.general');
    location_stats.innerHTML="";
    let wins=0,loses=0,totalGames=0,kills=0,deaths=0,assists=0,champs=[],lane=[],teamID=[],allKills=0,allDeaths=0,allAssists=0,kda,kp,first_blood=0,vision_score=0,control_ward=0, gold = 0, cs = 0, time = 0, gold_min, cs_min;

    for(let i = 0; i < data.length; i++) {
        time += data[i].info.gameDuration;
        for(let j = 0; j < data[i].info.participants.length; j++) {
            if(data[i].info.participants[j].summonerName == name) {
                if(data[i].info.participants[j].win == true) {
                    wins++;  //win urile din ultime N meciuri
                } else {
                    loses++; //losses urile din ultime N meciuri
                }
                kills+= data[i].info.participants[j].kills;
                deaths+= data[i].info.participants[j].deaths;
                assists+= data[i].info.participants[j].assists;
                champs.push(data[i].info.participants[j].championId);

                if(data[i].info.participants[j].individualPosition != 'Invalid') {
                    if(data[i].info.participants[j].individualPosition == 'BOTTOM' && data[i].info.participants[j].individualPosition == 'UTILITY') {
                        lane.push(data[i].info.participants[j].role);
                    } else {
                        lane.push(data[i].info.participants[j].individualPosition);
                    }
                    
                }  

                if(data[i].info.participants[j].firstBloodKill == true) {
                    first_blood++;
                }

                vision_score += data[i].info.participants[j].visionScore;

                control_ward += data[i].info.participants[j].visionWardsBoughtInGame;

                gold += data[i].info.participants[j].goldEarned;

                cs += data[i].info.participants[j].neutralMinionsKilled + data[i].info.participants[j].totalMinionsKilled

                teamID.push(data[i].info.participants[j].teamId);
            }
        }
    }
    function millisToMinutes(millis) {
        var minutes = Math.floor(millis / 60000);
        //var seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes;
    }
    
    gold_min = (gold / millisToMinutes(time)).toFixed(1);
    cs_min = (cs / millisToMinutes(time)).toFixed(1);


    kda = ((kills+assists)/deaths).toFixed(2);

    first_blood = (first_blood/(wins+loses)).toFixed(1)*100;

    vision_score = (vision_score / (wins+loses)).toFixed(2);

    control_ward = (control_ward / (wins+loses)).toFixed(1);

    
    for(let i = 0; i < data.length; i++) {
        for(let j = 0; j < data[i].info.participants.length; j++) {
            if(data[i].info.participants[j].teamId == teamID[i]) {
                allKills+= data[i].info.participants[j].kills;
                allDeaths+= data[i].info.participants[j].deaths;
                allAssists+= data[i].info.participants[j].assists;
            }
        }
    }
    kp= Math.round(((kills + assists) /allKills)*100);

    let top=0,jg=0,mid=0,bot=0,supp=0,lane_vec=[];

    if(lane.length == 0) {
        lane_vec.push('-');
    } else {
        for(let i = 0; i < lane.length; i++) {
            if(lane[i]=='TOP'){
                top++;
            } else if(lane[i]=='JUNGLE') {
                jg++;
            } else if(lane[i]=='MIDDLE') {
                mid++;
            } else if(lane[i]=='BOTTOM') {
                bot++;
            } else if(lane[i]=='UTILITY') {
                supp++;
            }
        }
    }

    lane_vec.push(top,jg,mid,bot,supp);
    console.log(lane);

    let favorite_laneProcent,favorite_lane=0, favorite_lanePoz;

    for(let g = 0; g < lane_vec.length; g++) {
        if(lane_vec[g] > favorite_lane) {
            favorite_lane = lane_vec[g];
            //favorite_laneVal = lane_vec[i];
            favorite_lanePoz = g;
        }
    }
    
    if(favorite_lanePoz == 0) {
        favorite_lanePoz = 'top';
    } else if(favorite_lanePoz == 1) {
        favorite_lanePoz = 'jungle';
    } else if(favorite_lanePoz == 2) {
        favorite_lanePoz = 'middle';
    } else if(favorite_lanePoz == 3) {
        favorite_lanePoz = 'bottom';
    } else if(favorite_lanePoz == 4) {
        favorite_lanePoz = 'utility';
    }
    //console.log(favorite_lanePoz);

    favorite_laneProcent = (favorite_lane / lane.length).toFixed(1)*100;

    totalGames = wins + loses;

    let first_champ = champs[0];
    let second_champ = 0;

    function sortByFrequency(array) { // functie care sorteaza un array dupa numarul de aparitii ale itemilor
        var frequency = {};
        var sortAble = [];
        var newArr = [];
    
        array.forEach(function(value) { 
            if ( value in frequency )
                frequency[value] = frequency[value] + 1;
            else
                frequency[value] = 1;
        });
        
    
        for(var key in frequency){
            sortAble.push([key, frequency[key]])
        }
    
        sortAble.sort(function(a, b){
            return b[1] - a[1]
        })
    
        
        sortAble.forEach(function(obj){
            for(var i=0; i < obj[1]; i++){
                newArr.push(obj[0]);
            }
        })
        return newArr;
        
    }
    const champs_sorted = sortByFrequency(champs);

    first_champ = champs_sorted[0];
    for(let i =0;i<champs_sorted.length;i++) {
        if(champs_sorted[i]!==first_champ) {
            second_champ = champs_sorted[i];
            break;
        }
    }
    console.log(second_champ);


    function get_stats_for_lane(input) {
        let win = 0, lose=0,kill=0,death=0,assist=0;
        let allValues = [];
        if(input !== undefined) {
            for(let i = 0; i < data.length; i++) {
                for(let j = 0; j < data[i].info.participants.length; j++) {
                    if(data[i].info.participants[j].individualPosition !== 'undefined') {
                        if(data[i].info.participants[j].individualPosition == input.toUpperCase() && data[i].info.participants[j].summonerName == name) {
                            if(data[i].info.participants[j].win==true) {
                                win++;
                            } else {
                                lose++;
                            }
                            kill+= data[i].info.participants[j].kills;
                            death+= data[i].info.participants[j].deaths;
                            assist+= data[i].info.participants[j].assists;
                        }
                    } else {
                        win=0;
                        lose=0;
                        kill = 0;
                        death=0;
                        assist=0;
                    }
                }
            }
        }

        allValues.push(win,lose,kill,death,assist);
        return allValues;
        //console.log(allValues);
    }


    
    const first_champ_details = await getChampionByKey(first_champ);
    const second_champ_details = await getChampionByKey(second_champ);
    

    function get_stats_for_first_second_champ(input) {
        let win = 0, lose=0,kill=0,death=0,assist=0;
        let allValues = [];
        if(input !== undefined) {
            for(let i = 0; i < data.length; i++) {
                for(let j = 0; j < data[i].info.participants.length; j++) {
                    if(data[i].info.participants[j].championName == input.id && data[i].info.participants[j].summonerName == name) {
                        if(data[i].info.participants[j].win==true) {
                            win++;
                        } else {
                            lose++;
                        }
                        kill+= data[i].info.participants[j].kills;
                        death+= data[i].info.participants[j].deaths;
                        assist+= data[i].info.participants[j].assists;
                    }
                    
                }
            }
            allValues.push(win,lose,kill,death,assist);
        } else {
            allValues.push(0,0,0,0,0);
        }
   
        
        return allValues;
        //console.log(allValues);
    }
    let first_champ_stats = get_stats_for_first_second_champ(first_champ_details);
    let second_champ_stats = get_stats_for_first_second_champ(second_champ_details);

    function kda_first_second_champ(input) {
        return ((input[2] + input[4]) / input[3]).toFixed(1);
    }


    async function checkImg(input, inputData) {
        if(input !== undefined) {
            return `
            <img src="http://ddragon.leagueoflegends.com/cdn/${await getLatestVersion()}/img/champion/${input.id}.png" data-tippy-content="${input.name}">
            <div class="general_stats_champs_stats">
                <p><span class="important_text">${inputData[0]}</span><span >W</span> <span class="important_text">${inputData[1]}</span><span >L</span> ${(inputData[0] / (inputData[0] + inputData[1])*100).toFixed(1)}%<span></span></p>

                <p>${(inputData[2] / (inputData[0] + inputData[1])).toFixed(1)} / ${(inputData[3] / (inputData[0] + inputData[1])).toFixed(1)} / ${(inputData[4] / (inputData[0] + inputData[1])).toFixed(1)} (${kda_first_second_champ(inputData)}) KDA</p>
            </div>`;
        } else {
            return `<img src="./img/none1.png" data-tippy-content="No champion">
                    <h3>Not found Champion</h3>`;
        }
    }

    function checkNum(input) {
        if(input == 'NaN') {
            return '-';
        } else {
            return `${input}`;
        }
    }


    //console.log(first_champ_details,second_champ_details);
    //console.log(wins,loses,kills,deaths,assists,champs,favorite_lanePoz,kda,kp,first_blood,vision_score,control_ward,favorite_laneProcent);

    const total_games = wins + loses;

    let favorite_lane_details=get_stats_for_lane(favorite_lanePoz);
    
    function checkFavoriteLane(input) {
        if(input !== undefined) {
            return `
            <h4 class="general_stats_position_lane" data-tippy-content = "${favorite_laneProcent}% of games is on ${favorite_lanePoz}"><img width="40rem" height="40rem" src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-${favorite_lanePoz}.png">${favorite_lanePoz} (${favorite_laneProcent}%)</h4>
            `
        } else {
            return `
                <img width="40rem" height="40rem" src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-champ-select/global/default/images/champion-bench/moreinfo4k_default.png">
            `
        }
    }

    let markup = `
    
        <div class="general_stats">
            <div class="general_stats_title">
                <h3 class="general_stats_title_title1">RECENT SUMMARY </h3>
                <h3 class="neimportant_text">(last ${total_games} games): </h3>
            </div>
            

            <div class="general_stats_score">
                <h4>${wins}<span ">W</span> ${loses}<span ">L</span> (${(wins / total_games).toFixed(1)*100}% WR)</h4>
                <img src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-match-history/global/default/kills.png">
                <p>${(kills / total_games).toFixed(1)} / ${(deaths / total_games).toFixed(1)} / ${(assists / total_games).toFixed(1)}</p>
                <p>${kda} KDA <span data-tippy-content = "Kill participation">(${kp}%)</span></p>
            </div>
            
            <div class="general_stats_position">
                <div>
                    <h3>Preferred Position:</h3>
                    ${checkFavoriteLane(favorite_lanePoz)}

                    <div class="general_stats_position_stats">
                        <p><span class="important_text">${favorite_lane_details[0]}</span><span >W</span> <span class="important_text">${favorite_lane_details[1]}</span><span >L</span> ${checkNum((favorite_lane_details[0] / (favorite_lane_details[0] + favorite_lane_details[1])*100).toFixed(1))}%<span></span></p>

                        <p>${checkNum((favorite_lane_details[2] / (favorite_lane_details[0] + favorite_lane_details[1])).toFixed(1))} / ${checkNum((favorite_lane_details[3] / (favorite_lane_details[0] + favorite_lane_details[1])).toFixed(1))} / ${checkNum((favorite_lane_details[4] / (favorite_lane_details[0] + favorite_lane_details[1])).toFixed(1))} (${checkNum(kda_first_second_champ(favorite_lane_details))}) KDA</p>
                    </div>
                </div>
            </div>

            <div class="general_stats_champs">
                <h3>Preferred champion:</h3>
                <div class="general_stats_champs_firstChamp">
                    ${await checkImg(first_champ_details, first_champ_stats)}
                  
                </div>

                <div class="general_stats_champs_secondChamp">
                    ${await checkImg(second_champ_details, second_champ_stats)}
                    
                </div>
            </div>
            
            <div class="general_stats_performance">
                <h3 class="general_stats_performance_title">PERFORMANCE OVERVIEW: </h3>
                <div class="general_stats_performance_content">

                    <div class="general_stats_performance_content_vs">
                        <h2>${vision_score} <img src="https://raw.communitydragon.org/pbe/plugins/rcp-fe-lol-parties/global/default/icon-spectate.png"></h2>
                        <p>Vision Score</p>  
                    </div>

                    <div class="general_stats_performance_content_fb">
                        <h2>${first_blood}% <img src = "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-postgame/global/default/icon-target.png"> </h2>
                        <p>First Blood %</p>
                    </div>

                    <div>
                        <h2>${gold_min} <img src = "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-postgame/global/default/mask-icon-gold.png"> </h2>
                        <p>Gold / min</p>
                    </div>

                    <div>
                        <h2>${cs_min} <img src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-postgame/global/default/mask-icon-cs.png"></h2>
                        <p>CS / min</p>
                    </div>

                    <div class="general_stats_performance_content_cw">
                        <h2>${control_ward} <img src="https://raw.communitydragon.org/pbe/plugins/rcp-fe-lol-navigation/global/default/rewardicons_ward.png"> </h2>
                        <p>Control wards</p>
                        
                    </div>
                </div>
            </div>
        </div>
`


    tippy('[data-tippy-content]', {
        allowHTML: true,
    });

    


 

   //change active class for navigation
   const btn_nav = document.querySelectorAll('.general_queue_type');
   for(let v = 0; v < btn_nav.length; v++) {

       btn_nav[v].addEventListener('click',function() {
           var current = document.querySelectorAll(".general_queue_types_active");
           current[0].className = current[0].className.replace(" general_queue_types_active", "");
           
           this.className += " general_queue_types_active";
       });
   }

    location_stats.insertAdjacentHTML('afterbegin', markup);
}




async function render_liveMatch(data) {
    const location_stats = document.querySelector('.liveGame');
    //const rune = await runes(player_match.perks.styles[0].selections[0].perk, player_match.perks.styles[1].style);
    //console.log((await runes(data.participants[0].perks.perkIds[0], data.participants[0].perks.perkIds[5]))[0]);
    //console.log((await runes(data.participants[0].perks.perkIds[0], data.participants[0].perks.perkIds[5]))[1]);
    
    const getRegion = this.window.location.hash.substring(this.window.location.hash.lastIndexOf('#')+1, this.window.location.hash.lastIndexOf('/'));

    

    document.querySelector('.liveGame').classList.remove('hidden');
    document.querySelector('.liveGame').innerHTML='';
    
       
    
    
    async function getRank() {
        let rankPlayers = [];
        for(let i = 0; i < data.participants.length; i++) {
            rankPlayers.push(await summonerRank(getRegion,data.participants[i].summonerId));
        }
        

        //console.log(rankPlayers);


        let rankPlayersSolo = [];
        let rankPlayersFlex = [];

        for(let j = 0; j < rankPlayers.length;j++) {
    
                if(rankPlayers[j].length==0) {
                    rankPlayersSolo.push([`unranked`, 0,0,0,0]);
                    rankPlayersFlex.push([`unranked`, 0,0,0,0]);
                } else if(rankPlayers[j][0].queueType == 'RANKED_SOLO_5x5' && rankPlayers[j].length==1) {

                    rankPlayersSolo.push([rankPlayers[j][0].tier, rankPlayers[j][0].rank, rankPlayers[j][0].leaguePoints, rankPlayers[j][0].wins, rankPlayers[j][0].losses]);   
                    rankPlayersFlex.push([`unranked`, 0,0,0,0]);

                } else if(rankPlayers[j][0].queueType == 'RANKED_FLEX_SR' && rankPlayers[j].length==1) {

                    rankPlayersFlex.push([rankPlayers[j][0].tier, rankPlayers[j][0].rank, rankPlayers[j][0].leaguePoints, rankPlayers[j][0].wins, rankPlayers[j][0].losses]);
                    rankPlayersSolo.push([`unranked`, 0,0,0,0]);

                } else if(rankPlayers[j][0].queueType == 'RANKED_SOLO_5x5') {

                    rankPlayersSolo.push([rankPlayers[j][0].tier, rankPlayers[j][0].rank, rankPlayers[j][0].leaguePoints, rankPlayers[j][0].wins, rankPlayers[j][0].losses]);
                    rankPlayersFlex.push([rankPlayers[j][1].tier, rankPlayers[j][1].rank, rankPlayers[j][1].leaguePoints, rankPlayers[j][1].wins, rankPlayers[j][1].losses]);

                } else if(rankPlayers[j][1].queueType == 'RANKED_SOLO_5x5') {

                    rankPlayersSolo.push([rankPlayers[j][1].tier, rankPlayers[j][1].rank, rankPlayers[j][1].leaguePoints, rankPlayers[j][1].wins, rankPlayers[j][1].losses]);
                    rankPlayersFlex.push([rankPlayers[j][0].tier, rankPlayers[j][0].rank, rankPlayers[j][0].leaguePoints, rankPlayers[j][0].wins, rankPlayers[j][0].losses]);
                    
                }  
        }

        //console.log(rankPlayersSolo);
        //console.log(rankPlayersFlex);
        

        //console.log(dataRank);
    
        if(data.gameQueueConfigId === 420) {
            return rankPlayersSolo;
            //console.log(rankPlayersSolo);
        }
        else if(data.gameQueueConfigId === 440){
            return rankPlayersFlex;
            //console.log(rankPlayersFlex);
        } else {
            return rankPlayersSolo;
        }
    }
    
    const rank = await getRank();


    async function bans_champ() {
        let vec = [];
        if(data.bannedChampions.length==0) {
            return [`./img/none1.png`,`./img/none1.png`,`./img/none1.png`,`./img/none1.png`,`./img/none1.png`,`./img/none1.png`,`./img/none1.png`,`./img/none1.png`,`./img/none1.png`,`./img/none1.png`];
        } else {
            for(let i=0;i<data.bannedChampions.length;i++) {
                if(data.bannedChampions[i].championId == -1) {
                    vec.push(`./img/none1.png`);
                } else {
                    vec.push(`http://ddragon.leagueoflegends.com/cdn/${await getLatestVersion()}/img/champion/${(await getChampionByKey(data.bannedChampions[i].championId)).id}.png`); 
                }
            }
            return vec;
        }

    }

    async function bans_champ_title() {
        let vec = [];
        if(data.bannedChampions.length==0) {
            return [`No Ban`,`No Ban`,`No Ban`,`No Ban`,`No Ban`,`No Ban`,`No Ban`,`No Ban`,`No Ban`,`No Ban`];
        } else {
            for(let i=0;i<data.bannedChampions.length;i++) {
                if(data.bannedChampions[i].championId == -1) {
                    vec.push(`No Ban`);
                } else {
                    vec.push(`${(await getChampionByKey(data.bannedChampions[i].championId)).name}`); 
                }
            }
            return vec;
        }

    }

    /*
    function getStatsMode() {
        let vec = [];
        for(let i=0;i<data.participants.length;i++) {
            if(data.participants[i].perks.perkIds[6] == 5005){
                vec.push('./img/public/img/perk-images/StatMods/StatModsAttackSpeedIcon.png');
            } else if(data.participants[i].perks.perkIds[6] == 5008) {
                vec.push('./img/public/img/perk-images/StatMods/StatModsAdaptiveForceIcon.png');
            } else if(data.participants[i].perks.perkIds[6] == 5008) {
                vec.push('./img/public/img/perk-images/StatMods/StatModsAdaptiveForceIcon.png');
            }
        }
    }
    getStatsMode();*/

    async function render_blueTeam() {
        const location_stats = document.querySelector('.liveGame--team--blue');
        
        for(let i = 0; i < data.participants.length-5; i++) {
            function checkNr() {
                if(isNaN((rank[i][3] / (rank[i][3]+rank[i][4])).toFixed(2).toString().substr(-2))) {
                    return '-';
                } else {
                    return (rank[i][3] / (rank[i][3]+rank[i][4])).toFixed(2).toString().substr(-2)+'%';
                }
            }
            location_stats.insertAdjacentHTML('beforeend', `    
                <div class="liveGame--players">
                    <div class="liveGame--players_basic">
                        <div class="liveGame--players-icon liveGame--players-iconBlue"><img src="http://ddragon.leagueoflegends.com/cdn/${await getLatestVersion()}/img/champion/${(await getChampionByKey(data.participants[i].championId)).id}.png" alt="champ"></div> 
                        <div class="liveGame--players-spell">
                            <div class="liveGame--players-spell_1"><img src="http://ddragon.leagueoflegends.com/cdn/${await getLatestVersion()}/img/spell/${await spell(data.participants[i].spell1Id)}.png" alt="spell1"></div>
                            <div class="liveGame--players-spell_2"><img src="http://ddragon.leagueoflegends.com/cdn/${await getLatestVersion()}/img/spell/${await spell(data.participants[i].spell2Id)}.png" alt="spell2"></div>
                        </div>
                        <div class="liveGame--players-runes">
                            <div class="liveGame--players-runes_1"><img src="./img/${(await runes(data.participants[i].perks.perkIds[0], data.participants[i].perks.perkSubStyle))[0]}" alt="runes"></div>
                            <div class="liveGame--players-runes_2"><img src="./img/${(await runes(data.participants[i].perks.perkIds[0], data.participants[i].perks.perkSubStyle))[1]}" alt="runes"></div>
                        </div>
                        <a class="liveGame--players-name" href="${location.origin}/#${getRegion}/${data.participants[i].summonerName}" target='_blank'>${data.participants[i].summonerName}</a>
                    </div>

                    <div class="liveGame--players-rank" title = "${rank[i][2]}LP">
                        <div class="liveGame--players-rank_icon"><img src="./img/${rank[i][0]}.png" alt="rank"></div>
                        <div class="liveGame--players-rank_name"><span>${rank[i][0]} ${rank[i][1]}</span> <span>(${rank[i][2]} LP)</span></div>
                    </div>
                    <div class="liveGame--players-wr"><span style="font-weight: bold">${checkNr()}</span><span class="liveGame--players_matchPlayed">(${rank[i][3]+rank[i][4]} Played)</span></div>
                    <div class="liveGame--players-fullRunes">
                        <button class="btn btn_runes">Runes</button>
                    </div>
                    <div class="liveGame--players-ban">
                        <img src="${(await bans_champ())[i]}" alt="ban" class="img_bans">
                    </div>
                </div>`);
                tippy('[data-tippy-content]', {
                    allowHTML: true,
                });  

                let spell1 = document.querySelectorAll('.liveGame--players-spell_1');

                for(let r = 0; r < spell1.length; r++) {
                    tippy(spell1[r], {
                        content: `${await spell_description(data.participants[r].spell1Id)}`,
                        allowHTML: true,
                    });
                }

                let spell2 = document.querySelectorAll('.liveGame--players-spell_2');

                for(let t = 0; t < spell1.length; t++) {
                    tippy(spell2[t], {
                        content: `${await spell_description(data.participants[t].spell2Id)}`,
                        allowHTML: true,
                    });
                }


                let champ_icon = document.querySelectorAll('.liveGame--players-iconBlue');
                for(let w = 0; w <= champ_icon.length; w++) {
                    tippy(champ_icon[w], {
                        content: (await getChampionByKey(data.participants[w].championId)).name,
                        allowHTML: true,
                    });
                }

                let bans = document.querySelectorAll('.img_bans');
                for(let q =0;q<bans.length;q++) {
                    tippy(bans[q], {
                        content: (await bans_champ_title())[q],
                        allowHTML: true,
                    });
                }


                let rune0 = document.querySelectorAll('.btn_runes');
                
                for(let j = 0; j < rune0.length; j++) {
                    tippy(rune0[j], {
                        content: `<div class="runes_tooltip"><div>${await runesDescription(data.participants[j].perks.perkIds[0])}
                                    ${await runesDescription(data.participants[j].perks.perkIds[1])}
                                    ${await runesDescription(data.participants[j].perks.perkIds[2])}
                                    ${await runesDescription(data.participants[j].perks.perkIds[3])}</div>
                                   
                                    <div>
                                    <div style="display: flex; align-items: center; margin-bottom:10px;"><img src="./img/${(await runes(data.participants[j].perks.perkIds[0], data.participants[j].perks.perkSubStyle))[1]}" style="height:42px; width:42px;"><p>${(await runesDescription_noImg(data.participants[j].perks.perkIds[1],data.participants[j].perks.perkSubStyle))[1]}</p></div>

                                    ${await runesDescription(data.participants[j].perks.perkIds[4])}
                                    ${await runesDescription(data.participants[j].perks.perkIds[5])}
                                    <img src = "./img/perk-images/StatMods/${data.participants[j].perks.perkIds[6]}.png">
                                    <img src = "./img/perk-images/StatMods/${data.participants[j].perks.perkIds[7]}.png">
                                    <img src = "./img/perk-images/StatMods/${data.participants[j].perks.perkIds[8]}.png"></div></div>
                        `,
                        allowHTML: true,
                        placement: 'bottom-end',
                        trigger: 'click',
                        maxWidth: 500,
                    });
                }

        }


    }


    async function render_redTeam() {
        const location_stats = document.querySelector('.liveGame--team--red');


        for(let i = data.participants.length-5; i < data.participants.length; i++) {
            function checkNr() {
                if(isNaN((rank[i][3] / (rank[i][3]+rank[i][4])).toFixed(2).toString().substr(-2))) {
                    return '-';
                } else {
                    return (rank[i][3] / (rank[i][3]+rank[i][4])).toFixed(2).toString().substr(-2)+"%";
                }
            }
            location_stats.insertAdjacentHTML('beforeend', `    
            <div class="liveGame--players">
            <div class="liveGame--players_basic">
                <div class="liveGame--players-icon liveGame--players-iconRed"><img src="http://ddragon.leagueoflegends.com/cdn/${await getLatestVersion()}/img/champion/${(await getChampionByKey(data.participants[i].championId)).id}.png" alt="champ"></div>
                <div class="liveGame--players-spell">
                <div class="liveGame--players-spell_11"><img src="http://ddragon.leagueoflegends.com/cdn/${await getLatestVersion()}/img/spell/${await spell(data.participants[i].spell1Id)}.png" alt="spell1"></div>
                <div class="liveGame--players-spell_22"><img src="http://ddragon.leagueoflegends.com/cdn/${await getLatestVersion()}/img/spell/${await spell(data.participants[i].spell2Id)}.png" alt="spell2"></div>
                </div>
                <div class="liveGame--players-runes" >
                    <div class="liveGame--players-runes_1"><img src="./img/${(await runes(data.participants[i].perks.perkIds[0], data.participants[i].perks.perkSubStyle))[0]}" alt="runes"></div>
                    <div class="liveGame--players-runes_2"><img src="./img/${(await runes(data.participants[i].perks.perkIds[0], data.participants[i].perks.perkSubStyle))[1]}" alt="runes"></div>
                </div>
                <a class="liveGame--players-name" href="${location.origin}/#${getRegion}/${data.participants[i].summonerName}" target='_blank'>${data.participants[i].summonerName}</a>
            </div>

            <div class="liveGame--players-rank" title = "${rank[i][2]}LP">
            <div class="liveGame--players-rank_icon"><img src="./img/${rank[i][0]}.png" alt="rank"></div>
            <div class="liveGame--players-rank_name"><span>${rank[i][0]} ${rank[i][1]}</span> <span>(${rank[i][2]} LP)</span></div>
            </div>
            <div class="liveGame--players-wr"><span style="font-weight: bold">${checkNr()}</span><span class="liveGame--players_matchPlayed">(${rank[i][3]+rank[i][4]} Played)</span></div>
            <div class="liveGame--players-fullRunes">
                <button class="btn btn_runes1">Runes</button>
            </div>
            <div class="liveGame--players-ban">
                <img src="${(await bans_champ())[i]}" alt="ban" class="img_bans">
            </div>
        </>`);

        let spell1 = document.querySelectorAll('.liveGame--players-spell_11');

        for(let r = 0; r < spell1.length; r++) {
            tippy(spell1[r], {
                content: `${(await spell_description(data.participants[r+5].spell1Id))}`,
                allowHTML: true,
            });
        }

        let spell2 = document.querySelectorAll('.liveGame--players-spell_22');

        for(let t = 0; t < spell1.length; t++) {
            tippy(spell2[t], {
                content: `${(await spell_description(data.participants[t+5].spell2Id))}`,
                allowHTML: true,
            });
        }





        let champ_icon = document.querySelectorAll('.liveGame--players-iconRed');
        for(let w = 0; w < champ_icon.length; w++) {
            tippy(champ_icon[w], {
                content: (await getChampionByKey(data.participants[w+5].championId)).name,
                allowHTML: true,
            });
        }

        let bans = document.querySelectorAll('.img_bans');
        for(let q =0;q<bans.length;q++) {
            tippy(bans[q], {
                content: (await bans_champ_title())[q],
                allowHTML: true,
            });
        }

        let rune0 = document.querySelectorAll('.btn_runes1');
        
        for(let j = 0; j < rune0.length; j++) {
            tippy(rune0[j], {
                content: `<div class="runes_tooltip"><div>${await runesDescription(data.participants[j+5].perks.perkIds[0])}
                            ${await runesDescription(data.participants[j+5].perks.perkIds[1])}
                            ${await runesDescription(data.participants[j+5].perks.perkIds[2])}
                            ${await runesDescription(data.participants[j+5].perks.perkIds[3])}</div>
                           

                            <div><div style="display: flex; align-items: center"><img src="./img/${(await runes(data.participants[j+5].perks.perkIds[0], data.participants[j+5].perks.perkSubStyle))[1]}" style="height:42px; width:42px;"><p>${(await runesDescription_noImg(data.participants[j+5].perks.perkIds[1],data.participants[j+5].perks.perkSubStyle))[1]}</p></div>

                            ${await runesDescription(data.participants[j+5].perks.perkIds[4])}
                            ${await runesDescription(data.participants[j+5].perks.perkIds[5])}
                            <img src = "./img/perk-images/StatMods/${data.participants[j+5].perks.perkIds[6]}.png">
                            <img src = "./img/perk-images/StatMods/${data.participants[j+5].perks.perkIds[7]}.png">
                            <img src = "./img/perk-images/StatMods/${data.participants[j+5].perks.perkIds[8]}.png"></div></div>
                `,
                allowHTML: true,
                placement: 'bottom-end',
                trigger: 'click',
                maxWidth: 500,
            });
        }
        }

    }


    const markup = `
   
                    <div class="liveGame_details">
                        <div class="liveGame_details-type">
                            <div class="liveGame_details--type">${await getMatchType(data.gameQueueConfigId)}</div>
                            <div class="liveGame_details--map">${await getMapa(data.mapId)}</div>
                            <div class="liveGame_details--time"><label id="minutes">00</label>:<label id="seconds">00</label></div>
                            
                        </div>
                        <div class="liveGame_details-ban">
                            Bans
                        </div>
                    </div>

                    <div class="liveGame_teams liveGame_blue">
                        <div class="liveGame_blue--team"></div>
                            
                        <div class="liveGame--team liveGame--team--blue">
                                

                        </div>
                    </div>


                    <div class="liveGame_teams liveGame_red">
                        <div class="liveGame_red--team"></div>

                        <div class="liveGame--team liveGame--team--red">


                        </div>
                    </div>
            
    `;

    
       
        location_stats.insertAdjacentHTML('afterbegin', markup);
        render_blueTeam();
        render_redTeam();
        //document.querySelector('.liveGame').innerHTML='';






            
        let timer = msToMin_SecV2(new Date().getTime() - data.gameStartTime);
        console.log(timer);
        let timerVec = timer.split(":");
        console.log(timerVec);
        
        var minutesLabel = document.getElementById("minutes");
        var secondsLabel = document.getElementById("seconds");

        
        minutesLabel.innerHTML = timerVec[0];
        secondsLabel.innerHTML = timerVec[1];
        setInterval(function(){ 
            ++timerVec[1];
            if(timerVec[1]<10) {
                secondsLabel.innerHTML = '0'+timerVec[1];
            } else {
                secondsLabel.innerHTML = timerVec[1];
            }
            

            if(timerVec[1] >= 60) {
                timerVec[1]=00;
                ++timerVec[0];
                if(timerVec[0]<10) {
                    minutesLabel.innerHTML = '0'+timerVec[0];
                } else {
                    minutesLabel.innerHTML = timerVec[0];
                }
                
            }

        }, 1000);
    profile_container.style.cursor='url(https://cur.cursors-4u.net/games/gam-14/gam1340.cur), auto';   
   // const refresh_btn2 = document.querySelector('.refresh_liveGame2');
    //refresh_btn2.classList.remove('hidden');
    liveGameBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M17.91 14c-.478 2.833-2.943 5-5.91 5c-3.308 0-6-2.692-6-6s2.692-6 6-6h2.172l-2.086 2.086L13.5 10.5L18 6l-4.5-4.5l-1.414 1.414L14.172 5H12a8 8 0 0 0 0 16c4.08 0 7.438-3.055 7.93-7h-2.02z"/></svg>
    <p style="font-size: 1.4rem; font-weight: bold;">Refresh</p>
    `;
    liveGameBtn.disabled = false;




}








function renderErrorLiveGame() {
    const location_stats = document.querySelector('.liveGame');
    document.querySelector('.liveGame').classList.remove('hidden');
    document.querySelector('.liveGame').innerHTML='';

    const getRegion = this.window.location.hash.substring(this.window.location.hash.lastIndexOf('#')+1, this.window.location.hash.lastIndexOf('/'));
    
    const markup = `
    <div class="liveGame__error">
        <h2 class="liveGame__error--name">'${decodeURI(this.window.location.hash.slice(1+getRegion.length+1))}' is not in an active game.</h2>
        <h3 class="liveGame__error--name">Please try again later if the summoner is currently in game or just REFRESH the whole page.</h3>
    </div>
    `
    location_stats.insertAdjacentHTML('afterbegin',markup);
    profile_container.style.cursor='url(https://cur.cursors-4u.net/games/gam-14/gam1340.cur), auto'; 
    
    //const refresh_btn1 = document.querySelector('.refresh_liveGame1');
    //refresh_btn1.classList.remove('hidden');
    liveGameBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M17.91 14c-.478 2.833-2.943 5-5.91 5c-3.308 0-6-2.692-6-6s2.692-6 6-6h2.172l-2.086 2.086L13.5 10.5L18 6l-4.5-4.5l-1.414 1.414L14.172 5H12a8 8 0 0 0 0 16c4.08 0 7.438-3.055 7.93-7h-2.02z"/></svg>
    <p style="font-size: 1.4rem; font-weight: bold;">Refresh</p>
    `;
    liveGameBtn.disabled = false;
}

function regionName(input) {
    if(input=='eun1') {
        return 'EUNE';
    } else if(input == 'euw1') {
        return 'EUW';
    } else if(input == 'br1') {
        return 'BR';
    } else if(input == 'jp1') {
        return 'JP';
    } else if(input == 'kr') {
        return 'KR';
    } else if(input == 'la1') {
        return 'LAN';
    } else if(input == 'la2') {
        return 'LAS';
    } else if(input == 'na1') {
        return 'NA';
    } else if(input == 'oc1') {
        return 'OC';
    } else if(input == 'ru') {
        return 'RU';
    } else if(input == 'tr1') {
        return 'TR';
    }
}

function regionNameExtend(input) {
    if(input=='eun1') {
        return '<img src="https://opgg-static.akamaized.net/css3/sprite/images/regionFlag-eune.png" class="profile_container__content_error_region_icon"><p>Europe Nordic & East</p>';
    } else if(input == 'euw1') {
        return '<img src="https://opgg-static.akamaized.net/css3/sprite/images/regionFlag-euw.png" class="profile_container__content_error_region_icon"><p>Europe West</p>';
    } else if(input == 'br1') {
        return '<img src="https://opgg-static.akamaized.net/css3/sprite/images/regionFlag-br.png" class="profile_container__content_error_region_icon"><p>Brazil</p>';
    } else if(input == 'jp1') {
        return '<img src="https://opgg-static.akamaized.net/css3/sprite/images/regionFlag-jp.png" class="profile_container__content_error_region_icon"><p>Japan</p>';
    } else if(input == 'kr') {
        return '<img src="https://opgg-static.akamaized.net/css3/sprite/images/regionFlag-kr.png" class="profile_container__content_error_region_icon"><p>Korea</p>';
    } else if(input == 'la1') {
        return '<img src="https://opgg-static.akamaized.net/css3/sprite/images/regionFlag-lan.png" class="profile_container__content_error_region_icon"><p>LAN</p>';
    } else if(input == 'la2') {
        return '<img src="https://opgg-static.akamaized.net/css3/sprite/images/regionFlag-las.png" class="profile_container__content_error_region_icon"><p>LAS</p>';
    } else if(input == 'na1') {
        return '<img src="https://opgg-static.akamaized.net/css3/sprite/images/regionFlag-na.png" class="profile_container__content_error_region_icon"><p>North America</p>';
    } else if(input == 'oc1') {
        return '<img src="https://opgg-static.akamaized.net/css3/sprite/images/regionFlag-oce.png" class="profile_container__content_error_region_icon"><p>Oceania</p>';
    } else if(input == 'ru') {
        return '<img src="https://opgg-static.akamaized.net/css3/sprite/images/regionFlag-ru.png" class="profile_container__content_error_region_icon"><p>Russia</p>';
    } else if(input == 'tr1') {
        return '<img src="https://opgg-static.akamaized.net/css3/sprite/images/regionFlag-tr.png" class="profile_container__content_error_region_icon"><p>Turkey</p>';
    }
}

async function renderErrorAccount(input,region) {
    document.querySelector('.profile_container__content').classList.add('hidden');
    document.querySelector('.profile_container__content_error').classList.remove('hidden');
    document.querySelector('.profile_container__content_error').innerHTML='';
    const region_vec=['eun1','euw1','na1','br1','la1','la2','oc1','kr','ru','tr1','jp1'];
    

    async function checkPlayerRegion(contRegion) {
        let account_stats = await lolstats_accout(contRegion,input);
        if((account_stats).hasOwnProperty('status') !== true) {
            return `<a href="#${contRegion}/${account_stats.name}" target="_blank">${regionNameExtend(contRegion)} - <img src="http://ddragon.leagueoflegends.com/cdn/11.15.1/img/profileicon/${(account_stats).profileIconId}.png" class="profile_container__content_error_region_icon"> ${(account_stats).name}</a>`;
        } else {
            return `${regionNameExtend(contRegion)}`;
        }
       
    }

    document.querySelector('.profile_container__content_error').insertAdjacentHTML('beforeend', `
    <div class="profile_container__content_error_text">
        <h3>Data not found for <span style="color:rgb(95,158,160);">'${decodeURI(decodeURI(input))}' #${regionName(region)}</span>. Please check spelling or selected region...</h3>
    </div>
    `);

    for(let i=0;i<region_vec.length;i++) {
        document.querySelector('.profile_container__content_error').insertAdjacentHTML('beforeend', `
            <div class="profile_container__content_error_region">
                <p class="profile_container__content_error_region_regions">${await checkPlayerRegion(region_vec[i])}</p>
            </div>
        `);
    }
}



//////////////////////////////////////////////////////////////////////////////////////////////////////




const search_btn__icon = document.querySelector('.search_btn--icon');
const search_btn__loader = document.querySelector('.search_btn--loader');





////////////////////        FUNCTIA MAMA      //////////////////////////////////
console.log(location.origin);

async function getAll(input) {
    try {
        profile_container.style.cursor='wait'; //la inceput pun cursorul de loading

                
        //schimb din iconita de search in loader
        search_btn__icon.classList.add('hidden');
        search_btn__loader.classList.remove('hidden'); 


        let continent;
        const getRegion = this.window.location.hash.substring(this.window.location.hash.lastIndexOf('#')+1, this.window.location.hash.lastIndexOf('/'));  //iau regiunea selectata in hash ul de la site(eune, euw etc...)
        console.log(getRegion);


        //pun fiecare regiune pe continent
        if(getRegion === 'eun1' || getRegion === 'euw1' || getRegion === 'ru' || getRegion === 'tr1') {  
            continent = 'europe';
        }
        if(getRegion === 'br1' || getRegion === 'la1' || getRegion === 'la2' || getRegion === 'na1' || getRegion === 'oc1') {
            continent = 'americas';
        }
        if(getRegion === 'jp1' || getRegion === 'kr') {
            continent = 'asia';
        } 

        

        const cont_details = await lolstats_accout(getRegion,input);  //iau si stochez datele despre cont, dupa regiune si input ul introdus

        if(cont_details.hasOwnProperty('status') == true) {
            renderErrorAccount(input,getRegion);
            toggle_hidden();   //dupa ce se primesc datele la client side, se afiseaza fereastra cu statusurile 
            
        } else {
            document.querySelector('.profile_container__content').classList.remove('hidden');
            document.querySelector('.profile_container__content_error').classList.add('hidden');

            const meciuri = await match_v5_list_by_puuid(continent, cont_details.puuid);  //lista de meciuri

            //const live_match = await liveMatch(getRegion,cont_details.id);  //live match ul
            const rank = await summonerRank(getRegion,cont_details.id); // rank ul 
    
            
            const meciuri_FuLL = []; //vector in care stochez meciurile cu tot cu detalii
            const meciuri_noCustom = [];   //vector CU ULTIMELE 20 MECIURI, FARA CUSTOM URI
            for(let i=0; i<meciuri.length; i++) { 
              meciuri_FuLL.push(await match_v5_game_by_gameID(continent, meciuri[i]));  //aici le stochez
            }
    
            for(let k = 0; k<meciuri_FuLL.length;k++) {
                if(meciuri_FuLL[k].hasOwnProperty('metadata') === true && meciuri_FuLL[k].hasOwnProperty('info') === true) {
                    meciuri_noCustom.push(meciuri_FuLL[k]);  //aici le pun excluzand cele custom
                }
            }
    
            console.log(meciuri_noCustom);
    
     
    
            toggle_hidden();   //dupa ce se primesc datele la client side, se afiseaza fereastra cu statusurile 
    
    
            render_basic_profile_stats(cont_details); //dau render la detalile profilului
            render_rank_profile_stats(rank);  //dau render la rank uri
            
    
            const location_stats = document.querySelector('.profile_container__content__match-history'); //selectez portiunea unde vide match history ul si elimin tot ce pe in ea
            location_stats.innerHTML="";
    
            
    
            for(let j = 0 ;j<meciuri_noCustom.length;j++) {
                render_match(await match_v5_game_by_gameID(continent, meciuri_noCustom[j].metadata.matchId), cont_details.name);  //pentru toate meciurile, fara cele custom, afisez datele (natch history ul)
            }
            render_general_status(meciuri_noCustom,cont_details.name);
            
    
    
            const filter_all = document.querySelector('.general_queue_all');
            filter_all.addEventListener('click',async function() {
                document.querySelector('.profile_container__content__match-history').innerHTML = ""; //golesc pagina si fac curosrul wait
                profile_container.style.cursor='wait';
                for(let j = 0 ;j<meciuri_noCustom.length;j++) {
                    render_match(await match_v5_game_by_gameID(continent, meciuri_noCustom[j].metadata.matchId), cont_details.name);  //pentru toate meciurile, fara cele custom, afisez datele (natch history ul)
                }
                render_general_status(meciuri_noCustom,cont_details.name);
                profile_container.style.cursor='url(https://cur.cursors-4u.net/games/gam-14/gam1340.cur), auto';
            });
    
            async function render_filter(queueType) {
    
                const queueQ = await match_v5_listCustom_by_puuid(continent,cont_details.puuid,queueType); //la click iau ultime N meciuri de ce tip vreau(soloq flex aram etc)
                const queueQ_matchFull=[];
    
    
                document.querySelector('.profile_container__content__match-history').innerHTML = ""; //golesc pagina si fac curosrul wait
                profile_container.style.cursor='wait';
    
                if(queueQ.length == 0) {
                    render_match_error();
                } else {
                    
                    for(let i = 0; i < queueQ.length; i++) {
                        render_match(await match_v5_game_by_gameID(continent, queueQ[i]), cont_details.name);//afisez fiecare meci + stats
                        queueQ_matchFull.push(await match_v5_game_by_gameID(continent, queueQ[i]));
    
                    }
                    render_general_status(queueQ_matchFull,cont_details.name);
    
                    console.log(queueQ_matchFull);
                }
                
    
                
                profile_container.style.cursor='url(https://cur.cursors-4u.net/games/gam-14/gam1340.cur), auto';
            }
    
    
            const filter_solo = document.querySelector('.general_queue_solo');  //btn de soloQ din pagina
            filter_solo.addEventListener('click',function() {
                render_filter(420);
                
            });
    
            const filter_flex = document.querySelector('.general_queue_flex');
            filter_flex.addEventListener('click',function() {
                render_filter(440);
            });
    
            const filter_draft = document.querySelector('.general_queue_draft');
            filter_draft.addEventListener('click',function() {
                render_filter(400);
            });
    
            const filter_blind = document.querySelector('.general_queue_blind');
            filter_blind.addEventListener('click',function() {
                render_filter(430);
            });
    
            const filter_aram = document.querySelector('.general_queue_aram');
            filter_aram.addEventListener('click',function() {
                render_filter(450);
            });
    
            const filter_gameMode = document.querySelector('.general_queue_mode');
            filter_gameMode.addEventListener('click',function() {
                render_filter(1400);
            });
    
    
    
            await render_camph_mastery(getRegion, cont_details.id); //render la champ mastery

            
            
            render_match(await match_v5_game_by_gameID('europe','EUW1_5177838925'), cont_details.name);
        }




        profile_container.style.cursor='url(https://cur.cursors-4u.net/games/gam-14/gam1340.cur), auto';  //la sfarsit dupa ce se incarca toata functia, ii dau cursor default




        console.log(window.performance.timing.domContentLoadedEventEnd- window.performance.timing.navigationStart); //preformance
    }catch(err) {
        console.error(err);
    }
}




const profile_container = document.querySelector('.profile_container');
const background_video = document.querySelector('.bg-video-back');
const btn_close = document.querySelector('.btn_close');

//const refresh_btn1 = document.querySelector('.refresh_liveGame1');
//const refresh_btn2 = document.querySelector('.refresh_liveGame2');




function toggle_hidden() { //functia care face fereastra cu statusurile vizibila / invizibila
    profile_container.classList.remove('hidden');
    //background_video.addEventListener('click',function() {
      //  profile_container.classList.add('hidden');
   // });
    btn_close.addEventListener('click',function() {
        profile_container.classList.add('hidden');
        //history.replaceState(null, null, ' ');
        //refresh_btn1.remove();
        //refresh_btn2.remove();
    });

    //schimb din loader in iconita cand se inchide fereastra
    search_btn__icon.classList.remove('hidden');
    search_btn__loader.classList.add('hidden');
}





input_form.addEventListener('submit', function(e) {
    e.preventDefault();
    if(input_lol.value==='') {
        input_lol.classList.toggle('search_error');
        document.querySelector('.search').classList.toggle('search_place-holder_error');
    } else {

        const getRegion = getSelectedRegion(); //iau regiunea selectata in panoul de option

        window.location.hash = `${getRegion}/${input_lol.value}`;  //cand introduc datele despre cont(numele) in form, se schimba hash ul cu regiunea si numele corespunzator
    }
 });
 

 


window.addEventListener('hashchange', function(e) {  //cand se schimba hash ul, adica exact dupa ce se da submit la form(sau cand il schimbam noi manual)
    e.preventDefault();
    const getRegion = this.window.location.hash.substring(this.window.location.hash.lastIndexOf('#')+1, this.window.location.hash.lastIndexOf('/'));//iau regiunea, adica elemetul cuprins intre # si /
    getAll(encodeURI(this.window.location.hash.slice(1+getRegion.length+1))); //functia cu toate (mama)  //aplez functia mama cu parametrul din hash (numele din hash)   
});



window.addEventListener('load', function(e) { //cand dau copy paste la link in alt tab, sau cand incarc pagina
    e.preventDefault();

    if(this.window.location.hash != '') {
        const getRegion = this.window.location.hash.substring(this.window.location.hash.lastIndexOf('#')+1, this.window.location.hash.lastIndexOf('/'));
        getAll(encodeURI(this.window.location.hash.slice(1+getRegion.length+1))); //functia cu toate (mama)   
    }
   
});


//////////////////////////////////////////////////////////////////////////////////////////













//////////////////////////////////////// LIVE GAME ///////////////////////////////////////

const liveGame = document.querySelector('.liveGame');
const liveGameBtn = document.querySelector('.profile_container__content--btn');

async function liveGame_Match() {

    

     
    let getRegion = window.location.hash.substring(window.location.hash.lastIndexOf('#')+1, window.location.hash.lastIndexOf('/'));

    window.addEventListener('hashchange',function() {
        if(window.location.hash.substring(window.location.hash.lastIndexOf('#')+1, window.location.hash.lastIndexOf('/')) != getRegion) {
            getRegion = window.location.hash.substring(window.location.hash.lastIndexOf('#')+1, window.location.hash.lastIndexOf('/'));
        }
    });

    
    //console.log(getRegion,decodeURI(window.location.hash.slice(1+getRegion.length+1)));

        profile_container.style.cursor='wait';
        liveGameBtn.disabled = true;
        

        console.log('-----------live game---------------');
        

        const live_match = await liveMatch(getRegion,(await lolstats_accout(getRegion,encodeURI(window.location.hash.slice(1+getRegion.length+1)))).id);
        
        liveGame.innerHTML='';
            
        if(live_match.hasOwnProperty('status')) {
            renderErrorLiveGame();
        } else {
            render_liveMatch(live_match);  
        }
    
            


        console.log('-----------live game---------------'); 


    window.addEventListener('hashchange',function() {
       // liveGameBtn.disabled = false;
        liveGame.innerHTML='';
        liveGameBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M21 6h-7.59l3.29-3.29L16 2l-4 4l-4-4l-.71.71L10.59 6H3a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8a2 2 0 0 0-2-2zm0 14H3V8h18v12zM9 10v8l7-4z"/></svg>
        <p>Live Game</p>
        `;
    });
}
liveGameBtn.addEventListener('click', function(){
    liveGame_Match();
});




        
        
///////////////////////////////////////////////////////////////////////////////////////////////














////////////////////        NEWS      //////////////////////////////////




const btn_view_more = document.querySelector('.btn_view_more');
btn_view_more.addEventListener('click',function() {
    news_10.classList.remove('hidden');
    news_11.classList.remove('hidden');
    btn_view_more.classList.add('hidden');
});


///////////////////////////////////////////////////////////////////////////////////////////////////////



















////////////////////        FREE CHAMP ROTATION RENDER / DISPALY      //////////////////////////////////

async function free_to_play_display() {
	//const annie = await getChampionByKey(1, "en_US");
	//const leona = await getChampionByKey(89);
	//const brand = await getChampionByID("ekko");

	//console.log(annie);
	//console.log(leona);
	//console.log(brand);

    
    const free_to_play = document.querySelector('.free_to_play_champs');
    const campioni = [];

    const rotatie_campioni_free = await lolstats_free_champion();


    for(let i = 0; i<= rotatie_campioni_free.freeChampionIds.length; i++) {  //ia array ul cu id campionilor si imi returneaza in vectorul campioni informatiile despre acel campion
        campioni.push(await getChampionByKey(rotatie_campioni_free.freeChampionIds[i]));
    }
    //console.log(campioni[0].id);


    //console.log(campioni);

    for(var i = 0; i < campioni.length-1; i++) {
        free_to_play.insertAdjacentHTML('afterbegin',  `<img src="http://ddragon.leagueoflegends.com/cdn/${await getLatestVersion()}/img/champion/${campioni[i].id}.png" alt="champs" width="60px" data-tippy-content = "${campioni[i].name}">`);  
    }

    tippy('[data-tippy-content]', {   // js library from tooltips, tippy.js
        allowHTML: true,
    });
}
free_to_play_display();

//////////////////////////////////////////////////////////////////////////////////////////////////















