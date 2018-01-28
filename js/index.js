var xhrCounter = -1;

function xhr(d) {
	return $.ajax({
		type: 'get',
		dataType: 'json',
		data: d,
		cache: false,
		async: true,
		url: 'proxy.php',
		beforeSend: function() {
			if(xhrCounter === 0) {
				$('#id-for-spinner').append('<img src="./images/spinner1.gif" class = "spin"/>');
			}
			xhrCounter++;
		}
	}).always(function() {
		// remove spinner  
		if(xhrCounter <= 0) {  
			$('#id-for-spinner').fadeOut(500, function() {
				$(this).remove();
			});
		}

	}).fail(function(err) {
		console.log(err);
		xhrCounter = 0;
	});
}


var resources = null;

function init() {

	var people = [];
	var courses = [];
	//home page
	/*$('.tlt').textillate({
			in: {effect: 'fadeIn', sequence: true },
			out: {effect: 'pulse', reverse: true },
			loop: true
		}); */
	$('#menu1').on('click', function(e) {
		displayDialog(e.target)
	});
	$('#menu2').on('click', function(e) {
		displayDialog(e.target)
	});
	//get About
	xhr({ path: "/about/" }).done(function(json) {
		$('.corner-style').corner('notch');

		$('<h3>' + json.title + '</h3>').insertBefore('#about blockquote');
		$('<p style="color: black;">' + json.description + '</p>').insertBefore('#about blockquote');
		$('#about blockquote p').append(json.quote);
		$('#about blockquote footer').append(json.quoteAuthor);
		xhrCounter--;
	});

	//get undergraduate courses
	xhr({ path: "/degrees/undergraduate/" }).done(function(json) {
		$.each(json.undergraduate, function(i, item) {
			$("." + this.degreeName + " a:first").after('<a><h3>' + this.title + '</h3><p style="color:black">' + this.description + '</p></a>');
			var concentrations = this.concentrations
			var title = this.title;
			var degree = this.degreeName;
			$("." + this.degreeName + " a:last").click(function() {
				$.dialog({
					title: title,
					content: '<h5 class="center"><strong>Concentrations</strong></h5><div class="center">' + concentrations + '<hr></div>',
					type: 'dark',
					closeIcon: true,
					animation: 'scaleY',
    				closeAnimation: 'scale',
					closeIconClass: 'fa fa-close',
					columnClass: 'medium',
				});
			});

		});
		xhrCounter--;
	});


	//get graduate courses
	xhr({ path: "/degrees/graduate/" }).done(function(json) {
		$.each(json.graduate, function(i, item) {

			$("." + this.degreeName + " a:first").after('<a><h3>' + this.title + '</h3><p style="color:black">' + this.description + '</p></a>');
			var concentrations = this.concentrations
			var title = this.title;

			if (this.degreeName == "graduate advanced certificates") {
				$.each(this.availableCertificates, function(i, item) {
					$(".degrees a").eq(i).append('<h4>' + item + '</h4>');
				});
			}

			$("." + this.degreeName + " a:last").click(function() {
				$.dialog({
					title: title,
					content: '<h5 class="center"><strong>Concentrations</strong></h5><div class="center">' + concentrations + '<hr></div>',
					type: 'dark',
					closeIcon: true,
					animation: 'RotateY',
					closeIconClass: 'fa fa-close',
					columnClass: 'medium',
				});
			});
		});
		xhrCounter--;
	});

	//get minors
	xhr({ path: "/minors/" }).done(function(json) {
		$.each(json.UgMinors, function(i, item) {
			var content_str = "";
			var color = ["Coral", "SandyBrown", "PaleGreen", "Crimson", "PaleVioletRed", "MediumOrchid", "pink", "SkyBlue"];
			var icons = ["fa-database", "fa-map-marker", "fa-h-square", "fa-mobile", "fa-code", "fa-share-alt", "fa-html5", "fa-desktop"];
			$("#minors .minor-links-container").append('<li class="col-sm-3" col-sm-1><a class="area-content"><i class="fa ' + icons[i] + '"></i></a></li>');
			$("#minors div li:last a").append('<p class="area-details">' + item.title + '</p>');
			$("#minors li").eq(i).css({
				"background-color": color[i],
				"padding-top":"50px",
				"min-height": "200px"
			});

			$.each(item.courses, function(j, item2) {
				content_str += '<li class="col-md-12 text-center" id="' + item2 + '" style="background-color: DarkGray; margin-bottom: 10px;" onclick = "displayCourses(this.id)"><a>' + item2 + '</a></li><br>';
				courses.push(item2);
			});
			$("#minors li").eq(i).click(function() {
				$.dialog({
					title: item.title,
					content: '<p>' + item.description + '</p>' + content_str,
					type: 'dark',
					closeIcon: true,
					closeIconClass: 'fa fa-close',
					columnClass: 'large',
				});
			});
		});
		xhrCounter--;
		$(".minor-links-container li").on("mouseenter", function() 
			{
				$(this).effect("bounce", 1000)
			});
	});

	//employment
	xhr({ path: "/employment/" }).done(function(json) {
		$("#career_info div").last().append('<div class="text-center"><h3>' + json.introduction.title + '<hr></h3></div>');
		//$.each(json.introduction.content,function(i, item){
		$("#career_info div").last().append('<h5 class="text-center" style="color:MidnightBlue">' + json.introduction.content[0].title + '</h5><p>' + json.introduction.content[0].description + '</p>');
		$.each(json.degreeStatistics.statistics, function(i, item) {
			$("#career_info .row").append('<div class="stats-col text-center col-md-3 col-sm-6"><div class="circle"><span class="stats-no" data-toggle="counter-up">' + item.value + '</span>' + item.description + '</div></div>');
		});
		$("#career_info .row").append('<h5 class="text-center" style="color:MidnightBlue">' + json.introduction.content[1].title + '</h5><p>' + json.introduction.content[1].description + '</p>');
		$("#career_info .row").append('<h5 class="text-center" style="color:Crimson">' + json.employers.title + '</h5>');

		$.each(json.employers.employerNames, function(i, item2) {
			$("#career_info .row").append('<li class="col-md-2">' + item2 + '</li>');
		});
		$("#career_info .row").append('<h5 class="text-center" style="color:Crimson">' + json.careers.title + '</h5>');
		$.each(json.careers.careerNames, function(i, item2) {
			$("#career_info .row").append('<li class="col-md-2">' + item2 + '</li>');
		});
		$("#career_loc .text-center").append('<div class="row"><div  id="coopTable" class="text-center col-sm-6" style="margin-top: 30px; height: 100px; background-color:pink; padding:30px; font-size:30px">' + json.coopTable.title + '</div><div id="employmentTable" class="text-center col-sm-6" style="margin-top: 30px; padding:30px; font-size:30px; height: 100px;background-color:SkyBlue">' + json.employmentTable.title + '</div></div>');

		$("#coopTable").click(function() {
			displayCoopTable(json.coopTable.coopInformation);
		});

		$("#employmentTable").click(function() {
			displayEmploymentTable(json.employmentTable.professionalEmploymentInformation);
		});
		xhrCounter--;

		//});
	});


	//people
	xhr({ path: "/people" }).done(function(json) {
		peep = json.faculty;
		$.each(json.faculty, function(i, item) {
			// console.log(i);
			$('#faculty').append(
				'<div class="col-sm-2 people-div" style="height:80px;border: solid 2px white;">' +
				'<li>' +
				'<h5 class="center">' + item.name + '</h5>' +
				'<h6 class="center">' + item.title + '</h6>' +
				'</li></div>'
			);
			$("#faculty div").eq(i).click(function() {
				var content = '<div class=col-sm-6><h4>' + item.title + '</h5>' +
					'<img width="120px" height="100px" src="' + item.imagePath + '"/>' +
					'<h4>' + item.tagline + '</h4></div>' +
					'<div class="col-sm-6">' +
					'<h4>Interest Area: ' + item.interestArea + '</h4>' +
					'</div>' +
					'<div class="col-sm-6">' +
					'<h6><i class="fa-fa-phone">' + item.phone + '</i></h6>' +
					'<h6><i class="fa fa-envelope">' + item.email + '</i></h6>' +
					'</div>';
				$.dialog({
					title: item.name,
					content: content,
					type: 'dark',
					closeIcon: true,
					closeIconClass: 'fa fa-close',
					columnClass: 'large',
				});
			});
			//$('.flip').css("width", "15%").css("height", "30px").css("float", "left");
		});
		$(".people-div").on("mouseenter", function() 
			{
				$(this).animate({backgroundColor: "Navy", color: "white"});
		});
		$(".people-div").on("mouseleave", function() 
			{
				$(this).animate({backgroundColor: "transparent", color: "black"});
		});

		$.each(json.staff, function(i, item) {
			$('#staff').append(
				'<div class="col-sm-2 staff-div" style="height:80px;border: solid 2px white;">' +
				'<li class= "front">' +
				'<h5 class="center">' + item.name + '</h5>' +
				'<h6 class="center">' + item.title + '</h6>' +
				'</li></div>'
			);
			$("#staff div").eq(i).click(function() {
				var content = '<div class=col-sm-6><h4>' + item.title + '</h5>' +
					'<img width="120px" height="100px" src="' + item.imagePath + '"/>' +
					'<h4>' + item.tagline + '</h4></div>' +
					'<div class="col-sm-6">' +
					'<h4>Interest Area: ' + item.interestArea + '</h4>' +
					'</div>' +
					'<div class="col-sm-6">' +
					'<h6><i class="fa fa-phone"> ' + item.phone + '</i></h6>' +
					'<h6><i class="fa fa-envelope"> ' + item.email + '</i></h6>' +
					'</div>';
				$.dialog({
					title: item.name,
					content: content,
					type: 'dark',
					closeIcon: true,
					closeIconClass: 'fa fa-close',
					columnClass: 'large',
				});
			});
			//$('.flip').css("width", "15%").css("height", "30%").css("float", "left");
		});
		xhrCounter--;
		$(".staff-div").on("mouseenter", function() 
			{
				$(this).animate({backgroundColor: "Navy", color: "white"});
		});
		$(".staff-div").on("mouseleave", function() 
			{
				$(this).animate({backgroundColor: "transparent", color: "black"});
		});
	});

	//resources
	xhr({ path: "/resources/" }).done(function(json) {
		resources = json;

		var arr1 = ["studyAbroad", "studentServices", "tutorsAndLabInformation", "studentAmbassadors", "forms", "coopEnrollment"];
		var arr2 = ["blog1.jpg", "blog2.jpg", "blog3.jpg", "blog1.jpg", "blog2.jpg", "blog3.jpg", "blog1.jpg"];
		var arr3 = ["studyAbroad", "tutorsAndLabInformation"];
		$.each(arr1, function(i, item1) {
			var title = json[arr1[i]]["title"] ? json[arr1[i]]["title"] : arr1[i];
			$("#menu1").append(
				'<div class="col-md-4 col-sm-12 col-xs-12 portfolio-item"><figure class="effect-oscar"><img src="images/' + arr2[i] + '" class="img-responsive"/><figcaption data-link="' + arr1[i] + '"><h2 class="item-title">' + title + '</h2></figcaption></figure></div>'
			);
		});
		$.each(arr3, function(i, item1) {
			var title = json[arr3[i]]["title"] ? json[arr3[i]]["title"] : arr1[i];
			$("#menu2").append(
				'<div class="col-md-4 col-sm-12 col-xs-12 portfolio-item"><figure class="effect-oscar"><img src="images/' + arr2[i] + '" class="img-responsive"/><figcaption data-link="' + arr3[i] + '"><h2 class="item-title">' + title + '</h2></figcaption></figure></div>'
			);
		});
		xhrCounter--;
	});

	$("#out").on("click", function() {
			$.dialog({
			title: "Switching Majors Out of IST",
			content: '<p>If you wish to change your major to one outside of IST, your first step is to schedule an appointment with an advisor from the major you would like to enter. They will be the best resource to help you decide if the major is right for you. They will also alert you to any additional materials you will need to prepare in order to switch majors into their department. (For example, IST requires a written statement from all change of program applicants). Next, meet with your current academic advisor in IST, and they will complete a Change of Program form with you. The form is then sent (along with your academic file) to your new department. Your new department will then review all materials and make the final decision. You will be notified of this decision via email from your new department.',
			type: 'dark',
			closeIcon: true,
			closeIconClass: 'fa fa-close',
			columnClass: 'large',
		});
	});

		$("#into").on("click", function() {
			content = '<p>Attend one of our meetings' + 
						'<li>Tuesday, October 17th; 12:30pm-1:30pm in GOL-2650 </li>' +
						'<li>Monday, October 23rd; 2:30pm-3:30pm in GOL-2130</li>' +
						'To request an interpreter, please go through Access Services: <a href="https://myaccess.rit.edu/2/Application Process"></a></p> <br>' +
						'<p>Meet with your academic advisor in your current (home) department to complete a Change of Program Registrar form. You will need to submit a 1-2 page written statement that answers the following questions:' +
						'<li>Why are you applying to your chosen IST major?</li>' +
						'<li>What are you academic strengths and weaknesses?</li>' +
						'<li>What areas of computing are you passionate about?</li>'+
						'<li>What are you future goals and/or career interests?</li>' +
						'<li>Why do you believe this major is the right fit for your future goals?</li>'+
						'Your application & statement should be sent to the IST Department, GOL-2100.</p><br>';
			$.dialog({
			title: "Switching Majors Into IST",
			content: content,
			type: 'dark',
			closeIcon: true,
			closeIconClass: 'fa fa-close',
			columnClass: 'large',
		});
	});

		$("#within").on("click", function() {
				content = '<p>Attend one of our meetings' + 
						'<li>Tuesday, October 17th; 12:30pm-1:30pm in GOL-2650 </li>' +
						'<li>Monday, October 23rd; 2:30pm-3:30pm in GOL-2130</li>' +
						'To request an interpreter, please go through Access Services: <a href="https://myaccess.rit.edu/2/Application Process"></a></p> <br>' +
						'<p>Meet with your academic advisor in your current (home) department to complete a Change of Program Registrar form. You will need to submit a 1-2 page written statement that answers the following questions:' +
						'<li>Why are you applying to your chosen IST major?</li>' +
						'<li>What are you academic strengths and weaknesses?</li>' +
						'<li>What areas of computing are you passionate about?</li>'+
						'<li>What are you future goals and/or career interests?</li>' +
						'<li>Why do you believe this major is the right fit for your future goals?</li>'+
						'Your application & statement should be sent to the IST Department, GOL-2100.</p><br>'
			$.dialog({
			title: "Switching Majors Into IST",
			content: content,
			type: 'dark',
			closeIcon: true,
			closeIconClass: 'fa fa-close',
			columnClass: 'large',
		});
	});

	//research
	xhr({ path: "/research/" }).done(function(json) {

		$.each(json.byFaculty, function(i, item) {
			var image;
			var content_str = "";
			$.each(peep, function(i, person) {
				if (item.facultyName == person.name) {
					image = person.imagePath;
				};
				if (image == undefined) {
					image = "./images/avatar1.png"
				};
			});
			$("#research_faculty div").last().append('<li><a class="portfolio-content" style="background-image: url(' + image + ')"></a></li>');
			$("#research_faculty div li:last a").append('<p class="details"></p>');
			$("#research_faculty div li:last a p").last().append('<h4>' + item.facultyName + '</h4>');
			$("#research_faculty li").css(
				{ 	"display": "inline-block",
					"width": "10%",
					"margin": "10px",
				});

			$.each(item.citations, function(j, item1) {
				content_str += '<li><i class="fa fa-circle-o"></i>  ' + item1 + '</li><br>';
			});
			$("#research_faculty li").eq(i).click(function() {
				$.dialog({
					title: "Research by: " + item.facultyName,
					content: content_str,
					type: 'dark',
					closeIcon: true,
					closeIconClass: 'fa fa-close',
					columnClass: 'large',
				});
			});
		});

		$.each(json.byInterestArea, function(i, item2) {
			var content_str;
			var color = ["Coral", "SandyBrown", "PaleGreen", "SkyBlue", "Crimson", "PaleVioletRed", "DarkCyan", "DarkSlateGray", "MediumOrchid", "DarkGray", "MidnightBlue", "pink"];
			var icons = ["fa-user", "fa-pencil-square-o", "fa-map-marker", "fa-database", "fa-bar-chart", "fa-desktop", "fa-share-alt", "fa-mobile", "fa-h-square", "fa-file-o", "fa-sitemap", "fa-caret-square-o-right"];
			$("#interest_area div").last().append('<li class="col-md-3"><a class="area-content"><i class="fa ' + icons[i] + '"></i></a></li>');
			$("#interest_area div li:last a").append('<p class="area-details">' + item2.areaName + '</p>');
			$("#interest_area li").eq(i).css("min-height", "180px").css("max-height", "200px").css("background-color", color[i]).css("padding", "20px");
			$("#interest_area li p").css("color", "white").css("font-size", "20px");
			$.each(item2.citations, function(j, item3) {
				content_str += '<li><i class="fa fa-circle-o"></i>  ' + item3 + '</li><br>';
			});
			$("#interest_area li").eq(i).click(function() {
				$.dialog({
					title: item2.areaName,
					content: content_str,
					type: 'dark',
					closeIcon: true,
					closeIconClass: 'fa fa-close',
					columnClass: 'large',
				});
			});
		});
		xhrCounter--;
	});

	$("#interest_area li").mouseenter(function() {
		$(this).effect("bounce", "slow");
	});

	//footer
	xhr({ path: "/footer" }).done(function(json) {

		$('#copyright div').eq(3).append(
			'<h4 class="text-center">' + json.social.tweet + '</h4>' +
			'<h4 class="text-center">' + json.social.by + '</h4>' +
			'<ul class="text-center"><a href="' + json.social.twitter + '"><span class="fa-stack fa-2x"><i class="fa fa-circle fa-stack-2x"></i><i class="fa fa-twitter"></i></span></a> &nbsp;' +
			'<a href="' + json.social.facebook + '"><span class="fa-stack fa-2x"><i class="fa fa-circle fa-stack-2x"></i><i class="fa fa-facebook"></i></span></a></ul>'
		);
		$.each(json.quickLinks, function(i, item) {
			$(".myfooter").append('<li><a href="' + item.href + '">' + item.title + '</a></li>');
		});
		$(".myfooter li").wrapAll('<div class="col-sm-4" id="quickLinks"></div>');
		$(".myfooter").append('<div class="col-sm-4 text-center" id="copyright">' + json.copyright.html + '</div>');
		$(".myfooter").append('<div class="col-sm-4 text-center" id="news"><li ><a>Recent news</a></li>' +
			'<li><a>Older News</a></li></div>');
		$("#news li").css("display", "block");
		$("#news li").css("padding-left", "50%");
		xhrCounter--;
	});

	//news
	xhr({ path: "/news" }).done(function(json) {
		var content_str = "";
		$.each(json.year, function(i, item) {
			content_str += '<h5 class="center"><strong>' + item.title + '</strong></h5> <hr><h6 class="center">' + item.date + '</h6><p>' + item.description + '</p>';
		});
		$("#news li:first").click(function() {
			$.dialog({
				title: "Recent News",
				content: content_str,
				type: 'dark',
				closeIcon: true,
				closeIconClass: 'fa fa-close',
				columnClass: 'large',
			});
		});
		var content = "";
		$.each(json.older, function(i, item) {
			content += '<h5 class="center"><strong>' + item.title + '</strong></h5> <hr><h6 class="center">' + item.date + '</h6><p>' + item.description + '</p>';
		});
		$("#news li:last").click(function() {
			$.dialog({
				title: "Older News",
				content: content,
				type: 'dark',
				closeIcon: true,
				closeIconClass: 'fa fa-close',
				columnClass: 'large',
			});
		});
		xhrCounter--;
	});

	/*$("#minors li").mouseenter(function() {
		$(this).effect("bounce", "slow");
	}); */
}

