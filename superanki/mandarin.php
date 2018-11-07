<!DOCTYPE html>
<!-- saved from url=(0054)http://fynmorph.free.fr/sprite_comic/randomizer/random -->
<html><head><meta http-equiv="Content-Type" content="text/html; charset=Unicode"><meta name="robots" content="noindex">

   
   <title>CN TRAINER</title>
      <script class="jsbin" src="jquery-3.3.1.js"></script> <!-- je suis pas sûr de son utilité -->
      <script type="application/javascript">

        function el(id){return document.getElementById(id);} // Get elem by ID  
		function print(e) {console.log(e);}
		
			  function spliceSlice(str, index, count, add) {
  // We cannot pass negative indexes dirrectly to the 2nd slicing operation.
  if (index < 0) {
    index = str.length + index;
    if (index < 0) {
      index = 0;
    }
  }

  return str.slice(0, index) + (add || "") + str.slice(index + count);
}
			  
			function getRandom(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}


function get_random_color() {
    var h = getRandom(1, 360);
    var s = 100;
    var l = getRandom(20, 80);
    return 'hsl(' + h + ',' + s + '%,' + l + '%)';
}

function couleur(niveau){

	switch (parseInt(niveau)) {
    case 1:
        return '#fff';
        break;
    case 2:
        return '#ddc1ff';
        break;
    case 3:
        return '#99e9fa';
        break;
    case 4:
        return '#91ffc0';
        break;
    case 5:
        return 'fffaab';
        break;
    case 6:
        return '#c10000';
        break;
	case 7:
        return '#222222';
        break;
	case 8:
        return '#fff';
        break;
}
}

var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        return this.responseText;
    }
};

var niveau1 = [];
var niveau2 = [];
var niveau3 = [];
var niveau4 = [];
var niveau5 = [];
var niveau6 = [];
var niveau7 = [];
var niveau8 = [];
var niveau9 = [];

var array = "";

for (i=1;i<10;i++){
	window['niveau'+i]=[];

$.ajax({
	type: 'POST',
	url: 'lire.php',
	data: { 'chemin' : 'data' + i + '.txt'},
	async: false,
	success: function(data){
        array = data.split("\n"); //or something similar
    }
	});

	for (j =0; j< array.length; j++) {
	window['niveau'+i][j] = array[j].split("@");
	}
	
	if (window['niveau'+i] == "")	{window['niveau'+i] = ""} //la ligne la plus utile de tout ce code

}



var niveaumax = 9;
var niveau = 1;
var jour = 0;
var step = 0;

$.ajax({
	type: 'POST',
	url: 'lire.php',
	data: { 'chemin' : 'jour.txt'},
	async: false,
	success: function(data){
        jour = data.split("@")[0]; //or something similar
		step = data.split("@")[1]
		console.log(data);
    }
	});

function yaquoi(n){
	
	tableur = []
	if (n%64 == 50) {
		tableur.push("7");
	}
	if (n%32 == 16) {
		tableur.push("6");
	}
	if (n%16 == 8) {
		tableur.push("5");
	}
	if (n%8 == 4) {
		tableur.push("4");
	}
	if (n%4 == 2) {
		tableur.push("3");
	}
	if (n%2 == 1) {
		tableur.push("2");
	}
	tableur.push("1");

return tableur
}

function choixniveau(){

	motchoisi = false;
	
	while (motchoisi == false){

	if ( window["niveau" + (yaquoi(jour)[step])][0] != null){ //SI LE NIVEAU A DES MOTS
	motchoisi = true;
	}
	else {
		if ( step + 1 < yaquoi(jour).length ){ //SI IL RESTE DES STEPS A FAIRE
			step = parseInt(step) + 1;
		}
		else {
			step = 0; jour = parseInt(jour) + 1;
			//if (jour == 65){jour = 1;}
		}
	}
	
	}
	
	$.ajax({
	type: 'POST',
	url: 'overwrite2.php',
	data: { 'jour' : jour , 'step': step},
	});
	
	return yaquoi(jour)[step];
}


