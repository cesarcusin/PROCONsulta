// Variáveis Temporárias
var	timeHolder;

// Variáveis de Configuração
var	$idFormBusca	= "form-busca";
	$idInputBusca	= "busca-html5",
	$timeSugestao	= 1000,
	$idSugestoes	= "sugestoes",
	$classSugestao	= "sugestao",
	$idResultados	= "resultado",
	$classResultado	= "resultados";

// Função que irá chamar os XML, recebe o endereço, os dados e a função que irá executar ao final
function postCallXML(endereco, dados, funcao) {
	var xhr = new XMLHttpRequest();
	if ("withCredentials" in xhr) {
		xhr.open("POST", endereco, true);
	} else if (typeof XDomainRequest != "undefined") {
		xhr = new XDomainRequest();
		xhr.open("POST", endereco);
	}
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4 && xhr.status == 200)
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

// Função que irá exibir as respostas da busca
function pesquisar(termo, pagina) {
	// Verifica se já existe resultados e limpa caso verdadeiro
	var resultadoDOM = document.getElementById($idResultados);
	if(typeof resultadoDOM != "undefined" && resultadoDOM != null) {
		resultadoDOM.parentNode.removeChild(resultadoDOM);
	}
	
	// Codifica termo de busca para o padrão URL
	var termoPesquisa = encodeURIComponent(termo);
	
	// Puxa o XML dos resultados
	console.log('Pesquisa pelo termo: ' + termo);
	postCallXML('http://projetos.arturluiz.com/proconsulta/resultado.php','termo=' + termoPesquisa + '&pagina=' + pagina,function (xmlDoc) {
		var container = document.createElement('div');
		container.id = $idResultados;
		var content = "<br><h4>Resultados</h4>"; 
		if(pagina>1) {
			content += '<a href="#" title="Voltar página">Voltar</a>';
		}
		var x = xmlDoc.getElementsByTagName("texto");
		var y = xmlDoc.getElementsByTagName("termo");
		console.log("Resultados do termo: " + y[0].childNodes[0].nodeValue);
		for (i = 0; i < x.length; i++)
			content += '<a class="' + $classResultado + '" onclick="clicaResultado(this)">' + x[i].childNodes[0].nodeValue + '</a><br/>';
		container.innerHTML = content; 
        	document.getElementById($idFormBusca).appendChild(container);
	});
	return false;
}

// Funções das sugestões
var inputPesquisa = document.getElementById($idInputBusca);
if(typeof inputPesquisa != "undefined") {
	// Adiciona o escutador de evento ao clicar nas sugestões
	inputPesquisa.onkeyup = function() {
		clearInterval(timeHolder);
		timeHolder = setInterval(mostraSugestao, $timeSugestao);
	}
	
	// Adiciona suporte à fala nos navegadores webkit
	inputPesquisa.setAttribute('x-webkit-speech');
}
function clicaSugestao(dom) {
	// Coloca o valor do input-busca com o valor da sugestão
	inputPesquisa.value = dom.innerHTML;
	
	// Remove quadro de sugestões
	var sugestaoDOM = document.getElementById($idSugestoes);
	if(typeof sugestaoDOM != "undefined" && sugestaoDOM != null) {
		sugestaoDOM.parentNode.removeChild(sugestaoDOM);
	}
	
	// Executa a busca
	document.getElementById($idFormBusca).onsubmit();
}

// Funções da busca
var formBusca = document.getElementById($idFormBusca);
if(typeof formBusca != "undefined") {
	// Adiciona evento ao enviar do formulário
	formBusca.onsubmit = function() {
		var termo = document.getElementById($idInputBusca).value;
		var pagina = 1;
		return pesquisar(termo, pagina);
	};
}
