function chamar() {
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.open("GET", "cd_catalog.xml", false);
    xmlhttp.send();
    xmlDoc = xmlhttp.responseXML;

    document.write('<table class="tabela" border="1">');
    var x = xmlDoc.getElementsByTagName("CD");
    for (i = 0; i < x.length; i++)
    {
        document.write('<tr><td class="td">');
        document.write(x[i].getElementsByTagName('TITLE')[0].childNodes[0].nodeValue);
        document.write('</td><td class="td">');
        document.write(x[i].getElementsByTagName('ARTIST')[0].childNodes[0].nodeValue);
        document.write('</td><td class="td">');
        document.write(x[i].getElementsByTagName('COUNTRY')[0].childNodes[0].nodeValue);
        document.write('</td><td class="td">');
        document.write(x[i].getElementsByTagName('COMPANY')[0].childNodes[0].nodeValue);
        document.write('</td><td class="td">');
        document.write(x[i].getElementsByTagName('PRICE')[0].childNodes[0].nodeValue);
        document.write('</td><td class="td">');
        document.write(x[i].getElementsByTagName('YEAR')[0].childNodes[0].nodeValue);
        document.write('</td></tr>');
    }
    document.write('</table>');
}