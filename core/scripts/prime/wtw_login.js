/* All code is Copyright 2013-2023 Aaron Scott Dishno Ed.D., HTTP3D Inc. - WalkTheWeb, and the contributors */
/* "3D Browsing" is a USPTO Patented (Serial # 9,940,404) and Worldwide PCT Patented Technology by Aaron Scott Dishno Ed.D. and HTTP3D Inc. */
/* Read the included GNU Ver 3.0 license file for details and additional release information. */

/* These functions provide many of the common functions for browse and admin modes */
/* login pages, select avatar, account, profile, options, and related functions */


WTWJS.prototype.globalLogin = async function(zparameters) {
	/* references 3dnet.walktheweb.com - global WalkTheWeb login complete and confirms the local values from login */
	try {
		let zglobaluserid = '';
		let zdisplayname = '';
		let zusertoken = '';
		let zuseremail = '';
		if (zparameters.indexOf('|') > -1) {
			let zparameter = zparameters.split('|');
			zglobaluserid = atob(zparameter[0]);
			zusertoken = atob(zparameter[1]);
			zuseremail = atob(zparameter[2]);
			zdisplayname = atob(zparameter[3]);
			var zrequest = {
				'globaluserid':zglobaluserid,
				'usertoken':zusertoken,
				'displayname':btoa(zdisplayname),
				'useremail':zuseremail,
				'function':'globallogin'
			};
			WTW.postAsyncJSON('/core/handlers/users.php', zrequest,
				function(zresponse) {
					zresponse = JSON.parse(zresponse);
					/* continue if no errors */
					if (WTW.globalLoginResponse(zresponse)) {
						WTW.hide('wtw_menuloggedin');
						WTW.openLoginHUD('Select My Avatar');
					}
				}
			);
		}
	} catch (ex) {
		WTW.log('core-scripts-prime-wtw_login.js-globalLogin=' + ex.message);
	}
}

WTWJS.prototype.globalLoginResponse = function(zresponse) {
	/* references 3dnet.walktheweb.com - global WalkTheWeb login complete and returns the local values from login */
	let znoerror = true;
	try {
		var zerror = '';
		if (zresponse != null) {
			if (zresponse.serror != undefined) {
				if (zresponse.serror != '') {
					znoerror = false;
					zerror = zresponse.serror;
					dGet('wtw_tglobaluserid').value = '';
					dGet('wtw_tuserid').value = '';
					dGet('wtw_tuseremail').value = '';
					dGet('wtw_tdisplayname').value = '';
					dGet('wtw_mainmenudisplayname').innerHTML = 'Login';
					dGet('wtw_mainmenudisplaynamemobile').innerHTML = 'Login';
					dGet('wtw_menudisplayname').innerHTML = 'Login';
					dGet('wtw_tuserimageurl').value = '';
					dGet('wtw_profileimagelg').src = '/content/system/images/menuprofilebig.png';
					dGet('wtw_profileimagesm').src = '/content/system/images/menuprofile32.png';
					dGet('wtw_profileimagesmmobile').src = '/content/system/images/menuprofile32.png';
					dGet('wtw_tusertoken').value = '';
					WTW.show('wtw_mainmenudisplaynamemobile');
				}
				if (zresponse.userid != '') {
					dGet('wtw_tusertoken').value = zresponse.usertoken;
					dGet('wtw_tglobaluserid').value = zresponse.globaluserid;
					WTW.hide('wtw_menulogin');
					WTW.setLoginValues(zresponse.userid, zresponse.displayname, zresponse.email, zresponse.userimageurl);
					WTW.show('wtw_menuloggedin');
				} else {
					WTW.hide('wtw_menuloggedin');
					WTW.show('wtw_menulogin');
				}
			}
		}
		var ziframe = dGet('wtw_ibrowseframe');
		window.parent.postMessage({
			'message': zerror
		}, '*');
	} catch (ex) {
		WTW.log('core-scripts-prime-wtw_login.js-globalLoginResponse=' + ex.message);
	}
	return znoerror;
}

WTWJS.prototype.checkLogin = function() {
	/* when window gets focus, this function checks to see if the user is still logged in */
	try {
		if (dGet('wtw_tuserid').value != '') {
			/* only check if site was logged in previously */
			var zrequest = {
				'function':'isuserloggedin'
			};
			WTW.postAsyncJSON('/core/handlers/users.php', zrequest, 
				function(zresponse) {
					zresponse = JSON.parse(zresponse);
					/* note serror would contain errors */
					var zloggedin = false;
					if (zresponse.loggedin != undefined) {
						if (zresponse.loggedin == true || zresponse.loggedin == 'true') {
							zloggedin = true;
						}
					}
					if (zloggedin == false) {
						WTW.logout();
					}
				}
			);
		}
	} catch (ex) {
		WTW.log('core-scripts-prime-wtw_login.js-checkLogin=' + ex.message);
	}
}

WTWJS.prototype.openLoginMenu = function() {
	/* open login menu for login or show profile as needed */
	try {
		WTW.closeIFrame();
		if (dGet('wtw_tuserid').value != '') {
			WTW.openLoginHUD('User Menu');
		} else {
			if (WTW.isInitCycle == 1) {
				WTW.openLoginHUD('Enter Menu');
			} else {
				WTW.openLoginHUDLogin();
			}
		}
	} catch (ex) {
		WTW.log('core-scripts-prime-wtw_login.js-openLoginMenu=' + ex.message);
	}
}