function displayDialog(target) {
	var link = $(target).data('link');
	var details = resources[link];
	var content = "";

	switch (link) {
		case "studyAbroad":
			content = displayStudyAbroad(details);
			break;
		case "studentServices":
			content = displayStudentServices(details);
			break;
		case "tutorsAndLabInformation":
			content = displayTutorsAndLabInfo(details);
			break;
		case "studentAmbassadors":
			content = displaystudentAmbassadors(details);
			break;
		case "forms":
			content = displayForms(details);
			break;
		case "coopEnrollment":
			content = displayCoopEnrollment(details);
			break;

	};


	$.dialog({
		title: details.title ? details.title : link,
		content: content,
		type: 'dark',
		closeIcon: true,
		closeIconClass: 'fa fa-close',
		columnClass: 'medium',
	});
};

function displayStudyAbroad(data) {
	var content = "";
	var name = [];
	var des = [];
	$.each(data.places, function(i, item) {
		name = item.nameOfPlace;
		des = item.description;
		content += '<h3 class="text-center">' + name + '</h3><p>' + des + '</p>';
	});
	return '<p>' + data.description + '</p>' + content;
};

function displayStudentServices(data) {
	var content = "";
	var content2 = "";
	$.each(data.professonalAdvisors.advisorInformation, function(i, item) {
		content += '<li>' + item.name + '<li>' + item.department + '</li><li>' + item.email + '</li></li>';
	});
	$.each(data.istMinorAdvising.minorAdvisorInformation, function(i, item) {
		content2 += '<li>' + item.title + '<li>' + item.advisor + '</li><li>' + item.email + '</li></li>';
	});

	return '<h2>' + data.academicAdvisors.title + '</h2><p>' + data.academicAdvisors.description + '</p>' + '<h2>' + data.professonalAdvisors.title + '</h2>' + content + '<h2>' + data.facultyAdvisors.title + '</h2><p>' + data.facultyAdvisors.description + '</p>' + '<h2>' + data.istMinorAdvising.title + '</h2>' + content2;
};

