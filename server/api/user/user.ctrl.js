var User = require('./user.model'),
    Pathway = require('../pathway/pathway.model'),
    Gym = require('../gym/gym.model');

module.exports = {
    getAllUsers: function (req, res) {
        User.find(req.query)
            .exec(function (err, response) {
                if (err) {
                    res.send(err);
                } else {
                    res.send(response);
                }
            });
    },
    findByID: function (req, res) {
        User.findById(req.params.memberId)
            .exec(function (err, response) {
                if (err) {
                    res.send(err);
                } else {
                    res.send(response);
                }
            });
    },
    getUserDetails: function (req, res) {
        User.findById(req.params.memberId)
            .exec(function (err, response) {
                if (err) {
                    res.send(err);
                } else {
                    var userObj = {
                        _id: response._id,
                        name: response.name,
                        gender: response.gender,
                        age: response.age,
                        weight: response.weight,
                        height: response.height,
                        goals: response.goals,
                        contact_info: response.contact_info
                    };
                    Gym.findById(response.gym)
                        .exec(function (err, response) {
                            if (err) {
                                res.send(err);
                            } else {
                                var gymObj = {
                                    _id: response._id,
                                    name: response.name
                                };
                                var newObj = {
                                    user: userObj,
                                    gym: gymObj
                                };
                                res.send(newObj);
                            }
                        });
                }
            });
    },
    getUserLogos: function (req, res) {
        User.findById(req.params.memberId)
            .exec(function (err, response) {
                if (err) {
                    res.send(err);
                } else {
                    res.send(response.pathways[0]);
                }
            });
    },
    getUserPathos: function (req, res) {
        User.findById(req.params.memberId)
            .exec(function (err, response) {
                if (err) {
                    res.send(err);
                } else {
                    res.send(response.pathways[1]);
                }
            });
    },
    getUserEthos: function (req, res) {
        User.findById(req.params.memberId)
            .exec(function (err, response) {
                if (err) {
                    res.send(err);
                } else {
                    res.send(response.pathways[2]);
                }
            });
    },
    addUser: function (req, res) {
        var newUser = new User(req.body);
        newUser.save(function (err, response) {
            if (err) {
                res.send(err);
            } else {
                var userID = response._id;
                User.findById(userID)
                    .populate('gym')
                    .exec(function (err, response) {
                        if (err) {
                            res.send(err);
                        } else {
                            var newUserObj = response;
                            Gym.findById(newUserObj.gym)
                                .exec(function (err, response) {
                                    if (err) {
                                        res.send(err);
                                    } else {
                                        var pathwayCount = response.gym_pathway_program;
                                        for (var i = 0; i < pathwayCount.length; i++) {
                                            var stagesCount = pathwayCount[i]["stages"];
                                            var stagesLength = stagesCount.length;
                                            var x = 0;
                                            while (x < stagesLength) {
                                                stagesCount[x]["total_to_complete"] = 100 / stagesLength;
                                                var stagesValue = stagesCount[x]["total_to_complete"];
                                                var evaluationCount = stagesCount[x]["evaluations"];
                                                var evaluationLength = evaluationCount.length;
                                                var y = 0;
                                                while (y < evaluationLength) {
                                                    evaluationCount[y]["total_to_complete"] = stagesValue / evaluationLength;
                                                    y++;
                                                }
                                                x++;
                                            }
                                        }
                                        var userPathways = [];
                                        for (var y = 0; y < pathwayCount.length; y++) {
                                            userPathways.push(pathwayCount[y]);
                                        }
                                        newUserObj.pathways = userPathways;
                                        User.findByIdAndUpdate(userID, newUserObj)
                                            .exec(function (err, response) {
                                                if (err) {
                                                    res.send(err);
                                                } else {
                                                    Gym.findById(req.body.gym)
                                                        .exec(function (err, response) {
                                                            if (err) {
                                                                res.send(err);
                                                            } else {
                                                                var newMemberToGym = response.members;
                                                                newMemberToGym.push(userID);
                                                                var newGymObj = {
                                                                    members: newMemberToGym
                                                                };
                                                                Gym.findByIdAndUpdate(req.body.gym, newGymObj)
                                                                    .exec(function (err, response) {
                                                                        if (err) {
                                                                            res.send(err);
                                                                        } else {
                                                                            res.send(response);
                                                                        }
                                                                    });
                                                            }
                                                        });
                                                }
                                            });
                                    }
                                });
                        }
                    });
            }
        });
    },
    updateUser: function (req, res) {
        User.findByIdAndUpdate(req.body._id, req.body)
            .exec(function (err, response) {
                if (err) {
                    res.send(err);
                } else {
                    res.send(response);
                }
            });
    },
    updateEvalStatus: function (req, res) {
        User.findById(req.body.userID)
            .exec(function (err, response) {
                if (err) {
                    res.send(err);
                } else {
                    var pathways = response.pathways;
                    for (var i = 0; i < pathways.length; i++) {
                        if (req.body.pathwayID == pathways[i]["_id"]) {
                            var stages = pathways[i]["stages"];
                            for (var x = 0; x < stages.length; x++) {
                                if (req.body.stageID == stages[x]["_id"]) {
                                    var evaluations = stages[x]["evaluations"];
                                    for (var y = 0; y < evaluations.length; y++) {
                                        if (req.body.evalID == evaluations[y]["_id"]) {
                                            console.log(evaluations[y]);
                                            if (evaluations[y]["needs_approval"] === true && evaluations[y]["pending"] === false) {
                                                response.pathways[i]["stages"][x]["evaluations"][y]["pending"] = true;
                                                User.findByIdAndUpdate(req.body.userID, response)
                                                    .exec(function (err, response) {
                                                        if (err) {
                                                            res.send(err);
                                                        } else {
                                                            res.send(response);
                                                        }
                                                    });
                                                // // } else if (evaluations[y]["needs_approval"] === true && evaluations[y]["pending"] === true) {

                                                // }



                                                // User.findByIdAndUpdate(req.body.userID, response)
                                                //     .exec(function (err, response) {
                                                //         if (err) {
                                                //             res.send(err);
                                                //         } else {
                                                //             res.send(response);
                                                //         }
                                                //     });
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });
    }
};

/* For initial user add testing
{
    "name": {
        "first": "Mike",
        "last": "Buckley"
    },
    "gym": "55fddafabb429c4575c69617"
}
*/
