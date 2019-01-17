var express = require('express');
var router = express.Router();
var mongo = require('mongoskin');
var db = mongo.db(process.env.mongo_url, { native_parser: true });
db.bind('reusablecomponents');
db.bind('developers');
var graphs;

router.post('/', (req, res) => {
	graphs = req.body;
	res.status(201).send(graphs);
});

router.get('/', (req, res) => {
	res.status(200).send(graphs);
});

router.get('/components/:username', (req, res) => {
	db.developers.findOne({ 'username': req.params.username }, (err, user) => {
		if (err) res.status(400).send(err);
		
		if (user) {
			db.reusablecomponents.find({ 'owner': user._id }).toArray((err, comps) => {
				if (err) res.status(400).send(err);
				
				var unique = [];
				var uniqueComponents = [];
				comps.forEach((comp) => {
					if (!unique.includes(comp.code)) {
						unique.push(comp.code);
						uniqueComponents.push({'name': comp.tags[1], 'src': comp.code, 'type': 'Component'});
					}
					
				});
				
				res.status(200).send(uniqueComponents);
			});
		} else {
			res.status(400).send('Invalid username');
		}
	});
});

module.exports = router;
