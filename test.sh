#!/bin/bash

find examples -type f -name '*_invisible.js' -exec rm {} \;
find examples -type f -name '*.js' -exec node invisible.js {} \;
