// Vari�veis de tempo
var timeHolder, timeTemp = 0;

// Fun��o que ir� chamar os XML, recebe o endere�o, os dados e a fun��o que ir� executar ao final
function postCallXML(endereco,dados,funcao) {
    if (window.XMLHttpRequest)
        xmlhttp = new XMLHttpRequest();
    else
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	console.log("withCredentials" in xmlhttp);
	xmlhttp.onreadystatechange=function() {
		if(xmlhttp.readyState==4 && xmlhttp.status==200)
			funcao(xmlhttp.responseXML);
	}
    xmlhttp.open("POST", endereco, true);
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlhttp.send(dados);
}

// Funcao que ir� exibir a lista de sugest�es de pesquisa
function mostraSugestao() {
	var termoPesquisa = encodeURIComponent(document.getElementById('busca-html5').value);
	clearInterval(timeHolder);
	if(timeTemp>0) {		
		var x = document.getElementById('sugestoes');
		x.parentNode.removeChild(x);
	}
	postCallXML('http://projetos.arturluiz.com/proconsulta/sugestao.php','termo='+termoPesquisa,function (xmlDoc) {
		var container = document.createElement('div');
		container.id = 'sugestoes';
		var content = ""; 
		var x = xmlDoc.getElementsByTagName("texto");
		var y = xmlDoc.getElementsByTagName("termo");
		console.log("Pesquisa pelo termo: "+y[0].childNodes[0].nodeValue+"\n");
		for (i = 0; i < x.length; i++)
			content += '<span onclick="clicaSugestao(this)">'+x[i].childNodes[0].nodeValue+'</span><br/>';
		container.innerHTML = content; 
        document.getElementById('form-busca').appendChild(container);
		timeTemp++;
	});
}

var inputPesqusia = document.getElementById('busca-html5');
if(typeof inputPesqusia != "undefined") 
	inputPesqusia.onkeyup = function() {
		clearInterval(timeHolder);
		timeHolder = setInterval('mostraSugestao()',2000);
	}
function clicaSugestao(dom) {
	inputPesqusia.value = dom.innerHTML;
	var x = document.getElementById('sugestoes');
	x.parentNode.removeChild(x);
	document.getElementById('form-busca').onsubmit();
}