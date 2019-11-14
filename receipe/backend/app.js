const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Thing = require('./models/thing');

const app = express();

mongoose.connect('mongodb+srv://henry-korir:WMBxWF7Ux4urWfm@cluster0-nlk76.mongodb.net/test?retryWrites=true&w=majority')
	.then(() =>{
		console.log('Successfully connected to MONGODB Atlas');
	})
	.catch((error) =>{
		console.log('Unable to connect to MONGODB Atlas!');
		console.error(error);
	});
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
app.use(bodyParser.json());
app.post('/api/recipes', (req, res, next) => {
  const thing = new Thing({
		title: req.body.title,
		ingredients: req.body.ingredients,
		instructions: req.body.instructions,
		time: req.body.time,
		difficulty: req.body.difficulty
  });
  thing.save().then(
	() => {
		res.status(201).json({
			message: 'Post saved successfully!'
		});
	}
	).catch(
		(error) =>{
			res.status(400).json({
				error: error
			});
		}
	);
});
app.get('/api/recipes/:id',(req, res, next) => {
	Thing.findOne({
		_id: req.params.id
	}).then(
		(thing) =>{
			res.status(200).json(thing);
		}
	).catch(
		(error) =>{
			res.status(404).json({
				error: error
			});
		}
	);
});
app.put('/api/recipes/:id', (req, res, next) => {
	const thing = new Thing({
		_id: req.params.id,
		title: req.body.title,
		ingredients: req.body.ingredients,
		instructions: req.body.instructions,
		duration: req.body.duration,
		difficulty: req.body.difficulty
	});
	Thing.updateOne({_id: req.params.id}, thing).then(
	() => {
		res.status(201).json({
			mesage: 'Thing updated successfully!'
		});
	}
	).catch(
		(error) => {
			res.status(400).json({
				error: error
			});
		}
	);
});
app.delete('/api/recipes/:id', (req, res, next) => {
	Thing.deleteOne({_id: req.params.id}).then(
	() => {
		res.status(200).json({
			message: 'Deleted!'
		});
	}
	).catch(
		(error) => {
			res.status(400).json({
				error: error
			});
		}
	);
});
app.use('/api/recipes', (req, res, next) => {
  Thing.find().then(
    (things) => {
      res.status(200).json(things);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
});


module.exports = app;