WTWJS.prototype.openLocalLogin = function(zitem, zwidth, zheight) {
	/* show various local login screens as needed */
	try {
		WTW.setWindowSize();
		if (typeof zwidth === 'undefined' || zwidth === null) {
			zwidth = .9; 
		}
		if (typeof zheight === 'undefined' || zheight === null) {
			zheight = .9; 
		}
		let zpagediv = '';
		dGet('wtw_browsetitle').innerHTML = zitem;
		dGet('wtw_browseheaderclose').onclick = function() {WTW.closeIFrame();};
		switch (zitem) {
			case 'Local Profile':
				zpagediv += "<h2 class='wtw-login'>Profile</h2>";
				zpagediv += "<div class='wtw-loadingmenu'>Loading</div>";
				dGet('wtw_ipagediv').innerHTML = zpagediv;
				WTW.getLocalProfile(false, zwidth, zheight);
				break;
			case 'Edit Profile':
				zpagediv += "<h2 class='wtw-login'>Edit Profile</h2>";
				zpagediv += "<div class='wtw-loadingmenu'>Loading</div>";
				dGet('wtw_ipagediv').innerHTML = zpagediv;
				WTW.getLocalProfile(true, zwidth, zheight);
				break;
			case 'Login Menu':
				zpagediv += "<h2 class='wtw-login'>Login Menu</h2>";
				zpagediv += "<div class='wtw-loginbutton' onclick=\"WTW.openLocalLogin('3D Website Login', .4, .6);\"><img src='/content/system/images/icon-128x128.jpg' alt='HTTP3D Inc.' title='HTTP3D Inc.' class='wtw-image40'/><img id='wtw_localcheck' src='/content/system/images/greencheck.png' class='wtw-imageright40' /><div style='margin-top:4px;'>3D Website Login<br /><span style='font-size:.6em;'>(3D Websites on this Server Only)</span></div></div>";
				if (dGet('wtw_tuserid').value != '') {
					zpagediv += "<div class='wtw-logincancel' onclick='WTW.logout();' style='width:170px;'>Logout 3D Website Only</div>";
				} else {
					zpagediv += "<div class='wtw-loginbutton' onclick=\"WTW.openLoginHUD('Select My Avatar');\"><img src='/content/system/images/menuprofilebig.png' alt='Anonymous Login' title='Anonymous Login' class='wtw-image40'/><div style='margin-top:10px;'>3D Browse as Guest</div></div>";
				}
				dGet('wtw_ipagediv').innerHTML = zpagediv;
				if (dGet('wtw_tuserid').value == '') {
					dGet('wtw_localcheck').style.visibility = 'hidden';
				}
				break;
			case '3D Website Login':
				zpagediv += "<h2 class='wtw-login'>3D Website Login</h2>" +
					"<div class='wtw-loginlabel'>Email</div><div><input type='text' id='wtw_temail' autocomplete='email' class='wtw-textbox' maxlength='64' /></div><div style='clear:both;'></div>" +
					"<div class='wtw-loginlabel'>Password</div><div><input type='password' id='wtw_tpassword' autocomplete='current-password' class='wtw-textbox' maxlength='255' /></div><div style='clear:both;'></div>" +
					"<div class='wtw-loginlabelspace'>&nbsp;</div><div class='wtw-logintext'><input type='checkbox' id='wtw_trememberlogin' class='wtw-checkbox' /> Remember Me</div><div style='clear:both;'></div><br />" +
					"<div id='wtw_loginerrortext' class='wtw-errortext'>&nbsp;</div><br />" +
					"<div class='wtw-loginbutton' onclick='WTW.loginAttempt();'><img src='/content/system/images/icon-128x128.jpg' alt='HTTP3D Inc.' title='HTTP3D Inc.' class='wtw-image40'/><div style='margin-top:10px;'>3D Website Login</div></div>" +
					"<div class='wtw-logincancel' onclick=\"WTW.openLocalLogin('Create Login', .4, .7);\">Create Login</div>&nbsp;&nbsp;" +
					"<div class='wtw-logincancel' onclick=\"WTW.openLocalLogin('Recover Login', .4, .5);\">Forgot Password?</div>&nbsp;&nbsp;" +
					"<div class='wtw-logincancel' onclick='WTW.openLoginMenu();'>Cancel</div>";
				dGet('wtw_ipagediv').innerHTML = zpagediv;
				var zlogin = WTW.getCookie('rememberlogin');
				if (zlogin != '') {
					dGet('wtw_temail').value = zlogin;
					dGet('wtw_trememberlogin').checked = true;
				} else {
					dGet('wtw_trememberlogin').checked = false;
				}
				break;
			case 'Recover Login':
				zpagediv += "<h2 class='wtw-login'>Recover Login</h2>" +
					"<div class='wtw-loginlabel'>Email</div><div><input type='text' id='wtw_temailrecover' autocomplete='email' class='wtw-textbox' maxlength='255' /></div><div style='clear:both;'></div>" +
					"<div id='wtw_reseterrortext' class='wtw-errortext'>&nbsp;</div><br />" +
					"<div class='wtw-loginbutton' onclick='WTW.passwordReset();'><div style='margin-top:10px;'>Recover my Password</div></div>" +
					"<div class='wtw-logincancel' onclick=\"WTW.closeIFrame();WTW.openLoginHUD('3D Website Login');\">Return to Login</div>&nbsp;&nbsp;";
				dGet('wtw_ipagediv').innerHTML = zpagediv;
				break;
			case 'Email Verification':
				zpagediv += "<h2 class='wtw-login'>Email Verification</h2>" +
					"<h2 style='color:#FDFFCE;white-space:normal;'>WalkTheWeb would like to confirm your email before continuing. Please check your email for the latest validation link.<br /><br />If you cannot find the email, click <i>Continue</i> to resend it.<br /><br />After you confirm your email, click <i>Continue</i> to complete the login.</h2>" + 
					"<div class='wtw-loginbutton' onclick=\"WTW.checkEmailValidation('');\"><img src='/content/system/images/wtwlogo.png' alt='HTTP3D Inc.' title='HTTP3D Inc.' class='wtw-image40'/><div style='margin-top:10px;'>Continue</div></div>" +
					"<div class='wtw-logincancel' onclick=\"WTW.openLocalLogin('3D Website Login', .4, .6);\">Return to Login</div>&nbsp;&nbsp;";
				dGet('wtw_ipagediv').innerHTML = zpagediv;
				break;
			case 'Create Login':
				zpagediv += "<h2 class='wtw-login'>Create 3D Website Login</h2>" +
					"<div class='wtw-loginlabel'>Display Name</div><div><input type='text' id='wtw_tnewdisplayname' autocomplete='nickname' class='wtw-textbox' maxlength='255' /></div><div style='clear:both;'></div>" +
					"<div class='wtw-loginlabel'>Email</div><div><input type='text' id='wtw_tnewemail' autocomplete='email' class='wtw-textbox' maxlength='255' /></div><div style='clear:both;'></div>" +
					"<div class='wtw-loginlabelspace' id='wtw_passwordstrengthdiv' style='visibility:hidden;text-align:center;margin-left:220px;margin-top:0px;'><input type='text' id='wtw_tpasswordstrength' style='visibility:hidden;' /></div><div style='clear:both;'></div>" +
					"<div class='wtw-loginlabel'>Password</div><div><input type='password' id='wtw_tnewpassword' autocomplete='new-password' class='wtw-textbox' maxlength='255' onkeyup=\"WTW.checkPassword(this,'wtw_tpasswordstrength');WTW.checkPasswordConfirm('wtw_tnewpassword', 'wtw_tnewpassword2', 'wtw_registererrortext');\" onfocus='WTW.registerPasswordFocus();' onblur='WTW.registerPasswordBlur();' /></div><div style='clear:both;'></div>" +
					"<div class='wtw-loginlabel'>Confirm Password</div><div><input type='password' id='wtw_tnewpassword2' autocomplete='new-password' class='wtw-textbox' maxlength='255' onkeyup=\"WTW.checkPasswordConfirm('wtw_tnewpassword', 'wtw_tnewpassword2', 'wtw_registererrortext');\" /></div><div style='clear:both;'></div>" +
					"<div id='wtw_registererrortext' class='wtw-errortext'>&nbsp;</div><br />" +
					"<div class='wtw-loginbutton' onclick='WTW.createAccount();'><div style='margin-top:10px;'>Create Login</div></div>" +
					"<div class='wtw-logincancel' onclick=\"WTW.openLocalLogin('3D Website Login', .4, .6);\">Cancel</div>";
				dGet('wtw_ipagediv').innerHTML = zpagediv;
				break;
		}
		WTW.pluginsOpenLocalLogin(zitem, zwidth, zheight);
		WTW.hide('wtw_ibrowseframe');
		WTW.show('wtw_ipagediv');
		WTW.setBrowseDiv(zwidth, zheight);
	} catch (ex) {
		WTW.log('core-scripts-prime-wtw_login.js-openLocalLogin=' + ex.message);
		WTW.closeIFrame();
	}
}