var state = 2; //state 1 question displayed (waiting for answer), state 2 answer (waiting for question)
var lang = "cn"; //if state is question, is the question english or chinese?
var behavior = "cn"; //stay cn ? go en ? alternate ?


function newword(e){
	
	for (i=1; i<10; i++){
	   el('carre'+i).style.height = (window["niveau"+i].length * 5) + 'px';
	   el('nbmots_carre'+i).innerHTML = window["niveau"+i].length;
	   el('carre'+i).style.background = couleur(i);
   }

if (state == 1){
	console.log(random);
	
	state = 2;
	
	if(lang=="en"){document.getElementById('answer').innerHTML = array2[random][0];
	document.getElementById('pinyin2').innerHTML = array2[random][2];
	}
	if(lang=="cn"){document.getElementById('answer').innerHTML = array2[random][1];
	el('pinyin').innerHTML = array2[random][2];}
	 
	}

else if (state == 2){
	
	niveau = choixniveau();

	for (i=0; i< niveaumax+1; i++)
	{
		if(niveau == i){array2 = eval("niveau"+i)};
	}
	
	state = 1;
	
	el('pinyin').innerHTML = "";
	el('pinyin2').innerHTML = "";
	el('answer').innerHTML = "";
	
	random = getRandom(0,array2.length-1);
	
	console.log(random);
	
	document.getElementById('level').innerHTML = niveau;
	document.getElementById('day').innerHTML = jour;
	
	el('prompt').style.background = couleur(niveau);
	
	if (niveau == '6' || niveau == '7'){
		el('prompt').style.color = 'white';
	}
	else{ el('prompt').style.color = 'black'; }
	
	if (e == 1){
	lang = "cn"
	el('word').innerHTML = array2[random][0];

		 }

	if (e == 2){
	lang = "en"
	el("word").innerHTML = array2[random][1];
}
}

}

function success(){
	if (window["niveau"+(parseInt(niveau)+1)] === "")  //you can't push into "" so i first check if it's ""
	{
		window["niveau"+(parseInt(niveau)+1)] = [array2[random]];
	}
	else {
		window["niveau"+(parseInt(niveau)+1)].push(array2[random]);
	}
			window["niveau"+niveau].splice(random,1);
			updateData(parseInt(niveau)+1);
			
			addcolor();
}

function fyneval(funcName, callback) {
    window[funcName] = callback;
}

function giveup() {
			if (state == 1){	newword(getRandom(1, 2)); 
			
			window["niveau"+niveau].splice(random,1);
			//LUL LUL LUL LUL
			//enlever à l'array niveau, celui sur lequel tu t'es trompé.
			
			console.log(niveau2);
			niveau1.push(array2[random]);
			
			updateData(1);
			}
			else if (state == 2){	newword(getRandom(1, 2)); }
}

