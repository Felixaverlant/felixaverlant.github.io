$(document).ready(function(){

	console.log("code is dirty I know. Maybe someday I'll re-do it...");
	

	$(function(){

		var string1 = "felix.averlant";
		var string2 = "@";
		var string3 = "gmail.com";
		var string4 = string1 + string2 + string3;

		$("#talk-1").typed({
			strings: ["Gi ^50 I'm ^200","Hi^200 I'm Félix"],
			typeSpeed: 50,
			showCursor:false
		});
		
		$("#talk-2").typed({
			strings:["Hope you ^100 hav^50e a^50 gre^50at day."],
			startDelay: 4000,
			typeSpeed: 50,
			showCursor:false
		});
		
		$("#typed").typed({
			strings:["<a href='https://twitter.com/felixaverlant' target='_blank'>Twitter</a> - <a href='https://github.com/Felixaverlant' target='_blank'>Github</a> - <a href='https://www.linkedin.com/in/f%C3%A9lix-averlant-a1887017' target='_blank'>LinkedIn</a> - <a href='mailto:"+string4+"' target='_blank'>"+string4+" </a>" ],
			startDelay: 7500,
			typeSpeed: 60,
			showCursor:false,
			callback: function(){
				$("span a").click(function(e){
					var txt = $(e.target).text();
					ga('send', 'event', 'Links', 'Clicked on Link', $( e.target ).text())
				});
			}
		});
	});

});
