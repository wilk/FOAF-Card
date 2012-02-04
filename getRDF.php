<?php
	define ('FOAF', 'foaf.rdf');
	
	if (isset ($_POST['rdf'])) {
		// Requests rdf resource for the client
		$httpRequest = new HttpRequest ($_POST['rdf']);
		$httpRequest->setHeaders (array ('Accept:' => 'application/xml+rdf'));
		
		try {
			$httpRequest->send ();
			if ($httpRequest->getResponseCode () === 200) {
				// Saves rdf resource into a file on the server
				if (file_put_contents (FOAF, $httpRequest->getResponseBody ()) === false) {
					throw new Exception ('Permission denied: right of write required!');
				}
				else {
					// Notifies the client
					header ('HTTP/1.1 200 OK');
					echo FOAF;
				}
			}
		}
		catch (HttpException $ex) {
			header ('HTTP/1.1 500 Internal Server Error');
			header ('Content-type: text/html');
			
			echo $ex->getMessage ();
		}
	}
?>
