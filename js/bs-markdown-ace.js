(function($) {
	/**
	 *
	 * IE9+
	 * @param {Object} options
	 */

	$.fn.bsmd = function(options) {
		var settings = $.extend(true, {}, $.fn.bsmd.defaults, options);

		var id = 'bsmd-' + (new Date).getTime();
		var source = $('<div id="' + id + '" class="bsmd"><div class="btn-toolbar" role="toolbar"></div><div class="bsmd-editor"></div><div class="bsmd-preview"></div></div>');
		source.insertAfter($(this));
		var txt = $(this).is('textarea') ? $(this).val() : $(this).text();
		$(this).remove();

		var editor = ace.edit($('#' + id + ' .bsmd-editor')[0]);

		for (var i = 0; i < settings.toolbar.length; i++) {
			var bg = $('<div class="btn-group"></div>').appendTo($('#' + id + ' .btn-toolbar'));
			for (var j = 0; j < settings.toolbar[i].length; j++) {
				var bt = settings[settings.toolbar[i][j]];
				bt.callback(bt.theme ? $(bt.theme(id)).appendTo(bg) : null, source, editor);
			}
		}

		editor.setTheme('ace/theme/chrome');
		editor.getSession().setMode('ace/mode/markdown');

		if (txt)
			editor.setValue(txt);

		editor.clearSelection();

		return editor;
	};

	function addLine(editor, num) {
		for (var i = 0; i < num; i++) {
			editor.getSession().getDocument().insertNewLine(editor.getSelection().getCursor());
		}
	}

	function addText(editor, text) {
		editor.getSession().getDocument().insertInLine(editor.getSelection().getCursor(), text);
	}

	function selText(editor, from, to) {
		var p = editor.getSelection().getCursor();
		editor.gotoLine(p.row + 1, p.column - from, false);
		editor.getSelection().selectTo(p.row, p.column - to);
	}


	$.fn.bsmd.defaults = {
		toolbar : [['bold', 'italic'], ['link', 'quote', 'code', 'picture'], ['ol', 'ul', 'header', 'ellipsis'], ['undo', 'redo'], ['preview']],
		bold : {
			//粗体
			theme : function(id) {
				return '<button type="button" class="btn btn-default bsmd-btn bsmd-btn-bold" title="粗体"><i class="fa fa-bold"></i></button>';
			},
			callback : function(theme, source, editor) {
				theme.on('click', function() {
					addText(editor, '**粗体**');
					selText(editor, 2, 4);
					editor.focus();
				});
			}
		},
		italic : {
			//斜体
			theme : function(id) {
				return '<button type="button" class="btn btn-default bsmd-btn bsmd-btn-italic" title="斜体"><i class="fa fa-italic"></i></button>';
			},
			callback : function(theme, source, editor) {
				theme.on('click', function() {
					addText(editor, '*斜体*');
					selText(editor, 1, 3);
					editor.focus();
				});
			}
		},
		link : {
			//链接
			theme : function(id) {
				$('<form class="form-horizontal bsmd-form-link modal fade" id="' + id + '-modal-link" role="dialog" tabindex="-1"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title">链接</h4></div><div class="modal-body"><div class="form-group"><label for="' + id + '-link-title" class="col-sm-2 control-label">标题：</label><div class="col-sm-10"><input type="text" name="title" class="form-control" id="' + id + '-link-title" placeholder="标题"></div></div><div class="form-group"><label for="' + id + '-link-url" class="col-sm-2 control-label">网址：</label><div class="col-sm-10"><input type="text" name="url" value="http://" class="form-control" id="' + id + '-link-url" placeholder="网址"></div></div></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">关闭</button><button type="submit" class="btn btn-primary">确定</button></div></div></div></form>').appendTo('body');

				return '<button type="button" class="btn btn-default bsmd-btn" title="链接" data-toggle="modal" data-target="#' + id + '-modal-link"><i class="fa fa-link"></i></button>';
			},
			callback : function(theme, source, editor) {
				var modal = $(theme.attr('data-target'));
				modal.on('show.bs.modal', function(e) {
					var f = $(this)[0];
					f.title.value = '';
					f.url.value = 'http://';
				});

				modal.on('submit', function() {
					var f = $(this)[0];
					addText(editor, '[' + f.title.value + '](' + f.url.value + ' "' + f.title.value + '")');
					$(this).modal('hide');
					editor.focus();
					return false;
				});
			}
		},
		quote : {
			//引用
			theme : function(id) {
				return '<button type="button" class="btn btn-default bsmd-btn bsmd-btn-quote" title="引用"><i class="fa fa-quote-left"></i></button>';
			},
			callback : function(theme, source, editor) {
				theme.on('click', function() {
					addLine(editor, 2);
					addText(editor, '>');
					editor.focus();
				});
			}
		},
		code : {
			//代码
			theme : function(id) {
				var mode = {
					none : '片段',
					abap : 'ABAP',
					actionscript : 'ActionScript',
					ada : 'ADA',
					apache_conf : 'Apache Conf',
					asciidoc : 'AsciiDoc',
					assembly_x86 : 'Assembly x86',
					autohotkey : 'AutoHotKey',
					batchfile : 'BatchFile',
					c9search : 'C9Search',
					c_cpp : 'C/C++',
					cirru : 'Cirru',
					clojure : 'Clojure',
					cobol : 'Cobol',
					coffee : 'CoffeeScript',
					coldfusion : 'ColdFusion',
					csharp : 'C#',
					css : 'CSS',
					curly : 'Curly',
					d : 'D',
					dart : 'Dart',
					diff : 'Diff',
					dot : 'Dot',
					erlang : 'Erlang',
					ejs : 'EJS',
					forth : 'Forth',
					ftl : 'FreeMarker',
					gherkin : 'Gherkin',
					glsl : 'Glsl',
					golang : 'Go',
					groovy : 'Groovy',
					haml : 'HAML',
					handlebars : 'Handlebars',
					haskell : 'Haskell',
					haxe : 'haXe',
					html : 'HTML',
					html_ruby : 'HTML (Ruby)',
					ini : 'INI',
					jack : 'Jack',
					jade : 'Jade',
					java : 'Java',
					javascript : 'JavaScript',
					json : 'JSON',
					jsoniq : 'JSONiq',
					jsp : 'JSP',
					jsx : 'JSX',
					julia : 'Julia',
					latex : 'LaTeX',
					less : 'LESS',
					liquid : 'Liquid',
					lisp : 'Lisp',
					livescript : 'LiveScript',
					logiql : 'LogiQL',
					lsl : 'LSL',
					lua : 'Lua',
					luapage : 'LuaPage',
					lucene : 'Lucene',
					makefile : 'Makefile',
					matlab : 'MATLAB',
					markdown : 'Markdown',
					mel : 'MEL',
					mysql : 'MySQL',
					mushcode : 'MUSHCode',
					nix : 'Nix',
					objectivec : 'Objective-C',
					ocaml : 'OCaml',
					pascal : 'Pascal',
					perl : 'Perl',
					pgsql : 'pgSQL',
					php : 'PHP',
					powershell : 'Powershell',
					prolog : 'Prolog',
					properties : 'Properties',
					protobuf : 'Protobuf',
					python : 'Python',
					r : 'R',
					rdoc : 'RDoc',
					rhtml : 'RHTML',
					ruby : 'Ruby',
					rust : 'Rust',
					sass : 'SASS',
					scad : 'SCAD',
					scala : 'Scala',
					smarty : 'Smarty',
					scheme : 'Scheme',
					scss : 'SCSS',
					sh : 'SH',
					sjs : 'SJS',
					space : 'Space',
					snippets : 'snippets',
					soy_template : 'Soy Template',
					sql : 'SQL',
					stylus : 'Stylus',
					svg : 'SVG',
					tcl : 'Tcl',
					tex : 'Tex',
					text : 'Text',
					textile : 'Textile',
					toml : 'Toml',
					twig : 'Twig',
					typescript : 'Typescript',
					vbscript : 'VBScript',
					velocity : 'Velocity',
					verilog : 'Verilog',
					xml : 'XML',
					xquery : 'XQuery',
					yaml : 'YAML'
				};

				var modal = ('<div class="modal fade bsmd-modal-code" id="' + id + '-modal-code" role="dialog" tabindex="-1"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title">代码</h4></div><div class="modal-body"><ul class="nav nav-tabs"><li class="active"><a href="#' + id + '-code-lang" data-toggle="tab">语言</a></li><li><a href="#' + id + '-code-example" data-toggle="tab">示例</a></li></ul><div class="tab-content"><div class="tab-pane active" id="' + id + '-code-lang"><div class="list-group list-group-code">');

				for (var key in mode) {
					if (mode.hasOwnProperty(key)) {
						modal += '<a class="list-group-item" href="javascript:void(0);" mode="' + key + '">' + mode[key] + '</a>';
					}
				}

				modal += '</div></div><div class="tab-pane" id="' + id + '-code-example">';
				modal += '</div></div></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">关闭</button><button type="button" class="btn btn-primary">确定</button></div></div></div></div>';

				$(modal).appendTo('body');

				return '<button type="button" class="btn btn-default bsmd-btn bsmd-btn-code" title="代码" data-toggle="modal" data-target="#' + id + '-modal-code"><i class="fa fa-code"></i></button>';
			},
			callback : function(theme, source, editor) {
				var modal = $(theme.attr('data-target'));
				$('a.list-group-item', modal).each(function(index) {
					$(this).click(function() {
						var mode = $(this).attr('mode');
						if ('none' == mode) {
							addText(editor, '`代码`');
							selText(editor, 1, 3);
						} else {
							addLine(editor, 2);
							addText(editor, '```' + mode);
							addLine(editor, 2);
							addText(editor, '```');
							editor.gotoLine(editor.getSelection().getCursor().row, 0, false);
						}
						modal.modal('hide');
						editor.focus();
					});
				});
			}
		},
		picture : {
			//图片
			theme : function(id) {
				$('<form class="form-horizontal bsmd-form-picture modal fade" id="' + id + '-modal-picture" role="dialog" tabindex="-1"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title">图片</h4></div><div class="modal-body"><div class="form-group"><label for="' + id + '-picture-title" class="col-sm-2 control-label">标题：</label><div class="col-sm-10"><input type="text" name="title" class="form-control" id="' + id + '-picture-title" placeholder="标题"></div></div><div class="form-group"><label for="' + id + '-picture-url" class="col-sm-2 control-label">网址：</label><div class="col-sm-10"><input type="text" name="url" value="http://" class="form-control" id="' + id + '-picture-url" placeholder="网址"></div></div></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">关闭</button><button type="submit" class="btn btn-primary">确定</button></div></div></div></form>').appendTo('body');

				return '<button type="button" class="btn btn-default bsmd-btn" title="图片" data-toggle="modal" data-target="#' + id + '-modal-picture"><i class="fa fa-picture-o"></i></button>';
			},
			callback : function(theme, source, editor) {
				var modal = $(theme.attr('data-target'));
				modal.on('show.bs.modal', function(e) {
					var f = $(this)[0];
					f.title.value = '';
					f.url.value = 'http://';
				});

				modal.on('submit', function() {
					var f = $(this)[0];
					addText(editor, '![Alt ' + f.title.value + '](' + f.url.value + ' "' + f.title.value + '")');
					$(this).modal('hide');
					editor.focus();
					return false;
				});
			}
		},
		ol : {
			//有序列表
			theme : function(id) {
				return '<button type="button" class="btn btn-default bsmd-btn bsmd-btn-ol" title="有序列表"><i class="fa fa-list-ol"></i></button>';
			},
			callback : function(theme, source, editor) {
				theme.on('click', function() {
					addLine(editor, 2);
					addText(editor, '0. ');
					editor.focus();
				});
			}
		},
		ul : {
			//无序列表
			theme : function(id) {
				return '<button type="button" class="btn btn-default bsmd-btn bsmd-btn-ul" title="无序列表"><i class="fa fa-list-ul"></i></button>';
			},
			callback : function(theme, source, editor) {
				theme.on('click', function() {
					addLine(editor, 2);
					addText(editor, '+ ');
					editor.focus();
				});
			}
		},
		header : {
			//标题
			theme : function(id) {
				return '<div class="btn-group"><button type="button" class="btn btn-default bsmd-btn dropdown-toggle" data-toggle="dropdown" title="标题"><i class="fa fa-header"></i><span class="caret"></span></button><ul class="dropdown-menu"><li><a class="bsmd-header" href="javascript:void(0);"><i class="fa fa-header"></i>1</a></li><li><a class="bsmd-header" href="javascript:void(0);"><i class="fa fa-header"></i>2</a></li><li><a class="bsmd-header" href="javascript:void(0);"><i class="fa fa-header"></i>3</a></li><li><a class="bsmd-header" href="javascript:void(0);"><i class="fa fa-header"></i>4</a></li><li><a class="bsmd-header" href="javascript:void(0);"><i class="fa fa-header"></i>5</a></li><li><a class="bsmd-header" href="javascript:void(0);"><i class="fa fa-header"></i>6</a></li></ul></div>';
			},
			callback : function(theme, source, editor) {
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
			//分割线
			theme : function(id) {
				return '<button type="button" class="btn btn-default bsmd-btn bsmd-btn-ellipsis" title="分割线"><i class="fa fa-ellipsis-h"></i></button>';
			},
			callback : function(theme, source, editor) {
				theme.on('click', function() {
					addLine(editor, 2);
					addText(editor, '-------');
					addLine(editor, 2);
					editor.focus();
				});
			}
		},
		undo : {
			//撤消
			theme : function(id) {
				return '<button type="button" class="btn btn-default bsmd-btn bsmd-btn-undo" title="撤消"><i class="fa fa-undo"></i></button>';
			},
			callback : function(theme, source, editor) {
				theme.on('click', function() {
					editor.undo();
					editor.focus();
				});
			}
		},
		redo : {
			//恢复
			theme : function(id) {
				return '<button type="button" class="btn btn-default bsmd-btn bsmd-btn-redo" title="恢复"><i class="fa fa-repeat"></i></button>';
			},
			callback : function(theme, source, editor) {
				theme.on('click', function() {
					editor.redo();
					editor.focus();
				});
			}
		},
		preview : {
			theme : function(id) {
				return '<button type="button" class="btn btn-default bsmd-btn-eye" title="预览"><i class="fa fa-eye"></i></button>';
			},
			callback : function(theme, source, editor) {
				//预览
				theme.on('click', function() {
					$(this).toggleClass('active');
					$('.bsmd-editor', source).toggle(0);
					$('.bsmd-preview', source).toggle(0, function() {
						if ($(this).is(':visible')) {
							$(this).html(marked(editor.getValue()));

							$(this).find('code').each(function(index) {
								var cl = $(this).attr('class');
								if (cl && 'lang' == cl.substring(0, 4)) {
									var mode = cl.substring(5, cl.length);
									var code = $(this).text();
									var p = $(this).parent().empty();

									var aceEditor = ace.edit(p[0]);
									aceEditor.setTheme('ace/theme/chrome');
									aceEditor.getSession().setMode('ace/mode/' + mode);
									aceEditor.setValue(code);
									aceEditor.setOptions({
										maxLines : Infinity
									});
									aceEditor.setReadOnly(true);
									aceEditor.clearSelection();
								};
							});
						}
					});
					$('.bsmd-btn', source).toggleClass('disabled');
				});
			}
		}
	};
})(jQuery);