function updateData(e){
	
	//bouge au niveau supérieur
	array2 = eval("niveau"+e);
	
data = [];
array = [];
	
	for (i =0; i< array2.length; i++) {
		array[i]= array2[i].join('@');
	}
	
	if (array[0]==""){array.splice(0,1);}
	
	data = array.join("\n");
	
	$.ajax({
	type: 'POST',
	url: 'overwrite.php',
	data: { 'data' : data, 'niveau' : e},
	});
	
	//enleve du niveau inférieur
	array2 = eval("niveau"+niveau);
	
data = [];
array = [];

	for (i =0; i< array2.length; i++) {
		array[i]= array2[i].join('@');
		
	}
	data = array.join("\n");
	
	$.ajax({
	type: 'POST',
	url: 'overwrite.php',
	data: { 'data' : data, 'niveau' : niveau},
	});

}


	function addcolor(){
			var div = document.createElement('div');
			div.classList.add('jolicarre');
			div.style.backgroundColor = get_random_color();
			
			var element = document.getElementById("carreaux");
			element.appendChild(div);
	}

	function exe(){
	var mdp = document.getElementById('pass').value;
	
	if (mdp.startsWith('eval(')) {
		var element = document.getElementById("result");
			element.innerHTML = "";
			element.appendChild(document.createTextNode (eval((mdp.slice(5,)))));
	}
	else{
	
	if (state == 1){
	if (lang=="cn"){
	if ( mdp.length == 0) {newword(1);}
	else if (mdp.length > 1){
		if ( (array2[random][1]).toLowerCase().includes(mdp.toLowerCase()) ){
			
			//IF YOU SUCCEEDED!!!
			newword(1);
			success();
		}
		else{
		
			var element = document.getElementById("result");
			element.appendChild(document.createTextNode ("X"));
		}	
	}
	}
	
	else if (lang=="en"){
	if ( mdp.length == 0) {newword(2);}
	else if ( array2[random][0].includes(mdp) ){
	
	newword(2);
	success();
	}
	
		else{
	
	var element = document.getElementById("result");
	element.appendChild(document.createTextNode ("X"));
	}	
	}
	}
	
	else if (state == 2){
		
		if (behavior == "random"){
			if (lang == "en"){newword(1);}
		
			else if (lang == "cn"){newword(2);}
		}
		
		else if (behavior == "cn") {newword(1);}
		else if (behavior == "en") {newword(2);}
	}
	}
	}
      </script>
      <style type="text/css">
	  
	  .jolicarre{width:50px; height:1000px;
	  float:left;
	  border:0px solid #ccc;}
	  
	  #carreaux{position:absolute;z-index:0;top:0px;left:0px;}
         
		 button { font-size: 30px;
		 background-color: #EE99DD;
    padding: 10px 20px;
    text-align: center;
    text-decoration: bold;
    display: inline-block;
    margin: 4px 2px;
    cursor: pointer;
	
	}
	
	#word{
	font-size: 60px;
	}
	#answer{
	font-size: 60px;
	}
	#pinyin{
	font-size: 20px;
	}
	#pinyin2{
	font-size: 20px;
	}
	
	.carre{
		position: relative;
		background:#fff;
		width:50px;
		display: inline-block;
	}
	
	.nbmots{
	margin: 0;
  position: relative;
  top: 35%;
		} 
      </style>
   </head>
   <body style="background-color:#aaa">
	<span id="carreaux"></span>
   <span style="position:absolute; z-index:1;left: 50%">
   <span style="position: relative; left: -50%;">
   <center>
   
   <button onclick="behavior = 'cn'; newword(1);" >CHINESE</button>
   <button onclick="behavior = 'random'; newword(getRandom(1, 2));" >RANDOM</button>
   <button onclick="behavior = 'en'; newword(2);" >ENGLISH</button>
   
   <br><br><span style="font-size:30px; font-family: 'comic sans ms';">Day:<span id="day"></span> Word LVL:<span id="level"></span></span><br>
   <div id="prompt" style="background:#fff">
   <div id="pinyin" style='height:20px'></div>
   <div id="word" style='height:80px'></div>
   <div id="pinyin2" style='height:20px'></div>
   <div id="answer" style='height:80px'></div>
   </div>
   <br>
   
   	<form action="javascript:exe();" method="get">
<input id="pass" value="" type="input"> <br>
<input type="submit" value="Submit">
	</form>
	<br>
	<button onclick="giveup();" >GIVE UP</button>
	<div id="result"></div>
	
	<div id="stats" style="text-align:center; font-family: 'Franklin Gothic';">
	<!-- ici y a l'histogramme -->
	</div>
	
	<script>
	for (i=1; i<10; i++)
	{	
		var div = document.createElement('div');
			div.classList.add('carre');
			div.id = 'carre'+i;
			div.innerHTML = i + '</br><span class="nbmots" id="nbmots_carre' + i +'"></span>'
			el('stats').appendChild(div);
	}
	</script>
	
	</span>
	</span>
   
   </center>
   
   


</body></html>