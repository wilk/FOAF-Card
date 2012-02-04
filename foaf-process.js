var foafNS = 'http://xmlns.com/foaf/0.1/';
var rdfsNS = 'http://www.w3.org/2000/01/rdf-schema#';
var foaf;

function show (obj, rdfUrl, depth) {
	rdfUrl = rdfUrl || $('#foafBox').val ();
	depth = ((depth == null) ? 1 : depth);
	
	// Removes old div from different iterations
	if ($('.person') && (depth != 0)) {
		$('.person').remove ();
		$('h1').remove ();
		$('hr').remove ();
	}
	
	// Tells the server to get the rdf resource
	// This is done to avoid cross-browser problems
	$.ajax ({
		type: 'post' ,
		url: window.location.pathname + 'getRDF.php' ,
		data: {
			rdf: rdfUrl
		} ,
		success: function (uri) {
			foaf = new RDF ();
	
			// Retrieves foaf ID
			foaf.getRDFURL (window.location.pathname + uri, function () {
				var name = foaf.getSingleObject (null, null, foafNS + 'name', null);
				var firstName = foaf.getSingleObject (null, null, foafNS + 'firstName', null) ||
						foaf.getSingleObject (null, null, foafNS + 'givenName', null) ||
						foaf.getSingleObject (null, null, foafNS + 'givenname', null);
				var surname =   foaf.getSingleObject (null, null, foafNS + 'surname', null) ||
						foaf.getSingleObject (null, null, foafNS + 'lastName', null) ||
						foaf.getSingleObject (null, null, foafNS + 'family_name', null) ||
						foaf.getSingleObject (null, null, foafNS + 'familyName', null);
				var title = foaf.getSingleObject (null, null, foafNS + 'title', null) || '';
				var nick = foaf.getSingleObject (null, null, foafNS + 'nick', null);
				var email = foaf.getSingleObject (null, null, foafNS + 'mbox', null);
				var weblog = foaf.getSingleObject (null, null, foafNS + 'weblog', null);
				var homepage = foaf.getSingleObject (null, null, foafNS + 'homepage', null);
				var depiction = foaf.getSingleObject (null, null, foafNS + 'depiction', null) ||
						foaf.getSingleObject (null, null, foafNS + 'img', null) ||
						foaf.getSingleObject (null, null, foafNS + 'thumbnail', null);
				var knows = foaf.Match (null, null, foafNS + 'knows', null);
				
				// Build the HTML structure
				// TODO: something with XSLT?
				/*
					<div id="person">
						<figure>
							<img src="" alt="" /\>
							<figcaption>
							</figcaption>
						</figure>
						<div id="personData">
							<p id="title"></p>
							<p id="otherData">
							</p>
						</div>
					</div>
				*/
				
				var lName = ((name) ? '<p class="title">' + title + ' ' + name + '</p>' : '');
				var lFirstName = ((firstName) ? '<label>First Name : </label>' + firstName + '<br /\>' : '');
				var lSurname = ((surname) ? '<label>Last Name : </label>' + surname + '<br /\>' : '');
				var lEmail = ((email) ? '<label>Email : </label><a href="' + email + '">' + email.split(':')[1] + '</a><br /\>' : '');
				var lNick = ((nick) ? '<label>Nick : </label>' + nick + '<br /\>' : '');
				var lWeblog = ((weblog) ? '<label>Web Blog : </label><a href="' + weblog + '">' + weblog + '</a><br /\>' : '');
				var lHomepage = ((homepage) ? '<label>Homepage : </label><a href="' + homepage + '">' + homepage + '</a><br /\>' : '');
				
				var figure = ((depiction) ? '<figure class="left"><img src="' + depiction + '" alt="' + name + '"><figcaption>' + nick + '</figcaption></figure>' : '');
				
				var data = 	'<div class="personData left">' + 
						lName +
						lFirstName +
						lSurname +
						lEmail + 
						lNick + 
						lWeblog + 
						lHomepage +
						'</div>';
				
				$(document.body).append ('<div class="person">' + figure + data + '</div>');
				
				// If someone gots friends, display them recursively!
				if ((knows.length > 0) && (depth > 0)) {
					depth--;
					$(document.body).append ('<h1>Knows</h1><hr />');
					
					// Represent each foaf:knows
					for (var i = 0; i < knows.length; i++) {
						show (null, foaf.getSingleObject (null, knows[i].object, rdfsNS + 'seeAlso', null), depth);
					}
				}
			});
	
	} ,
		error: function (error) {
			alert ('Something goes wrong during the request of the foaf resource! Try again.');
		}
	});
}
