#!/bin/env python3

languageValues = {
    "c":   [ "c89"  , "c95"  , "c99"  , "c11"  , "c17" ],
    "cxx": [ "cxx98", "cxx03", "cxx11", "cxx14", "cxx17", "cxx20" ]
}

for language in languageValues.keys():
    #print(",\n".join([f"body.select-thy-{language} .t-since-{value}" for value in languageValues[language]]))
    #print("{\n\tdisplay: none;\n}")
    lbrace = '{'
    rbrace = '}'
    print("\n".join([f"body.select-thy-{language}.hide-since-thy-{value} .is-since-thy-{value} {lbrace} display: none; {rbrace}" for value in languageValues[language]]))
    print("\n".join([f"body.select-thy-{language}.hide-until-thy-{value} .is-until-thy-{value} {lbrace} display: none; {rbrace}" for value in languageValues[language]]))
    print("\n")
