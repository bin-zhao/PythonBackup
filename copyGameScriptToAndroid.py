#
# copyGameScriptToAndroid.py
#

import sys
import os


_ROOT_PROJECT		= "F:\\"
_ROOT_DESTINATION	= "frameworks\\runtime-src\\proj.android\\assets"
_PATH_COPY			= ('src', 'res')
#_PATH_COPY			= ('src', 'res\\ui', 'res\\other\\data', 'res\\texture', 'res\\texture_low')
#_PATH_COPY			= ('src', 'res\\animat', 'res\\UI', 'res\\fonts', 'res\\other\\data', 'res\\texture', 'res\\texture_low', 'res\\tiledmap')
#_PATH_COPY			= ('src', 'res\\animat', 'res\\UI', 'res\\fonts', 'res\\other\\data', 'res\\texture', 'res\\texture_low', 'res\\music')
_FILE_COPY			= ('config.json', 'main.js', 'project.json')
_CMD_COPY_PATH		= 'xcopy %s\\* %s /E /Y /I /D'
_CMD_COPY_FILE		= 'echo f | xcopy %s %s /Y /D'
_CMD_POSTPROCESS	= '''rmdir /S /Q %s\\%s'''

def _do(src, dest):
	for path in _PATH_COPY:
		p	= os.path.join(src, path)
		d	= os.path.join(dest, path)
#		print('path: %s -> %s' % (p, d))
		cmd	= _CMD_COPY_PATH % (p, d)
#		print(cmd)
		os.system(cmd)

	for f in _FILE_COPY:
		sf	= os.path.join(src, f)
		df	= os.path.join(dest, f)
#		print('file: %s -> %s' % (sf, df))
		cmd	= _CMD_COPY_FILE % (sf, df)
#		print(cmd)
		os.system(cmd)

	os.system(_CMD_POSTPROCESS % (dest, 'res\\music\\aac'))
	os.system(_CMD_POSTPROCESS % (dest, 'res\\music\\mp3'))


if __name__ == "__main__":
	path	= ""
	src		= ""
	dest	= ""
	
	# test
	
#	sys.argv.append('afanty_ctcc')
	
	if len(sys.argv) < 2:
		print("need a path in %s!" % _ROOT_PROJECT)
		path	= raw_input("you can input it or quit(q): ")
		if path == 'q':
			sys.exit()
	else:
		path	= sys.argv[1]
	
	# 
	
	path.rstrip('\\')
	path.rstrip('/')
	
	src			= os.path.join(_ROOT_PROJECT, path)
	dest		= os.path.join(src, _ROOT_DESTINATION)
	
#	print(path, src, dest)

	if not os.access(src, os.F_OK) or not os.access(dest, os.F_OK):
		print('%s or %s is not exist, please check!' % (src, dest))
		sys.exit()
		
	_do(src, dest)