
// require the Twilio module and create a REST client
const clientTwilio = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
const nodemailer = require('nodemailer');

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

  generateHash(){
    return require('crypto')
          .createHash('sha256')
          .update(`${ Math.random(10000000) }`)
          .update('salt').digest('hex')
  }

  sendSMS(phone, msg ){
    return new Promise(( resolve, reject) => {
      clientTwilio.messages.create({
          to: phone,
          from: process.env.TWILIO_PHONE,
          body: msg,
        }, (err, message) => {
          if(err){ reject(err) }
            resolve(message)
        });
    })
  } 

  sendEmail(email, subject, body){ 
    return new Promise((resolve, reject)=>{

        let transporter = 
        nodemailer.createTransport({
          service: process.env.SMTP_SERVICE,
          auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
          }
        });
      
        transporter.sendMail({
          from: process.env.SMTP_SENDER,
          to: email,
          subject: subject,
          html: body
        }, (error, info) => {
            if (error) {
              reject(error);
            } else {
              resolve(info);
            }
        });

    }) 
  }


  forgotEmail(user, token){
    return `Caso nao tenha solicitado esse email, descosidere-o <br> <a href="${ process.env.APPLICATION_URL }create_password?email=${ user.email }&token=${ token }" target="new">clique aqui</a> para criar sua nova senha`
  }

}