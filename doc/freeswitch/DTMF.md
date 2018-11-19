# DTMF

## Mode Overview

In the context of two bridged analog channels we need to consider 5 possible approaches to DTMF handling per audio path (tx and rx).

DTMF behavior for a single audio path can be captured by a triple of booleans as follows:

Matrix
passthrough	.	.	.
passthrough	.	X	.
intercept	X	.	.
intercept	X	X	.
intercept	X	X	X
Two such triples would be needed to fully describe the behavior of two bridged channels: one for the rx and one for tx audio path.

## Mode Descriptions

DTMF passthrough inband
Audio passes between the A and B legs without being inspected or modified.

DTMF passthrough inband w/ DTMF detection
Audio passes between the A and B legs without being modified. DTMF detection is done by running Goertzel on each 20ms buffer but NOT dropping frames in which DTMF is detected.

DTMF intercept w/ DTMF removal
DTMF is filtered out. In some implementations this could be a cheaper operation than detect and remove.

DTMF intercept w/ DTMF detection and removal
Detect DTMF using Goertzel and drop samples containing DTMF tones. The opposite leg will hear silence (with or without some bleeding).

DTMF intercept w/ DTMF detection, removal and regeneration
Detect DTMF using Goertzel and drop samples identified as containing DTMF tones. Regenerate the detected DTMF tones on the opposite leg. This AFAIK is the only DTMF intercept mode supported by FreeSWITCH ATM.

## DTMF Options

FreeSWITCH attempts to negotiate rfc2833 DTMF out-of-band transmission.

An option to offer rfc2833 but accept INFO was added in GIT bc7cb400c0d576817b12836012899925dce61cca on June 23, 2011.

As a SIP Profile option: Sofia Configuration Files#liberal-dtmf and set it to true
As a gateway/user variable: sip_liberal_dtmf=true (I think, based on the GIT diff?) ~~
If you are receiving the DTMF inband and FreeSWITCH hasn't automatically started inband detection, use mod_dptools: start_dtmf

## See more: Sofia Configuration Files#DTMF

DTMF Tools
You may want DTMF input to trigger certain actions. These tools will let you do that, e.g. start recording the call or initiate a transfer.

Watch for digits: mod_dptools: bind_meta_app or the more flexible mod_dptools: bind_digit_action
Play a prompt to enter digits: mod_dptools: play_and_get_digits