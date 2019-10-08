<?php
$texto=$_POST['texto']; 

if($texto){
$enlace = mysqli_connect("localhost", "curwen", "5275786tele", "chat");
if ($enlace) {
    $textoAnterior="";
    $usuario="";
    $consulta = 'SELECT * FROM conversaciones WHERE id = "1"';
    $resultado = mysqli_query($enlace,$consulta);

    if($resultado){
        while($fila = $resultado->fetch_assoc()){
            $textoAnterior = $fila['texto'];
            $usuario = $fila['usuario'];
            }
            $contenedor= '<div class="row">
            <div class="caja-user">
            <p class="pUsuario">
            '.$usuario.': 
            </p>
            <p>'.$texto.'</p>
            </div>
            </div>';
            $completo = $textoAnterior.$contenedor;
            
            $consulta2 = "UPDATE conversaciones SET texto = '".$completo."' WHERE id = '1'";
            
            $query = mysqli_query($enlace,$consulta2);
            if($query){
                echo "OK";
                mysqli_close($enlace);
            }else{
                mysqli_error($query);
                echo $completo;
            }
            
            
    }else{
        mysqli_connect_error();
    }
    
    
}else{
    echo "Error: No se pudo conectar a MySQL." . PHP_EOL;
    echo "errno de depuración: " . mysqli_connect_errno() . PHP_EOL;
    echo "error de depuración: " . mysqli_connect_error() . PHP_EOL;
    exit;
}
}


// echo "Éxito: Se realizó una conexión apropiada a MySQL! La base de datos mi_bd es genial." . PHP_EOL;
// echo "Información del host: " . mysqli_get_host_info($enlace) . PHP_EOL;

?>