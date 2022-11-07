////IMOPRT////
///Files
    //Import-"constants.js"//
    const con = require("../../constants");
	//Import-"funcrions.js"//
	const fun = require("../../functions");
///API
	//Import-GoogleSheets.api//
	const {google} = require('googleapis');

    
//!pp
exports.pp = (client, channel, userName) => {

    //Authorize-{Sheets}
    con.gsClient.authorize(function(e, tokens){
        if(e){
            console.log(e);
            return;
        } else {
            console.log('Connected to Google-Sheets api.');
            gsrun(con.gsClient);
        }
    });

    //Connect-to-{Sheets}
    async function gsrun(cl){
        const gsapi = google.sheets({version:'v4', auth: cl });

        //Get-{Sheet-Values}
        const [, ...values] = (await gsapi.spreadsheets.values.get({ 
            spreadsheetId: con.botSheet, 
            range: con.ppUserRange
        })).data.values;
        console.log(`Existing Users, Values = ${[values] }`);

        //Search-{userName}-in-{Sheet-Values}
        //Filter-&-Reduce-List-into-One
        const index = values.reduce((o, [a, ...v], i) => ((o[a] = i + 2), o), {});
        console.log(`index[item] = ${index[userName]}`);

        //IF-{userName}-already-exists // 🍆💦 => +0.001 mm
        if (index[userName]){
        console.log(`${userName} already exists.`)
            ///Get-&-update-existing-PP-length
            try{
            //1//Get-existing-PP-length
            const existingValue = await gsapi.spreadsheets.values.get({
                spreadsheetId: con.botSheet,
                range: `!pp!B${index[userName]}`,
            }); 
            const trueValue = existingValue.data.values;
            console.log(`existing value = ${trueValue}`);
            //2//Update-existing-PP-length
            const addedValue =  Number(trueValue) + Number(0.001);
            console.log(`added value = ${addedValue}`);
            const updatedValue = await gsapi.spreadsheets.values.update({
                spreadsheetId: con.botSheet,
                range: `!pp!B${index[userName]}`,
                valueInputOption: "USER_ENTERED",
                resource: { values: [[addedValue]] },
            });
            //3//Reply-to-{userName}
            if (trueValue < 0.254) { //teeny-tiny-🍤
                client.say(channel, `${userName} 🍤💦 => +0.001 mm~!`);
                } else if (trueValue < 2.540) { //teeny-tiny-🍄
                client.say(channel, `${userName} 🍄💦 => +0.001 mm~!`);
                } else if (trueValue < 25.400) { //lit-🥕
                client.say(channel, `${userName} 🥕💦 => +0.001 mm~!`);
                } else if (trueValue < 101.640) { //Asian-🍌
                client.say(channel, `${userName} 🍌💦 => +0.001 mm~!`);
                } else if (trueValue < 152.400) { //🍆
                client.say(channel, `${userName} 🍆💦 => +0.001 mm~!`);
                } else { //🥒-Dong
                client.say(channel, `${userName} 🥒💦 => +0.001 mm~!`);
                }
            } catch(e) {console.error(e);};
        }

        //IF-{userName}-does-not-exist // a NEW 0.001 mm
        else {	
        console.log(`${userName} does not exist.`)

            //1//Add-new-PP
            const updatedValue = await gsapi.spreadsheets.values.append({
                spreadsheetId: con.botSheet,
                range: con.ppUserRange,
                valueInputOption: "USER_ENTERED",
                resource: { values: [[userName, 0.001]] },
            });
            //2//Reply-to-{userName}
            client.say(channel, `Congrats ${userName}! U have grown a NEW 0.001 mm of *inclusive* pp today!`);
        
        }};
        
}

