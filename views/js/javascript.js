
var i = 0;
var j = 0;
var k = 0;
var images = [];
var image = [];
var imagek = [];
var time = 1000;

//images

images[0] = "images/afri.jpg";
images[1] = "images/foutou.jpg";
images[2] = "images/alloco.jpg";
images[3] = "images/asi.jpg";
image[0] = "images/euro1.jpg";
image[1] = "images/euro2.jpg";
image[2] = "images/euro3.jpg";
image[3] = "images/euro4.jpg";
imagek[0] = "images/asi1.jpg";
imagek[1] = "images/asi2.jpg";
imagek[2] = "images/asi3.jpg";
imagek[3] = "images/asi4.jpg";

// changer les images 
function changeImg(){
	document.slide.src = images[i];
	document.euro.src = image[j];
	document.asi.src = imagek[k];

	// Index Max Min

	if(i<images.length - 1){
		i++;
	} else {
		i = 0;
	}
	if(j<image.length - 1){
		j++;
	} else {
		j = 0;
	}
	if(k<imagek.length - 1){
		k++;
	} else {
		k = 0;
	}


	// lire chaque x seconde
	setTimeout("changeImg()", time);
}
window.onload=changeImg;
