var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var newPathwaySchema = new Schema({
    pathway: [
        {
            name: { type: String },
            is_active: { type: Boolean },
            completion: {
                amount_completed: { type: Number, default: 0 },
                total_to_complete: { type: Number, default: 100 },
                complete: { type: Boolean, default: false }
            },
            stages: [
                {
                    name: { type: String },
                    amount_completed: { type: Number, default: 0 },
                    total_to_complete: { type: Number },
                    complete: { type: Boolean, default: false },
                    evaluations: [
                        {
                            name: { type: String },
                            content: {
                                video: { type: String },
                                image: { type: String },
                                progressions: [
                                    {
                                        explanation: { type: String },
                                        complete: { type: Boolean, default: false }
                                    }
                                ],
                                explanation: { type: String },
                                question: { type: String },
                                answer: { type: String }
                            },
                            total_to_complete: { type: Number },
                            complete: { type: Boolean, default: false },
                            needs_approval: { type: Boolean, default: false },
                            pending: { type: Boolean, default: false }
                        }
                    ]
                }
            ]
        }
    ]
});

module.exports = mongoose.model('pathways', newPathwaySchema);

//For testing with Postman, please don't change this info!
/*
{
    "pathway": [
        {
            "name": "Logos",
            "completion": {
                "amount_completed": 0,
                "total_to_complete": 100,
                "complete": false
            },
            "stages": [
                {
                    "name": "Stage 1",
                    "amount_completed": 0,
                    "total_to_complete": 0,
                    "complete": false,
                    "evaluations": [
                        {
                            "name": "Excersize 1",
                            "content": {
                                "video": "https://www.youtube.com/watch?v=8A6Uai5sQVw",
                                "image": "http://www.70sbig.com/wp-content/uploads/2012/03/halfsquat-fuck.jpg",
                                "progressions": [
                                    {
                                        "explanation": "Run 100 yards.",
                                        "complete": false
                                    }
                                ],
                                "explanation": "Here is an explanation for this excersize.",
                                "question": "",
                                "answer": "",
                                "complete": false,
                                "completed_on": ""
                            },
                            "total_to_complete": 0,
                            "complete": false,
                            "needs_approval": true,
                            "approved_by": "",
                            "approved_on": "",
                            "approved": false
                        },
                    ]
                }
            ]
        }
    ]
}
*/