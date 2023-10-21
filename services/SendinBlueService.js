const Sib = require('sib-api-v3-sdk');


const client = Sib.ApiClient.instance;

const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.SIB_API_KEY;



exports.SibService = async (email,uid)=>{
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
            textContent: `http://54.208.165.234/password/resetpassword/${uid}`
        })

        return emailRes;

};