WTWJS.prototype.setBrowseDiv = function(zwidth, zheight) {
	try {
		dGet('wtw_ibrowsediv').style.width = Math.round(WTW.sizeX * zwidth) + 'px';
		dGet('wtw_ibrowsediv').style.height = 'auto';
		dGet('wtw_ibrowsediv').style.height = Math.round(WTW.sizeY * zheight) + 'px';
		dGet('wtw_ibrowsediv').style.left = Math.round((WTW.sizeX * (1 - zwidth)) / 2) + 'px';
		dGet('wtw_ibrowsediv').style.top = Math.round((WTW.sizeY * (1 - zheight)) / 2) + 'px';
		dGet('wtw_ibrowsediv').style.display = 'inline-block';
		dGet('wtw_ibrowsediv').style.visibility = 'visible';
		dGet('wtw_ibrowsediv').style.zIndex = 3000;
	} catch (ex) {
		WTW.log('core-scripts-prime-wtw_login.js-setBrowseDiv=' + ex.message);
	}
}

WTWJS.prototype.getLocalProfile = async function(zedit, zwidth, zheight) {
	try {
		WTW.getAsyncJSON('/connect/userprofile.php?useravatarid=' + dGet('wtw_tuseravatarid').value, 
			function(zresponse) {
				zresponse = JSON.parse(zresponse);
				let zpagediv = '';
				var zdob = '';
				if (zresponse.dob != 'null' && zresponse.dob != null) {
					zdob = zresponse.dob;
				}
				if (zedit) {
					zpagediv += "<h2 class='wtw-login'>Edit Local Profile</h2>";
					zpagediv += "<div class='wtw-loginlabel'>Display Name</div><div><input type='text' id='wtw_tprofiledisplayname' autocomplete='nickname' value=\"" + zresponse.displayname + "\" class='wtw-textbox' maxlength='255' /></div><div style='clear:both;'></div>";
					zpagediv += "<div class='wtw-loginlabel'>Email</div><div><input type='text' id='wtw_tprofileemail' autocomplete='email' value='" + zresponse.email + "'  class='wtw-textbox' maxlength='255' /></div><div style='clear:both;'></div>";
					zpagediv += "<div class='wtw-loginlabel'>First Name</div><div><input type='text' id='wtw_tprofilefirstname' autocomplete='given-name' value=\"" + zresponse.firstname + "\" class='wtw-textbox' maxlength='255' /></div><div style='clear:both;'></div>";
					zpagediv += "<div class='wtw-loginlabel'>Last Name</div><div><input type='text' id='wtw_tprofilelastname' autocomplete='family-name' value=\"" + zresponse.lastname + "\" class='wtw-textbox' maxlength='255' /></div><div style='clear:both;'></div>";
					zpagediv += "<div class='wtw-loginlabel'>Gender</div><div><input type='text' id='wtw_tprofilegender' autocomplete='sex' value='" + zresponse.gender + "' class='wtw-textbox' maxlength='45' /></div><div style='clear:both;'></div>";
					zpagediv += "<div class='wtw-loginlabel'>Birth Date</div><div><input type='text' id='wtw_tprofiledob' autocomplete='bday' value='" + zdob + "' class='wtw-textbox' maxlength='10' /></div><div style='clear:both;'></div>";
					zpagediv += "<div id='wtw_errortext' class='wtw-errortext'>&nbsp;</div><br />";
					zpagediv += "<div class='wtw-loginbutton' onclick='WTW.saveMyProfile();'><div style='margin-top:4px;'>Save Profile</div></div>";

					zpagediv += "<div class='wtw-logincancel' onclick=\"WTW.closeIFrame();WTW.openLoginHUD('User Menu');\">Cancel</div>";
				} else {
					zpagediv += "<h2 class='wtw-login'>Local Profile</h2>";
					zpagediv += "<div class='wtw-loginlabel'>Display Name</div><div class='wtw-profiletext'>" + zresponse.displayname + "</div><div style='clear:both;'></div>";
					zpagediv += "<div class='wtw-loginlabel'>Email</div><div class='wtw-profiletext'>" + zresponse.email + "</div><div style='clear:both;'></div>";
					zpagediv += "<div class='wtw-loginlabel'>First Name</div><div class='wtw-profiletext'>" + zresponse.firstname + "</div><div style='clear:both;'></div>";
					zpagediv += "<div class='wtw-loginlabel'>Last Name</div><div class='wtw-profiletext'>" + zresponse.lastname + "</div><div style='clear:both;'></div>";
					zpagediv += "<div class='wtw-loginlabel'>Gender</div><div class='wtw-profiletext'>" + zresponse.gender + "</div><div style='clear:both;'></div>";
					zpagediv += "<div class='wtw-loginlabel'>Birth Date</div><div class='wtw-profiletext'>" + zdob + "</div><div style='clear:both;'></div>";

					zpagediv += "<div class='wtw-loginbutton' onclick=\"WTW.openLocalLogin('Edit Profile', .4, .6);\"><div style='margin-top:4px;'>Edit Profile</div></div>";
					
					zpagediv += "<div class='wtw-loginbutton' onclick=\"WTW.openLoginHUD('Select My Avatar');\"><div style='margin-top:4px;'>Select My Avatar</div></div>";
					
					zpagediv += "<div class='wtw-loginbutton' onclick='WTW.closeIFrame();WTW.openAvatarDesigner();'><div style='margin-top:4px;'>Edit My Avatar</div></div>";
					
					zpagediv += "<div class='wtw-loginbutton' onclick='WTW.logout();'><div style='margin-top:4px;'>Log Out</div></div>";
				}
				dGet('wtw_ipagediv').innerHTML = zpagediv;
				WTW.setBrowseDiv(zwidth, zheight);
			}
		);
	} catch (ex) {
		WTW.log('core-scripts-prime-wtw_login.js-getLocalProfile=' + ex.message);
	}
}

