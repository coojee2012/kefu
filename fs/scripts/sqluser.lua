-- comment the following line for production:
freeswitch.consoleLog("notice", "===== Provided params:\n" .. params:serialize() .. "\n")

local req_user   = params:getHeader("user")
local req_domain = params:getHeader("domain")
local req_key    = params:getHeader("key")

local db_ip = freeswitch.getGlobalVariable("kamailio_location_database_ip")
local db_database = freeswitch.getGlobalVariable("kamailio_location_database_database")
local db_username = freeswitch.getGlobalVariable("kamailio_location_database_username")
local db_password = freeswitch.getGlobalVariable("kamailio_location_database_password")

if req_domain==nil or req_key==nil or req_user==nil then
  freeswitch.consoleLog("notice","===== Mising headers - not an event we are looking for!\n")
  return
end

--MySQL database connection
luasql = require "luasql.mysql"
env = assert (luasql.mysql())
con = assert (env:connect(db_database, db_username, db_password, db_ip))

cur = assert (con:execute ("SELECT username, domain, email_address, vmpin FROM subscriber WHERE username='" .. req_user .. "' LIMIT 1" ))

-- print all rows, the rows will be indexed by field names
row = cur:fetch ({}, "a")

if not row then
	freeswitch.consoleLog("notice","===== User not found " .. req_user .. "!\n")
	return
end

dial_string = "{sip_invite_domain=" .. req_domain .. ",presence_id=" .. req_user .. "@" .. req_domain .. "}${sofia_contact(" .. req_user .. "@" .. req_domain .. ")},pickup/" .. req_user .. "@" .. req_domain .. ""

XML_STRING =
[[<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<document type="freeswitch/xml">
  <section name="directory">
    <domain name="]] .. req_domain .. [[">
      <user id="]] .. req_user .. [[" mailbox="]] .. req_user .. [[">
        <params>
          <param name="vm-email-all-messages" value="true"/>
          <param name="vm-mailto" value="]] .. row.email_address .. [["/>
          <param name="vm-mailfrom" value="voicemail@myservice.com"/>
          <param name="vm-password" value="]] .. row.vmpin .. [["/>
          <param name="dial-string" value="]] .. dial_string .. [["/>
        </params>
        <variables>
          <variable name="user_context" value="default"/>
        </variables>
      </user>
    </domain>
  </section>
</document>]]

-- comment the following line for production:
freeswitch.consoleLog("notice", "===== Generated XML:\n" .. XML_STRING .. "\n")

-- close everything
cur:close()
con:close()
env:close()