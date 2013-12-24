var time_ms=0; 
require(['$api/models', '$views/list#List', '$views/buttons'],function(models, List, button) {
var isFour = false; 
var dropbox = document.querySelector('#metlist-content');

var main = models.Playlist.createTemporary().done(function(meta) { 
	
	meta.addEventListener('change', function(e) {
	dropbox.innerHTML="";
	var list = List.forPlaylist(meta);
	dropbox.appendChild(list.node);
	list.init(); 
	meta.load('tracks').done(function(p) {
	p.tracks.snapshot().done(function(t) {
	time_ms=0;
	var tracks = t.toArray(); 
	for (var i=0;i<tracks.length;i++) {
		time_ms+= tracks[i].duration; 	
		}//for  
	update_time(); 	
	});//actual updating
	});

	}); 
 	meta.addEventListener('insert', function(e) {
	dropbox.innerHTML="";
	var list = List.forPlaylist(meta);
	dropbox.appendChild(list.node);
	list.init(); 


	}); 
	meta.load('tracks').done(function(m) {
	m.tracks.clear(); 
	dropbox.addEventListener('dragstart', function(e) {

		e.dataTransfer.setData('text/html', this.innerHTML);
		e.dataTransfer.effectAllowed = 'copy';
	}, false);
	
	dropbox.addEventListener('dragenter', function(e) {

	if (e.preventDefault) e.preventDefault();
	e.dataTransfer.dropEffect = 'copy';
	this.classList.add('over'); 
	}, false); 
	
	dropbox.addEventListener('dragover', function(e) {
	if (e.preventDefault) e.preventDefault();
	e.dataTransfer.dropEffect = 'copy';
	return false;
	}, false);

	dropbox.addEventListener('drop', function(e) {

	 
	if (e.preventDefault) e.preventDefault();
	var drop = models.Playlist.fromURI(e.dataTransfer.getData('text'));
	this.classList.remove('over');
	var success_msg = document.getElementById('status');
	success_msg.innerHTML = 'Playlist dropped';
	drop.load('tracks').done(function(p) {
	p.tracks.snapshot().done(function(t) {
	var tracks = t.toArray(); 
	for (var i=0;i<tracks.length;i++) {
		time_ms+= tracks[i].duration; 	
		m.tracks.add(tracks[i]); 
		}//for  
	update_time(); 	
	var list = List.forPlaylist(meta);
	dropbox.appendChild(list.node); 	
	list.init(); 
	});//actual updating
	});//updating time 
	}, false); 
		

	models.application.addEventListener('dropped', function(e) {

	console.log(models.application.dropped);
	});
});
	});
var button = button.Button.withLabel('4-Track Mode'); 
	var add_button = document.getElementById('spanbutton');
	add_button.appendChild(button.node); 
	add_button.addEventListener('click', function() {
isFour = !isFour; 
if (isFour) {
main.done(function(p) {
p.load('tracks').done(function(t) {
t.tracks.snapshot().done(function(ts) {
var tracks = ts.toArray(); 
t.tracks.clear();
var tracknums = [];
for (var i=0; i<tracks.length; i++) {
tracknums.push(tracks[i].number-1);
tracks[i].album.load('tracks').done(function(alb) {
alb.tracks.snapshot().done(function(albt) {
var album_tracks = albt.toArray(); 
var four = [];  
var index = tracknums.shift(); 
for (var j=0; j<4; j++) { 
var candidate = album_tracks[index+j]; 
if (candidate!=undefined) { four.push(candidate);} 
}//for j
p.load('tracks').done(function(t) {
t.tracks.add(four); 
});//album_tracks 
});//get_original album  
}); 
}//for i  
});//get meta tracklist detalis  
 });//get meta tracks 
});//get meta  

}//if isFour

else {
main.done(function (p) {
p.load('tracks').done(function(t) {
t.tracks.snapshot().done(function (sh) {
var x=Math.floor(sh.length/4);
for (var j=0; j<x;j++) {
t.tracks.snapshot().done(function (sh) { 
var tracks = sh.toArray(); 
t.tracks.snapshot().done(function (sh) { t.tracks.remove(sh.find(tracks[j+1])); }); 
t.tracks.snapshot().done(function (sh) { t.tracks.remove(sh.find(tracks[j+2])); }); 
t.tracks.snapshot().done(function (sh) { t.tracks.remove(sh.find(tracks[j+3])); }); 
}); 
}
}); 
}); 
}); 
} 

var temp = document.getElementById('status');
if (isFour) temp.innerHTML = '4 Track Enabled'; 
else temp.innerHTML = '4 Track Disabled';
}); 

}); 


function update_time() { 
var minutes = Math.floor(time_ms / 60000); 
var seconds = Math.floor((time_ms % 60000)/1000);
if (seconds < 10) seconds = "0"+seconds; 
if (minutes < 10) minutes = "0"+minutes; 
var time = document.getElementById('time_tag'); 
time.innerHTML = "Current Time : " + minutes + ":" + seconds;  

}

 
