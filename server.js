const express = require('express');
const app = express();
const mongoose = require('mongoose');
let count = 0;

const connect = async () => {
  try {
    const db = await mongoose.connect(
      'mongodb://127.0.0.1:27018,127.0.0.1:27019,127.0.0.1:27020/check?replicaSet=rs0',
      {
        readPreference: 'secondaryPreferred', // Prefer secondary for reads
        writeConcern: { w: 'majority' }, // Ensure writes happen on the primary
      }
    );
    console.log('MongoDB connected Successfully..');
    return db;
  } catch (er) {
    console.log('Mongodb Connection Error!..', er.message);
    process.exit(1);
    return;
  }
};

const schema = new mongoose.Schema({
  name: String,
  count: Number,
});

const model = mongoose.model('user', schema);

app.get('/', async (req, res) => {
  try {
    const data = await model.find();
    res.status(200).send({ data });
    return;
  } catch (er) {
    res.status(500).send({ message: er.message });
    return;
  }
});
app.post('/', async (req, res) => {
  try {
    count += 1;
    const data = await model.create({ name: 'nayan', count });
    res.status(200).send({ data });
    return;
  } catch (er) {
    res.status(500).send({ message: 'Internal Server error!..' });
    return;
  }
});

app.listen(8080, async () => {
  await connect();
  console.log('Server listening on the port 8080');
});
