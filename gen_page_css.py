#!/bin/env python3

import itertools

languageValues = {
    "c":   [ "c89"  , "c95"  , "c99"  , "c11"  , "c17", "c2x" ],
    "cxx": [ "cxx98", "cxx03", "cxx11", "cxx14", "cxx17", "cxx20" ]
}

for language in languageValues.keys():
    print(",\n".join([f"body.select-thy-{language}.hide-thy-{language}-version-tags .t-mark-rev.t-{since}-{value}" for value,since in itertools.product(languageValues[language],("since","until"))]))
    print("{\n\tdisplay: none;\n}")
    lbrace = '{'
    rbrace = '}'
    print("\n".join([f"body.select-thy-{language}.hide-{since}-thy-{value} .is-{since}-thy-{value} {lbrace} display: none; {rbrace}" for value,since in itertools.product(languageValues[language],("since","until"))]))
    print("\n")

    print(f"body.select-thy-{language} .t-rev-inl {lbrace} border: initial; {rbrace}")
    print(f"body.select-thy-{language} .t-rev > td {lbrace} border: initial; {rbrace}")
