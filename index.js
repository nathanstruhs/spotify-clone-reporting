const { Consumer } = require('sqs-consumer');
const AWS = require('aws-sdk');
const fs = require('fs');

AWS.config.update({
  region: 'us-east-1',
});

AWS.config.update({
  region: 'eu-west-1',
  accessKeyId: process.env.KEY,
  secretAccessKey: process.env.SECRET
});

const app = Consumer.create({
  queueUrl: 'https://sqs.us-east-1.amazonaws.com/739260242084/reporting',
  attributeNames: [
    "artist",
    "album",
    "song",
  ],
  messageAttributeNames: [ "All" ],
  handleMessage: async (message) => {
    console.log('--- play ---');
    console.log(message.MessageAttributes.artist.StringValue);
    console.log(message.MessageAttributes.album.StringValue);
    console.log(message.MessageAttributes.song.StringValue);
    console.log('---');
    let data = {
      artist: message.MessageAttributes.artist.StringValue,
      album: message.MessageAttributes.album.StringValue,
      song: message.MessageAttributes.song.StringValue
    }
    fs.writeFile("/reporting/logs", data, function(err) {
      if(err) {
          return console.log(err);
      }
  });
  },
  sqs: new AWS.SQS({apiVersion: '2012-11-05'})
});

app.on('error', (err) => {
  console.error(err.message);
});

app.on('processing_error', (err) => {
  console.error(err.message);
});

app.start();
