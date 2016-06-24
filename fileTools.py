# encoding: utf-8

from __future__ import print_function
import os
import sys
import thread
import re


# 在文件中查找文本内容

def _findInFile(path, content, exts, bInclude):

	cnt		= 0
	fileLst	= []
	
	for root, _, files in os.walk(path):
		if root.find('.svn') != -1:
			continue
		for file in files:
			_, ext		= os.path.splitext(file)
			ext			= ext.lower()
			if len(ext) == 0 or (bInclude and not ext in exts) or (not bInclude and ext in exts):								# 没有扩展名也搜索
				continue
			f	= open(os.path.join(root, file))
			times	= 0
			for i, line in enumerate(f):
#				if 
				if line.find(content) != -1:
					# retLst.append((os.path.join(root, file), i + 1, line))
					times		+= 1
					cnt			+= 1
					print('find %d item' % cnt, end = '\r')
			f.close()
			if times > 0:
				fileLst.append((os.path.join(root, file), times))
	
	return fileLst


# 收集目录下的所有扩展名

def _findExt(path):
	retLst	= set()
	
	for root, _, files in os.walk(path):
		for file in files:
			retLst.add(os.path.splitext(file)[1])
	
	return retLst


# 获取分号分隔的扩展名'.txt;.c'

def _getExts(exts):
	retLst	= exts.split(';')
	for s in retLst:
		s	= s.strip()
		s	= s.lower()
	
	return retLst


# 把搜索结果写入log

# 格式：
#文件名
#	行号: 内容
def _writeResult(path, aLst):
	f		= open(path, 'w')
	s		= ''
	for obj in aLst:
		s		+= '%s\n\t%-4d: %s' % (obj[0], obj[1], obj[2])
	f.write(s)
	f.close()


# 格式：
# 按行输出
def _writeResult1(path, aLst):
	f		= open(path, 'w')
	s		= ''
	for obj in list(aLst):
		s	+= '%s\n' % obj
	f.write(s)
	f.close()

	
# 格式：
#文件名		结果数量
def _writeResult2(path, aLst):
	f		= open(path, 'w')
	s		= ''
	for obj in aLst:
		s		+= '%-100s%d\n' % (obj[0], obj[1])
	f.write(s)
	f.close()

	
if __name__	== '__main__':
	
	commands	= ('findInFile', 'findExt', )
	
	# test
	
#	sys.argv		= ['', 'findInFile', 'F:\\afanty_360', 'H:\\jjyx\\versionstool\\afanty_360', '.a;.dll;.dylib;.so;.exe;.bin;.db;.apk;.mp3;.jpeg;.zip;.TTF;.ico;.lib;.jpg', '0']
	sys.argv		= ['', 'findInFile', 'F:\\afanty_ctcc', 'onPay', '.a;.dll;.dylib;.so;.exe;.bin;.db;.apk;.mp3;.jpeg;.zip;.TTF;.ico;.lib;.jpg', '0']

	if len(sys.argv) < 2:
		print(u'需要参数：功能名 参数')
		sys.exit()
	
	bCanExit	= False
	bResult		= False
	function	= sys.argv[1]
	
	if function == commands[0]:
	
		if len(sys.argv) != 6:
			print(u'需要参数：搜索路径、搜索内容、扩展名列表（由;分隔）、扩展名列表是否为包含列表')
			sys.exit()
		
		path		= sys.argv[2]
		content		= sys.argv[3]
		exts		= _getExts(sys.argv[4])
		bInclude	= True if sys.argv[5] == 'true' else False
		
		aLst	= _findInFile(path, content, exts, bInclude)
		_writeResult2('F:\\_log\\searchInFile.log', aLst)
		bResult		= True
	
	elif function == commands[1]:
		
		if len(sys.argv) != 3:
			print(u'需要参数：路径名')
			sys.exit()
		
		path		= sys.argv[2]
		
		aLst		= _findExt(path)
		_writeResult1('F:\\_log\\findExt.log', aLst)
		bResult		= True
	
	
	if bResult:
		print(u'\n命令完成！')
	else:
		s		= u''
		for cmd in commands:
			s	+= '%s, ' % cmd
		print(u'\n没有相应命令！支持的命令：%s' % s)
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	