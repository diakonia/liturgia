php ./scripts.php deferred | yui-compressor --nomunge --type js --charset utf-8 --line-break 250 | gzip - -c > js/moosongdef.min.js.gz
php ./scripts.php sync | yui-compressor --nomunge --type js --charset utf-8 --line-break 250 | gzip - -c > js/moosong.min.js.gz