function displayTutorsAndLabInfo(data) {
	return '<p>' + data.description + '</p><a>' + data.tutoringLabHoursLink + '</a>';
};

function displaystudentAmbassadors(data) {
	var content = "";
	$.each(data.subSectionContent, function(i, item) {
		content += '<h3 class="text-center">' + item.title + '</h3><p>' + item.description + '</p>';
	});
	return '<h2>' + data.title + '</h2><img src="' + data.ambassadorsImageSource + ' "> ' + content + '</p><a>' + data.applicationFormLink + '</a><p>' + data.note + '</p>';
};

function displayForms(data) {
	var content = '<h2 class="text-center"> Graduate Forms</h2>';
	$.each(data.graduateForms, function(i, item) {
		content += '<a href=" ' + item.href + '">' + item.formName + '</a><br>';
	});
	content += '<h2 class="text-center"> Undergraduate Forms</h2>';
	$.each(data.undergraduateForms, function(i, item) {
		content += '<a href=" ' + item.href + '">' + item.formName + '</a><br>';
	});
	return content;
};

function displayCoopEnrollment(data) {
	var content = "";
	$.each(data.enrollmentInformationContent, function(i, item) {
		content += '<h3 class="text-center">' + item.title + '</h3><p>' + item.description + '</p>';
	});
	return content + '</p><a>' + data.RITJobZoneGuidelink + '</a>';
};

