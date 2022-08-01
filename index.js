function funcion_externa(){
  console.log("funcion_externa");
}


var AffTracker = {
  print_data: function(data){
    console.log(data);
  },
  test: function(){
    console.log("Hola mundo");
  },
  call_funcion_externa: function(){
    funcion_externa();
  }
}