#!/bin/bash

let DIFF=(`date +%s`-`cat timer_start.txt`)/60

printf '{ "text" : "%s"}' $DIFF