WTWJS.prototype.saveMyProfile = async function() {
	/* save local server user profile */
	try {
		/* validate entries... */
		var zrequest = {
			'userid': dGet('wtw_tuserid').value,
			'displayname':btoa(dGet('wtw_tprofiledisplayname').value),
			'useremail':dGet('wtw_tprofileemail').value,
			'firstname':btoa(dGet('wtw_tprofilefirstname').value),
			'lastname':btoa(dGet('wtw_tprofilelastname').value),
			'gender':btoa(dGet('wtw_tprofilegender').value),
			'dob':dGet('wtw_tprofiledob').value,
			'function':'savemyprofile'
		};
		WTW.postAsyncJSON('/core/handlers/users.php', zrequest, 
			function(zresponse) {
				zresponse = JSON.parse(zresponse);
				/* note serror would contain errors */
				if (zresponse == '') {
					WTW.setLoginValues(dGet('wtw_tuserid').value, dGet('wtw_tprofiledisplayname').value, dGet('wtw_tprofileemail').value);
				}
				WTW.saveMyProfileComplete(zresponse.serror);
			}
		);
	} catch (ex) {
		WTW.log('core-scripts-prime-wtw_login.js-saveProfile=' + ex.message);
	}
}

WTWJS.prototype.saveMyProfileComplete = function(zresponse) {
	/* save local server user profile complete */
	try {
		if (zresponse == '') {
			WTW.closeIFrame();
			WTW.openLoginHUD('User Menu');
		} else {
			dGet('wtw_errortext').innerHTML = zresponse;
			window.setTimeout(function() {
				dGet('wtw_errortext').innerHTML = '';
			},5000);
		}
	} catch (ex) {
		WTW.log('core-scripts-prime-wtw_login.js-saveMyProfileComplete=' + ex.message);
	}
}

WTWJS.prototype.downloadUserAvatarVersion = function(zobj, zglobaluseravatarid, zuseravatarid, zupdateuseravatarid, zwebid, zupdatewebid, zversionid, zversion, zoldversion, zwebtype) {
	/* download and update user avatar by version */
	try {
		if (zobj != null) {
			zobj.innerHTML = 'Updating to (v' + zversion + ')';
			zobj.onclick = function () {};
		}

		var zrequest = {
			'webid': zwebid,
			'serverinstanceid': dGet('wtw_serverinstanceid').value,
			'domainurl': wtw_domainurl,
			'globaluserid': btoa(dGet('wtw_tglobaluserid').value),
			'globaluseravatarid': zglobaluseravatarid,
			'useravatarid': zuseravatarid,
			'userid': dGet('wtw_tuserid').value,
			'instanceid': dGet('wtw_tinstanceid').value,
			'updatewebid': zupdatewebid,
			'versionid': zversionid,
			'version': zversion,
			'webtype': zwebtype,
			'function':'downloadupdateuseravatar'
		};
		if (zuseravatarid != '') {
			WTW.postAsyncJSON('/core/handlers/wtw-3dinternet-downloads.php', zrequest, 
				function(zresponse) {
					zresponse = JSON.parse(zresponse);
					/* note serror would contain errors */
					if (zglobaluseravatarid == '') {
						WTW.updateVersionDisplay(zobj, zversion, zoldversion, 'wtw_beditavatar-' + zupdateuseravatarid, 'wtw_beditavatar_update-' + zupdateuseravatarid);
						window.setTimeout(function(){
							if (dGet('wtw_tuseravatarid').value == zuseravatarid) {
								WTW.onMyAvatarSelect(zglobaluseravatarid, zuseravatarid, zwebid);
							}
						},10000);
					}
					WTW.pluginsDownloadUserAvatarVersionResponse(zobj, zglobaluseravatarid, zuseravatarid, zupdateuseravatarid, zwebid, zupdatewebid, zversionid, zversion, zoldversion, zwebtype);
				}
			);
		}
		WTW.pluginsDownloadUserAvatarVersion(zobj, zglobaluseravatarid, zuseravatarid, zupdateuseravatarid, zwebid, zupdatewebid, zversionid, zversion, zoldversion, zwebtype);
	} catch (ex) {
		WTW.log('core-scripts-prime-wtw_login.js-downloadUserAvatarVersion=' + ex.message);
	} 
}

WTWJS.prototype.updateVersionDisplay = async function(zobj, zversion, zoldversion, zupdateid, zupdatebadgeid) {
	/* swap old version for new version after update occurred */
	try {
		zobj.innerHTML = 'Completed (v' + zversion + ')';
		zobj.className = 'wtw-badgebuttoncompleted';
		if (dGet(zupdateid) != null) {
			dGet(zupdateid).innerHTML = dGet(zupdateid).innerHTML.replace(zoldversion,zversion);
		}
		window.setTimeout(function(){
			if (dGet(zupdatebadgeid) != null) {
				dGet(zupdatebadgeid).remove();
			}
		},5000);
	} catch (ex) {
		WTW.log('core-scripts-prime-wtw_login.js-updateVersionDisplay=' + ex.message);
	} 
}
		
WTWJS.prototype.onMyAvatarSaveSelect = async function(zglobaluseravatarid, zuseravatarid, zavatarid) {
	/* process to enter the 3D Scene when the avatar is selected (save my selection) */
	try {
		WTW.openLoginHUD('Loading 3D Avatar');
		if (dGet('wtw_tnewavatardisplayname') != null) {
			if (dGet('wtw_menudisplayname').innerHTML == '' && dGet('wtw_tnewavatardisplayname').value != '') {
				dGet('wtw_menudisplayname').innerHTML = dGet('wtw_tnewavatardisplayname').value;
			}
		}
		if (dGet('wtw_menudisplayname').innerHTML == '' && dGet('wtw_tuseremail').value != '') {
			var zemailbase = dGet('wtw_tuseremail').value.split('@');
			dGet('wtw_menudisplayname').innerHTML = zemailbase[0];
		}
		if (dGet('wtw_menudisplayname').innerHTML == '') {
			dGet('wtw_menudisplayname').innerHTML = 'Anonymous';
		}
		dGet('wtw_tavatardisplayname').value = dGet('wtw_menudisplayname').innerHTML;
		var zrequest = {
			'instanceid': dGet('wtw_tinstanceid').value,
			'userip': dGet('wtw_tuserip').value,
			'displayname':btoa(dGet('wtw_tnewavatardisplayname').value),
			'avatarid':zavatarid,
			'function':'quicksaveavatar'
		};
		WTW.postAsyncJSON('/core/handlers/avatars.php', zrequest, 
			function(zresponse) {
				zresponse = JSON.parse(zresponse);
				/* note serror would contain errors */
				if (zresponse.useravatarid != undefined) {
					if (zresponse.useravatarid == '') {
						/* avatar could not be created, send back to selection */
						WTW.openLoginHUD('Select My Avatar');
					} else {
						/* avatar created, continue to loading the avatar */
						zuseravatarid = zresponse.useravatarid;
						WTW.onMyAvatarSelect(zglobaluseravatarid, zuseravatarid, zavatarid);
					}
				} else {
					/* avatar could not be created, send back to selection */
					WTW.openLoginHUD('Select My Avatar');
				}
			}
		);
	} catch (ex) {
		WTW.log('core-scripts-prime-wtw_login.js-onMyAvatarSaveSelect=' + ex.message);
	}
}

