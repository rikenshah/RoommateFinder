#!/bin/bash
for i in $( ls ); do
	echo item: $i
	mongoimport -h ds117729.mlab.com:17729 -d roommatefinder -c users -u seprojuser -p seprojuser123 --file $i
done
