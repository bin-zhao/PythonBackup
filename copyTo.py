#
# copyTo.py
#

import sys
import os
import re


FILES				= (
'F:\\afanty3.3\\src\\game\\view\\revive\\ReviveLayer.js',
'F:\\afanty3.3\\res\\other\\data\\MessagePay_data.txt',
'F:\\afanty3.3\\src\\payment\\PaymentManager.js',
'F:\\afanty3.3\\src\\play\\mainlayer\\RunGameLayer.js',
'F:\\afanty3.3\\src\\game\\view\\stage\\NewStageMediator.js',
'F:\\afanty3.3\\src\\game\\server\\TaskServer.js',
'F:\\afanty3.3\\src\\game\\server\\UserServer.js',
)


_RE_SEP				= '([a-zA-Z]:[/\\\\])([^/\\\\]+)[/\\\\](.*)'
_CMD_COPY_FILE		= 'echo f | xcopy %s %s /Y'
_PROJ_LIST			= ('afanty_360', 'afanty_androidMarket', 'afanty_anzhi', 'afanty_baidu', 'afanty_ctcc', 'afanty_jinli',
	'afanty_migu', 'afanty_miui', 'afanty_oppo', 'afanty_uc', 'afanty_UniPay', 'afanty_yingyongbao', 'afanty3.3')
# _PROJ_LIST			= ('afanty3.3', 'afanty_jinli')


if __name__ == '__main__':
	files							= FILES

	if len(sys.argv) >= 2:
		files						= [i for i in sys.argv]
		files						= files[1 : ]
	
	if len(files) == 0:
		sFiles						= raw_input('please enter file to copy: ')
		files						= sFiles.split()

	for src in files:
		print(src)
		result						= re.findall(_RE_SEP, src)
		print(result)
		if not len(result):
			continue
		root, projName, path		= result[0]
		for destProjName in _PROJ_LIST:
			if destProjName != projName:
				dest						= os.path.join(root, destProjName)
				dest						= os.path.join(dest, path)
#				print('%s -> %s' % (src, dest))
				os.system(_CMD_COPY_FILE % (src, dest))