WTWJS.prototype.onMyAvatarSelect = function(zglobaluseravatarid, zuseravatarid, zavatarid) {
	/* after the avatar is saved, this process loads the avatar */
	/* and allows plugins to provide alternate loading and saving of changed avatars */
	try {
		WTW.openLoginHUD('Loading 3D Avatar');
		dGet('wtw_tuseravatarid').value = zuseravatarid;
		dGet('wtw_tglobaluseravatarid').value = zglobaluseravatarid;
		dGet('wtw_tavatarid').value = zavatarid;
		WTW.setCookie('globaluseravatarid', zglobaluseravatarid, 365);
		WTW.setCookie('useravatarid', zuseravatarid, 365);
		WTW.closeIFrame();
		var zloading = WTW.pluginsOnMyAvatarSelect(zglobaluseravatarid, zuseravatarid, zavatarid);
		if (zloading == false) {
			WTW.getSavedAvatar('myavatar-' + dGet('wtw_tinstanceid').value, zglobaluseravatarid, zuseravatarid, zavatarid, true);
		} 
	} catch (ex) {
		WTW.log('core-scripts-prime-wtw_login.js-onMyAvatarSelect=' + ex.message);
	}
}

WTWJS.prototype.loginAttempt = async function() {
	/* process a local server login attempt */
	try {
		if (dGet('wtw_trememberlogin').checked == true) {
			WTW.setCookie('rememberlogin', dGet('wtw_temail').value, 365);
		} else {
			WTW.deleteCookie('rememberlogin');
		}
		dGet('wtw_loginerrortext').innerHTML = '';
		var zrequest = {
			'useremail':dGet('wtw_temail').value,
			'password':btoa(dGet('wtw_tpassword').value),
			'function':'login'
		};
		WTW.postAsyncJSON('/core/handlers/users.php', zrequest, 
			function(zresponse) {
				zresponse = JSON.parse(zresponse);
				/* note serror would contain errors */
				WTW.loginAttemptResponse(zresponse);
			}
		);
	} catch (ex) {
		WTW.log('core-scripts-prime-wtw_login.js-loginAttempt=' + ex.message);
	}
}

WTWJS.prototype.loginAttemptResponse = function(zresponse) {
	/* response and results of a local server login request */
	try {
		var serror = '';
		if (zresponse != null) {
			if (zresponse.serror != undefined) {
				if (zresponse.serror != '') {
					serror = zresponse.serror;
					dGet('wtw_tuserid').value = '';
					dGet('wtw_tuseremail').value = '';
					dGet('wtw_tdisplayname').value = '';
					dGet('wtw_mainmenudisplayname').innerHTML = 'Login';
					dGet('wtw_mainmenudisplaynamemobile').innerHTML = 'Login';
					dGet('wtw_menudisplayname').innerHTML = 'Login';
					dGet('wtw_tuserimageurl').value = '';
					dGet('wtw_profileimagelg').src = '/content/system/images/menuprofilebig.png';
					dGet('wtw_profileimagesm').src = '/content/system/images/menuprofile32.png';
					dGet('wtw_profileimagesmmobile').src = '/content/system/images/menuprofile32.png';
					WTW.show('wtw_mainmenudisplaynamemobile');
				}
				if (zresponse.userid != '') {
					WTW.hide('wtw_menulogin');
					WTW.show('wtw_menuloggedin');
					WTW.setLoginValues(zresponse.userid, zresponse.displayname, zresponse.email, zresponse.userimageurl);
					if (WTW.enableEmailValidation == 1) {
						WTW.checkEmailValidation(zresponse.email);
					} else {
						WTW.openLoginHUD('Select My Avatar');
					}
				} else {
					WTW.hide('wtw_menuloggedin');
					WTW.show('wtw_menulogin');
				}
			}
		}
		if (dGet('wtw_loginerrortext') != null) {
			if (serror != '') {
				dGet('wtw_loginerrortext').innerHTML = serror;
				WTW.show('wtw_loginerrortext');
			} else {
				dGet('wtw_loginerrortext').innerHTML = '';
				WTW.hide('wtw_loginerrortext');
			}
		}
	} catch (ex) {
		WTW.log('core-scripts-prime-wtw_login.js-loginAttemptResponse=' + ex.message);
	}
}

WTWJS.prototype.logout = async function() {
	/* local server log out and clear login values from 3D Scene and browse window */
	try {
		WTW.hide('wtw_mainadminmode');
		WTW.hide('wtw_mainadminmodemobile');
		WTW.hide('wtw_menuloggedin');
		WTW.show('wtw_menulogin');
		dGet('wtw_tuserid').value = '';
		dGet('wtw_tusertoken').value = '';
		dGet('wtw_tuploadpathid').value = '';
		dGet('wtw_tdisplayname').value = '';
		dGet('wtw_mainmenudisplayname').innerHTML = 'Login';
		dGet('wtw_mainmenudisplaynamemobile').innerHTML = 'Login';
		dGet('wtw_menudisplayname').innerHTML = '';
		dGet('wtw_tuseremail').value = '';
		dGet('wtw_profileimagelg').src = '/content/system/images/menuprofilebig.png';
		dGet('wtw_profileimagesm').src = '/content/system/images/menuprofile32.png';
		dGet('wtw_profileimagesmmobile').src = '/content/system/images/menuprofile32.png';
		WTW.show('wtw_mainmenudisplaynamemobile');
		if (dGet('wtw_mainadminmode') != null) {
			dGet('wtw_mainadminmode').innerHTML = '';
			dGet('wtw_mainadminmodemobile').innerHTML = '';
		}
		if (dGet('wtw_modecommunity') != null) {
			dGet('wtw_modecommunity').onclick = '';
			dGet('wtw_modecommunitymobile').onclick = '';
		}
		if (dGet('wtw_showcommunityname') != null) {
			dGet('wtw_showcommunityname').onclick = '';
			dGet('wtw_showcommunitynamemobile').onclick = '';
		}
		if (dGet('wtw_modebuilding') != null) {
			dGet('wtw_modebuilding').onclick = '';
			dGet('wtw_modebuildingmobile').onclick = '';
		}
		if (dGet('wtw_showbuildingname') != null) {
			dGet('wtw_showbuildingname').onclick = '';
			dGet('wtw_showbuildingnamemobile').onclick = '';
		}
		if (window.location.href.indexOf('admin.php') == -1) {
			WTW.logoutMyAvatar();
		}
		var zrequest = {
			'function':'logout'
		};
		WTW.postAsyncJSON('/core/handlers/users.php', zrequest, 
			function(zresponse) {
				zresponse = JSON.parse(zresponse);
				/* note serror would contain errors */
				if (window.location.href.indexOf('admin.php') > -1) {
					window.location.href = '//' + wtw_domainname + '/';
				} else {
					WTW.openLoginHUDLogin();
				}
			}
		);
	} catch (ex) {
		WTW.log('core-scripts-prime-wtw_login.js-logout=' + ex.message);
	}
}