function initMap() {
	console.log('map init');
	var mapProp = {
		center: new google.maps.LatLng(37.972753, -95.681656),
		zoom: 4,
	};
	var map = new google.maps.Map(document.getElementById("map-canvas-holder"), mapProp);

	// get locations
	$.ajax({
		type: 'get',
		url: 'proxy.php',
		data: {
			path: "/location/"
		},
		cache: false,
		async: true,
		dataType: 'json'
	}).done(function(json) {
		displayMarkers(json, map);
	});

};

function displayMarkers(locations, map) {
	$.ajax({
		type: 'get',
		url: 'proxy.php',
		data: {
			path: "/employment/employmentTable"
		},
		cache: false,
		async: true,
		dataType: 'json'
	}).done(function(json) {

		var employerData = {};
		$.each(json.employmentTable.professionalEmploymentInformation, function(i, item) {
			//console.log(item);
			var key = item.city.toUpperCase();
			key = key.replace(/\s+/g, '');
			key = key.replace(",", "");
			//console.log(key);
			if (typeof employerData[key] === 'undefined') {
				employerData[key] = [];
			}
			employerData[key].push(item);
		});

		$.each(locations, function(i, item1) {
			//console.log(item1);
			var key = item1.city + " " + item1.state;
			key = key.replace(/\s+/g, '');
			//console.log(key);
			//console.log("item",employerData[key]);
			var marker = new google.maps.Marker({
				position: {
					lat: parseFloat(item1.latitude),
					lng: parseFloat(item1.longitude)
				},
				map: map
			});
			if (typeof employerData[key] !== 'undefined') {
				var places = employerData[key];
				var contentString = "";
				$.each(places, function(i, place) {
					contentString += '<div id="siteNotice">' +
						'<h4 id="firstHeading" class="firstHeading">' + place.employer + '</h4> <hr>' +
						'<h5>' + place.degree + '</h5>' +
						'<h5>' + place.title + '</h5>' +
						'<h6>' + place.startDate + '</h6> </div>';
				});

				var infowindow = new google.maps.InfoWindow({
					content: contentString
				});

				marker.addListener('click', function() {
					infowindow.open(map, marker);
				});
			};
		});
	});
};

