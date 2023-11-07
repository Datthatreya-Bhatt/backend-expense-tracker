const Sib = require('sib-api-v3-sdk');


const client = Sib.ApiClient.instance;

const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.SIB_API_KEY;

let url = 'localhost:3000';

exports.SibService = async (email,uid)=>{
    try{

        const transactionalEmailsApi = new Sib.TransactionalEmailsApi();

        const sender = {
            email: 'techkosha@gmail.com'
        }
    
        const receivers = [
            {
                email: `${email}`
            }
        ]
    
        
        let emailRes = await transactionalEmailsApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: 'test',
            textContent: `http://${url}/password/resetpassword/${uid}`
        })

        return emailRes;
    }
    catch(err){
        console.trace(err);
    }
};