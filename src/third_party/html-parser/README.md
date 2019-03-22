URL: https://github.com/taoqf/node-html-parser
License: The MIT License

Description:
HTML parser written in TypeScript. For set innerHTML implementation.

Local Modifications:
Replaced model used to represent node elements for ours (/src/worker-thread/dom).
Removed all class declarations for nodes previously used.
Removed CSS Matcher class.
Parsed HTML Comment nodes (previously ignored).