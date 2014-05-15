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
		var txt = $(this).is('textarea') ? $(this).val() : $(this).html() ? $.parseHTML($(this).html())[0].data : '';
		$(this).remove();

		var editor = CodeMirror($('#' + id + ' .bsmd-editor')[0], {
			lineNumbers : true,
			mode : 'text/x-markdown',
			value : txt
		});

		for (var i = 0; i < settings.toolbar.length; i++) {
			var bg = $('<div class="btn-group"></div>').appendTo($('#' + id + ' .btn-toolbar'));
			for (var j = 0; j < settings.toolbar[i].length; j++) {
				var bt = settings[settings.toolbar[i][j]];
				bt.callback(bt.theme ? $(bt.theme(id)).appendTo(bg) : null, source, editor);
			}
		}

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


	$.fn.bsmd.defaults = {
		toolbar : [['bold', 'italic'], ['link', 'quote', 'code', 'picture'], ['ol', 'ul', 'header', 'ellipsis'], ['undo', 'redo'], ['preview']],
		bold : {
			//粗体
			theme : function(id) {
				return '<button type="button" class="btn btn-default bsmd-btn bsmd-btn-bold" title="粗体"><i class="fa fa-bold"></i></button>';
			},
			callback : function(theme, source, editor) {
				theme.on('click', function() {
					editor.focus();
					addText(editor, '**粗体**');
					selText(editor, 2, 4);
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
					editor.focus();
					addText(editor, '*斜体*');
					selText(editor, 1, 3);
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
					editor.focus();
					addLine(editor, 2);
					addText(editor, '>');
				});
			}
		},
		code : {
			//代码
			theme : function(id) {
				var mode = {
					'none' : ['片段', 'none'],
					'text/apl' : ['APL', 'apl'],
					'text/x-asterisk' : ['Asterisk dialplan', 'asterisk'],
					'text/x-csrc' : ['C', 'clike'],
					'text/x-c++src' : ['C++', 'clike'],
					'text/x-java' : ['C#', 'clike'],
					'text/x-csharp' : ['Java', 'clike'],
					'text/x-scala' : ['Scala', 'clike'],
					'text/x-clojure' : ['Clojure', 'clojure'],
					'text/x-cobol' : ['COBOL', 'cobol'],
					'text/x-coffeescript' : ['CoffeeScript', 'coffeescript'],
					'text/x-common-lisp' : ['Common Lisp', 'commonlisp'],
					'text/css' : ['CSS', 'css'],
					'text/x-less' : ['LESS', 'css'],
					'text/x-scss' : ['SCSS', 'css'],
					'application/x-cypher-query' : ['Cypher', 'cypher'],
					'text/x-d' : ['D', 'd'],
					'text/x-diff' : ['diff', 'diff'],
					'text/x-django' : ['Django', 'django'],
					'application/xml-dtd' : ['DTD', 'dtd'],
					'text/x-dylan' : ['Dylan', 'dylan'],
					'text/x-ecl' : ['ECL', 'ecl'],
					'text/x-eiffel' : ['Eiffel', 'eiffel'],
					'text/x-erlang' : ['Erlang', 'erlang'],
					'text/x-Fortran' : ['Fortran', 'fortran'],
					'text/x-fsharp' : ['F#', 'mllike'],
					'text/x-ocaml' : ['OCaml', 'mllike'],
					'text/x-gas' : ['Gas', 'gas'],
					'gfm' : ['GFM', 'gfm'],
					'text/x-feature' : ['Gherkin', 'gherkin'],
					'text/x-go' : ['Go', 'go'],
					'text/x-groovy' : ['Groovy', 'groovy'],
					'text/x-haml' : ['HAML', 'haml'],
					'text/x-haskell' : ['Haskell', 'haskell'],
					'text/x-haxe' : ['Haxe', 'haxe'],
					'text/x-hxml' : ['Hxml', 'haxe'],
					'application/x-aspx' : ['ASP.NET', 'htmlembedded'],
					'application/x-ejs' : ['Embedded Javascript', 'htmlembedded'],
					'application/x-jsp' : ['JSP', 'htmlembedded'],
					'text/html' : ['HTML', 'htmlmixed'],
					'message/http' : ['HTTP', 'http'],
					'text/x-jade' : ['Jade', 'jade'],
					'text/javascript' : ['JavaScript', 'javascript'],
					'application/json' : ['JSON', 'javascript'],
					'text/typescript' : ['TypeScript', 'javascript'],
					'jinja2' : ['Jinja2', 'jinja2'],
					'text/x-julia' : ['Julia', 'julia'],
					'text/x-livescript' : ['LiveScript', 'livescript'],
					'text/x-lua' : ['Lua', 'lua'],
					'text/x-markdown' : ['Markdown', 'markdown'],
					'text/mirc' : ['mIRC', 'mirc'],
					'text/nginx' : ['Nginx', 'nginx'],
					'text/n-triples' : ['NTriples', 'ntriples'],
					'text/x-octave' : ['Octave (MATLAB)', 'octave'],
					'text/x-pascal' : ['Pascal', 'pascal'],
					'pegjs' : ['PEG.js', 'pegjs'],
					'text/x-perl' : ['Perl', 'perl'],
					'text/x-php' : ['PHP', 'php'],
					'application/x-httpd-php' : ['PHP&HTML', 'php'],
					'text/x-pig' : ['Pig Latin', 'pig'],
					'text/x-properties' : ['Properties files', 'properties'],
					'text/x-puppet' : ['Puppet', 'puppet'],
					'text/x-python' : ['Python', 'python'],
					'text/x-cython' : ['Cython', 'python'],
					'text/x-q' : ['Q', 'q'],
					'text/x-rsrc' : ['R', 'r'],
					'text/x-rpm-spec' : ['RPM spec', 'rpm'],
					'text/x-rpm-changes' : ['RPM changes', 'rpm'],
					'text/x-rst' : ['reStructuredText', 'rst'],
					'text/x-ruby' : ['Ruby', 'ruby'],
					'text/x-rustsrc' : ['Rust', 'rust'],
					'text/x-sass' : ['Sass', 'sass'],
					'text/x-scheme' : ['Scheme', 'scheme'],
					'text/x-sh' : ['Shell', 'shell'],
					'application/sieve' : ['Sieve', 'sieve'],
					'text/x-stsrc' : ['Smalltalk', 'smalltalk'],
					'text/x-smarty' : ['Smarty', 'smarty'],
					'text/x-smarty' : ['Smarty/HTML mixed', 'smartymixed'],
					'text/x-solr' : ['Solr', 'solr'],
					'application/x-sparql-query' : ['SPARQL', 'sparql'],
					'text/x-sql' : ['SQL', 'sql'],
					'text/x-mysql' : ['MySQL', 'sql'],
					'text/x-mariadb' : ['MariaDB', 'sql'],
					'text/x-cassandra' : ['Cassandra', 'sql'],
					'text/x-plsql' : ['PLSQL', 'sql'],
					'text/x-mssql' : ['msSQL', 'sql'],
					'text/x-hive' : ['Hive', 'sql'],
					'text/x-stex' : ['sTeX, LaTeX', 'stex'],
					'text/x-tcl' : ['Tcl', 'tcl'],
					'text/x-tiddlywiki' : ['Tiddlywiki', 'tiddlywiki'],
					'tiki' : ['Tiki wiki', 'tiki'],
					'text/x-toml' : ['TOML', 'toml'],
					'text/turtle' : ['Turtle', 'turtle'],
					'text/x-vb' : ['VB.NET', 'vb'],
					'text/vbscript' : ['VBScript', 'vbscript'],
					'text/velocity' : ['Velocity', 'velocity'],
					'text/x-verilog' : ['Verilog', 'verilog'],
					'text/x-systemverilog' : ['SystemVerilog', 'verilog'],
					'application/xml' : ['XML', 'xml'],
					'application/xquery' : ['XQuery', 'xquery'],
					'text/x-yaml' : ['YAML', 'yaml'],
					'text/x-z80' : ['Z80', 'z80'],
				};

				var modal = ('<div class="modal fade bsmd-modal-code" id="' + id + '-modal-code" role="dialog" tabindex="-1"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title">代码</h4></div><div class="modal-body"><ul class="nav nav-tabs"><li class="active"><a href="#' + id + '-code-lang" data-toggle="tab">语言</a></li><li><a href="#' + id + '-code-example" data-toggle="tab">示例</a></li></ul><div class="tab-content"><div class="tab-pane active" id="' + id + '-code-lang"><div class="list-group list-group-code">');

				for (var key in mode) {
					if (mode.hasOwnProperty(key)) {
						modal += '<a class="list-group-item" href="javascript:void(0);" mime="' + key + '" mode="' + mode[key][1] + '">' + mode[key][0] + '</a>';
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
							addText(editor, '```' + mode + '&' + $(this).attr('mime'));
							addLine(editor, 2);
							addText(editor, '```');
							editor.execCommand('goLineUp');
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
					editor.focus();
					addLine(editor, 2);
					addText(editor, '0. ');
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
					editor.focus();
					addLine(editor, 2);
					addText(editor, '+ ');
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

						editor.focus();
						addText(editor, c + (index + 1) + '级标题' + c);
						selText(editor, index + 1, index + 5);
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
					editor.focus();
					addLine(editor, 2);
					addText(editor, '-------');
					addLine(editor, 2);
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
									var mode = cl.substring(5, cl.length).split('&');
									var code = $(this).text();
									$(this).text('');
									var cm = CodeMirror($(this)[0], {
										lineNumbers : true,
										readOnly : true,
										mode : mode[1],
										value : code
									});

									CodeMirror.autoLoadMode(cm, mode[0]);
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
