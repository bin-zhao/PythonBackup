# coding: utf-8

#
# formater.py
#

import sys
import os
import re
import abc


_OUTPUT_ROOT					= 'F:\\_python\\_formater\\'
_RE_IDENTIFIER					= '(?:[a-zA-Z_][a-zA-Z0-9_]*)'


def _getFormaterFilePath(path):
	nameList					= os.path.splitext(os.path.basename(path))
	return _OUTPUT_ROOT + nameList[0] + '_' + nameList[1].lstrip('.') + '_formater.txt'

	
def _print(lines, fileName = ''):
	if fileName != '':
		s				= ''
		for line in lines:
			s			+= line + '\n'
		f				= open(fileName, 'w')
		f.write(s)
		f.close()
		
		os.system(fileName)
	else:
		print(lines)


##################################################################################
# base class

class FormaterBase(object):

	__metaclass__			= abc.ABCMeta

	def __init__(self):
		self._result		= []

	@abc.abstractmethod
	def _format(self, line):
		pass
	
	def _restrictResult(self, newLines):
		return newLines

	def execute(self, lines):
		newLines			= []
		for line in lines:
			newLines.append(self._format(line))
		newLines			= self._restrictResult(newLines)
		
		self._result		= newLines
		return self
	
	def getResult(self):
		return self._result
	
	def output(self, fileName):
		_print(self._result, fileName)
	
	def _removeEmptyLine(self, lines):
		popList				= []
		for i, line in enumerate(lines):
			if line == '':
				popList.append(i)
		popList.reverse()
		for i in popList:
			lines.pop(i)
		return lines
	
	def _sortLines(self, lines, fn = None):
		if fn == None:
			fn				= self.__sortByAlphabet
		lines.sort(fn)
		return lines
	
	def __sortByAlphabet(self, left, right):
		if left < right:
			return -1
		elif left > right:
			return 1
		else:
			return 0

	
##################################################################################
# 从SVN上复制下来的路径格式化为‘F:\\a\\b\\c.txt’,样式的字符串
# /versionstool/afanty_360/src/game/vo/DataVo.js

class Formater20160601(FormaterBase):

	FORMATER				= '\'F:/%s\','

	def __init__(self):
		super(self.__class__, self).__init__()

	def _format(self, line):
		line			= line.strip()
		line			= line.lstrip('/versionstool')
		line			= self.FORMATER % line
		line			= line.replace('/', '\\\\')
		
		return line

		
##################################################################################
# 从cc.Node的定义中取出成员函数列表
# addChild : function(

class Formater2016060201(FormaterBase):

	def __init__(self):
		super(self.__class__, self).__init__()

	def _format(self, line):
		reMethod			= '(%s)\\s*:\\s*function' % _RE_IDENTIFIER
		result				= re.findall(reMethod, line)
#		line				= '\t' + line + '; ' + str(re.findall(reMethod, line))

		if len(result) == 0:
			line			= ''
		else:
			line			= result[0]
		
		return line

	def _restrictResult(self, newLines):
		self._sortLines(newLines)
		return self._removeEmptyLine(newLines)

		
##################################################################################
# 从C++的绑定Node定义中取出成员函数列表
# js_cocos2dx_Node_setPhysicsBody(JSContext *cx, uint32_t argc, jsval *vp);

class Formater2016060202(FormaterBase):

	def __init__(self):
		super(self.__class__, self).__init__()

	def _format(self, line):
		reMethod			= 'js_cocos2dx_Node_(%s)\\(' % _RE_IDENTIFIER
		result				= re.findall(reMethod, line)

		if len(result) == 0:
			line			= ''
		else:
			line			= result[0]
		
		return line

	def _restrictResult(self, newLines):
		self._sortLines(newLines)
		return self._removeEmptyLine(newLines)


##################################################################################
# 从C++ Node定义中取出成员函数列表
# virtual void addChild(Node* child, int localZOrder, const std::string &name);
# inline T getChildByTag(int tag) const { return static_cast<T>(getChildByTag(tag)); }
# class CC_DLL Node : public Ref

class Formater2016060203(FormaterBase):

	def __init__(self):
		super(self.__class__, self).__init__()
		self.__start		= False
		self.__end			= False

	def _format(self, line):
		if not self.__start and line.find('class CC_DLL Node : public Ref') != -1:
			self.__start	= True
		if not self.__start:
			return ''
		
		if self.__start and not self.__end and line.find('CC_DISALLOW_COPY_AND_ASSIGN(Node);') != -1:
			self.__end		= True
		if self.__end:
			return ''
			
		reMethod			= '^\s*(?:[a-zA-Z0-9_*&<>:()]+\s+)+(%s)\\(.*\\)' % (_RE_IDENTIFIER)
		result				= re.findall(reMethod, line)
		
		# debug
#		return line.rstrip() + ' -> ' + str(re.findall(reMethod, line))
		# ~debug

		if len(result) == 0:
			line			= ''
		else:
			line			= result[0]
		
		return line

	def _restrictResult(self, newLines):
		newLines			= list(set(newLines))
		self._sortLines(newLines)
		return self._removeEmptyLine(newLines)


##################################################################################
# 格式化SVN commit上复制下来的路径
# res/other/data/MessagePay_data.txt -> '%GAME_ROOT%\res\other\data\MesagePay_data.txt',

class Formater20160621(FormaterBase):

	FORMATER				= '\'F:/afanty3.3/%s\','

	def __init__(self):
		super(self.__class__, self).__init__()

	def _format(self, line):
		line			= line.strip()
		line			= self.FORMATER % line
		line			= line.replace('/', '\\\\')

		return line


##################################################################################
# 格式化
#

# class Formater2016062101(FormaterBase):
#
# 	FORMATER				= '\'F:/afanty3.3/%s\','
#
# 	def __init__(self):
# 		super(self.__class__, self).__init__()
#
# 	def _format(self, line):
# 		line			= line.strip()
# 		line			= self.FORMATER % line
# 		line			= line.replace('/', '\\\\')
#
# 		return line


##################################################################################
# main

if __name__ == '__main__':
	sys.argv.append('F:/_python/_formater/source.txt')
	if len(sys.argv) < 2:
		print('need file name or a string wrap with \'')
		sys.exit()
		
	# prepare
		
	lines				= []
	fileName			= ''
	formater			= None
	
	if sys.argv[1].startswith('\''):
		lines.append(sys.argv[1].strip('\''))
	else:
		f				= open(sys.argv[1])
		lines			= f.readlines()
		f.close()	
		fileName		= _getFormaterFilePath(sys.argv[1])
	
	# format
	
	Formater20160601().execute(lines).output(fileName)
#	Formater2016060201().execute(lines).output(fileName)						# python F:\_python\formater.py C:\Users\Administrator\Desktop\1.txt
#	Formater2016060202().execute(lines).output(fileName)						# python F:\_python\formater.py F:\xxqy_code\xxqy\frameworks\cocos2d-x\cocos\scripting\js-bindings\auto\jsb_cocos2dx_auto.hpp
	# Formater2016060203().execute(lines).output(fileName)						# python F:\_python\formater.py F:\xxqy_code\xxqy\frameworks\cocos2d-x\cocos\2d\CCNode.h
	# Formater20160621().execute(lines).output(fileName)							# sys.argv.append('F:/_python/_formater/source.txt')
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	