
// Twilio Credentials
const accountSid = 'AC824e26650e496f390c9cbcd505832089';
const authToken = 'b9750806e2644eb8be18f108c025300c';

// require the Twilio module and create a REST client
const clientTwilio = require('twilio')(accountSid, authToken);

export default class Utils { 

  isCpf(c){
    if((c = c.replace(/[^\d]/g,"")).length != 11) return false;
    if (c == "00000000000") return false;
    let r;
    let s = 0;   
    for (let i=1; i<=9; i++) s = s + parseInt(c[i-1]) * (11 - i); 
    r = (s * 10) % 11;
    if ((r == 10) || (r == 11)) r = 0;
    if (r != parseInt(c[9])) return false;
    s = 0;
    for (let i = 1; i <= 10; i++) s = s + parseInt(c[i-1]) * (12 - i); 
    r = (s * 10) % 11;
    if ((r == 10) || (r == 11)) r = 0;
    if (r != parseInt(c[10])) return false;
    return true;
  }

  isEmail(email) {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  cleanCPF(cpf){
    cpf = cpf.replace('.', '');
    cpf = cpf.replace('.', '');
    return cpf.replace('-', '');
  }

  sendSMS(phone, msg ){
    return new Promise(( resolve, reject) => {
      clientTwilio.messages.create({
          to: phone,
          from: '+13304038180',
          body: msg,
        }, (err, message) => {
          if(err){ reject(err) }
            resolve(message)
        });
    })
  }

}