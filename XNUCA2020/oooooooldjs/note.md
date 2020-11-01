# oooooooldjs



## prototype pollution

- lodash 4.7.16 可用`_.set({},'__proto__[123]','123')` 进行污染
- set时键名问题很大？ 



## RCE

sourceURL做了防护......污染sourceURL没有用了。