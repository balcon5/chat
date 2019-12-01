let user='';
let listaClientes = [];
let clienteElegido = '';
let receptor;
let emisor;
let chat = [];
let userEncript;
let usuario;
let receptores = [];
const socket = io(); 
$(function(){
const userSession = sessionStorage.getItem('user'); 
console.log('userSession', userSession);
    if(userSession !== null ) { 
       const user = JSON.parse(userSession);
       console.log('a ', user.id);
       socket.id = user.id;
       console.log('b ', socket.id);
       usuario = user.usuario;
       userEncript = user.enc;
       chat = JSON.parse(user.chat);
       clienteElegido = user.elegido;
       listaClientes = JSON.parse(user.clientes);
       $('#login').css('display', 'none');
       $('#chat').css('display', 'block');
       setTimeout(()=>{
        console.log('c  ', socket.id);
        socket.emit('login',{
            id: socket.id,
            usuario: usuario,
            enc:userEncript
        });
        $('#contChatBox').attr('id','contChatBoxMaster');
        $('#chatBox').attr('id','chatBoxMaster');
        socket.emit('conn', {
            emisor: socket.id,
            receptor: clienteElegido
        });
        const arr=[];
        receptores.forEach( rec => {
            if(rec.idReceptor === clienteElegido) {
                arr.push({
                idReceptor: rec.idReceptor,
                nMensagge: 0
            });
            $('#noleido' + clienteElegido).html('');
            }else{
            arr.push(rec);
            }
        });
        receptores = arr;
        chat.forEach( data => {
            if (data.seleccion === clienteElegido || data.id === clienteElegido) {
                let clase = 'cont-own';
                if(data.usuario !== usuario ) {
                   clase = 'cont-user'
                }
                $('#chatBoxMaster').append('<div class="flex-none"><div class="' + clase + '"><p class="nameUsers">'+ data.usuario  +'</p><p>' + data.mensaje + '</p></div></div></p>');
            }
        });
        socket.emit('enviando mensaje', 
            {
                id: socket.id,
                usuario: usuario,
                mensaje: '',
                seleccion:clienteElegido
            }
            );

       }, 500);
       
     
    }
    $('#btnChat').on('click', function(){
       
        if($('#inputChat').val() != '') {
            socket.emit('enviando mensaje', 
            {
                id: socket.id,
                usuario: usuario,
                mensaje: $('#inputChat').val(),
                seleccion:clienteElegido
            }
            );
            $('#inputChat').val('');
        }  
    });

    $('#btnLog').on('click',() => {
        if($('#inputLog').val() != ''){
            user = $('#inputLog').val();
            userEncript = btoa(user);
            usuario = user;
            $('#login').css('display', 'none');
            $('#chat').css('display', 'block');
            socket.emit('login',{
                id: socket.id,
                usuario: usuario,
                enc:userEncript
            });
        }
    });

    socket.on('nuevo mensaje', data => {

        let clase = 'cont-own';
        if(data.usuario !== usuario ) {
           clase = 'cont-user'
        }
        if(socket.id === data.seleccion){
            clienteElegido = data.id;
        }
            if( (data.id === socket.id || data.seleccion === socket.id) && data.mensaje !== '' ) {
                chat.push({
                    id: data.id ,
                    usuario: data.usuario,
                    mensaje: data.mensaje,
                    seleccion: data.seleccion
                });
                $('#chatBox').append('<div class="flex-none"><div class="' + clase + '"><p class="nameUsers">'+ data.usuario  +'</p><p>' + data.mensaje + '</p></div></div></p>');
                 if( data.id === receptor || data.id === emisor){
                    $('#chatBoxMaster').append('<div class="flex-none"><div class="' + clase + '"><p class="nameUsers">'+ data.usuario  +'</p><p>' + data.mensaje + '</p></div></div></p>');
                    const heightMaster = $('#chatBoxMaster').height();
                    $('#contChatBoxMaster').animate({scrollTop:heightMaster},500);
                    
                 }else {
                     let n = 0;
                     const arr=[];
                     receptores.forEach( rec => {
                         if(rec.idReceptor === data.id) {
                             n = rec.nMensagge;
                             n++;
                             arr.push({
                                 idReceptor: rec.idReceptor,
                                 nMensagge: n
                             });
                             $('#noleido' + data.id).html('<span class="badge badge-primary">' +  n +'</span>');
                         }else{
                             arr.push(rec);
                         }
                     });
                     receptores = arr;
                 }
                 const heigthChat = $('#chatBox').height();
                 $('#contChatBox').animate({scrollTop:heigthChat},500); 
                 
            }else{
                console.log('entra aca');
               
            }
        
        
    });

    socket.on('clientes', clientes => {
        let index =0;
        listaClientes = clientes;
        console.log('listaClientes', listaClientes );
        $('#clientes').html('');
        listaClientes.forEach( cliente=> {
            if(cliente.id !== socket.id) {
                $('#clientes').append('<a class="dropdown-item" href="#" onclick="selectCliente('+index+')">' + cliente.usuario + '&nbsp;<span id="noleido' + cliente.id + '"></span></a><div class="dropdown-divider"></div>');
                receptores.push({
                    idReceptor:cliente.id,
                    nMensagge:0
                });
            }
            index++;
        });
    });

    socket.on('conected', data => {
        receptor = data.receptor;
        emisor = data.emisor;
    });
    window.onbeforeunload = function(e) {
        // sessionStorage.setItem('users', JSON.stringify(listaClientes));
        if(chat.length > 0){
            const user={
                id: socket.id,
                usuario: usuario,
                enc:userEncript,
                chat: JSON.stringify(chat),
                clientes: JSON.stringify(listaClientes),
                elegido: clienteElegido
            };
            const str =JSON.stringify(user);
            sessionStorage.setItem('user', str);

        }
       
    };
});
function selectCliente(cli) {
    clienteElegido = listaClientes[cli].id;
    $('#contChatBox').attr('id','contChatBoxMaster');
    $('#chatBox').attr('id','chatBoxMaster');
    $('#chatBoxMaster').html('');
    console.log('d ', socket.id);
    socket.emit('conn', {
        emisor: socket.id,
        receptor: clienteElegido
    });
    const arr=[];
    receptores.forEach( rec => {
            if(rec.idReceptor === clienteElegido) {
                arr.push({
                idReceptor: rec.idReceptor,
                nMensagge: 0
            });
            $('#noleido' + clienteElegido).html('');
            }else{
            arr.push(rec);
            }
        });
        receptores = arr;
    chat.forEach( data => {
        if (data.seleccion === clienteElegido || data.id === clienteElegido) {
            let clase = 'cont-own';
            if(data.usuario !== user ) {
               clase = 'cont-user'
            }
            $('#chatBoxMaster').append('<div class="flex-none"><div class="' + clase + '"><p class="nameUsers">'+ data.usuario  +'</p><p>' + data.mensaje + '</p></div></div></p>');
        }
    });
    
}