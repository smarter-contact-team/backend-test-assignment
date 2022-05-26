import * as functions from 'firebase-functions';

export default functions
  .runWith({
    maxInstances: 1,
  })
  .https
  .onRequest((req, res) => {
    
  })
