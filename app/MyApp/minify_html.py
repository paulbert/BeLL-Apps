from __future__ import print_function
import os
import pprint
#import lxml
#import lxml.etree
import re

def handle_line(line):
    regex = re.compile('\s*<script\s+src\s*=\s*"(?P<source>.*?)"></script>\s*<!--\s*(?P<dest>\S*)\s*-->\s*')
    d = re.match(regex, line)
    if d:
        return d.groupdict()
    else:
        return None

#def handle_line(line):
#    parser =  lxml.etree.XMLParser()
#    parser.feed(line)
#    root = parser.close()
#    d = {}
#    try:
#        d['source'] = root.attrib['src']
#        d['dest'] = root.getnext().text.strip()
#    except:
#        return None
#    return d


def parse_index_html(file, target):
    lines = [l for l in open("index.html").readlines() if l]

    data = []
    for line in lines:
        if target in line and "script src" in line:
            results = handle_line(line)
            if results:
                data.append(results)
    return data


def concatenate_files(input_files=[], output_file=None):
    for file in input_files:
        assert os.path.isfile(file)

    res = []
    for file in input_files:
        with open(file,'r') as ff:
            res.append(ff.read())

    with open(output_file,'w') as ff:
        ff.write(';\n'.join(res))


if __name__ == '__main__':

    targets = ["app/views.js", "app/models.js", "app/collections.js", "app/vendor.js"]

    res = []
    for target in targets:
        res.extend(parse_index_html("index.html", target))


    for target in targets:
        files = []
        for r in res:
            if r['dest'] == target:
                files.append(r['source'])
        concatenate_files(input_files=files, output_file=target)


