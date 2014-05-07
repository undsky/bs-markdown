(function($) {
	/**
	 *
	 * IE6+
	 * @param {Object} options
	 */
	$.fn.bsmd = function(options) {
		var settings = $.extend(true, {}, $.fn.bsmd.defaults, options);

		var id = 'bsmd-' + (new Date).getTime();
		var source = $('<div id="' + id + '" class="bsmd"><div class="btn-toolbar" role="toolbar"></div><div class="bsmd-editor"></div><div class="bsmd-preview"></div></div>');
		source.insertAfter($(this));
		var mdText = $(this).is('textarea') ? $(this).val() : $(this).html();
		$(this).remove();

		var editor = CodeMirror($('#' + id + ' .bsmd-editor')[0], {
			lineNumbers : true
		});
		editor.setOption('mode', 'markdown');
		if (CodeMirror.autoLoadMode)
			CodeMirror.autoLoadMode(editor, 'markdown');

		for (var i = 0; i < settings.toolbar.length; i++) {
			var bg = $('<div class="btn-group"></div>').appendTo($('#' + id + ' .btn-toolbar'));
			for (var j = 0; j < settings.toolbar[i].length; j++) {
				var bt = settings[settings.toolbar[i][j]];
				if (bt.modal)
					$(themeFormat(bt.modal, id)).appendTo('body');
				var theme = bt.theme ? $(themeFormat(bt.theme, id)).appendTo(bg) : null;
				bt.callback(theme, source, editor);
			}
		}

		if (mdText)
			editor.setValue(mdText);

		return editor;
	};

	function addLine(editor, num) {
		for (var i = 0; i < num; i++) {
			editor.execCommand('newlineAndIndent');
		}
	}

	function addText(editor, text) {
		editor.replaceRange(text, editor.getCursor());
	}

	function selText(editor, from, to) {
		var p = editor.getCursor();
		editor.extendSelection({
			line : p.line,
			ch : p.ch - from
		}, {
			line : p.line,
			ch : p.ch - to
		});
	}

	function themeFormat() {
		var s = arguments[0];

		if (s)
			for (var i = 0; i < arguments.length - 1; i++) {
				var reg = new RegExp("\\{" + i + "\\}", "gm");
				s = s.replace(reg, arguments[i + 1]);
			}

		return s;
	}


	$.fn.bsmd.defaults = {
		toolbar : [['bold', 'italic'], ['link', 'quote', 'code', 'picture'], ['ol', 'ul', 'header', 'ellipsis'], ['undo', 'redo'], ['preview']],
		bold : {
			theme : '<button type="button" class="btn btn-default bsmd-btn bsmd-btn-bold" title="粗体"><i class="fa fa-bold"></i></button>',
			callback : function(theme, source, editor) {
				//粗体
				theme.on('click', function() {
					addText(editor, '**粗体**');
					selText(editor, 2, 4);
					editor.focus();
				});
			}
		},
		italic : {
			theme : '<button type="button" class="btn btn-default bsmd-btn bsmd-btn-italic" title="斜体"><i class="fa fa-italic"></i></button>',
			callback : function(theme, source, editor) {
				//斜体
				theme.on('click', function() {
					addText(editor, '*斜体*');
					selText(editor, 1, 3);
					editor.focus();
				});
			}
		},
		link : {
			theme : '<button type="button" class="btn btn-default bsmd-btn" title="链接" data-toggle="modal" data-target="#{0}-modal-link"><i class="fa fa-link"></i></button>',
			modal : '<form class="form-horizontal bsmd-form-link modal fade" id="{0}-modal-link" role="dialog" tabindex="-1"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title">链接</h4></div><div class="modal-body"><div class="form-group"><label for="{0}-link-title" class="col-sm-2 control-label">标题：</label><div class="col-sm-10"><input type="text" name="title" class="form-control" id="{0}-link-title" placeholder="标题"></div></div><div class="form-group"><label for="{0}-link-url" class="col-sm-2 control-label">网址：</label><div class="col-sm-10"><input type="text" name="url" value="http://" class="form-control" id="{0}-link-url" placeholder="网址"></div></div></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">关闭</button><button type="submit" class="btn btn-primary">确定</button></div></div></div></form>',
			callback : function(theme, source, editor) {
				//链接
				$(theme.attr('data-target')).on('show.bs.modal', function(e) {
					var f = $(this)[0];
					f.title.value = '';
					f.url.value = 'http://';
				});

				$(theme.attr('data-target')).on('submit', function() {
					var f = $(this)[0];
					addText(editor, '[' + f.title.value + '](' + f.url.value + ' "' + f.title.value + '")');
					$(this).modal('hide');
					editor.focus();
					return false;
				});
			}
		},
		quote : {
			theme : '<button type="button" class="btn btn-default bsmd-btn bsmd-btn-quote" title="引用"><i class="fa fa-quote-left"></i></button>',
			callback : function(theme, source, editor) {
				//引用
				theme.on('click', function() {
					addLine(editor, 2);
					addText(editor, '>');
					editor.focus();
				});
			}
		},
		code : {
			theme : '<button type="button" class="btn btn-default bsmd-btn bsmd-btn-code" title="代码" data-toggle="modal" data-target="#{0}-modal-code"><i class="fa fa-code"></i></button>',
			modal : '<div class="modal fade bsmd-modal-code" id="{0}-modal-code" role="dialog" tabindex="-1"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title">代码</h4></div><div class="modal-body"><ul class="nav nav-tabs"><li class="active"><a href="#{0}-code-lang" data-toggle="tab">语言</a></li><li><a href="#{0}-code-example" data-toggle="tab">示例</a></li></ul><div class="tab-content"><div class="tab-pane active" id="{0}-code-lang"><div class="list-group list-group-code"><a class="list-group-item" href="javascript:void(0);" mode="">片段</a><a class="list-group-item" href="javascript:void(0);" mode="htmlembedded&application/x-aspx">ASPX</a><a class="list-group-item" href="javascript:void(0);" mode="clike&text/x-csrc">C</a><a class="list-group-item" href="javascript:void(0);" mode="clike&text/x-c++src">C++</a><a class="list-group-item" href="javascript:void(0);" mode="clike&text/x-csharp">C#</a><a class="list-group-item" href="javascript:void(0);" mode="coffeescript&text/x-coffeescript">CoffeeScript</a><a class="list-group-item" href="javascript:void(0);" mode="clojure&text/x-clojure">Clojure</a><a class="list-group-item" href="javascript:void(0);" mode="commonlisp&text/x-common-lisp">Common Lisp</a><a class="list-group-item" href="javascript:void(0);" mode="css&text/css">CSS</a><a class="list-group-item" href="javascript:void(0);" mode="python&text/x-cython">Cython</a><a class="list-group-item" href="javascript:void(0);" mode="mllike&text/x-fsharp">F#</a><a class="list-group-item" href="javascript:void(0);" mode="go&text/x-go">Go</a><a class="list-group-item" href="javascript:void(0);" mode="haml&text/x-haml">HAML</a><a class="list-group-item" href="javascript:void(0);" mode="haxe&text/x-hxml">Hxml</a><a class="list-group-item" href="javascript:void(0);" mode="htmlmixed&text/html">HTML</a><a class="list-group-item" href="javascript:void(0);" mode="http&message/http">HTTP</a><a class="list-group-item" href="javascript:void(0);" mode="clike&text/x-java">Java</a><a class="list-group-item" href="javascript:void(0);" mode="jade&text/x-jade">Jade</a><a class="list-group-item" href="javascript:void(0);" mode="javascript&text/javascript">JavaScript</a><a class="list-group-item" href="javascript:void(0);" mode="javascript&application/json">JSON</a><a class="list-group-item" href="javascript:void(0);" mode="htmlembedded&application/x-jsp">JSP</a><a class="list-group-item" href="javascript:void(0);" mode="css&text/x-less">LESS</a><a class="list-group-item" href="javascript:void(0);" mode="lua&text/x-lua">Lua</a><a class="list-group-item" href="javascript:void(0);" mode="markdown&text/x-markdown">Markdown</a><a class="list-group-item" href="javascript:void(0);" mode="nginx&nginx">Nginx</a><a class="list-group-item" href="javascript:void(0);" mode="pascal&text/x-pascal">Pascal</a><a class="list-group-item" href="javascript:void(0);" mode="perl&text/x-perl">Perl</a><a class="list-group-item" href="javascript:void(0);" mode="php&application/x-httpd-php">PHP</a><a class="list-group-item" href="javascript:void(0);" mode="python&text/x-python">Python</a><a class="list-group-item" href="javascript:void(0);" mode="ruby&text/x-ruby">Ruby</a><a class="list-group-item" href="javascript:void(0);" mode="sass&text/x-sass">Sass</a><a class="list-group-item" href="javascript:void(0);" mode="clike/text/x-scala">Scala</a><a class="list-group-item" href="javascript:void(0);" mode="scheme&text/x-scheme">Scheme</a><a class="list-group-item" href="javascript:void(0);" mode="css&text/x-scss">SCSS</a><a class="list-group-item" href="javascript:void(0);" mode="shell&text/x-sh">Shell</a><a class="list-group-item" href="javascript:void(0);" mode="smarty&text/x-smarty">Smarty</a><a class="list-group-item" href="javascript:void(0);" mode="sql&text/x-sql">SQL</a><a class="list-group-item" href="javascript:void(0);" mode="sql&text/x-mysql">MySQL</a><a class="list-group-item" href="javascript:void(0);" mode="sql&text/x-mariadb">MariaDB</a><a class="list-group-item" href="javascript:void(0);" mode="sql&text/x-cassandra">Cassandra</a><a class="list-group-item" href="javascript:void(0);" mode="sql&text/x-plsql">PLSQL</a><a class="list-group-item" href="javascript:void(0);" mode="sql&text/x-mssql">msSQL</a><a class="list-group-item" href="javascript:void(0);" mode="javascript&application/typescript">TypeScript</a><a class="list-group-item" href="javascript:void(0);" mode="vb&text/x-vb">VB.NET</a><a class="list-group-item" href="javascript:void(0);" mode="vbscript&text/vbscript">VBScript</a><a class="list-group-item" href="javascript:void(0);" mode="velocity&text/velocity">Velocity</a><a class="list-group-item" href="javascript:void(0);" mode="xml&application/xml">XML</a><a class="list-group-item" href="javascript:void(0);" mode="xquery&application/xquery">XQuery</a><a class="list-group-item" href="javascript:void(0);" mode="yaml&text/x-yaml">YAML</a></div></div><div class="tab-pane" id="{0}-code-example">{1}</div></div></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">关闭</button><button type="button" class="btn btn-primary">确定</button></div></div></div></div>',
			callback : function(theme, source, editor) {
				$(theme.attr('data-target') + ' a.list-group-item').each(function(index) {
					//代码
					$(this).click(function() {
						var lang = $(this).attr('mode');
						if ('none' == lang) {
							addText(editor, '`代码`');
							selText(editor, 1, 3);
						} else {
							addLine(editor, 2);
							addText(editor, '```' + lang);
							addLine(editor, 2);
							addText(editor, '```');
							editor.execCommand('goLineUp');
						}
						$(theme.attr('data-target')).modal('hide');
						editor.focus();
					});
				});
			}
		},
		picture : {
			theme : '<button type="button" class="btn btn-default bsmd-btn" title="图片" data-toggle="modal" data-target="#{0}-modal-picture"><i class="fa fa-picture-o"></i></button>',
			modal : '<form class="form-horizontal bsmd-form-picture modal fade" id="{0}-modal-picture" role="dialog" tabindex="-1"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title">图片</h4></div><div class="modal-body"><div class="form-group"><label for="{0}-picture-title" class="col-sm-2 control-label">标题：</label><div class="col-sm-10"><input type="text" name="title" class="form-control" id="{0}-picture-title" placeholder="标题"></div></div><div class="form-group"><label for="{0}-picture-url" class="col-sm-2 control-label">网址：</label><div class="col-sm-10"><input type="text" name="url" value="http://" class="form-control" id="{0}-picture-url" placeholder="网址"></div></div></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">关闭</button><button type="submit" class="btn btn-primary">确定</button></div></div></div></form>',
			callback : function(theme, source, editor) {
				//图片
				$(theme.attr('data-target')).on('show.bs.modal', function(e) {
					var f = $(this)[0];
					f.title.value = '';
					f.url.value = 'http://';
				});

				$(theme.attr('data-target')).on('submit', function() {
					var f = $(this)[0];
					addText(editor, '![Alt ' + f.title.value + '](' + f.url.value + ' "' + f.title.value + '")');
					$(this).modal('hide');
					editor.focus();
					return false;
				});
			}
		},
		ol : {
			theme : '<button type="button" class="btn btn-default bsmd-btn bsmd-btn-ol" title="有序列表"><i class="fa fa-list-ol"></i></button>',
			callback : function(theme, source, editor) {
				//有序列表
				theme.on('click', function() {
					addLine(editor, 2);
					addText(editor, '0. ');
					editor.focus();
				});
			}
		},
		ul : {
			theme : '<button type="button" class="btn btn-default bsmd-btn bsmd-btn-ul" title="无序列表"><i class="fa fa-list-ul"></i></button>',
			callback : function(theme, source, editor) {
				//无序列表
				theme.on('click', function() {
					addLine(editor, 2);
					addText(editor, '+ ');
					editor.focus();
				});
			}
		},
		header : {
			theme : '<div class="btn-group"><button type="button" class="btn btn-default bsmd-btn dropdown-toggle" data-toggle="dropdown" title="标题"><i class="fa fa-header"></i><span class="caret"></span></button><ul class="dropdown-menu"><li><a class="bsmd-header" href="javascript:void(0);"><i class="fa fa-header"></i>1</a></li><li><a class="bsmd-header" href="javascript:void(0);"><i class="fa fa-header"></i>2</a></li><li><a class="bsmd-header" href="javascript:void(0);"><i class="fa fa-header"></i>3</a></li><li><a class="bsmd-header" href="javascript:void(0);"><i class="fa fa-header"></i>4</a></li><li><a class="bsmd-header" href="javascript:void(0);"><i class="fa fa-header"></i>5</a></li><li><a class="bsmd-header" href="javascript:void(0);"><i class="fa fa-header"></i>6</a></li></ul></div>',
			callback : function(theme, source, editor) {
				//标题
				$('a.bsmd-header', theme).each(function(index) {
					$(this).click(function() {
						var c = '';

						for (var i = 0; i < (index + 1); i++) {
							c += '#';
						};

						addText(editor, c + (index + 1) + '级标题' + c);
						selText(editor, index + 1, index + 5);
						editor.focus();
					});
				});
			}
		},
		ellipsis : {
			theme : '<button type="button" class="btn btn-default bsmd-btn bsmd-btn-ellipsis" title="分割线"><i class="fa fa-ellipsis-h"></i></button>',
			callback : function(theme, source, editor) {
				//分割线
				theme.on('click', function() {
					addLine(editor, 2);
					addText(editor, '-------');
					addLine(editor, 2);
					editor.focus();
				});
			}
		},
		undo : {
			theme : '<button type="button" class="btn btn-default bsmd-btn bsmd-btn-undo" title="撤消"><i class="fa fa-undo"></i></button>',
			callback : function(theme, source, editor) {
				//撤消
				theme.on('click', function() {
					editor.undo();
				});
			}
		},
		redo : {
			theme : '<button type="button" class="btn btn-default bsmd-btn bsmd-btn-redo" title="恢复"><i class="fa fa-repeat"></i></button>',
			callback : function(theme, source, editor) {
				//恢复
				theme.on('click', function() {
					editor.redo();
				});
			}
		},
		preview : {
			theme : '<button type="button" class="btn btn-default bsmd-btn-eye" title="预览"><i class="fa fa-eye"></i></button>',
			callback : function(theme, source, editor) {
				//预览
				theme.on('click', function() {
					$(this).toggleClass('active');
					$('.bsmd-editor', source).toggle('fast');
					$('.bsmd-preview', source).toggle('fast', function() {
						if ($(this).is(':visible'))
							$(this).html(marked(editor.getValue()));

						if (CodeMirror.autoLoadMode)
							$(this).find('code').each(function(index) {
								var cl = $(this).attr('class');
								if (cl && 'lang' == cl.substring(0, 4)) {
									var mode = cl.substring(5, cl.length).split('&');
									var code = $(this).text();
									$(this).text('');
									var cm = CodeMirror($(this)[0], {
										lineNumbers : true,
										readOnly : true
									});

									cm.setOption('mode', mode[1]);
									CodeMirror.autoLoadMode(cm, mode[0]);

									cm.setValue(code);
								};
							});
					});
					$('.bsmd-btn', source).toggleClass('disabled');
				});
			}
		}
	};
})(jQuery);
