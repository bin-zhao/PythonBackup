# coding: utf-8

import os
import sys
import re
import codecs

__author__ = 'Administrator'

_TEMPLATE_PATH				= 'F:\\_python\\$Name$Layer.js'
_GAME_ROOT					= 'F:\\xxqy_code\\xxqy'
# _FILES_PATH					= os.path.join(_GAME_ROOT, 'src\\files.js')
# _NOTIFY_PATH				= os.path.join(_GAME_ROOT, 'src\\game\\NotifyType.js')

_RE_IDENTIFIER				= '[a-zA-Z0-9_]'
_RE_ARGUMENT				= '\\(~?%s+\\)' % _RE_IDENTIFIER
_RE_TAG						= '(?i)(\\$%s+(%s)*\\$)' % (_RE_IDENTIFIER, _RE_ARGUMENT)
_RE_TAG_COMMENT				= '(?i)(\\$%s\\$)' % 'comment'
_RE_TAG_NAMESPACE			= '(?i)(\\$%s\\$)' % 'namespace'
_RE_TAG_NAME				= '(?i)(\\$%s\\$)' % 'name'
_RE_TAG_MODEL				= '(?i)(\\$%s\\$)' % 'model'
_RE_TAG_SWITCH				= '(?i)(\\$%s%s\\$)' % ('switch', _RE_ARGUMENT)


def _onException(sMessage):
	print(sMessage)
	sys.exit(0)


def _parseArguments(args):
	retMap				= {}
	aList				= args.split(';')
	for value in aList:
		key, value		= value.split(':')
		if key and value:
			key			= key.strip()
			value		= value.strip()
			if value.find(',') != -1:
				retMap[key]		= []
				for element in value.split(','):
					if element != '':
						retMap[key].append(element)
			else:
				retMap[key]		= value

	return retMap


class GameFileGenerator(object):

	def __init__(self):
		pass

	@classmethod
	def test(cls):
		obj					= GameFileGenerator()

		camel				= 'WaitForSignal'
		print(camel, '->', obj._camel2underline(camel))

		underline			= '_waitA_for_signal'
		print(underline, '->', obj._underline2camel(underline))

	# 驼峰转下划线
	def _camel2underline(self, camel):
		if len(camel) == 0:
			return camel

		underline			= camel[0]
		for i in xrange(1, len(camel)):
			if camel[i].isupper():
				underline	+= '_' + camel[i].lower()
			else:
				underline	+= camel[i]

		return underline

	# 下划线转驼峰
	def _underline2camel(self, underline):
		if len(underline) == 0:
			return underline

		camel				= underline[0]
		start				= False
		for i in xrange(1, len(underline)):
			if underline[i] == '_':
				start		= True
			else:
				if start:
					start	= False
					camel	+= underline[i].upper()
				else:
					camel	+= underline[i]

		return camel

	# tag全大写，arg也全大写
	# tag首字母大写，arg首字母也大写
	def _caseSensitivityProc(self, tag, arg):
		target				= arg
		if tag.isupper() and not arg.isupper():
			arg				= self._camel2underline(arg)			# 全大写，先转成underline格式的
			target			= arg.upper()
		elif tag[1].isupper() and arg[0].islower():
			target			= arg[0].upper() + arg[1:]

		return target


	def _commentHandle(self, tag, arg):
		assert(arg != '')

		return arg


	def _nameSpaceHandle(self, tag, arg):
		assert(arg != '')

		target					= self._caseSensitivityProc(tag, arg)

		return target


	def _nameHandle(self, tag, arg):
		assert(arg != '')

		target					= self._caseSensitivityProc(tag, arg)

		return target


	def _modelHandle(self, tag, arg):
		assert(arg != '')

		target					= self._caseSensitivityProc(tag, arg)

		return target


	def _getFileName(self, arg):
		assert(arg != '')

		match					= re.search(_RE_TAG_NAME, _TEMPLATE_PATH)
		if not match:
			_onException('can not find $name$ in template path!')

		target					= self._nameHandle(match.group(0), arg)

		return _TEMPLATE_PATH.replace(match.group(0), target)


	def do(self, argMap):
		templateFile			= codecs.open(_TEMPLATE_PATH, 'r', 'utf-8')
		content					= ''.join(templateFile.readlines())
		templateFile.close()

		parseStack				= []
		pattern					= re.compile(_RE_TAG)
		match					= pattern.search(content, 0)
		while match:
			if re.match(_RE_TAG_COMMENT, match.group(0)):
				target			= self._commentHandle(match.group(0), argMap.get('comment', ''))
				content			= content[:match.start()] + target + content[match.end():]
				match			= pattern.search(content, match.start() + 1)
			elif re.match(_RE_TAG_NAMESPACE, match.group(0)):
				target			= self._nameSpaceHandle(match.group(0), argMap.get('namespace'))
				content			= content[:match.start()] + target + content[match.end():]
				match			= pattern.search(content, match.start() + 1)
			elif re.match(_RE_TAG_NAME, match.group(0)):
				target			= self._nameHandle(match.group(0), argMap.get('name'))
				content			= content[:match.start()] + target + content[match.end():]
				match			= pattern.search(content, match.start() + 1)
			elif re.match(_RE_TAG_MODEL, match.group(0)):
				target			= self._modelHandle(match.group(0), argMap.get('model'))
				content			= content[:match.start()] + target + content[match.end():]
				match			= pattern.search(content, match.start() + 1)
			elif re.match(_RE_TAG_SWITCH, match.group(0)):
				id				= match.group(2)[1:-1].lstrip('~')
				if len(parseStack) == 0:
					# print('switch push: ', id, match.start(), match.end())
					parseStack.append((id, match.start(), match.end()))
					match				= pattern.search(content, match.end() + 1)
					continue
				if id == parseStack[-1][0]:
					_, start0, end0	= parseStack.pop()
					start1, end1	= match.start(), match.end()
					# print('switch pop: ', id, start0, end0, start1, end1)
					if id in argMap.get('switch', []):
						content	= content[:start0 - 2] + content[end1 + 2:]
					else:
						content	= content[:start1] + content[end1 + 2:]
						content	= content[:start0] + content[end0 + 2:]
					match			= pattern.search(content, start0)
				else:
					# print('switch push: ', id, match.start(), match.end())
					parseStack.append((id, match.start(), match.end()))
					match				= pattern.search(content, match.end() + 1)

		targetFile					= codecs.open(self._getFileName(argMap.get('name')), 'w', 'utf-8')
		targetFile.write(content)
		targetFile.close()


_DEBUG				= False

if __name__ == '__main__':
	if not _DEBUG:
		# sys.argv.append(u'comment:选择器;namespace:test;name:selector;model:test1;switch:'.encode('utf-8'))
		if len(sys.argv) == 1:
			_onException(u'need some arguments to generate the file!\nexample: comment:what;namespace:what')

		sArg						= sys.argv[1].decode('gbk')				# 输入进来的是GBK编码的；中文Windows的编码
		argMap						= _parseArguments(sArg)
		if len(argMap) == 0:
			_onException(u'parse arguments failed! %s' % sys.argv[1])

		generator					= GameFileGenerator()
		generator.do(argMap)
	else:
		GameFileGenerator.test()