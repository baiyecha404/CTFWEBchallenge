#!/usr/bin/node

module.exports = ((app, fs, path) => {
	app.post("/", (req, res) => {
		let sess = req.session;
		if ("worldoor" in req.query) {
			let worldoor = req.query.worldoor;
			if (!Array.isArray(worldoor) && (typeof worldoor) !== "object") {
				if (!/rickstuff/.test(worldoor)) {
					console.log("worldoor done");
					if (worldoor.toLowerCase() === path.join(__dirname, "rickstuff").toLowerCase()) {
						if ("teleport" in req.query) {
							let teleport = req.query.teleport;
							if (!Array.isArray(teleport) && (typeof teleport) !== "object") {
								if (/^[137]+$/.test(teleport)) {
									if (parseInt(teleport) === 13333333333333334000) {
										console.log("teleport done");
										if ("bridge" in req.query) {
											let bridge = req.query.bridge;
											if (bridge == "d0wnth3r3" && bridge.length === 1) {
												console.log("bridge done");
												if ("neworld" in req.query) {
													let neworld = req.query.neworld;
													if (!Array.isArray(neworld) && (typeof neworld) !== "object") {
														if (/^[137]+$/.test(neworld)) {
															if ("Ricks" + (neworld * 1)  === "RicksInfinity") {
																console.log("neworld done");
																if ("lord" in req.query && "rord" in req.query)  {
																	let lord = req.query.lord;
																	let rord = req.query.rord;
																	if (!Array.isArray(lord) && !Array.isArray(rord) && (typeof lord) !== "object" && (typeof rord) !== "object") {
																		if ("ricks".concat(XOR(lord)) === rord) {
																			console.log("lord rord done");
																			if ("worldname" in req.query && "component" in req.query) {
																				let worldname = req.query.worldname;
																				let component = req.query.component;
																				if (!Array.isArray(worldname) && (typeof worldname) !== "object" && !Array.isArray(component) && (typeof component) !== "object") {
																					if (/^[1-9]+$/.test(worldname) && /^[1-9]+$/.test(component)) {
																						if (("A" + worldname / component + "as").toLowerCase() === "ananas") {
																							console.log("worldname / component done");
																							if ("animal" in req.query) {
																								let animal = req.query.animal;
																								if (!Array.isArray(animal)) {
																									try {
																										res.end((animal / 1337).toString());
																									}
																									catch (e) {
																										console.log("animal done");
																										if ("weired" in req.query) {
																											let weired = req.query.weired;
																											if (!Array.isArray(weired) && (typeof weired) !== "object") {
																												if (!weired.includes(".")) {
																													weired = parseFloat(weired);
																													if (weired > 0 && weired < 0.05) {
																														console.log("weired done");
																														if ("st" in req.query && "ar" in req.query) {
																															let st = req.query.st;
																															let ar = req.query.ar;
																															if (!st.includes(",") && !ar.includes(",") && ar.length === 2 && st.length === 2) {
																																if ((st + ar) === "1,33,7") {
																																	console.log("st,ar done");
																																	if (sess.AccessGranted !== "undefined" && sess.AccessGranted === true) {
																																		if ("fastfood" in req.query) {
																																			let fastfood = req.query.fastfood;
																																			if (!Array.isArray(fastfood) && (typeof fastfood) !== "object") {
																																				try {
																																					let in_food = JSON.parse(fastfood);
																																					if (!("food" in in_food)) {
																																						let order = Object.assign({}, in_food);
																																						if (order.food === "Makloub") {
																																							if ("letter_name" in req.body && "letter" in req.body) {
																																								console.log("fast food done");
																																								let letter_name = req.body.letter_name;
																																								let letter = req.body.letter;
																																								if (!Array.isArray(letter) && !Array.isArray(letter_name) && (typeof letter) !== "object" && (typeof letter_name) !== "object") {
																																									let letter_path = path.join(__dirname, "letters/", sess.id, path.basename(letter_name));
																																									if (!fs.existsSync(path.join(__dirname, "letters/", sess.id))) {
			fs.mkdirSync(path.join(__dirname, "letters/", sess.id));
																																									}
																																									fs.writeFileSync(letter_path, letter);
																																									if ("view_letter" in req.query) {
																																										console.log("letter_name done");
																																										let view_letter = req.query.view_letter;
																																										res.render(view_letter);
																																									}
																																									else {
																																										res.end("Wait Morty where's my thing?");
																																									}
																																								}
																																								else {
																																									res.end("Come on Morty it's a letter.");
																																								}
																																							}
																																							else {
																																								res.end("Wait Morty where's my thing?");
																																							}
																																						}
																																						else {
																																							res.end("Does that seem like a Makloub for you?");
																																						}
																																					}
																																					else {
																																						res.end("We don't do that here Morty.");
																																					}
																																				}
																																				catch (e) {
																																					res.end("That doesn't seem like a food even.");
																																				}
																																			}
																																			else {
																																				res.end("Come on Morty it only accepts strings.");
																																			}
																																		}
																																		else {
																																			res.end("Wait Morty where's my thing?");
																																		}

																																	}
																																	else {
																																		res.end("Access denied Morty.");
																																	}
																																}
																																else {
																																	res.end("Not that clear Morty.");
																																}
																															}
																															else {
																																res.end("Again Morty, touching things that I always say don't touch.");
																															}
																														}
																														else {
																															res.end("Wait Morty where's my thing?");
																														}
																													}
																													else {
																														res.end("Is zero the minimal value Morty?");
																													}
																												}
																												else {
																													res.end("Again Morty, touching things that I always say don't touch.");
																												}
																											}
																											else {
																												res.end("Come on Morty it only accepts numbers and stuff like that.");
																											}
																										}
																										else {
																											res.end("Wait Morty where's my thing?");
																										}
																									}
																								}
																								else {
																									res.end("Well, animals here are not like other animals.");
																								}
																							}
																							else {
																								res.end("Wait Morty where's my thing?");
																							}
																						}
																						else {
																							res.end("Stop skipping math class Morty.");
																						}
																					}
																					else {
																						res.end("Again Morty, touching things that I always say don't touch.");
																					}
																				}
																				else {
																					res.end("Come on Morty it only accepts numbers.");
																				}
																			}
																			else {
																				res.end("Wait Morty where's my thing?");
																			}
																		}
																		else {
																			res.end("Oh who's rord :joy:?");
																		}
																	}
																	else {
																		res.end("Come on Morty shouldn't it only get strings?");
																	}
																}
																else {
																	res.end("Wait Morty where's my thing?");
																}
															}
															else {
																res.end("What's does that even mean?");
															}
														}
														else {
															res.end("Again Morty, touching things that I always say don't touch.");
														}
													}
													else {
														res.end("Come on Morty it only accepts numbers.");
													}
												}
												else {
													res.end("Wait Morty where's my thing?");
												}
											}
											else {
												res.end("Is that how you make a bridge work?");
											}
										}
										else {
											res.end("Wait Morty Where's my thing?");
										}
									}
									else {
										res.end("Not valid location morty.");
									}
								}
								else {
									res.end("Again Morty, touching things that I always say don't touch.");
								}
							}
							else {
								res.end("Come on Morty it only accepts numbers.");
							}
						}
						else {
							res.end("Wait Morty where's my thing?");
						}
					}
					else {
						res.end("We can't open the door like that Morty.");
					}
				}
				else {
					res.end("Again Morty, touching things that I always say don't touch.");
				}
			}
			else {
				res.end("Come on Morty what's that!?");
			}
		}
		else {
			res.end("Wait Morty where's my thing?");
		}
	});

	const XOR = ((str) => {
		let i, num = Math.floor(Math.random() * 1337), encoded = "";

		for (i = 0; i < str.length; i++) {
			encoded += str.charCodeAt(i) ^ num;
		}

		return
			encoded;
	});

	app.get("/secretplace", (req, res) => {
		let sess = req.session;
		sess.AccessGranted = false;
		if ("secretWord" in req.query) {
			let secretWord = req.query.secretWord;
			let secretword = fs.readFileSync(path.join(__dirname, "secretword.txt"), "utf-8").trim();
			if (!Array.isArray(secretWord) && (typeof secretWord) !== "object") {
				if (!secretword.search(secretWord) && secretWord.length === 10 && secretWord === secretword) {
					sess.AccessGranted = true;
					res.end();
				}
				else {
					res.end("Access to the secret place denied.");
				}
			}
			else {
				res.end("Come on Morty it's called secretWord.");
			}
		}
		else {
			res.end("Wait Morty where's my thing?");
		}
	});

	app.get("/:sicoupress", (req, res) => {
		res.end("A dead endpoint or what?");
	});

	app.get("/", (req, res) => {
		res.end("Welcome to the new Rick world, maybe read the source code or something?");
	});
});