WTWJS.prototype.createAccount = async function() {
	/* local server registration (add new user) attempt */
	try {
		/* NEEDED add validation */
		var zrequest = {
			'displayname':btoa(dGet('wtw_tnewdisplayname').value),
			'useremail':dGet('wtw_tnewemail').value,
			'password':btoa(dGet('wtw_tnewpassword').value),
			'function':'register'
		};
		WTW.postAsyncJSON('/core/handlers/users.php', zrequest, 
			function(zresponse) {
				zresponse = JSON.parse(zresponse);
				/* note serror would contain errors */
				WTW.createAccountComplete(zresponse);
			}
		);
	} catch (ex) {
		WTW.log('core-scripts-prime-wtw_login.js-createAccount=' + ex.message);
	}
}

WTWJS.prototype.createAccountComplete = function(zresponse) {
	/* local server registration complete response */
	try {
		/* show if error */
		if (zresponse.serror != '') {
			dGet('wtw_registererrortext').innerHTML = zresponse.serror;
		} else {
			dGet('wtw_teditdisplayname').value = zresponse.displayname;
			if (WTW.enableEmailValidation == 1) {
				WTW.checkEmailValidation(zresponse.email);
			} else {
				WTW.openLoginHUD('Select My Avatar');
			}
		}
	} catch (ex) {
		WTW.log('core-scripts-prime-wtw_login.js-createAccountComplete=' + ex.message);
	}
}

WTWJS.prototype.resetPassword = function() {
	try {
		dGet('wtw_submit').click();
	} catch (ex) {
		WTW.log('core-scripts-prime-wtw_login.js-resetPassword=' + ex.message);
	}
}

WTWJS.prototype.setLoginValues = function(zuserid, zdisplayname, zemail, zuserimageurl) {
	/* after a successful login, set the related visual and reference browser login values */
	try {
		if (zuserid == undefined) {
			zuserid = dGet('wtw_tuserid').value;
		} else {
			dGet('wtw_tuserid').value = zuserid;
		}
		if (zdisplayname == undefined) {
			zdisplayname = dGet('wtw_tavatardisplayname').value;
		} else {
			dGet('wtw_tavatardisplayname').value = zdisplayname;
		}
		if (zemail == undefined) {
			zemail = dGet('wtw_tuseremail').value;
		} else {
			dGet('wtw_tuseremail').value = zemail;
		}
		if (zuserimageurl == undefined) {
			zuserimageurl = dGet('wtw_tuserimageurl').value;
		} else {
			dGet('wtw_tuserimageurl').value = zuserimageurl;
		}
		if (zdisplayname != '' && zdisplayname != undefined && zdisplayname != 'undefined') {
			dGet('wtw_mainmenudisplayname').innerHTML = zdisplayname;
			dGet('wtw_profileimagesmmobiletext').innerHTML = 'Profile: ' + zdisplayname;
			dGet('wtw_menudisplayname').innerHTML = zdisplayname;
			WTW.hide('wtw_mainmenudisplaynamemobile');
		}
		dGet('wtw_tdisplayname').value = zdisplayname;
		dGet('wtw_teditdisplayname').value = zdisplayname;
		dGet('wtw_teditemail').value = zemail;
		dGet('wtw_menuemail').innerHTML = zemail;
		if (zuserimageurl != '' && zuserimageurl != undefined) {	
			dGet('wtw_profileimagelg').src = zuserimageurl;
			dGet('wtw_profileimagesm').src = zuserimageurl;
			dGet('wtw_profileimagesmmobile').src = zuserimageurl;
		}
		WTW.hide('wtw_menulogin');
		WTW.show('wtw_mainadminmode');
		WTW.show('wtw_mainadminmodemobile');
		WTW.show('wtw_menuloggedin');
	} catch (ex) {
		WTW.log('core-scripts-prime-wtw_login.js-setLoginValues=' + ex.message);
	}
}

WTWJS.prototype.checkEmailValidation = async function(zuseremail) {
	try {
		if (zuseremail == '') {
			zuseremail = dGet('wtw_tuseremail').value;
		}
		var zrequest = {
			'useremail':zuseremail,
			'userid':dGet('wtw_tuserid').value,
			'function':'checkemailvalidation'
		};
		WTW.postAsyncJSON('/core/handlers/users.php', zrequest, 
			async function(zresponse) {
				zresponse = JSON.parse(zresponse);

				var zuserid = '';
				var zdisplayname = '';
				if (zresponse.userid != undefined) {
					zuserid = zresponse.userid;
				}
				if (zresponse.displayname != undefined) {
					zdisplayname = zresponse.displayname;
				}
				if (zresponse.valid != '1') {
					WTW.openLocalLogin('Email Verification', .4, .6);
					
					/* sendto accepts either single email string or comma separated values */
					var zrequest = {
						'sendto': zuseremail,
						'subject': wtw_domainname + ' - Email Verification',
						'htmlmessage':'You have recently created a ' + wtw_domainname + ' account using this email address.<br />Please click this link to complete the email validation.<br /><br /><a href="' + wtw_domainurl + '/core/pages/validate.php?email=' + zuseremail + '&confirm=' + zresponse.emailconfirm + '">Validate My Email</a><br /><br /><b>Welcome to WalkTheWeb 3D Internet!</b>',
						'message':'You have recently created a ' + wtw_domainname + ' account using this email address.\r\nPlease click this link to complete the email validation.\r\n\r\nPlease copy and paste this link into your browser to Validate your Email:\r\n ' + wtw_domainurl + '/core/pages/validate.php?email=' + zuseremail + '&confirm=' + zresponse.emailconfirm + '\r\n\r\nWelcome to WalkTheWeb 3D Internet!',
						'function':'sendemail'
					};
					WTW.postAsyncJSON('/core/handlers/tools.php', zrequest, 
						function(zresponse2) {
							zresponse2 = JSON.parse(zresponse2);
							WTW.openLocalLogin('Email Verification', .4, .6);
						}
					);
				} else {
					WTW.hide('wtw_menuloggedin');
					WTW.openLoginHUD('Select My Avatar');
				}
			}
		);
	} catch (ex) {
		WTW.log('core-scripts-prime-wtw_login.js-checkEmailValidation=' + ex.message);
	}
}

