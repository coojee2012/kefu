#!/bin/bash

# We let you set some memory variables
# ...which have defaults (see: http://www.cyberciti.biz/faq/bash-ksh-if-variable-is-not-defined-set-default-variable/)
# so you can do so say: docker run -e "KAMAILIO_SHR=1024" -it dougbtv/kamailio /bin/bash
# which runs with 1024 megs of shared memory.
kama_shr=${KAMAILIO_SHR:-64}
kama_pkg=${KAMAILIO_PKG:-24}

rm /etc/kamailio/kamailio.cfg
ln -s /etc/kamailio/config.d/kamailio.cfg /etc/kamailio/kamailio.cfg

rm /etc/kamailio/tls.cfg
ln -s /etc/kamailio/config.d/tls.cfg /etc/kamailio/tls.cfg

rm /etc/kamailio/setup_ice_parameters.lua
ln -s /etc/kamailio/config.d/setup_ice_parameters.lua /etc/kamailio/setup_ice_parameters.lua

rm /etc/kamailio/kamailio-local.cfg
ln -s /etc/kamailio/config.d/${KAMAILIO_ENV:-dev}/kamailio-local.cfg /etc/kamailio/kamailio-local.cfg

rm /etc/kamailio/server.key
ln -s /etc/kamailio/config.d/${KAMAILIO_ENV:-dev}/server.key /etc/kamailio/server.key

rm /etc/kamailio/server.crt
ln -s /etc/kamailio/config.d/${KAMAILIO_ENV:-dev}/server.crt /etc/kamailio/server.crt

# Test the syntax.
kamailio -c

# And get kama going.
kamailio -M ${kama_pkg} -m ${kama_shr} -DD -E -e
