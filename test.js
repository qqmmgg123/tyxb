var nodemailer = require('nodemailer');

var transportOptions =  {
        host: 'smtp.gmail.com',
        port: 465,
        service: 'Gmail',
        auth: {
            user: 'qqmmgg123@gmail.com',
            pass: 'Suopoearth123'
        }
        //proxy: 'http://dev-proxy.oa.com:8080/'
        //proxy: 'http://127.0.0.1:8087'
    };

var transporter = nodemailer.createTransport(transportOptions);

var mailOptions = {
                        to: 'hakehaha123@sina.cn',
                        from: '娑婆世界 <qqmmgg123@gmail.com>',
                        subject: '娑婆世界密码重置邮件',
                        html: '<p>该邮件用于为您的账号提供重置密码的请求链接.</p>' +
                              '<p>请点击 <a href="">这里 </a>发送请求进行密码重置操作, 若点击无效请将以下链接拷贝黏贴到您浏览器的地址栏，并访问，以便完成密码重置操作:</p>' +
                              '<p></p>' +
                              '<p>如果您不做当前这一步操作，请忽略该邮件，您的密码不会有任何改变。</p>',
                        text: '该邮件用于为您的账号提供重置密码的请求链接.\n\n' +
                              '请点击提供给您的链接, 或者将该链接黏贴到您浏览器的地址栏，并访问，以便完成密码重置:\n\n' +
                              '如果您不做当前这一步操作，请忽略该邮件，您的密码不会有任何改变。\n'
                    };

                    transporter.sendMail(mailOptions, function() {
                        console.log(arguments);
                    });