WTWJS.prototype.openAvatarDesigner = function() {
	/* opens the Avatar Designer and loads your current avatar for changes */
	try {
		WTW.openIFrame('/content/plugins/wtw-avatars/pages/designer.php?globaluserid=' + dGet('wtw_tglobaluserid').value + '&globaluseravatarid=' + dGet('wtw_tglobaluseravatarid').value + '&useravatarid=' + dGet('wtw_tuseravatarid').value, .9, .9, 'Avatar Desiger');
		dGet('wtw_ibrowsediv').style.backgroundColor = 'rgba(0, 0, 0, 1)';
	} catch (ex) {
		WTW.log('core-scripts-prime-wtw_login.js-openAvatarDesigner=' + ex.message);
	}
}

WTWJS.prototype.editProfile = function() {
	/* edit local user profile */
	try {
		WTW.hide('wtw_menudisplayname');
		WTW.hide('wtw_menuemail');
		WTW.showInline('wtw_teditdisplayname');
		WTW.showInline('wtw_teditemail');
		WTW.show('wtw_menusaveprofile');
		WTW.show('wtw_menucancelsaveprofile');
		//WTW.showSettingsMenu('wtw_menuprofile');
		WTW.openLoginHUD('User Menu');
	} catch (ex) {
		WTW.log('core-scripts-prime-wtw_login.js-editProfile=' + ex.message);
	}
}

WTWJS.prototype.saveProfile = async function() {
	/* save local server user profile */
	try {
		/* validate entries... */
		var zrequest = {
			'useravatarid':dGet('wtw_tuseravatarid').value,
			'instanceid':dGet('wtw_tinstanceid').value,
			'useremail':dGet('wtw_teditemail').value,
			'displayname':btoa(dGet('wtw_teditdisplayname').value),
			'function':'saveprofile'
		};
		WTW.postAsyncJSON('/core/handlers/users.php', zrequest, 
			function(zresponse) {
				zresponse = JSON.parse(zresponse);
				/* note serror would contain errors */
				WTW.hide('wtw_teditdisplayname');
				WTW.hide('wtw_teditemail');
				WTW.hide('wtw_menusaveprofile');
				WTW.hide('wtw_menucancelsaveprofile');
				dGet('wtw_menudisplayname').innerHTML = dGet('wtw_teditdisplayname').value;
				dGet('wtw_tavatardisplayname').value = dGet('wtw_teditdisplayname').value;
				dGet('wtw_menuemail').innerHTML = dGet('wtw_teditemail').value;
				WTW.showInline('wtw_menudisplayname');
				WTW.showInline('wtw_menuemail');
				//WTW.showSettingsMenu('wtw_menuprofile');
				WTW.saveProfileComplete(zresponse.serror);
			}
		);
	} catch (ex) {
		WTW.log('core-scripts-prime-wtw_login.js-saveProfile=' + ex.message);
	}
}

WTWJS.prototype.saveProfileComplete = function(zresponse) {
	/* save local server user profile complete */
	try {
		dGet('wtw_profileerrortext').innerHTML = zresponse;
		//WTW.showSettingsMenu('wtw_menuprofile');
		window.setTimeout(function() {
			dGet('wtw_profileerrortext').innerHTML = '';
			//WTW.showSettingsMenu('wtw_menuprofile');
			WTW.openLoginHUD('User Menu');
		},5000);
	} catch (ex) {
		WTW.log('core-scripts-prime-wtw_login.js-saveProfileComplete=' + ex.message);
	}
}

WTWJS.prototype.cancelEditProfile = function() {
	/* cancel changes to local server profile */
	try {
		WTW.hide('wtw_teditdisplayname');
		WTW.hide('wtw_teditemail');
		WTW.hide('wtw_menusaveprofile');
		WTW.hide('wtw_menucancelsaveprofile');
		WTW.showInline('wtw_menudisplayname');
		WTW.showInline('wtw_menuemail');
		dGet('wtw_teditdisplayname').value = dGet('wtw_menudisplayname').innerHTML;
		dGet('wtw_teditemail').value = dGet('wtw_menuemail').innerHTML;
		//WTW.showSettingsMenu('wtw_menuprofile');
		WTW.openLoginHUD('User Menu');
	} catch (ex) {
		WTW.log('core-scripts-prime-wtw_login.js-cancelEditProfile=' + ex.message);
	}
}

WTWJS.prototype.registerPasswordFocus = function() {
	/* new user password focus */
	try {
		dGet('wtw_passwordstrengthdiv').style.visibility = 'visible';
	} catch (ex) {
		WTW.log('core-scripts-prime-wtw_login.js-registerPasswordFocus=' + ex.message);
	}
}

WTWJS.prototype.registerPasswordBlur = function() {
	/* new user password on blur */
	try {
		dGet('wtw_passwordstrengthdiv').style.visibility = 'hidden';
	} catch (ex) {
		WTW.log('core-scripts-prime-wtw_login.js-registerPasswordBlur=' + ex.message);
	}
}

WTWJS.prototype.scorePassword = function(zpassword) {
	/* score the complexity of the password */
	var zscore = 0;
	try {
		if (zpassword != undefined) {
			/* points for every unique letter until 5 repetitions */
			var zletters = new Object();
			for (var i=0; i<zpassword.length; i++) {
				zletters[zpassword[i]] = (zletters[zpassword[i]] || 0) + 1;
				zscore += 5.0 / zletters[zpassword[i]];
			}
			/* bonus points for complexity */
			var zvariations = {
				digits: /\d/.test(zpassword),
				lower: /[a-z]/.test(zpassword),
				upper: /[A-Z]/.test(zpassword),
				nonWords: /\W/.test(zpassword),
			}
			var zvariationcount = 0;
			for (var zcheck in zvariations) {
				zvariationcount += (zvariations[zcheck] == true) ? 1 : 0;
			}
			zscore += (zvariationcount - 1) * 10;
			zscore = parseInt(zscore);
		}
	} catch (ex) {
		WTW.log('core-scripts-prime-wtw_login.js-scorePassword=' + ex.message);
	}
    return zscore;
}