//!checkpp
exports.checkpp = (client, channel, userName) => {

    //Authorize-{Sheets}
    con.gsClient.authorize(function(e, tokens){
        if(e){
            console.log(e);
            return;
        } else {
            console.log('Connected to Google-Sheets api.');
            gsrun(con.gsClient);
        }
    });

    //Connect-to-{Sheets}
    async function gsrun(cl){
        const gsapi = google.sheets({version:'v4', auth: cl });

        //Get-{Sheet-Values}
        const [, ...values] = (await gsapi.spreadsheets.values.get({ 
            spreadsheetId: con.botSheet, 
            range: con.ppUserRange
        })).data.values;
        console.log(`Existing Users, Values = ${[values] }`);

        //Search-{userName}-in-{Sheet-Values}
        //Filter-&-Reduce-List-into-One
        const index = values.reduce((o, [a, ...v], i) => ((o[a] = i + 2), o), {});
        console.log(`index[item] = ${index[userName]}`);


        //IF-{userName}-already-exists // Check-Length
        if (index[userName]){
        console.log(`${userName} already exists.`)
            //Get-&-Convert-existing-PP-length
            try{
            //1//Get-existing-PP-length
            const existingValue = await gsapi.spreadsheets.values.get({
                spreadsheetId: con.botSheet,
                range: `!pp!B${index[userName]}`,
            }); 
            const trueValue = existingValue.data.values;
            console.log(`existing value = ${trueValue}`);
            //2//Reply-{Length}-to-{userName}
            if (trueValue < 0.254) { //teeny-tiny-🍤
            client.say(channel, `${userName} 😩 => ${trueValue} mm teeny-tiny-🍤~!`);
                } else if (trueValue < 2.540) { //teeny-tiny-🍄
                client.say(channel, `${userName} 😩 => ${trueValue} mm teeny-tiny-🍄~!`);
                } else if (trueValue < 25.400) { //lit-🥕
                client.say(channel, `${userName} 😗 => ${trueValue} mm lit-🥕~!`);
                } else if (trueValue < 101.640) { //Asian-🍌
                client.say(channel, `${userName} 😗 => ${trueValue} mm Asian-🍌~!`);
                } else if (trueValue < 152.400) { //🍆
                client.say(channel, `${userName} 😳 => ${trueValue} mm 🍆~!`);
                } else { //🥒-Dong
                client.say(channel, `${userName} 😳 => ${trueValue} mm 🥒-Dong~!`);
                }
            } catch(e) {console.error(e);};
        } 

        //IF-{userName}-does-not-exist // a NEW 0.001 mm
        else {

        console.log(`${userName} does not exist.`)
            //1//Reply-to-{userName}
            client.say(channel, `😔 ${userName}, U got no *inclusive* pp, Get urs today with !pp`);
	    
        }};
    
}

//!checkppin
exports.checkppin = (client, channel, userName) => {

    //Authorize-{Sheets}
    con.gsClient.authorize(function(e, tokens){
        if(e){
            console.log(e);
            return;
        } else {
            console.log('Connected to Google-Sheets api.');
            gsrun(con.gsClient);
        }
    });

    //Connect-to-{Sheets}
    async function gsrun(cl){
        const gsapi = google.sheets({version:'v4', auth: cl });

        //Get-{Sheet-Values}
        const [, ...values] = (await gsapi.spreadsheets.values.get({ 
            spreadsheetId: con.botSheet, 
            range: con.ppUserRange
        })).data.values;
        console.log(`Existing Users, Values = ${[values] }`);

        //Search-{userName}-in-{Sheet-Values}
        //Filter-&-Reduce-List-into-One
        const index = values.reduce((o, [a, ...v], i) => ((o[a] = i + 2), o), {});
        console.log(`index[item] = ${index[userName]}`);


        //IF-{userName}-already-exists // Check-Length
        if (index[userName]){
        console.log(`${userName} already exists.`)
            //Get-&-Convert-existing-PP-length
            try{
            //1//Get-existing-PP-length
            const existingValue = await gsapi.spreadsheets.values.get({
                spreadsheetId: con.botSheet,
                range: `!pp!B${index[userName]}`,
            }); 
            const trueValue = existingValue.data.values;
            const inchValue = existingValue.data.values * 0.0393701;
            const decimalValue = inchValue.toFixed(3);
            console.log(`existing value = ${decimalValue}`);
            //2//Reply-{Length}-to-{userName}
            if (trueValue < 0.254) { //teeny-tiny-🍤
            client.say(channel, `${userName} 😩 => ${decimalValue} inch teeny-tiny-🍤~!`);
                } else if (trueValue < 2.540) { //teeny-tiny-🍄
                client.say(channel, `${userName} 😩 => ${decimalValue} inch teeny-tiny-🍄~!`);
                } else if (trueValue < 25.400) { //lit-🥕
                client.say(channel, `${userName} 😗 => ${decimalValue} inch lit-🥕~!`);
                } else if (trueValue < 101.640) { //Asian-🍌
                client.say(channel, `${userName} 😗 => ${decimalValue} inch Asian-🍌~!`);
                } else if (trueValue < 152.400) { //🍆
                client.say(channel, `${userName} 😳 => ${decimalValue} inch 🍆~!`);
                } else { //🥒-Dong
                client.say(channel, `${userName} 😳 => ${decimalValue} inch 🥒-Dong~!`);
                }
            } catch(e) {console.error(e);};
        } 

        //IF-{userName}-does-not-exist // a NEW 0.001 mm
        else {

        console.log(`${userName} does not exist.`)
            //1//Reply-to-{userName}
            client.say(channel, `😔 ${userName}, U got no *inclusive* pp, Get urs today with !pp`);
	    
        }};
    
}

