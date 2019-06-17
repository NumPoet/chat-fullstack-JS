// console.log('Chat  Area !!!!!!!!');
$(function(){
    // alert('Jquery  arriba del avión!!!');
    const socket = io();
    /**Obteniendo los elementos del DOM desde la interface */
    const $messageForm = $('#message-form');
    const $messageBox = $('#message');
    const $chat = $('#chat');
    /**Obteniendo los elementos del DOM desde nickName form */
    const $nickForm = $('#nickForm');
    const $nickError = $('#nickError');
    const $nickname= $('#nickname');

    const $users = $('#usernames');

    $nickForm.submit(e => {
        e.preventDefault();
        // console.log('enviando ....');
        socket.emit('new user', $nickname.val(), data => {
            if(data) {
                $('#nickWrap').hide();
                $('#contentWrap').show();
            }else {
                $nickError.html(`
                <div class="alert alert-danger">
                    Ese usuario ya existe
                </div>
                `);
            }
            $nickname.val('');
        });
    });
    /**Eventos */
    $messageForm.submit(e => {
        e.preventDefault();
        // console.log($messageBox.val());
        socket.emit('send message', $messageBox.val(), data => {
            $chat.append(`<p class="error">${data}</p>`);
        });
        $messageBox.val('');
    });

    socket.on('new message', function(data){
        $chat.append('<b>' + data.nick + '</b>: ' + data.msg + '<br/>');
    });

    socket.on('usernames', data => {
        let html = '';
        for (let i = 0; i < data.length; i++){
            html += `<p><i class="fas fa-user"></i> ${data[i]}</p>`
        }
        $users.html(html);
    });

    socket.on('wisper', data => {
        $chat.append(`<p class="wisper"><b>${data.nick}</b> ${data.msg}</p>`);
    });
});