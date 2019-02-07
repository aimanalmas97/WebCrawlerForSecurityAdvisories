$( document ).ready(function() {
	// set the counter for log 
	var counter = 0 ;

	function show_notification(text) {
		var x = document.getElementById("snackbar");
		x.className = "show";
        x.innerHTML =text;
		setTimeout(function(){ x.className = x.className.replace("show", ""); }, 5000);
	}
	
	// SUBMIT FORM
    $("#TweetSearchForm").submit(function(event) {
		// Prevent the form from submitting via the browser.
        event.preventDefault();
		searchForTweets =false; 
		
		ajaxPost();
		searchForTweets = true ;
		setInterval(function(){ajaxGet();} , 10000) ;
		setInterval(function(){get_analysis();} , 10000) ;
		
		
		$(".list-unstyled").prepend(' <li><a href="#">'+$("#query").val()+'</a></li> <br>');
		
		
	});
    
    
    function ajaxPost(){
		$('#getResultDiv ').prepend('<div class="loader-container"><div class="loader"></div></div>');
		show_notification("initiating search");
    	
    	// PREPARE FORM DATA
    	var formData = {
    		query : $("#query").val()
    		
		}
		
    	
    	// DO POST
    	$.ajax({
			type : "POST",
			contentType : "application/json",
			url : window.location + "search",
			data : JSON.stringify(formData),
			dataType : 'text',
			success : function(query) {
			
				$('#getResultDiv ul').empty();
				if (counter == 0){
					show_notification("Getting top tweets")
				}
				else {
					show_notification("Getting latest tweets now")
				}
			},
			error : function(e) {
				alert( "Search timeout reloading");
				ajaxGet();

				console.log("OOps there is a ERROR: ", e);
			}
		});
    	
    	// Reset FormData after Posting
    	resetData();
 
    }
    
    function resetData(){
    	$("#search").val("");
    	
	}
	
	function ajaxGet(){
		$('.loader-container').detach();
		$('#getResultDiv').prepend('<div class="loader-container"><div class="loader"></div></div>');
		show_notification("Crunching and refining")
		if(searchForTweets){
		 $.ajax({
			 type : "GET",
			 url : window.location + "view_tweets",
			 success: function(result){
				show_notification("putting it all together")
				$('.loader-container').detach();
				 //alert("this is the result " + result)
				 $('#getResultDiv ul').empty();
				 var custList = "";
				 if(counter == 0){
					show_notification("Rendering top tweets now thanks for waiting")}
					else{
						show_notification("Rendering latest tweets now thanks for waiting")
					}
				
				 $.each(result, function(i, tweet){
					 
					     if(tweet.media_image !== 'none'){
							
                                   $('#getResultDiv .list-group').append('  <div id="tweet_div" class="media"><a class="media-left" href="https://twitter.com/'+tweet.user_screen_name+'"><img id="profile_pic" alt="" class="media-object img-rounded" src="' + tweet.profile_pic + '"></a><div class="media-body"><h4 class="media-heading" style="font-weight:bold;">'+ tweet.User_name + '<span style="color:#A4A4A4;" >  @'+ tweet.user_screen_name + ' -' + tweet.date+'</span>'+ '</h4>' +  '<p>'  + tweet.tweet + '</p>' +  '<img class="img-responsive img-thumbnail" src="'+tweet.media_image+'" alt="Twiiter_Media_Image" width="460" height="345">' + ' <ul class="nav nav-pills nav-pills-custom"><li><a href="#"><span class="glyphicon glyphicon-share-alt" style="color:#A4A4A4; font-weight:bold;"> '+tweet.replies+' </span></a></li><li><a href="#"><span class="glyphicon glyphicon-retweet" style="color:#A4A4A4; font-weight:bold;"> '+tweet.retweets+' </span></a></li><li><a href="#"><span class="glyphicon glyphicon-star" style="color:#A4A4A4; font-weight:bold;"> '+tweet.likes+' </span></a></li><li><a href="#"><span class="glyphicon glyphicon-option-horizontal"></span></a></li> </ul></div>  </div>')
											}
								else{	

								 
								  $('#getResultDiv .list-group').append('  <div id="tweet_div" class="media"><a class="media-left" href="https://twitter.com/'+tweet.user_screen_name+'"><img id="profile_pic" alt="" class="media-object img-rounded" src="' + tweet.profile_pic + '"></a><div class="media-body"><h4 class="media-heading" style="font-weight:bold;">'+ tweet.User_name + '<span style="color:#A4A4A4;" >  @'+ tweet.user_screen_name + ' -' + tweet.date+'</span>'+ '</h4>' +  '<p>'  + tweet.tweet + '</p>' +  ' <ul class="nav nav-pills nav-pills-custom"><li><a href="#"><span class="glyphicon glyphicon-share-alt" style="color:#A4A4A4; font-weight:bold;"> '+tweet.replies+' </span></a></li><li><a href="#"><span class="glyphicon glyphicon-retweet" style="color:#A4A4A4; font-weight:bold;"> '+tweet.retweets+' </span></a></li><li><a href="#"><span class="glyphicon glyphicon-star" style="color:#A4A4A4; font-weight:bold;"> '+tweet.likes+' </span></a></li><li><a href="#"><span class="glyphicon glyphicon-option-horizontal"></span></a></li> </ul></div>  </div>')					
								}
								});
				$('.log-container').detach();
				 counter = counter + 1 ;
			 },
			 error : function(e) {
				 $("#getResultDiv").html("<strong>Sorry server didnt respond refreshing ..</strong>");
				 ajaxGet();
				 console.log("ERROR: ", e);
			 }
		 });	
	 }
	 }


	 function get_analysis(){

		$.ajax({
			type:"GET",
			url : window.location +"analysis",
			dataType: "json" , 
			success: function(analysis){
				//alert(analysis.count + "   " + analysis.date);
				
				$('#total_tweets').text(analysis.count);
				$('#tweet_date').text(analysis.date + " ago");

			}, 
			error : function(e) {
				
				console.log("OOps there is a ERROR: ", e);
			}
		});
	 }
})