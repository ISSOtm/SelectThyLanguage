
all: page.css
.PHONY: all

page.css: gen_page_css.py
	./$< > $@


dist: select-thy-language.zip
.PHONY: dist

include dist.mk
select-thy-language.zip:
	zip -FS $@ $^