function displayCourses(id) {
	$.ajax({
		type: 'get',
		url: 'proxy.php',
		data: {
			path: "/course/courseID=" + id
		},
		cache: false,
		async: true,
		dataType: 'json'
	}).done(function(json) {
		console.log(json);
		$.dialog({
			title: json.title,
			content: '<p>' + json.description + '</p>',
			type: 'dark',
			closeIcon: true,
			closeIconClass: 'fa fa-close',
			columnClass: 'large',
		});
	});
};

function displayCoopTable(data) {
	var content = "";
	$.each(data, function(i, item) {
		content += '<tr><td>' + item.employer + '</td><td>' + item.degree + '</td><td>' + item.city + '</td><td>' + item.term + '</td></tr>';
	});
	$.dialog({
		title: "Co-op Table",
		content: '<table class="table table-striped"><thead><tr><th>Degree</th><th>Employer</th><th>Location</th><th>Term</th></tr></thead><tbody>' + content + '</tbody></table>',
		type: 'dark',
		closeIcon: true,
		closeIconClass: 'fa fa-close',
		columnClass: 'large',
	});
};

function displayEmploymentTable(data) {
	var content = "";
	$.each(data, function(i, item) {
		content += '<tr><td>' + item.employer + '</td><td>' + item.degree + '</td><td>' + item.city + '</td><td>' + item.title + '</td><td>' + item.startDate + '</td></tr>';
	});
	$.dialog({
		title: "Professional Employment Table",
		content: '<table class="table table-striped"><thead><tr><th>Degree</th><th>Employer</th><th>Location</th><th>Title</th></th><th>Satrt Date</th></tr></thead><tbody>' + content + '</tbody></table>',
		type: 'dark',
		closeIcon: true,
		closeIconClass: 'fa fa-close',
		columnClass: 'large',
	});
};
