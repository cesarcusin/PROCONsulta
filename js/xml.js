// Variáveis Temporárias
var	timeHolder,
	timeTemp	= 0;

// Variáveis de Configuração
var	$idInputBusca	= "busca-html5",
	$timeSugestao	= 1000,
	$idSugestoes	= "sugestoes",
	$classSugestao	= "sugestao";

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
	// Cancela o timing de carregar as sugestões
	clearInterval(timeHolder);
	
	// Verifica se já existe sugestões e limpa caso verdadeiro
	var sugestaoDOM = document.getElementById($idSugestoes);
	if(typeof sugestaoDOM != "undefined" && sugestaoDOM != null) {
		sugestaoDOM.parentNode.removeChild(sugestaoDOM);
	}
	
	// Pega o termo da busca
	var inputBuscaDOM = document.getElementById($idInputBusca);
	if(typeof inputBuscaDOM != "undefined" && inputBuscaDOM != null) {
		var termoPesquisa = encodeURIComponent(inputBuscaDOM.value);
	} else {
		console.log("Não foi possível encontrar o campo de busca.");
	}
	
	// Puxa o XML com as sugestões
	console.log("Buscando sugestões para o termo: " + termoPesquisa);
	postCallXML('http://projetos.arturluiz.com/proconsulta/sugestao.php','termo='+termoPesquisa,function (xmlDoc) {
		var container = document.createElement('div');
		container.id = $idSugestoes;
		var content = "<br><h4>Sugestões:</h4>"; 
		var x = xmlDoc.getElementsByTagName("texto");
		var y = xmlDoc.getElementsByTagName("termo");
		console.log("Sugestões para o termo: "+y[0].childNodes[0].nodeValue);
		for (i = 0; i < x.length; i++) {
			var sugestao = x[i].childNodes[0].nodeValue;
			content += '<span class="'+$classSugestao+'" onclick="clicaSugestao(this)">'+sugestao+'</span><br/>';
		}
		container.innerHTML = content; 
        	document.getElementById('form-busca').appendChild(container);
	});
}

function pesquisar(termo,pagina) {
	var termoPesquisa = encodeURIComponent(termo);
	postCallXML('http://projetos.arturluiz.com/proconsulta/resultado.php','termo='+termoPesquisa+'&pagina='+pagina,function (xmlDoc) {
		var container = document.createElement('div');
		container.id = 'resultado';
		var content = "<br><h4>Resultados</h4>"; 
		if(pagina>1) {
			content += "<a href=\"#\" title=\"Voltar página\">Voltar</a>";
		}
		var x = xmlDoc.getElementsByTagName("texto");
		var y = xmlDoc.getElementsByTagName("termo");
		console.log("Pesquisa pelo termo: "+y[0].childNodes[0].nodeValue);
		for (i = 0; i < x.length; i++)
			content += '<a class=\"pesquisa\" onclick="clicaResultado(this)">'+x[i].childNodes[0].nodeValue+'</a><br/>';
		container.innerHTML = content; 
        document.getElementById('form-busca').appendChild(container);
		timeTemp++;
	});
}

var inputPesqusia = document.getElementById('busca-html5');
if(typeof inputPesqusia != "undefined") {
	inputPesqusia.onkeyup = function() {
		clearInterval(timeHolder);
		timeHolder = setInterval('mostraSugestao()',$timeSugestao);
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
		return false;
	}
}
