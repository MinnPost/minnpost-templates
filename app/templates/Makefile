###
# Make file for project.
#
# Downloads, filters, and converts data
#
###

# Directories
data := data
original := $(data)/original
build := $(data)/build
processing := $(data)/processing

# Scripts
script_tracts := $(processing)/some-data-processing-script.js

# Sources
source_example := ftp://gisftp.metc.state.mn.us/PlannedTransitwayAlignments.zip

# Local sources
local_example := $(original)/planned-transitways.zip
local_example_dir := $(original)/planned-transitways/
local_example_shp := $(original)/planned-transitways/PlannedTransitwayAlignments.shp

# Converted
build_example := $(build)/swlrt-route.geo.json

# Final
example := $(data)/swlrt-route.geo.json



# Download and unzip sources.  Touch shapefile so that make knows it it
# up to date
$(local_example_shp):
	mkdir -p $(original)
	curl -o $(local_example) "$(source_example)"
	unzip $(local_example) -d $(local_example_dir)
	touch $(local_example_shp)

download: $(local_routes_shp)
clean_download:
	rm -rv $(original)/*


# Convert and filter data files
$(example): $(local_example_shp)
	mkdir -p $(build)
	ogr2ogr -f "GeoJSON" $(build_example) $(local_example_shp) -overwrite -where "NAME = 'Southwest LRT'" -t_srs "EPSG:4326"
	cp $(build_example) $(example)

convert: $(example)
clean_convert:
	rm -rv $(build)/*
	rm -rv $(example)


# General
all: convert
clean: clean_download clean_convert
