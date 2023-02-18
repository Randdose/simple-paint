const r = document.querySelector(':root');
const rs = window.getComputedStyle(r);

fetch('/home/random/Downloads/Projects/WEB/Paint/settings/settings.json')
.then((response) => response.json())
.then((json) => console.log(json));

rs.style.setProperty('--main', )
rs.style.setProperty('--sec')
rs.style.setProperty('--transp')
rs.style.setProperty('--back')
rs.style.setProperty('--for')
rs.style.setProperty('--inact')
