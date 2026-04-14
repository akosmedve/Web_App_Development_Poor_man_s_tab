FILES:
	index.html
	poormansdatabase.sql
	README.txt

api/
	auth.php
	db.php
	delete_account.php
	delete_tab.php
	profile.php
	rate_tab.php
	tabs.php
	upload_tab.php
css/
	style.css
js/
	app.js
misc/
	fav_icon

INSTALLATION INSTRUCTIONS:

DATABASE:
	The SQL file of the finalization phase is exported form phpMyAdmin (MariaDB, XAMPP).
	It includes CREATE DATABASE, CREATE TABLE and INSERT statements with sufficient dummy data.
	The database can be imported for example with phpMyAdmin or MySQL Workbench.

	Using the original developing environment is strongly recommended.
	XAMPP is a free-to-use local server environment, that bundles various components for development. 
	The latest version contains MariaDB as a database server environment.
	It can be downloaded from the following website:
	https://www.apachefriends.org/download.html

	After the installation, it is advised to run XAMPP Control Panel and start the Apache and MySQL modules
	(XAMPP Control Panel version 3.3.0). After starting the modules, phpMyAdmin can be also started.
	PhpMyAdmin will be opened in the device's default browser.
	In the phpMyAdmin window, the Export function must be used on the upper menu bar and the file “poormansdatabase.sql”
	must be chosen to import.

WEB APPLICATION:
	XAMPP can be also used as a local server.
	The complete folder must be copied in the following path: <XAMPP_INSTALL_DIR>/htdocs/
	Where <XAMPP_INSTALL_DIR> is the path to XAMPP.
	
	Examples of default installation path:
		Windows: C:\xampp\htdocs\webapp
		MacOS: /Applications/XAMPP/htdocs/webapp
		Linux: /opt/lampp/htdocs/webapp

	If all of the files are copied, the web application can be opened in a web browser (e.g.: Chrome, FireFox, Safari, etc.):
	http://localhost/webapp/	OR	http://localhost/WEBAPP/index.html

IF the list on the front page (index.html) empty, then the database is either not running, or was not installed properly.
	




