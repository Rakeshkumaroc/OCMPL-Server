// const accountSid = 'ACc41a42089fa8a3cad7061bb75205ac88';
// const authToken = '5be18bb077a089d093fbf4a30d764f7d';
// const client = require('twilio')(accountSid, authToken);

// client.verify.v2.services("VA4da1d5729f9d233971ab2b91f08d3811")
//       .verifications
//       .create({to: '+917091506903', channel: 'sms'})
//       .then(verification => console.log(verification.sid));


      const accountSid = 'ACc41a42089fa8a3cad7061bb75205ac88';
const authToken = '5be18bb077a089d093fbf4a30d764f7d';
const client = require('twilio')(accountSid, authToken);

client.verify.v2.services("VA4da1d5729f9d233971ab2b91f08d3811")
      .verificationChecks
      .create({to: '+917091506903', code: '503090'})
      .then(verification_check => console.log(verification_check.status));