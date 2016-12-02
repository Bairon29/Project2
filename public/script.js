$(document).ready(function() {
console.log('script loaded');
var movies = new Object();
var MOVIECOMIC = config.MOVIECOMIC;
$.ajax({
  url: "http://comicvine.com/api/search/?api_key="+ MOVIECOMIC+ "&query=movies&format=json",
  method: "GET",
success: function(data){
console.log(data)
  movies.results = data.results;
for(var i in movies.results){
  var $form = $('<form action="/add" method="post" ></form>');
  var $input = $('<input class="low" name="name" value='+movies.results[i].name+' />');
  var $input2 = $('<input class="low" name="img" value='+movies.results[i].image.small_url+' />');
  var $button = $('<button type="submit" >Add</button>');
  $form.append($button);
   $form.append($input);
   $form.append($input2);
  var $div = $('<div id="movies"></div>');
  var $name = $('<p name="name" >'+movies.results[i].name+' </p>');
  var $img = $('<img name="img" src='+movies.results[i].image.super_url+' >');
  $img.css({
    height: '100px',
    wigth: '200px'
  });
  $div.append($name);
  $div.append($img);
  $div.append($form);
  $('#container').append($div);
}
}
})



});



