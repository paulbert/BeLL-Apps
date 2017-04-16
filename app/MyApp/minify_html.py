from __future__ import print_function
import pprint
import lxml
import lxml.etree


def handle_line(line):
    parser =  lxml.etree.XMLParser()
    parser.feed(line)
    root = parser.close()
    d = {}
    try:
        d['source'] = root.attrib['src']
        d['dest'] = root.getnext().text.strip()
    except:

        return None
    return d


def parse_index_html(file, target):
    lines = [l for l in open("index.html").readlines() if l]

    data = []
    for line in lines:
        if target in line and "script src" in line:
            results = handle_line(line)
            if results:
                data.append(results)
    return data



if __name__ == '__main__':

    targets = ["app/views.js", "app/models.js", "app/collections.js", "app/vendor.js"]

    res = []
    for target in targets:
        res.extend(parse_index_html("index.html", target))



