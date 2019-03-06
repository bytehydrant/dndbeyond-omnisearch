function makeSearchUrl(term)
{
	return 'https://www.dndbeyond.com/search?q=' + encodeURIComponent(term);
}

chrome.omnibox.onInputEntered.addListener(function(text, disposition)
{
	var newURL = makeSearchUrl(text);
    chrome.tabs.update({ url: newURL });
});

chrome.omnibox.onInputChanged.addListener(function(text, suggest)
{
	var xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.onreadystatechange = function()
	{
		if (this.readyState == 4 && this.status == 200) {
			var response = JSON.parse(xmlHttpRequest.responseText);
			var suggestions = Array.from(response.list, x => ({content:x, description:x}));
			suggest(suggestions);
		}
	};
	xmlHttpRequest.open( "GET", "https://www.dndbeyond.com/es/term?query=" + encodeURIComponent(text), true /*async*/ );
    xmlHttpRequest.send( null );
});