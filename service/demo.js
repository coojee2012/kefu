[prev in list][next in list][prev in thread][next in thread]

List: freeswitch - users
Subject: [Freeswitch - users] Context problem with xml_curl directory
From: Alex Crow < acrow() integrafin!co!uk >
  Date: 2012 - 03 - 17 19: 33: 55
Message - ID: 4 F64E723 .5090604() integrafin!co!uk[Download message RAW]

Hi,

I 've just tried to get mod_xml_curl working against a PHP script 
connecting to an OpenLDAP server.

Things are working mostly OK, apart from the fact that calls from
extensions defined in LDAP are always initiated in context "public",
  even though the XML returned at auth request includes the variable "user_context=default".I 've traced in wireshark and the responses all 
seem correct.

This gets caught by the static XML public dialplan, but I still feel the
behaviour is not correct.

I have attached the PHP and a tcpdump trace in
  case anyone can see
something obviously incorrect.

Many thanks

Alex

  ["foo.dmp" (application / octet - stream)]
  ["xmlcurl.php" (application / x - php)]

<?php


if ($_SERVER['REQUEST_METHOD'] == 'POST') {



        define('OURFSDOMAIN','192.168.20.235');



        define('NOT_FOUND_RESPONSE', '<?xml version="1.0" encoding="UTF-8" \
standalone="no"?> < document type = "freeswitch/xml" >
  <
  section name = "result" >
  <
  result status = "not found" / >
  <
  /section> <
  /document>
');
define('DIALSTRING', '<param name="dial-string" \
value="{sip_invite_domain=${domain_name},presence_id=${dialed_user}@${dialed_domain}}${sofia_contact(${dialed_user}@${dialed_domain})}"/>');




function writeNotFoundResponse() {
  echo NOT_FOUND_RESPONSE;
}



function writeStartupResponse() {
  echo '<document type="freeswitch/xml"> <
    section name = "directory"
  description = "Dynamic User Directory" >
    <
    domain name = "' . OURFSDOMAIN . '" >
    <
    params >
    ' . DIALSTRING . ' <
    /params> <
    /domain> <
    /section> <
    /document>
  ';
}



function writeACLResponse() {
  writeNotFoundResponse();
}





function writeAuthorizationResponse($sUser, $sEMail, $sCN) {
  $sEMailString = '';

  if (
    (is_null($sEMail) == false) &&
    (is_string($sEMail))

    &&
    (strlen($sEMail) > 0)
  ) {

    $sEMailString = '<param name="vm-mailto" value="'.$sEMail.
    '"/>';

  }



  echo '<document type="freeswitch/xml"> <
    section name = "directory"
  description = "Dynamic User Directory" >
    <
    domain name = "' . OURFSDOMAIN . '" >
    <
    params >
    ' . DIALSTRING . ' <
    /params> <
    groups >
    <
    group name = "default" >
    <
    users >
    <
    user id = "'. $sUser . '" >
    <
    params >
    <
    param name = "password"
  value = "1234" / >
    <
    param name = "vm-password"
  value = "'. $sUser . '" / >
    <
    param name = "vm-enabled"
  value = "true" / >
    <
    param name = "vm-email-all-messages"
  value = "true" / >
    <
    param name = "vm-attach-file"
  value = "true" / >
    <
    param name = "vm-keep-local-after-email"
  value = "true" / >
    ' . $sEMailString . ' <
    /params> <
    variables >
    <
    variable name = "toll_allow"
  value = "" / >
    <
    variable name = "accountcode"
  value = "' . $sUser . '/> <
    variable name = "user_context"
  value = "default" / >
    <
    variable name = "effective_caller_id_name"
  value = "' . $sCN . '" / >
    <
    variable name = "limit_max"
  value = "1" / >
    <
    variable name = "limit_destination"
  value = "voicemail:' . $sUser . '" / >
    <
    /variables> <
    /user> <
    /users> <
    /group> <
    /groups> <
    /domain> <
    /section> <
    /document>
  ';


}






function writeVoicemailResponse($sUser, $sEMail) {
  $sEMailString = '';

  if (
    (is_null($sEMail) == false) &&
    (is_string($sEMail)) &&
    (strlen($sEMail) > 0)
  ) {

    $sEMailString = '<param name="vm-mailto" value="'.$sEMail.\
    '"/>';

  }


  echo '<document type="freeswitch/xml"> <
    section name = "directory"
  description = "Dynamic User Directory" >
    <
    domain name = "' . OURFSDOMAIN . '" >
    <
    params >
    ' . DIALSTRING . ' <
    /params> <
    groups >
    <
    group name = "default" >
    <
    users >
    <
    user id = "'. $sUser . '" >
    <
    params >
    <
    param name = "password"
  value = "1234" / >
    <
    param name = "vm-password"
  value = "'. $sUser . '" / >
    <
    param name = "vm-enabled"
  value = "true" / >
    <
    param name = "vm-email-all-messages"
  value = "true" / >
    <
    param name = "vm-attach-file"
  value = "true" / >
    <
    param name = "vm-keep-local-after-email"
  value = "true" / >
    ' . $sEMailString . ' <
    /params> <
    /user> <
    /users> <
    /group> <
    /groups> <
    /domain> <
    /section> <
    /document>
  ';


}





function writeDialByUserResponse($sUser) {


  echo '<document type="freeswitch/xml"> <
    section name = "directory"
  description = "Dynamic User Directory" >
    <
    domain name = "' . OURFSDOMAIN . '" >
    <
    params >
    ' . DIALSTRING . ' <
    /params> <
    groups >
    <
    group name = "default" >
    <
    users >
    <
    user id = "'. $sUser . '" >
    <
    /user> <
    /users> <
    /group> <
    /groups> <
    /domain> <
    /section> <
    /document>
  ';


}



function ldapEscape($s, $d = FALSE, $i = NULL) {
  /****************************\
   *      |   str $s - Subject string  |
   *      |  bool $d - DN mode         |
   *      | mixed $i - Chars to ignore |
   *      \****************************/
  $m = ($d) ? array(1 => '\\', ',', '=', '+', '<', '>', ';', '"', '#') : \
    array(1 => '\\', '*', '(', ')', chr(0));
  if (is_string($i) && ($l = strlen($s))) {
    for ($n = 0; $n < $l; $n++) {
      if ($k = array_search(substr($s, $n, 1), $m)) {
        unset($m[$k]);
      }
    }
  } else if (is_array($i)) {
    foreach($i as $c) {
      if ($k = array_search($c, $m)) {
        unset($m[$k]);
      }
    }
  }
  $q = array();
  foreach($m as $k => $c) {
    $q[$k] = '\\'.str_pad(dechex(ord($c)), 2, '0', STR_PAD_LEFT);
  }
  return str_replace($m, $q, $s);
}






function getFromLDAP($sExtension) {
  $sEMail = null;
  $sTelephoneNumber = null;
  $sCN = null;
  $sLDAPBase = 'ou=People,ou=Accounts,dc=ifa,dc=net';
  // connecting to ldap
  $conn = ldap_connect('ldap://pdc.ifa.net', 389);
  if ($conn) {
    // binding to ldap
    //$lOldError = error_reporting(E_ERROR ^ E_WARNING);
    $lOldError = error_reporting(E_ERROR);
    $bind = ldap_bind($conn);
    error_reporting($lOldError);
    if ($bind) {
      // we've successfully logged in!
      $asAttrs = array('mail', 'telephoneNumber', 'cn');
      $sLDAPQuery = 'telephoneNumber='.\
      ldapEscape($sExtension, false);
      $r = @ldap_search($conn, $sLDAPBase, $sLDAPQuery, \
        $asAttrs);
      if ($r) {
        $aResult = @ldap_first_entry($conn, $r);
        if ($aResult != false) {
          $aTelephoneNumber = @ldap_get_values($conn, $aResult, \
            'telephoneNumber');
          if ($aTelephoneNumber["count"]) {
            $aCN = @ldap_get_values($conn, $aResult, 'cn');
            $sCN = $aCN[0];
            $aEMail = \
              @ldap_get_values($conn, $aResult, 'mail');
            if ($aEMail["count"])\ {
              $sEMail = \
                $aEMail[0];
            } else {
              $sEMail = '';
            }
          }
        }
      }
    }
  }
  ldap_close($conn);
  return array($sEMail, $sCN);
}





if (array_key_exists('section', $_REQUEST) && ($_REQUEST['section'] == \
    'directory')) { //Now We have a valid XML CURL req for directory

  //Check for startup, ie tag_name does not exist, pass startup and \
  exit
  if (array_key_exists('tag_name', $_REQUEST)) {
    $sTagName = $_REQUEST['tag_name'];
    if (
      (is_null($sTagName)) ||
      (strlen($sTagName) == 0) ||
      (is_string($sTagName) == false)
    ) {
      //this is Startup
      writeStartupResponse();
    } else {

      //Initially call getFromLDAP and if return is null call \
      not_found $sUser = $_REQUEST['user'];
      $aEmail = getFromLDAP($sUser);
      $sEmail = $aEmail[0];
      $sCN = $aEmail[1];

      if (is_null($sEmail)) {
        writeNotFoundResponse();
      } else {
        $sKeyName = $_REQUEST['key_name'];
        $sKeyValue = $_REQUEST['key_value'];
        $sEventName = $_REQUEST['Event-Name'];
        $sEventCallingFunction = \
          $_REQUEST['Event-Calling-Function'];

        //Then differentiate between auth, vm and user_call.
        if (
          ($sTagName == 'domain') &&
          ($sKeyName == 'name') &&
          ($sKeyValue == OURFSDOMAIN)) {
          //check if user_call or registration
          if ($sEventName == "REQUEST_PARAMS")\ {
            $sAction = '';
            if (array_key_exists('action', $_REQUEST)) {
              $sAction = \
                $_REQUEST['action'];
            }
            if (
              ($sAction == \
                "sip_auth") &&
              \
              ($sEventCallingFunction == 'sofia_reg_parse_auth')) {\
              writeAuthorizationResponse($sUser, $sEmail, $sCN);
            } else if (
              ($sAction == \
                "user_call") &&
              \
              ($sEventCallingFunction == 'user_outgoing_channel')) {\
              writeDialByUserResponse($sUser);
            } else if ($sEventCallingFunction == 'user_data_function') {\
              writeAuthorizationResponse($sUser);
            } else {\
              writeNotFoundResponse();
            }

          } else if (
            ($sEventName == \
              'GENERAL') && (\
              ($sEventCallingFunction == 'resolve_id') ||
              ($sEventCallingFunction == 'voicemail_check_main')
            )
          ) {
            //Voicemail
            \
            writeAuthorizationResponse($sUser, $sEmail, $sCN);
          } else {\
            writeNotFoundResponse();
          }

        } else {
          writeNotFoundResponse();
        }

      }

      //endif for "is directory request"
    }
  }


}
//endif for POST check
}



_________________________________________________________________________
Professional FreeSWITCH Consulting Services:
  consulting @freeswitch.org
http: //www.freeswitchsolutions.com

  FreeSWITCH - powered IP PBX: The CudaTel Communication Server
http: //www.cudatel.com

  Official FreeSWITCH Sites
http: //www.freeswitch.org
  http: //wiki.freeswitch.org
  http: //www.cluecon.com

  FreeSWITCH - users mailing list
FreeSWITCH - users @lists.freeswitch.org
http: //lists.freeswitch.org/mailman/listinfo/freeswitch-users
  UNSUBSCRIBE: http: //lists.freeswitch.org/mailman/options/freeswitch-users
  http: //www.freeswitch.org


  [prev in list][next in list][prev in thread][next in thread]

Configure | About | News | Add a list | Sponsored by KoreLogic
