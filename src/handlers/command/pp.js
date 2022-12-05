////IMOPRT////
///Files
    //Import-"constants.js"//
    const con = require("../../constants");
	//Import-"funcrions.js"//
	const fun = require("../../functions");
///API
	//Import-GoogleSheets.api//
	const {google} = require('googleapis');

//logger
exports.logger = (client, channel, userName) => {

    //Authorize-{Sheets}
	con.gsClient.authorize(function(e, tokens){
		if(e){
			console.log(e);
			return;
		} else {
			//console.log('Connected to Google-Sheets api.');
			gsrun(con.gsClient);
		}
	});

	//Connect-to-{Sheets}-Logger
	async function gsrun(cl){

        const channelValue = `${channel}`;
        const channelName = channelValue.substring(1);

		const gsapi = google.sheets({version:'v4', auth: cl });
		//Get-{Sheet-Values}-in-[Data-joinChannel]
		const [,...values] = (await gsapi.spreadsheets.values.get({ 
			spreadsheetId: con.botSheet, 
			range: con.loggerRange
		})).data.values;

		//Search-{userName}-in-{Sheet-Values}-in-[Data-joinChannel]
		//Filter-&-Reduce-List-into-One
		const index = values.reduce((o, [a, ...v], i) => ((o[a] = i), o), {});
		//console.log(`index[item] = ${index[channelName]}`);

		//IF-{userName}-already-exists // Find-&-Excecute-[Logger.exe]
		if (index[channelName] >= 0){
		//console.log(`${userName} already exists.`)
			///Logger.exe
			try{
			//1//Get-existing-Logger-Settings-in-[Data-joinChannel]
			const adjustedIndex = index[channelName] + 3;
			const existingValue = await gsapi.spreadsheets.values.get({
				spreadsheetId: con.botSheet,
				range: `Data-joinChannel!C${adjustedIndex}`,
			});
			const trueValue = existingValue.data.values;
			//2//IF-"TRUE"-run-Logger.exe
			if (trueValue == "TRUE"){
				//Authorize-{Sheets}-Logger
				con.gsClient.authorize(function(e, tokens){
					if(e){
						console.log(e);
						return;
					} else {
						//console.log('Connected to Google-Sheets api.');
						gsrun(con.gsClient);
					}
				});
				//Connect-to-{Sheets}-Logger
				async function gsrun(cl){

					const gsapi = google.sheets({version:'v4', auth: cl });

					//Get-{Sheet-Values}-in-[Data-crew]
					const [, ...values] = (await gsapi.spreadsheets.values.get({ 
						spreadsheetId: con.botSheet, 
						range: con.twitchIdRange
					})).data.values;
					//console.log(`Existing Users, Values = ${[values]}`);

					//1//Search-{userName}-in-{Sheet-Values}-in-[Data-crew]
					//Filter-&-Reduce-List-into-One
                    const index = values.reduce((o, [a, ...v], i) => ((o[a] = i), o), {});
                    //console.log(`index[item] = ${index[userName]}`);
                    const [, ...ppvalues] = (await gsapi.spreadsheets.values.get({ 
						spreadsheetId: con.botSheet, 
						range: con.ppUserRange
					})).data.values;
					//console.log(`Existing Users, Values = ${[values]}`);

					//2//Search-{userName}-in-{Sheet-Values}-in-[Data-crew]
					//Filter-&-Reduce-List-into-One
                    const ppindex = ppvalues.reduce((o, [a, ...v], i) => ((o[a] = i), o), {});
                    //console.log(`index[item] = ${index[userName]}`);
                    const testIndex = index[userName] + 1;
                    //console.log(testIndex);

					//2//IF-{userName}-already-exists // Welcome-Back-{userName}!
					if (testIndex>0){
						
						console.log(`////////// Logger.exe: Welcome back ${userName} //////////`)
						///Get-Badge-&-Greet-{userName}
						try{

                            //1//Adjust-Row-Index
                            const adjustedBadgeIndex = index[userName] + 4;
                            const adjustedPPIndex = ppindex[userName] + 3;
                            //console.log(`Adjusted value = ${adjustedPPIndex}`);
                            //2//Get-existing-[userBadge]
                            const existingUserBadge = await gsapi.spreadsheets.values.get({
                                spreadsheetId: con.botSheet,
                                range: `Data-crew!B${adjustedBadgeIndex}`,
                            });
                            const trueUserBadge = existingUserBadge.data.values;
                            ///console.log(trueUserBadge);
                            //3//Get-existing-[ppBadge]
                            ///console.log(adjustedPPIndex);
                            if (adjustedPPIndex>0){
                                const existingPPBadge = await gsapi.spreadsheets.values.get({
                                    spreadsheetId: con.botSheet,
                                    range: `Data-!pp!D${adjustedPPIndex}`,
                                });
                                const truePPBadge = existingPPBadge.data.values;
                                console.log(truePPBadge);
                            //4//Reply-to-{userName}
                                client.say(channel, `Welcome~ ${userName} ${trueUserBadge}${truePPBadge}`);
                            } else {
                            //4//Reply-to-{userName}
                                client.say(channel, `Welcome~ ${userName} ${trueUserBadge}💕`);
                            }
						} catch(e) {console.error(e);};

					}

					//3//IF-{userName}-does-not-exist // Add-new-{userName}-&-Welcome!
					else {	

						console.log(`${userName} does not exist.`)
						//1//Get-existing-Index-No.
						const [, ...existingValue]  = (await gsapi.spreadsheets.values.get({
							spreadsheetId: con.botSheet,
							range: `Data-crew!A3:A`,
						})).data.values;
						//2//Find-Max-&-Add-Index-No.
						const maxValue = Math.max(...existingValue);
						const addedValue = maxValue + 1;
						//3//Add-new-{userName}
						const updatedValue = await gsapi.spreadsheets.values.append({
							spreadsheetId: con.botSheet,
							range: con.twitchIdRange,
							valueInputOption: "USER_ENTERED",
							resource: { values: [[`${addedValue}`,'👨‍🚀',userName, ,'FALSE','FALSE','FALSE']] },
						});
						//4//Reply-to-{userName}
						client.say(channel, `Welcome to xLi🚀 ${userName} ! Hope u enjoy ur stay 👨‍🚀 ~💜`);
					
					};

				};
			} else return;
			} catch(e) {console.error(e);};
		}

		//IF-{userName}-does-not-exist // Do-Nothing
		else return;
		
	}

}

