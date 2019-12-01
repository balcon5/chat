module.exports = function(io){

let clientes = [];
let clientesPar = [];

    io.on('connection', socket => {
        console.log('nuevo usuario conectado');
        
        socket.on('enviando mensaje', data => {
 
           io.emit('nuevo mensaje',data);
        });
        socket.on('login', data => {
            if(clientes.length !== 0){
                clientes.forEach( cliente => {
                    if(data.enc !== cliente.enc){
                        clientesPar.push(cliente);
                        console.log('si');
                    }
                });
                
            }
            
            clientesPar.push(data);
            clientes = clientesPar;
            clientesPar =[];
            io.emit('clientes', clientes);
         });
         socket.on('conn', data => {
            io.emit('conected', data);
         });
    });

}