WTWJS.prototype.checkPasswordStrength = function(zpassword) {
	/* check password strength - used with score password */
	zscore = 0;
	zvalue = 'Poor Password';
	zcolor = '#F87777';
	try {
		var zscore = WTW.scorePassword(zpassword);
		if (zscore > 80) {
			zvalue = 'Strong Password';
			zcolor = '#77F893';
		} else if (zscore > 60) {
			zvalue = 'Good Password';
			zcolor = '#DEF877';
		} else if (zscore >= 30) {
			zvalue = 'Weak Password';
			zcolor = '#F8DB77';
		} else {
			zvalue = 'Poor Password';
			zcolor = '#F87777';
		}
	} catch (ex) {
		WTW.log('core-scripts-prime-wtw_login.js-checkPasswordStrength=' + ex.message);
	}
    return {
		'score': zscore,
		'value': zvalue,
		'color': zcolor };
}

WTWJS.prototype.checkPassword = function(zpasswordtextbox, metername) {
	/* check password - used with score password and check password strength */
	try {
		var zcheck = WTW.checkPasswordStrength(zpasswordtextbox.value);
		if (zpasswordtextbox.value.length > 0) {
			dGet(metername).style.visibility = 'visible';
		} else {
			dGet(metername).style.visibility = 'hidden';
		}
		if (dGet(metername) != null) {
			dGet(metername).value = zcheck.value;
			dGet(metername).style.textAlign = 'center';
			dGet(metername).style.backgroundColor = zcheck.color;
			if (zcheck.score > 80) {
				dGet(metername).style.borderColor = 'green';
			} else {
				dGet(metername).style.borderColor = 'gray';
			}
		}
	} catch (ex) {
		WTW.log('core-scripts-prime-wtw_login.js-checkPassword=' + ex.message);
	}
}

WTWJS.prototype.checkPasswordConfirm = function(zpassword, zpassword2, zerrortext) {
	/* check if passwords match */
	try {
		if (dGet(zpassword) != null && dGet(zpassword2) != null && dGet(zerrortext) != null) {
			dGet(zerrortext).innerHTML = '';
			if (dGet(zpassword).value != dGet(zpassword2).value) {
				dGet(zerrortext).innerHTML = 'Passwords do not match.';
			}
		}
	} catch (ex) {
		WTW.log('core-scripts-prime-wtw_login.js-checkPasswordConfirm=' + ex.message);
	}
}

/* completed login screen section */


WTWJS.prototype.showHelp = function(helptab) {
	/* show the help screen */
	try {
		dGet('wtw_helptab').value = helptab;
		WTW.setHelp();
	} catch (ex) {
		WTW.log('core-scripts-prime-wtw_login.js-showHelp=' + ex.message);
	}
}

WTWJS.prototype.setHelp = function() {
	/* set the help options */
	try {
		var ziframe = dGet('wtw_ibrowseframe');
		var ziwindow = ziframe.contentWindow || ziframe;
		var zipage = ziframe.contentDocument || ziframe.contentWindow.document;
		if (typeof ziwindow.WTW.showHelp == 'function') {
			ziwindow.WTW.showHelp(dGet('wtw_helptab').value);
		}
	} catch (ex) {
		WTW.log('core-scripts-prime-wtw_login.js-setHelp=' + ex.message);
	}
}

WTWJS.prototype.toggleHelpOnStart = function() {
	/* toggle to show help on start */
	try {
		if (dGet('wtw_tshowhelponstart').checked) {
			WTW.deleteCookie('movecontrols');
		} else {
			WTW.setCookie('movecontrols','1',365);
		}
	} catch (ex) {
		WTW.log('core-scripts-prime-wtw_login.js-toggleHelpOnStart=' + ex.message);
	}
}

WTWJS.prototype.switchAvatarMenu = function(zmenu) {
	/* switch the avatar menus (will be obsolete with the new avatar designer) */
	try {
		switch (zmenu) {
			case 1:
				WTW.hide('wtw_menuavataranimationsdiv');
				WTW.hide('wtw_menuavatarchangediv');
				WTW.showAvatarDisplayName();
				break;
			case 3:
				WTW.hide('wtw_menuavatardisplaynamediv');
				WTW.hide('wtw_menuavatarchangediv');
				if (dGet('wtw_menuavataranimationsdiv').style.display == 'none') {
					WTW.getAvatarAnimationsAll();
					WTW.show('wtw_menuavataranimationsdiv');
				} else {
					WTW.hide('wtw_menuavataranimationsdiv');
				}
				break;
			case 4:
				WTW.hide('wtw_menuavatardisplaynamediv');
				WTW.hide('wtw_menuavataranimationsdiv');
				if (dGet('wtw_menuavatarchangediv').style.display == 'none') {
					WTW.closeMenus();
					WTW.openLoginHUD('Select My Avatar');
					WTW.show('wtw_menuavatarchangediv');
				} else {
					WTW.hide('wtw_menuavatarchangediv');
				}
				break;
		}
		WTW.showSettingsMenu('wtw_menuavatar');
	} catch (ex) {
		WTW.log('core-scripts-prime-wtw_login.js-switchAvatarMenu=' + ex.message);
	}
}

WTWJS.prototype.passwordReset = async function() {
	/* process to recover a local login */
	try {
		dGet('wtw_reseterrortext').innerHTML = '';
		if (dGet('wtw_temailrecover').value.length > 4 && dGet('wtw_temailrecover').value.indexOf('@') > -1 && dGet('wtw_temailrecover').value.indexOf('.') > -1) {
			var zrequest = {
				'useremail':dGet('wtw_temailrecover').value,
				'function':'passwordrecovery'
			};
			WTW.postAsyncJSON('/core/handlers/users.php', zrequest, 
				function(zresponse) {
					zresponse = JSON.parse(zresponse);
					/* note serror would contain errors */
					if (zresponse.serror == '') {
						dGet('wtw_reseterrortext').innerHTML = "<span style='color:#FDFFCE;'>Reset Password Email Sent.<br />Please check your email for further instructions.</span>";
					} else {
						dGet('wtw_reseterrortext').innerHTML = zresponse.serror;
					}
				}
			);
		} else {
			dGet('wtw_reseterrortext').innerHTML = 'Not a valid Email Address';
		}
	} catch (ex) {
		WTW.log('core-scripts-prime-wtw_login.js-passwordReset=' + ex.message);
	}
}