////COMMANDS////
//!pp
exports.pp = (client, channel, userName) => {

    //Authorize-{Sheets}
	con.gsClient.authorize(function(e, tokens){
		if(e){
			console.log(e);
			return;
		} else {
			//console.log('Connected to Google-Sheets api.');
			gsrun(con.gsClient);
		}
	});

	//Connect-to-{Sheets}
	async function gsrun(cl){

		const gsapi = google.sheets({version:'v4', auth: cl });
		//Get-{Sheet-Values}-in-[Data-crew]
		const [,...values] = (await gsapi.spreadsheets.values.get({ 
			spreadsheetId: con.botSheet, 
			range: con.twitchIdRange
		})).data.values;

		//Search-{userName}-in-{Sheet-Values}-in-[Data-crew]
		//Filter-&-Reduce-List-into-One
		const index = values.reduce((o, [a, ...v], i) => ((o[a] = i), o), {});
		//console.log(`User[Index] = ${index[userName]}`);

		//IF-{userName}-exists-in-[Data-crew] // Find-&-Excecute-[!pp]
		if (index[userName] >= 0){
		//console.log(`${userName} already exists.`)
			///!pp
			try{
			//1//Get-existing-[!ppValue]-in-[Data-crew]
			const adjustedIndex = index[userName] + 4;
			const existingValue = await gsapi.spreadsheets.values.get({
				spreadsheetId: con.botSheet,
				range: `Data-crew!G${adjustedIndex}`,
			});
			const trueValue = existingValue.data.values.flat();
            console.log(trueValue);
			//2//IF-"TRUE"-run-!pp
			if (trueValue == "TRUE"){

                //Authorize-{Sheets}
                con.gsClient.authorize(function(e, tokens){
                    if(e){
                        console.log(e);
                        return;
                    } else {
                        //console.log('Connected to Google-Sheets api.');
                        gsrun(con.gsClient);
                    }
                });

                //Connect-to-{Sheets}
                async function gsrun(cl){

                    const gsapi = google.sheets({version:'v4', auth: cl });

                    //Get-{Sheet-Values}-in-[Data-!pp]
                    const [, ...values] = (await gsapi.spreadsheets.values.get({ 
                        spreadsheetId: con.botSheet, 
                        range: con.ppUserRange
                    })).data.values;

                    //Search-{userName}-in-[Data-!pp]
                    //Filter-&-Reduce-List-into-One
                    const index = values.reduce((o, [a, ...v], i) => ((o[a] = i), o), {});
                    //console.log(`pp[User] = ${index[userName]}`);

                    //IF-{userName}-already-exists // 🍆💦 => +0.001 mm
                    if (index[userName] >= 0){

                        console.log(`${userName} got PP`)
                        ///Get-&-update-existing-PP-length
                        try{
                        //1//Get-existing-PP-length
                            const adjustedIndex = index[userName] + 3;
                            const existingValue = await gsapi.spreadsheets.values.get({
                                spreadsheetId: con.botSheet,
                                range: `Data-!pp!C${adjustedIndex}`,
                            });
                            const trueValue = existingValue.data.values;
                            //console.log(`existing value = ${trueValue}`);
                        //2//Update-existing-PP-length
                            const addedValue =  Number(trueValue) + Number(0.001);
                            console.log(`added value = ${addedValue}`);
                            const updatedValue = await gsapi.spreadsheets.values.update({
                                spreadsheetId: con.botSheet,
                                range: `Data-!pp!C${adjustedIndex}`,
                                valueInputOption: "USER_ENTERED",
                                resource: { values: [[addedValue]] },
                            });
                        //3//Adjust-Row-Index
                            const adjustedPPIndex = index[userName] + 3;
                            //console.log(`Adjusted value = ${adjustedPPIndex}`);
                        //4//Get-existing-[ppBadge]
                            const existingPPBadge = await gsapi.spreadsheets.values.get({
                                spreadsheetId: con.botSheet,
                                range: `Data-!pp!D${adjustedPPIndex}`,
                            });
                            const truePPBadge = existingPPBadge.data.values;
                        //5//Reply-to-{userName}
                            client.say(channel, `${userName} ${truePPBadge}💦 => +0.001 mm`);
                        } catch(e) {console.error(e);};

                    }

                    //IF-{userName}-does-not-exist // a NEW 0.001 mm
                    else {	
                    console.log(`${userName} pp not found`)

                        //1//Reply-to-{userName}
                        client.say(channel, `Err 404: ${userName} 's pp not found.. !checkpp`);
                    
                    };
                };

			} 
			//3//IF-"FALSE"-Err-Reply
            else {

                client.say(channel, `⛔ ERROR-PP-404 ⛔ ${userName} => !checkpp`);
            
            };
			} catch(e) {console.error(e);};
		}

		//IF-{userName}-does-not-exist // Do-Nothing
		else return;
		
	}
        
}

