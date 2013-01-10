<?php
use Everyman\Neo4j\Client,
	Everyman\Neo4j\Index\NodeIndex,
	Everyman\Neo4j\Relationship,
	Everyman\Neo4j\Node,
	Everyman\Neo4j\Cypher;

ini_set('memory_limit','1024m');

$nomeArquivoProconCSV = 'procon2009.csv';

$arquivoProconCSV = file_get_contents($nomeArquivoProconCSV);

$linhasArquivoProconCSV = explode("\n",$arquivoProconCSV);

$arquivoProconCSV = "";

$dadosProcon = array();

$file = new SplFileObject($nomeArquivoProconCSV);
$file->setFlags(SplFileObject::READ_CSV);
$file->setCsvControl(';');

foreach ($file as $dadosDaLinha) {
	$dadosProcon[] = $dadosDaLinha;
}

$chaves = array_shift($dadosProcon);
	