//!viagra
exports.viagra = (client, channel, userName) => {

    //Authorize-{Sheets}
    con.gsClient.authorize(function(e, tokens){
        if(e){
            console.log(e);
            return;
        } else {
            console.log('Connected to Google-Sheets api.');
            gsrun(con.gsClient);
        }
    });

    //Connect-to-{Sheets}
    async function gsrun(cl){
        const gsapi = google.sheets({version:'v4', auth: cl });

        //Get-{Sheet-Values}
        const [, ...values] = (await gsapi.spreadsheets.values.get({ 
            spreadsheetId: con.botSheet, 
            range: con.ppUserRange
        })).data.values;
        console.log(`Existing Users, Values = ${[values] }`);

        //Search-{userName}-in-{Sheet-Values}
        //Filter-&-Reduce-List-into-One
        const index = values.reduce((o, [a, ...v], i) => ((o[a] = i + 2), o), {});
        console.log(`index[item] = ${index[userName]}`);

        //IF-{userName}-already-exists // 🍆💦 => +0.001 mm
        if (index[userName]){
        console.log(`${userName} already exists.`)
            ///Get-&-update-existing-PP-length
            try{
            //1//Get-existing-PP-length
            const existingValue = await gsapi.spreadsheets.values.get({
                spreadsheetId: con.botSheet,
                range: `!pp!B${index[userName]}`,
            }); 
            const trueValue = existingValue.data.values;
            console.log(`existing value = ${trueValue}`);
            //2//Update-existing-PP-length
            const randomValue =  fun.between(0.001, 0.100, 3);
            console.log(`random value = ${randomValue}`);
            const addedValue =  Number(trueValue) + Number(randomValue);
            const updatedValue = await gsapi.spreadsheets.values.update({
                spreadsheetId: con.botSheet,
                range: `!pp!B${index[userName]}`,
                valueInputOption: "USER_ENTERED",
                resource: { values: [[addedValue]] },
            });
            //3//Reply-to-{userName}
            if (addedValue < 0.254) { //teeny-tiny-🍤
                client.say(channel, `${userName} 💊 => 💪🍤💦 => + ${randomValue} mm~`);
                } else if (addedValue < 2.540) { //teeny-tiny-🍄
                client.say(channel, `${userName} 💊 => 💪🍄💦 => + ${randomValue} mm~`);
                } else if (addedValue < 25.400) { //lit-🥕
                client.say(channel, `${userName} 💊 => 💪🥕💦 => + ${randomValue} mm~`);
                } else if (addedValue < 101.640) { //Asian-🍌
                client.say(channel, `${userName} 💊 => 💪🍌💦 => + ${randomValue} mm~`);
                } else if (addedValue < 152.400) { //🍆
                client.say(channel, `${userName} 💊 => 💪🍆💦 => + ${randomValue} mm~`);
                } else { //🥒-Dong
                client.say(channel, `${userName} 💊 => 💪🥒💦 => + ${randomValue} mm~`);
                }
            } catch(e) {console.error(e);};
        }

        //IF-{userName}-does-not-exist // a NEW 0.001 mm
        else {	
        console.log(`${userName} does not exist.`)

            //1//Add-new-PP
            const updatedValue = await gsapi.spreadsheets.values.append({
                spreadsheetId: con.botSheet,
                range: con.ppUserRange,
                valueInputOption: "USER_ENTERED",
                resource: { values: [[userName, 0.001]] },
            });
            //2//Reply-to-{userName}
            client.say(channel, `Congrats ${userName}! U have grown a NEW 0.001 mm of *inclusive* pp today!`);
        
        }};
        
}