//!checkpp
exports.checkpp = (client, channel, userName) => {

    //Authorize-{Sheets}
    con.gsClient.authorize(function(e, tokens){
        if(e){
            console.log(e);
            return;
        } else {
            //console.log('Connected to Google-Sheets api.');
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
        const index = values.reduce((o, [a, ...v], i) => ((o[a] = i), o), {});
        console.log(`index[item] = ${index[userName]}`);
        const testIndex = index[userName] + 1;
        //console.log(testIndex);

        //IF-{userName}-already-exists // Check-Length
        if (testIndex>0){

            console.log(`${userName} already exists.`)
            //Get-&-Convert-existing-PP-length
            try{

            //1//Get-existing-PP-length
                const adjustedIndex = index[userName] + 3;
                const existingValue = await gsapi.spreadsheets.values.get({
                    spreadsheetId: con.botSheet,
                    range: `Data-!pp!C${adjustedIndex}`,
                });
                const trueValue = existingValue.data.values;
                //console.log(`existing value = ${trueValue}`);
            //4//Get-existing-[ppBadge]
                const adjustedPPIndex = index[userName] + 3;
                //console.log(`Adjusted value = ${adjustedPPIndex}`);
                const existingPPBadge = await gsapi.spreadsheets.values.get({
                    spreadsheetId: con.botSheet,
                    range: `Data-!pp!D${adjustedPPIndex}`,
                });
                const truePPBadge = existingPPBadge.data.values;
            //2//Reply-{Length}-to-{userName}
                if (trueValue < 0.254) { //teeny-tiny-🍤
                    client.say(channel, `${userName} 😩 => ${trueValue} mm teeny-tiny-🍤~`);
                } else if (trueValue < 2.540) { //teeny-tiny-🍄
                    client.say(channel, `${userName} 😩 => ${trueValue} mm teeny-tiny-${truePPBadge}~`);
                } else if (trueValue < 25.400) { //lit-🥕
                    client.say(channel, `${userName} 😗 => ${trueValue} mm lit-${truePPBadge}~`);
                } else if (trueValue < 101.640) { //Asian-🍌
                    client.say(channel, `${userName} 😗 => ${trueValue} mm Asian-${truePPBadge}~`);
                } else if (trueValue < 152.400) { //🍆
                    client.say(channel, `${userName} 😳 => ${trueValue} mm ${truePPBadge}~`);
                } else { //🥒-Dong
                    client.say(channel, `${userName} 😳 => ${trueValue} mm ${truePPBadge}-Dong~`);
                }

            } catch(e) {console.error(e);};

        } 

        //IF-{userName}-does-not-exist // a NEW PP
        else {

            console.log(`${userName} does not exist.`)
        //1//Get-{Sheet-Values}-in-[Data-crew]
            const [, ...values] = (await gsapi.spreadsheets.values.get({ 
                spreadsheetId: con.botSheet, 
                range: con.twitchIdRange
            })).data.values;

        //2//Search-{userName}-in-[Data-!pp]
            //Filter-&-Reduce-List-into-One
            const index = values.reduce((o, [a, ...v], i) => ((o[a] = i), o), {});
            //console.log(`pp[User] = ${index[userName]}`);

        //IF-{userName}-already-exists // !pp // FALSE => TRUE
            if (index[userName] >= 0){

                console.log(`${userName} is a cew~!`)
                ///Update-existing-[!pp]-Setting-&-ADD-NEW
                try{

                    //1//Get-existing-Index-No.
                        const [, ...existingValue]  = (await gsapi.spreadsheets.values.get({
                            spreadsheetId: con.botSheet,
                            range: `Data-!pp!A2:A`,
                        })).data.values;
                    //2//Find-Max-&-Add-Index-No.
                        const maxValue = Math.max(...existingValue);
                        const addedIndexValue = maxValue + 1;
                    //3//Add-new-{userName}
                        const updatedPPValue = await gsapi.spreadsheets.values.append({
                            spreadsheetId: con.botSheet,
                            range: con.ppUserRange,
                            valueInputOption: "USER_ENTERED",
                            resource: { values: [[`${addedIndexValue}`, ,Number(0.001), ,Number(0), ,Number(0)]] },
                        });
                    //4//Update-existing-[!pp]-Setting
                        const adjustedIndex = index[userName] + 4;
                        const addedValue =  "TRUE";
                        //console.log(`added value = ${addedValue}`);
                        const updatedValue = await gsapi.spreadsheets.values.update({
                            spreadsheetId: con.botSheet,
                            range: `Data-crew!G${adjustedIndex}`,
                            valueInputOption: "USER_ENTERED",
                            resource: { values: [[addedValue]] },
                        });
                    //5//Reply-to-{userName}
                        client.say(channel, `WOW ${userName} U have grown a NEW *inclusive* pp 🍤~`);

                    } catch(e) {console.error(e);};

                }

            //IF-{userName}-does-not-exist // is not a crew~!
            else {	
            console.log(`${userName} is not a crew~!`)
            };

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
            //console.log('Connected to Google-Sheets api.');
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
        const index = values.reduce((o, [a, ...v], i) => ((o[a] = i), o), {});
        console.log(`index[item] = ${index[userName]}`);
        const testIndex = index[userName] + 1;
        //console.log(testIndex);

        //IF-{userName}-already-exists // Check-Length
        if (testIndex>0){

            console.log(`${userName} already exists.`)
            //Get-&-Convert-existing-PP-length
            try{

            //1//Get-existing-PP-length
                const adjustedIndex = index[userName] + 3;
                const existingValue = await gsapi.spreadsheets.values.get({
                    spreadsheetId: con.botSheet,
                    range: `Data-!pp!C${adjustedIndex}`,
                });
                const decimalValue = existingValue.data.values;
                const inchValue = existingValue.data.values * 0.0393701;
                const trueValue = inchValue.toFixed(3);
                //console.log(`existing value = ${decimalValue}`);
                //console.log(`existing value = ${trueValue}`);
            //4//Get-existing-[ppBadge]
                const adjustedPPIndex = index[userName] + 3;
                //console.log(`Adjusted value = ${adjustedPPIndex}`);
                const existingPPBadge = await gsapi.spreadsheets.values.get({
                    spreadsheetId: con.botSheet,
                    range: `Data-!pp!D${adjustedPPIndex}`,
                });
                const truePPBadge = existingPPBadge.data.values;
            //2//Reply-{Length}-to-{userName}
                if (trueValue < 0.01) { //teeny-tiny-🍤
                    client.say(channel, `${userName} 😩 => ${trueValue} in teeny-tiny-🍤~`);
                } else if (trueValue < 0.1) { //teeny-tiny-🍄
                    client.say(channel, `${userName} 😩 => ${trueValue} in teeny-tiny-${truePPBadge}~`);
                } else if (trueValue < 1) { //lit-🥕
                    client.say(channel, `${userName} 😗 => ${trueValue} in lit-${truePPBadge}~`);
                } else if (trueValue < 4) { //Asian-🍌
                    client.say(channel, `${userName} 😗 => ${trueValue} in Asian-${truePPBadge}~`);
                } else if (trueValue < 6) { //🍆
                    client.say(channel, `${userName} 😳 => ${trueValue} in ${truePPBadge}~`);
                } else { //🥒-Dong
                    client.say(channel, `${userName} 😳 => ${trueValue} in ${truePPBadge}-Dong~`);
                }

            } catch(e) {console.error(e);};

        } 

        //IF-{userName}-does-not-exist // a NEW PP
        else {

            console.log(`${userName} does not exist.`)
        //1//Get-{Sheet-Values}-in-[Data-crew]
            const [, ...values] = (await gsapi.spreadsheets.values.get({ 
                spreadsheetId: con.botSheet, 
                range: con.twitchIdRange
            })).data.values;

        //2//Search-{userName}-in-[Data-!pp]
            //Filter-&-Reduce-List-into-One
            const index = values.reduce((o, [a, ...v], i) => ((o[a] = i), o), {});
            //console.log(`pp[User] = ${index[userName]}`);

        //IF-{userName}-already-exists // !pp // FALSE => TRUE
            if (index[userName] >= 0){

                console.log(`${userName} is a cew~!`)
                ///Update-existing-[!pp]-Setting-&-ADD-NEW
                try{

                    //1//Get-existing-Index-No.
                        const [, ...existingValue]  = (await gsapi.spreadsheets.values.get({
                            spreadsheetId: con.botSheet,
                            range: `Data-!pp!A2:A`,
                        })).data.values;
                    //2//Find-Max-&-Add-Index-No.
                        const maxValue = Math.max(...existingValue);
                        const addedIndexValue = maxValue + 1;
                    //3//Add-new-{userName}
                        const updatedPPValue = await gsapi.spreadsheets.values.append({
                            spreadsheetId: con.botSheet,
                            range: con.ppUserRange,
                            valueInputOption: "USER_ENTERED",
                            resource: { values: [[`${addedIndexValue}`, ,Number(0.001), ,Number(0), ,Number(0)]] },
                        });
                    //4//Update-existing-[!pp]-Setting
                        const adjustedIndex = index[userName] + 4;
                        const addedValue =  "TRUE";
                        //console.log(`added value = ${addedValue}`);
                        const updatedValue = await gsapi.spreadsheets.values.update({
                            spreadsheetId: con.botSheet,
                            range: `Data-crew!G${adjustedIndex}`,
                            valueInputOption: "USER_ENTERED",
                            resource: { values: [[addedValue]] },
                        });
                    //5//Reply-to-{userName}
                        client.say(channel, `WOW ${userName} U have grown a NEW *inclusive* pp 🍤~`);

                    } catch(e) {console.error(e);};

                }

            //IF-{userName}-does-not-exist // is not a crew~!
            else {	
            console.log(`${userName} is not a crew~!`)
            };

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
			//console.log('Connected to Google-Sheets api.');
			gsrun(con.gsClient);
		}
	});

	//Connect-to-{Sheets}
	async function gsrun(cl){

		const gsapi = google.sheets({version:'v4', auth: cl });
		//Get-{Sheet-Values}-in-[Data-crew]
		const [,...values] = (await gsapi.spreadsheets.values.get({ 
			spreadsheetId: con.botSheet, 
			range: con.twitchIdRange
		})).data.values;

		//Search-{userName}-in-{Sheet-Values}-in-[Data-crew]
		//Filter-&-Reduce-List-into-One
		const index = values.reduce((o, [a, ...v], i) => ((o[a] = i), o), {});
		//console.log(`User[Index] = ${index[userName]}`);

		//IF-{userName}-exists-in-[Data-crew] // Find-&-Excecute-[!pp]
		if (index[userName] >= 0){
		//console.log(`${userName} already exists.`)
			///!pp
			try{

                //1//Get-existing-[!ppValue]-in-[Data-crew]
                const adjustedIndex = index[userName] + 4;
                const existingValue = await gsapi.spreadsheets.values.get({
                    spreadsheetId: con.botSheet,
                    range: `Data-crew!G${adjustedIndex}`,
                });
                const trueValue = existingValue.data.values.flat();
                console.log(trueValue);
                //2//IF-"TRUE"-run-!pp
                if (trueValue == "TRUE"){

                    //Authorize-{Sheets}
                    con.gsClient.authorize(function(e, tokens){
                        if(e){
                            console.log(e);
                            return;
                        } else {
                            //console.log('Connected to Google-Sheets api.');
                            gsrun(con.gsClient);
                        }
                    });

                    //Connect-to-{Sheets}
                    async function gsrun(cl){

                        const gsapi = google.sheets({version:'v4', auth: cl });

                        //Get-{Sheet-Values}-in-[Data-!pp]
                        const [, ...values] = (await gsapi.spreadsheets.values.get({ 
                            spreadsheetId: con.botSheet, 
                            range: con.ppUserRange
                        })).data.values;

                        //Search-{userName}-in-[Data-!pp]
                        //Filter-&-Reduce-List-into-One
                        const index = values.reduce((o, [a, ...v], i) => ((o[a] = i), o), {});
                        //console.log(`pp[User] = ${index[userName]}`);

                        //IF-{userName}-already-exists // 🍆💦 => +0.001 mm
                        if (index[userName] >= 0){

                            console.log(`${userName} got PP`)
                            ///Get-&-update-existing-PP-length
                            try{

                            //1//Get-existing-PP-length
                                const adjustedIndex = index[userName] + 3;
                                const existingValue = await gsapi.spreadsheets.values.get({
                                    spreadsheetId: con.botSheet,
                                    range: `Data-!pp!C${adjustedIndex}`,
                                });
                                const trueValue = existingValue.data.values;
                                //console.log(`existing value = ${trueValue}`);
                            //2//Update-existing-PP-length
                                const randomValue =  fun.between(0.001, 0.500, 3);
                                //console.log(`random value = ${randomValue}`);
                                const addedValue =  Number(trueValue) + Number(randomValue);
                                const updatedValue = await gsapi.spreadsheets.values.update({
                                    spreadsheetId: con.botSheet,
                                    range: `Data-!pp!C${adjustedIndex}`,
                                    valueInputOption: "USER_ENTERED",
                                    resource: { values: [[addedValue]] },
                                });
                            //3//Adjust-Row-Index
                                const adjustedPPIndex = index[userName] + 3;
                                //console.log(`Adjusted value = ${adjustedPPIndex}`);
                            //4//Get-existing-[ppBadge]
                                const existingPPBadge = await gsapi.spreadsheets.values.get({
                                    spreadsheetId: con.botSheet,
                                    range: `Data-!pp!D${adjustedPPIndex}`,
                                });
                                const truePPBadge = existingPPBadge.data.values;
                            //5//Get-existing-[viagraBadge]
                                const existingViagraBadge = await gsapi.spreadsheets.values.get({
                                    spreadsheetId: con.botSheet,
                                    range: `Data-!pp!F${adjustedPPIndex}`,
                                });
                                const trueViagraBadge = existingViagraBadge.data.values;
                            //6//Get-existing-[jailCount]
                                const existingVcountValue = await gsapi.spreadsheets.values.get({
                                    spreadsheetId: con.botSheet,
                                    range: `Data-!pp!E${adjustedIndex}`,
                                });
                                const trueVcountValue = existingVcountValue.data.values;
                                //console.log(`existing value = ${trueValue}`);
                            //7//Update-existing-[jailCount]
                                const addedVcountValue =  Number(trueVcountValue) + Number(1);
                                //console.log(`added value = ${addedVcountValue}`);
                                const updatedVcountValue = await gsapi.spreadsheets.values.update({
                                    spreadsheetId: con.botSheet,
                                    range: `Data-!pp!E${adjustedIndex}`,
                                    valueInputOption: "USER_ENTERED",
                                    resource: { values: [[addedVcountValue]] },
                                });
                            //8//Reply-to-{userName}
                                client.say(channel, `${userName} ${trueViagraBadge}=> 💪${truePPBadge}💦=> +${randomValue} mm`);

                            } catch(e) {console.error(e);};

                        }

                        //IF-{userName}-does-not-exist // a NEW 0.001 mm
                        else {	

                            console.log(`${userName} pp not found`)
                            //1//Reply-to-{userName}
                            client.say(channel, `Err 404: ${userName} 's pp not found.. !checkpp`);
                        
                        };
                    };

                } 
                //3//IF-"FALSE"-Err-Reply
                else {

                    client.say(channel, `⛔ ERROR-PP-404 ⛔ ${userName} => !checkpp`);
                
                };

			} catch(e) {console.error(e);};
		}

		//IF-{userName}-does-not-exist // Do-Nothing
		else return;
		
	}
        
}

//!ppfight
exports.ppfight = (client, channel, userName, opponent) => {

    //Authorize-{Sheets}
	con.gsClient.authorize(function(e, tokens){
		if(e){
			console.log(e);
			return;
		} else {
			//console.log('Connected to Google-Sheets api.');
			gsrun(con.gsClient);
		}
	});

	//Connect-to-{Sheets}
	async function gsrun(cl){

		const gsapi = google.sheets({version:'v4', auth: cl });
		//Get-{Sheet-Values}-in-[Data-crew]
		const [,...values] = (await gsapi.spreadsheets.values.get({ 
			spreadsheetId: con.botSheet, 
			range: con.twitchIdRange
		})).data.values;

		//Search-{userName}-in-{Sheet-Values}-in-[Data-crew]
		//Filter-&-Reduce-List-into-One
		const index = values.reduce((o, [a, ...v], i) => ((o[a] = i), o), {});
		//console.log(`User[Index] = ${index[userName]}`);

		//IF-{userName}-exists-in-[Data-crew] // Find-&-Excecute-[!pp]
		if (index[userName] >= 0){
		//console.log(`${userName} already exists.`)
			///!pp
			try{

                //1//Get-existing-[!ppValue]-in-[Data-crew]
                const adjustedIndex = index[userName] + 4;
                const existingValue = await gsapi.spreadsheets.values.get({
                    spreadsheetId: con.botSheet,
                    range: `Data-crew!G${adjustedIndex}`,
                });
                const trueValue = existingValue.data.values.flat();
                console.log(trueValue);
                //2//IF-"TRUE"-run-!ppfight
                if (trueValue == "TRUE"){

                    //Authorize-{Sheets}
                    con.gsClient.authorize(function(e, tokens){
                        if(e){
                            console.log(e);
                            return;
                        } else {
                            //console.log('Connected to Google-Sheets api.');
                            gsrun(con.gsClient);
                        }
                    });

                    //Connect-to-{Sheets}-[Data-!pp]
                    async function gsrun(cl){

                        const gsapi = google.sheets({version:'v4', auth: cl });

                        //Get-{Sheet-Values}-in-[Data-!pp]
                        const [, ...values] = (await gsapi.spreadsheets.values.get({ 
                            spreadsheetId: con.botSheet, 
                            range: con.ppUserRange
                        })).data.values;

                        //Search-{userName}-in-[Data-!pp]
                        //Filter-&-Reduce-List-into-One
                        const index = values.reduce((o, [a, ...v], i) => ((o[a] = i), o), {});
                        
                        const oppoLC = `${opponent}`.toLocaleLowerCase();

                        //IF-{userName}-already-exists // RUN-PPFIGHT
                        if (index[userName] >= 0 && index[oppoLC] >= 0){

                            console.log(`${userName} got PP`)
                            ///Get-&-update-existing-PP-length
                            try{

                            //1//Get-existing-PP-length
                                const adjustedCIndex = index[userName] + 3;
                                const adjustedOIndex = index[oppoLC] + 3;
                            //2//Get-existing-[ppBadge]-C
                                const existingPPBadge = await gsapi.spreadsheets.values.get({
                                    spreadsheetId: con.botSheet,
                                    range: `Data-!pp!D${adjustedCIndex}`,
                                });
                                const trueCBadge = existingPPBadge.data.values;
                            //3//Get-existing-[ppBadge]-O
                                const existingViagraBadge = await gsapi.spreadsheets.values.get({
                                    spreadsheetId: con.botSheet,
                                    range: `Data-!pp!D${adjustedOIndex}`,
                                });
                                const trueOBadge = existingViagraBadge.data.values;
                            //4//Reply-to-{userName}
                            	//If-not-Host-Delete-Msg
                                if (channel == "#xli24"){
                                    client.say(channel, `/announce ${userName} initated 🔥${trueCBadge}-vs-${trueOBadge}🔥 ${opponent} got ⏱️-1-min  to "!accept" the 🔥⚔️challenge⚔️🔥 in chat 👇`)
                                    } else {
                                //Execute-hornyJail
				                client.say(channel, `${userName} initated 🔥${trueCBadge}-vs-${trueOBadge}🔥 ${opponent} got ⏱️-1-min  to "!accept" the 🔥⚔️challenge⚔️🔥 in chat 👇`)
                                };

                            } catch(e) {console.error(e);};

                        }

                        //IF-{opponent}-does-not-exist // 
                        else if (!index[oppoLC] >= 0) {	

                            console.log(`${opponent} pp not found`)
                            //1//Reply-to-{userName}
                            client.say(channel, `⛔ ERROR-NOMMIE ⛔ Cannot initate fight with Nommie ${opponent}`);
                        
                        };
                    };

                } 
                //3//IF-"FALSE"-Err-Reply
                else {

                    client.say(channel, `Gotta bring a PP to a PPfight ${userName} => !checkpp`);
                
                };

			} catch(e) {console.error(e);};
		}

		//IF-{userName}-does-not-exist // Do-Nothing
		else return;
		
	}
        
}

//!accept // !ppfight
exports.accept = (client, channel, userName, opponent) => {

    //Authorize-{Sheets}
	con.gsClient.authorize(function(e, tokens){
		if(e){
			console.log(e);
			return;
		} else {
			//console.log('Connected to Google-Sheets api.');
			gsrun(con.gsClient);
		}
	});

	//Connect-to-{Sheets}
	async function gsrun(cl){

		const gsapi = google.sheets({version:'v4', auth: cl });
		//Get-{Sheet-Values}-in-[Data-crew]
		const [,...values] = (await gsapi.spreadsheets.values.get({ 
			spreadsheetId: con.botSheet, 
			range: con.twitchIdRange
		})).data.values;

		//Search-{userName}-in-{Sheet-Values}-in-[Data-crew]
		//Filter-&-Reduce-List-into-One
		const index = values.reduce((o, [a, ...v], i) => ((o[a] = i), o), {});
		console.log(`User[Index] = ${index[userName]}`);

		//IF-{userName}-exists-in-[Data-crew] // Find-&-Excecute-[!pp]
		if (index[userName] >= 0){
		//console.log(`${userName} already exists.`)
			///!accept // PPfight.exe
			try{

                //1//Get-existing-[!ppValue]-in-[Data-crew]
                const adjustedIndex = index[userName] + 4;
                const existingValue = await gsapi.spreadsheets.values.get({
                    spreadsheetId: con.botSheet,
                    range: `Data-crew!G${adjustedIndex}`,
                });
                const trueValue = existingValue.data.values.flat();
                console.log(trueValue);
                //2//IF-"TRUE"-run-!ppfight
                if (trueValue == "TRUE"){

                    //Authorize-{Sheets}
                    con.gsClient.authorize(function(e, tokens){
                        if(e){
                            console.log(e);
                            return;
                        } else {
                            //console.log('Connected to Google-Sheets api.');
                            gsrun(con.gsClient);
                        }
                    });

                    //Connect-to-{Sheets}-[Data-!pp]
                    async function gsrun(cl){
                        const gsapi = google.sheets({version:'v4', auth: cl });

                        //Get-{Sheet-Values}-in-[Data-!pp]
                        const [, ...values] = (await gsapi.spreadsheets.values.get({ 
                            spreadsheetId: con.botSheet, 
                            range: con.ppUserRange
                        })).data.values;

                        //Search-{userName}-in-[Data-!pp]
                        //Filter-&-Reduce-List-into-One
                        const index = values.reduce((o, [a, ...v], i) => ((o[a] = i), o), {});
                        
                        const oppoLC = `${opponent}`.toLocaleLowerCase();

                        //IF-{userName}-already-exists // RUN-PPFIGHT
                        if (index[userName] >= 0 && index[oppoLC] >= 0){

                            console.log(`${userName} got PP`)
                            ///Get-&-update-existing-PP-length
                            try{

                                //1//Get-existing-PP-length[s]
                                    const CadjustedPPIndex = index[userName] + 3;
                                    const CexistingValue = await gsapi.spreadsheets.values.get({
                                        spreadsheetId: con.botSheet,
                                        range: `Data-!pp!C${CadjustedPPIndex}`,
                                    });
                                    const CtrueValue = CexistingValue.data.values;
                                    const OadjustedPPIndex = index[oppoLC] + 3;
                                    const OexistingValue = await gsapi.spreadsheets.values.get({
                                        spreadsheetId: con.botSheet,
                                        range: `Data-!pp!C${OadjustedPPIndex}`,
                                    });
                                    const OtrueValue = OexistingValue.data.values;
                                //2//PP-FIGHT-ENIGINE
                                    const CrandomValue =  fun.between(0.001, 0.500, 3);
                                    const OrandomValue =  fun.between(0.001, 0.500, 3);
                                    console.log(`Crandom value = ${CrandomValue}`);
                                    console.log(`Orandom value = ${OrandomValue}`);
                                //3//Get-existing-PP-length
                                    const adjustedCIndex = index[userName] + 3;
                                    const adjustedOIndex = index[oppoLC] + 3;
                                //4//Get-existing-[ppBadge]-C
                                    const existingPPBadge = await gsapi.spreadsheets.values.get({
                                        spreadsheetId: con.botSheet,
                                        range: `Data-!pp!D${adjustedCIndex}`,
                                    });
                                    const trueCBadge = existingPPBadge.data.values;
                                //5//Get-existing-[ppBadge]-O
                                    const existingViagraBadge = await gsapi.spreadsheets.values.get({
                                        spreadsheetId: con.botSheet,
                                        range: `Data-!pp!D${adjustedOIndex}`,
                                    });
                                const trueOBadge = existingViagraBadge.data.values;
                                //WIN
                                if (CrandomValue > OrandomValue){
                                    //4.1//Update-existing-PP-length
                                        var addedValue =  Number(OtrueValue) - Number(OrandomValue);
                                        const updatedValue = await gsapi.spreadsheets.values.update({
                                            spreadsheetId: con.botSheet,
                                            range: `Data-!pp!C${OadjustedPPIndex}`,
                                            valueInputOption: "USER_ENTERED",
                                            resource: { values: [[addedValue]] },
                                        });                                
                                    //5.1//Reply
                                        client.say(channel, `💪${trueCBadge}😈 => ☠️${trueOBadge}✂️`)
                                        setTimeout(() => {
                                            client.say(channel, `F.. ${opponent} got their ${trueOBadge} => ✂️ => ⛔${addedValue} mm`)
                                        }, (1000));
                                }
                                //LOSE
                                if (CrandomValue < OrandomValue){
                                    //4.2//Update-existing-PP-length
                                        var addedValue =  Number(CtrueValue) - Number(CrandomValue);
                                        const updatedValue = await gsapi.spreadsheets.values.update({
                                            spreadsheetId: con.botSheet,
                                            range: `Data-!pp!C${CadjustedPPIndex}`,
                                            valueInputOption: "USER_ENTERED",
                                            resource: { values: [[addedValue]] },
                                        });                              
                                    //5.2//Reply
                                        client.say(channel, `💪${trueOBadge}😈 => ☠️${trueCBadge}✂️`)
                                        setTimeout(() => {
                                            client.say(channel, `F.. ${userName} got their ${trueCBadge} => ✂️ => ⛔${addedValue} mm`)
                                        }, (1000));
                                }

                            } catch(e) {console.error(e);};

                        }

                        //IF-{userName}-does-not-exist // a NEW 0.001 mm
                        else {	

                            console.log(`${userName} pp not found`)
                            //1//Reply-to-{userName}
                            client.say(channel, `Gotta bring a PP to a PPfight ${userName} => !checkpp`);
                        
                        };
                    };

                } 
                //3//IF-"FALSE"-Err-Reply
                else {

                    client.say(channel, `Gotta bring a PP to a PPfight ${userName} => !checkpp`);
                
                };

			} catch(e) {console.error(e);};
		}

		//IF-{userName}-does-not-exist // Do-Nothing
		else return;
		
	}
        
}

//!vfight
exports.vfight = (client, channel, userName, opponent) => {

    //Authorize-{Sheets}
	con.gsClient.authorize(function(e, tokens){
		if(e){
			console.log(e);
			return;
		} else {
			//console.log('Connected to Google-Sheets api.');
			gsrun(con.gsClient);
		}
	});

	//Connect-to-{Sheets}
	async function gsrun(cl){

		const gsapi = google.sheets({version:'v4', auth: cl });
		//Get-{Sheet-Values}-in-[Data-crew]
		const [,...values] = (await gsapi.spreadsheets.values.get({ 
			spreadsheetId: con.botSheet, 
			range: con.twitchIdRange
		})).data.values;

		//Search-{userName}-in-{Sheet-Values}-in-[Data-crew]
		//Filter-&-Reduce-List-into-One
		const index = values.reduce((o, [a, ...v], i) => ((o[a] = i), o), {});
		//console.log(`User[Index] = ${index[userName]}`);

		//IF-{userName}-exists-in-[Data-crew] // Find-&-Excecute-[!pp]
		if (index[userName] >= 0){
		//console.log(`${userName} already exists.`)
			///!pp
			try{

                //1//Get-existing-[!ppValue]-in-[Data-crew]
                const adjustedIndex = index[userName] + 4;
                const existingValue = await gsapi.spreadsheets.values.get({
                    spreadsheetId: con.botSheet,
                    range: `Data-crew!G${adjustedIndex}`,
                });
                const trueValue = existingValue.data.values.flat();
                console.log(trueValue);
                //2//IF-"TRUE"-run-!vfight
                if (trueValue == "TRUE"){

                    //Authorize-{Sheets}
                    con.gsClient.authorize(function(e, tokens){
                        if(e){
                            console.log(e);
                            return;
                        } else {
                            //console.log('Connected to Google-Sheets api.');
                            gsrun(con.gsClient);
                        }
                    });

                    //Connect-to-{Sheets}-[Data-!pp]
                    async function gsrun(cl){

                        const gsapi = google.sheets({version:'v4', auth: cl });

                        //Get-{Sheet-Values}-in-[Data-!pp]
                        const [, ...values] = (await gsapi.spreadsheets.values.get({ 
                            spreadsheetId: con.botSheet, 
                            range: con.ppUserRange
                        })).data.values;

                        //Search-{userName}-in-[Data-!pp]
                        //Filter-&-Reduce-List-into-One
                        const index = values.reduce((o, [a, ...v], i) => ((o[a] = i), o), {});
                        
                        const oppoLC = `${opponent}`.toLocaleLowerCase();

                        //IF-{userName}-already-exists // RUN-PPFIGHT
                        if (index[userName] >= 0 && index[oppoLC] >= 0){

                            console.log(`${userName} got PP`)
                            ///Get-&-update-existing-PP-length
                            try{

                            //1//Adjust-Index
                                const adjustedCIndex = index[userName] + 3;
                                const adjustedOIndex = index[oppoLC] + 3;
                            //2//Get-existing-[VBadge]-C
                                const existingPPBadge = await gsapi.spreadsheets.values.get({
                                    spreadsheetId: con.botSheet,
                                    range: `Data-!pp!F${adjustedCIndex}`,
                                });
                                const trueCBadge = existingPPBadge.data.values;
                            //3//Get-existing-[VBadge]-O
                                const existingViagraBadge = await gsapi.spreadsheets.values.get({
                                    spreadsheetId: con.botSheet,
                                    range: `Data-!pp!F${adjustedOIndex}`,
                                });
                                const trueOBadge = existingViagraBadge.data.values;
                            //4//Reply-to-{userName}
                            	//If-not-Host-Delete-Msg
                                if (channel == "#xli24"){
                                    client.say(channel, `/announce ${userName} initated 🔥${trueCBadge}-vs-${trueOBadge}🔥 ${opponent} got ⏱️-1-min  to "!accept" the 🔥⚔️challenge⚔️🔥 in chat 👇`)
                                    } else {
                                //Execute-hornyJail
				                client.say(channel, `${userName} initated 🔥${trueCBadge}-vs-${trueOBadge}🔥 ${opponent} got ⏱️-1-min  to "!accept" the 🔥⚔️challenge⚔️🔥 in chat 👇`)
                                };

                            } catch(e) {console.error(e);};

                        }

                        //IF-{opponent}-does-not-exist // 
                        else if (!index[oppoLC] >= 0) {	

                            console.log(`${opponent} pp not found`)
                            //1//Reply-to-{userName}
                            client.say(channel, `⛔ ERROR-NOMMIE ⛔ Cannot initate fight with Nommie ${opponent}`);
                        
                        };
                    };

                } 
                //3//IF-"FALSE"-Err-Reply
                else {

                    client.say(channel, `Gotta bring a PP to a PPfight ${userName} => !checkpp`);
                
                };

			} catch(e) {console.error(e);};
		}

		//IF-{userName}-does-not-exist // Do-Nothing
		else return;
		
	}
        
}

//!accept // !vfight
exports.vaccept = (client, channel, userName, opponent) => {

    //Authorize-{Sheets}
	con.gsClient.authorize(function(e, tokens){
		if(e){
			console.log(e);
			return;
		} else {
			//console.log('Connected to Google-Sheets api.');
			gsrun(con.gsClient);
		}
	});

	//Connect-to-{Sheets}
	async function gsrun(cl){

		const gsapi = google.sheets({version:'v4', auth: cl });
		//Get-{Sheet-Values}-in-[Data-crew]
		const [,...values] = (await gsapi.spreadsheets.values.get({ 
			spreadsheetId: con.botSheet, 
			range: con.twitchIdRange
		})).data.values;

		//Search-{userName}-in-{Sheet-Values}-in-[Data-crew]
		//Filter-&-Reduce-List-into-One
		const index = values.reduce((o, [a, ...v], i) => ((o[a] = i), o), {});
		console.log(`User[Index] = ${index[userName]}`);

		//IF-{userName}-exists-in-[Data-crew] // Find-&-Excecute-[!pp]
		if (index[userName] >= 0){
		//console.log(`${userName} already exists.`)
			///!accept // PPfight.exe
			try{

                //1//Get-existing-[!ppValue]-in-[Data-crew]
                const adjustedIndex = index[userName] + 4;
                const existingValue = await gsapi.spreadsheets.values.get({
                    spreadsheetId: con.botSheet,
                    range: `Data-crew!G${adjustedIndex}`,
                });
                const trueValue = existingValue.data.values.flat();
                console.log(trueValue);
                //2//IF-"TRUE"-run-!ppfight
                if (trueValue == "TRUE"){

                    //Authorize-{Sheets}
                    con.gsClient.authorize(function(e, tokens){
                        if(e){
                            console.log(e);
                            return;
                        } else {
                            //console.log('Connected to Google-Sheets api.');
                            gsrun(con.gsClient);
                        }
                    });

                    //Connect-to-{Sheets}-[Data-!pp]
                    async function gsrun(cl){
                        const gsapi = google.sheets({version:'v4', auth: cl });

                        //Get-{Sheet-Values}-in-[Data-!pp]
                        const [, ...values] = (await gsapi.spreadsheets.values.get({ 
                            spreadsheetId: con.botSheet, 
                            range: con.ppUserRange
                        })).data.values;

                        //Search-{userName}-in-[Data-!pp]
                        //Filter-&-Reduce-List-into-One
                        const index = values.reduce((o, [a, ...v], i) => ((o[a] = i), o), {});
                        
                        const oppoLC = `${opponent}`.toLocaleLowerCase();

                        //IF-{userName}-already-exists // RUN-PPFIGHT
                        if (index[userName] >= 0 && index[oppoLC] >= 0){

                            console.log(`${userName} got PP`)
                            ///Get-&-update-existing-PP-length
                            try{

                                //1//Get-existing-PP-length[s]
                                    const CadjustedPPIndex = index[userName] + 3;
                                    const CexistingValue = await gsapi.spreadsheets.values.get({
                                        spreadsheetId: con.botSheet,
                                        range: `Data-!pp!C${CadjustedPPIndex}`,
                                    });
                                    const CtrueValue = CexistingValue.data.values;
                                    const OadjustedPPIndex = index[oppoLC] + 3;
                                    const OexistingValue = await gsapi.spreadsheets.values.get({
                                        spreadsheetId: con.botSheet,
                                        range: `Data-!pp!C${OadjustedPPIndex}`,
                                    });
                                    const OtrueValue = OexistingValue.data.values;
                                //2//PP-FIGHT-ENIGINE
                                    const CrandomValue =  fun.between(0.500, 5.000, 3);
                                    const OrandomValue =  fun.between(0.500, 5.000, 3);
                                    console.log(`Crandom value = ${CrandomValue}`);
                                    console.log(`Orandom value = ${OrandomValue}`);
                                //3//Get-existing-PP-length
                                    const adjustedCIndex = index[userName] + 3;
                                    const adjustedOIndex = index[oppoLC] + 3;
                                //4//Get-existing-[ppBadge]-C
                                    const existingPPBadge = await gsapi.spreadsheets.values.get({
                                        spreadsheetId: con.botSheet,
                                        range: `Data-!pp!F${adjustedCIndex}`,
                                    });
                                    const trueCBadge = existingPPBadge.data.values;
                                //5//Get-existing-[ppBadge]-O
                                    const existingViagraBadge = await gsapi.spreadsheets.values.get({
                                        spreadsheetId: con.botSheet,
                                        range: `Data-!pp!F${adjustedOIndex}`,
                                    });
                                const trueOBadge = existingViagraBadge.data.values;
                                //WIN
                                if (CrandomValue > OrandomValue){
                                    //4.1//Update-existing-PP-length
                                        var addedOValue =  Number(OtrueValue) - Number(OrandomValue);
                                        console.log( OtrueValue );
                                        console.log( OrandomValue );
                                        console.log( addedOValue );
                                        const updatedOValue = await gsapi.spreadsheets.values.update({
                                            spreadsheetId: con.botSheet,
                                            range: `Data-!pp!C${OadjustedPPIndex}`,
                                            valueInputOption: "USER_ENTERED",
                                            resource: { values: [[addedOValue]] },
                                        });
                                        var addedCValue =  Number(CtrueValue) + Number(CrandomValue);
                                        console.log( CtrueValue );
                                        console.log( CrandomValue );
                                        console.log( addedCValue );
                                        const updatedCValue = await gsapi.spreadsheets.values.update({
                                            spreadsheetId: con.botSheet,
                                            range: `Data-!pp!C${CadjustedPPIndex}`,
                                            valueInputOption: "USER_ENTERED",
                                            resource: { values: [[addedCValue]] },
                                        });                                    
                                    //5.1//Reply
                                        client.say(channel, `💪${trueCBadge}💦 => ☠️${trueOBadge}💥`)
                                        setTimeout(() => {
                                            client.say(channel, `${userName} 😎gain${trueCBadge}➕${CrandomValue}   => ${opponent} 😵lost${trueOBadge}➖(${OrandomValue})`)
                                        }, (1000));
                                }
                                //LOSE
                                if (CrandomValue < OrandomValue){
                                    //4.1//Update-existing-PP-length
                                    var addedOValue =  Number(OtrueValue) + Number(OrandomValue);
                                    console.log( OtrueValue );
                                    console.log( OrandomValue );
                                    console.log( addedOValue );
                                    const updatedOValue = await gsapi.spreadsheets.values.update({
                                        spreadsheetId: con.botSheet,
                                        range: `Data-!pp!C${OadjustedPPIndex}`,
                                        valueInputOption: "USER_ENTERED",
                                        resource: { values: [[addedOValue]] },
                                    });
                                    var addedCValue =  Number(CtrueValue) - Number(CrandomValue);
                                    console.log( CtrueValue );
                                    console.log( CrandomValue );
                                    console.log( addedCValue );
                                    const updatedCValue = await gsapi.spreadsheets.values.update({
                                        spreadsheetId: con.botSheet,
                                        range: `Data-!pp!C${CadjustedPPIndex}`,
                                        valueInputOption: "USER_ENTERED",
                                        resource: { values: [[addedCValue]] },
                                    });                                    
                                //5.1//Reply
                                    client.say(channel, `💪${trueOBadge}💦 => ☠️${trueCBadge}💥`)
                                    setTimeout(() => {
                                        client.say(channel, `${opponent} 😎gain${trueOBadge}➕${OrandomValue}   => ${userName} 😵lost${trueCBadge}➖(${CrandomValue})`)
                                    }, (1000));
                                }

                            } catch(e) {console.error(e);};

                        }

                        //IF-{userName}-does-not-exist // a NEW 0.001 mm
                        else {	

                            console.log(`${userName} pp not found`)
                            //1//Reply-to-{userName}
                            client.say(channel, `Gotta bring a PP to a PPfight ${userName} => !checkpp`);
                        
                        };
                    };

                } 
                //3//IF-"FALSE"-Err-Reply
                else {

                    client.say(channel, `Gotta bring a PP to a PPfight ${userName} => !checkpp`);
                
                };

			} catch(e) {console.error(e);};
		}

		//IF-{userName}-does-not-exist // Do-Nothing
		else return;
		
	}
        
}

//hornyJail
exports.hornyJail = (client, channel, userName, coolDown) => {

    //Authorize-{Sheets}
    con.gsClient.authorize(function(e, tokens){
        if(e){
            console.log(e);
            return;
        } else {
            //console.log('Connected to Google-Sheets api.');
            gsrun(con.gsClient);
        }
    });

    //Connect-to-{Sheets}
    async function gsrun(cl){

        const gsapi = google.sheets({version:'v4', auth: cl });

        //Get-{Sheet-Values}-in-[Data-!pp]
        const [, ...values] = (await gsapi.spreadsheets.values.get({ 
            spreadsheetId: con.botSheet, 
            range: con.ppUserRange
        })).data.values;

        //Search-{userName}-in-[Data-!pp]
        //Filter-&-Reduce-List-into-One
        const index = values.reduce((o, [a, ...v], i) => ((o[a] = i), o), {});
        //console.log(`pp[User] = ${index[userName]}`);

        //IF-{userName}-already-exists // Reply-Horny-Jail
        if (index[userName] >= 0){

            ///Run-HornyJail
            try{
            //1//Adjust-Row-Index
                const adjustedPPIndex = index[userName] + 3;
                //console.log(`Adjusted value = ${adjustedPPIndex}`);
            //2//Get-existing-[jailBadge]
                const existingjailBadge = await gsapi.spreadsheets.values.get({
                    spreadsheetId: con.botSheet,
                    range: `Data-!pp!H${adjustedPPIndex}`,
                });
                const truejailBadge = existingjailBadge.data.values;
            //3//Get-existing-[ppBadge]
                const existingPPBadge = await gsapi.spreadsheets.values.get({
                    spreadsheetId: con.botSheet,
                    range: `Data-!pp!D${adjustedPPIndex}`,
                });
                const truePPBadge = existingPPBadge.data.values;
            //4//Get-existing-[jailCount]
                const adjustedIndex = index[userName] + 3;
                const existingValue = await gsapi.spreadsheets.values.get({
                    spreadsheetId: con.botSheet,
                    range: `Data-!pp!G${adjustedIndex}`,
                });
                const trueValue = existingValue.data.values;
                //console.log(`existing value = ${trueValue}`);
            //5//Update-existing-[jailCount]
                const addedValue =  Number(trueValue) + Number(1);
                //console.log(`added value = ${addedValue}`);
                const updatedValue = await gsapi.spreadsheets.values.update({
                    spreadsheetId: con.botSheet,
                    range: `Data-!pp!G${adjustedIndex}`,
                    valueInputOption: "USER_ENTERED",
                    resource: { values: [[addedValue]] },
                });
            //6//Reply-to-{userName}
                client.say(channel, `Horny-Jailed! ${userName} ${truejailBadge} => ${coolDown} min 🚫${truePPBadge}💦`)
            } catch(e) {console.error(e);};

        }

        //IF-{userName}-does-not-exist // No PP
        else {	

            console.log(`${userName} pp not found`)
            //1//Reply-to-{userName}
            client.say(channel, `${userName} => type "!checkpp" in chat for ur *inclusive* pp!`);
        
        };
        
    };

}