$(document).ready(function() {


$.ajax({
  url: "http://www.comicvine.com/api/movies/?api_key=moviecomic",
  method: "GET",
  success: function(data){
    console.log(data);
  }
})





});
