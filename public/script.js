$(document).ready(function() {


$.ajax({
  url: "http://www.comicvine.com/api/movies/?api_key=79be3d46aa2e46ef73ccca95d14359c78c9bb0d5",
  method: "GET",
  success: function(data){
    console.log(data);
  }
})





});
