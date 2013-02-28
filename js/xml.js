// Variáveis de tempo
var timeHolder, timeTemp = 0;

// Função que irá chamar os XML, recebe o endereço, os dados e a função que irá executar ao final
function postCallXML(endereco,dados,funcao) {
    var xhr = new XMLHttpRequest();
	if ("withCredentials" in xhr) {
		xhr.open("POST", endereco, true);
	} else if (typeof XDomainRequest != "undefined") {
		xhr = new XDomainRequest();
		xhr.open("POST", endereco);
	}
	xhr.onreadystatechange=function() {
		if(xhr.readyState==4 && xhr.status==200)
			funcao(xhr.responseXML);
	}
	xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhr.send(dados);
}

// Funcao que irá exibir a lista de sugestões de pesquisa
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

function pesquisar(termo,pagina) {
	var termoPesquisa = encodeURIComponent(termo);
	postCallXML('http://projetos.arturluiz.com/proconsulta/resultado.php','termo='+termoPesquisa+'&pagina='+pagina,function (xmlDoc) {
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
if(typeof inputPesqusia != "undefined") {
	inputPesqusia.onkeyup = function() {
		clearInterval(timeHolder);
		timeHolder = setInterval('mostraSugestao()',2000);
	}
	inputPesqusia.setAttribute('x-webkit-speech');
}
function clicaSugestao(dom) {
	inputPesqusia.value = dom.innerHTML;
	var x = document.getElementById('sugestoes');
	x.parentNode.removeChild(x);
	document.getElementById('form-busca').onsubmit();
}

var formBusca = document.getElementById('form-busca');
if(typeof formBusca != "undefined") {
	formBusca.onsubmit = function() {
		var termo = document.getElementById('busca-html5').value;
		var pagina = 1;
		pesquisar(termo,pagina);
	}
}