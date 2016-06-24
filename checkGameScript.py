#
# copyGameScriptToAndroid.py
#

import sys
import os


_PATH_ROOT			= 'F:\\xxqy_code\\xxqy\\src'
_PATH_TEMP			= 'F:\\_log\\src'
_CMD_COPY_PATH		= 'xcopy %s\\* %s /E /Y /I /D'

def _do():
	os.system('mkdir %s' % _PATH_TEMP)
	os.system(_CMD_COPY_PATH % (_PATH_ROOT, _PATH_TEMP))
	
	for root, dirs, files in os.walk(_PATH_TEMP):
		for f in files:
			path	= os.path.join(root, f)
			print('check file %s...' % path)
			os.system('node %s' % path)
	print('check end')
	os.system('rmdir %s' % _PATH_TEMP)


if __name__ == "__main__":
	_do()