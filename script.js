fetch('../settings/settings.json', {
	method: "POST",
	headers: {
		"Content-Type": "text/plain"
})
.then((response) => response.json())
.then((json) => {

	const themeName = json.appearance[0].theme;
	console.log(themeName);

});

/*fetch(`../assets/themes/${themeName}.json`)
.then((response) => response.json())
.then((theme) => {

	const themeJson = theme;

});*/
