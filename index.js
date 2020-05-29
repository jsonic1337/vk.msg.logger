var VK = require("VK-Promise"),
    vk = new VK("TOKEN"); // user token

    var messages = {  }
    vk.longpoll.start();
    
vk.on('message', function onMessage(event, msg) {
   if (Object.keys(messages).indexOf(msg.chat_id.toString()) >= 0 && !msg.out){
     vk.users.get({
     user_id: msg.user_id
     }).then(function onResponse(res) {
     console.log('response',res[0].first_name);
     messages[msg.chat_id].push(`[id${msg.user_id}|${res[0].first_name}]: ${msg.body}`);
     console.log(messages);
     }).catch(function onError(error){
     console.log('Ошибка',error);
   })

if (messages[msg.chat_id].length >= 11){
messages[msg.chat_id].shift();
}
}
if (!msg.out) return
 if (msg.body.toLowerCase() == '/log' && Object.keys(messages).indexOf(msg.chat_id.toString()) == -1){
 messages[msg.chat_id] = [];
 vk.messages.edit({ peer_id: msg.peer_id, message: ('Чат добавлен!'), message_id: msg.id.toString() });
 }

if (msg.body.toLowerCase() == '/del' && Object.keys(messages).indexOf(msg.chat_id.toString()) >= 0) {
 delete messages[msg.chat_id.toString()];
 vk.messages.edit({ peer_id: msg.peer_id, message: ('Чат убран из списка!'), message_id: msg.id.toString() });
 }

if (msg.body.toLowerCase() == 'верни') {
 console.log(messages)
 vk.messages.delete({ delete_for_all: 1, message_ids: msg.id.toString() });

vk.messages.send({ peer_id: msg.peer_id, message: (messages[msg.chat_id].join('\n')), disable_mentions: 1 });
messages[msg.chat_id].length = 0;
  }
})
