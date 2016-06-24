# coding: utf-8

#
# genFont.py
#

import sys
import os


_HEAD			= u'''info face="宋体" size=32 bold=0 italic=0 charset="" unicode=1 stretchH=100 smooth=1 aa=1 padding=0,0,0,0 spacing=1,1 outline=0
common lineHeight=33 base=28 scaleW=256 scaleH=256 pages=1 packed=0 alphaChnl=1 redChnl=0 greenChnl=0 blueChnl=0
page id=0 file="%s_0.png"
chars count=%d
'''

_WORD			= u'''char id=%d   x=%d     y=0     width=%d    height=%d    xoffset=0     yoffset=0     xadvance=32    page=0  chnl=15\n'''


def _do():
	pass


if __name__ == "__main__":
	if len(sys.argv) < 4:
		print(u'参数格式错误，参数请不要使用中文！格式为：输出文件名 单字宽 单字高')
		sys.exit()
	
	if not sys.argv[1].endswith('.fnt'):
		print(u'输出文件名需要以.fnt结尾！')
		sys.exit()
	
	outfile			= sys.argv[1]
	wordwidth		= int(sys.argv[2])
	wordheight		= int(sys.argv[3])
	
	root			= os.path.split(outfile)[0];
	fileName		= os.path.split(outfile)[1];
	fileName		= os.path.splitext(fileName)[0];

	lines			= ''
	try:
		print(root, fileName)
		print(os.path.join(root, fileName + '.txt'))
		f				= open(os.path.join(root, os.path.splitext(fileName)[0] + '.txt'))
	except Exception:
		print(u'输出目录下没有同名的txt文字文件！')
		sys.exit()
	
	for line in f:
		lines		+= line.rstrip('\n')
	
	lines			= lines.decode('utf8')
	
	f.close()
	
	head			= _HEAD % (fileName, len(lines))
	
	i				= 0
	words			= u''
	for word in lines:
		words		+= _WORD % (ord(word), i * (wordwidth + 1), wordwidth, wordheight);
		i			+= 1
		print(words)
	
	f				= open(outfile, 'w')
	for ch in head + words:
		f.write(ch.encode('utf-8'))
	f.close()
	print(u'字体生成成功！')