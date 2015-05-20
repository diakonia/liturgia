php ./scripts.php deferred | yui-compressor --nomunge --type js --charset utf-8 --line-break 250 | gzip - -c > js/deferred-scripts.min.js.gz
php ./scripts.php sync | yui-compressor --nomunge --type js --charset utf-8 --line-break 250 | gzip - -c > js/scripts.min.js.gz
