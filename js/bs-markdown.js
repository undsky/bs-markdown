(function($) {
	/**
	 *
	 * IE9+
	 * @param {Object} options
	 */

	$.fn.bsmd = function(options) {
		var settings = $.extend(true, {}, $.fn.bsmd.defaults, options);

		var id = 'bsmd-' + (new Date).getTime();
		$('<div class="bsmd" id="' + id + '"><div class="btn-toolbar" role="toolbar"></div><div class="bsmd-editor"></div>' + (settings.preview ? '<div class="bsmd-preview"></div>' : '') + '</div>').insertAfter($(this));
		var mdText = $(this).is('textarea') ? $(this).val() : $(this).html();
		$(this).remove();

		var editor = ace.edit($('#' + id + ' .bsmd-editor')[0]);

		for (var i = 0; i < settings.toolbar.length; i++) {
			var btnGroup = $('<div class="btn-group"></div>');
			btnGroup.appendTo($('#' + id + ' .btn-toolbar'));
			for (var j = 0; j < settings.toolbar[i].length; j++) {
				var item = settings.toolbar[i][j];
				var s = $(themeFormat(item.theme, id));
				s.appendTo(btnGroup);
				item.callback(s, editor);
			}
		}

		editor.setTheme('ace/theme/chrome');
		editor.getSession().setMode('ace/mode/markdown');

		if (settings.preview) {
			editor.on('change', function(e) {
				$('#' + id + ' .bsmd-preview').html(marked(editor.getValue()));
			});
		}

		if (mdText) {
			editor.setValue(mdText);
		}

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

	function reText(editor, from, to) {
		var p = editor.getSelection().getCursor();
		editor.gotoLine(p.row + 1, p.column - from, false);
		editor.getSelection().selectTo(p.row, p.column - to);
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
		toolbar : [[{
			name : 'bold',
			theme : '<button type="button" class="btn btn-default bsmd-btn-bold" title="粗体"><i class="fa fa-bold"></i></button>',
			callback : function(s, e) {
				//粗体
				s.on('click', function() {
					addText(e, '**粗体**');
					reText(e, 2, 4);
					e.focus();
				});
			}
		}, {
			name : 'italic',
			theme : '<button type="button" class="btn btn-default bsmd-btn-italic" title="斜体"><i class="fa fa-italic"></i></button>',
			callback : function(s, e) {
				//斜体
				s.on('click', function() {
					addText(e, '*斜体*');
					reText(e, 1, 3);
					e.focus();
				});
			}
		}], [{
			name : 'link',
			theme : '<button type="button" class="btn btn-default" title="链接" data-toggle="modal" data-target="#{0}-modal-link"><i class="fa fa-link"></i></button><form class="form-horizontal bsmd-form-link modal fade" id="{0}-modal-link" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title">链接</h4></div><div class="modal-body"><div class="form-group"><label for="{0}-link-title" class="col-sm-2 control-label">标题：</label><div class="col-sm-10"><input type="text" name="title" class="form-control" id="{0}-link-title" placeholder="标题"></div></div><div class="form-group"><label for="{0}-link-url" class="col-sm-2 control-label">网址：</label><div class="col-sm-10"><input type="text" name="url" value="http://" class="form-control" id="{0}-link-url" placeholder="网址"></div></div></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">关闭</button><button type="submit" class="btn btn-primary">确定</button></div></div></div></form>',
			callback : function(s, e) {
				//链接
				s.on('show.bs.modal', function(e) {
					var f = $(this)[0];
					f.title.value = '';
					f.url.value = 'http://';
				});

				s.submit(function() {
					var f = $(this)[0];
					addText(e, '[' + f.title.value + '](' + f.url.value + ' "' + f.title.value + '")');
					$(this).modal('hide');
					e.focus();
					return false;
				});
			}
		}, {
			name : 'quote',
			theme : '<button type="button" class="btn btn-default bsmd-btn-quote" title="引用"><i class="fa fa-quote-left"></i></button>',
			callback : function(s, e) {
				//引用
				s.click(function() {
					addLine(e, 2);
					addText(e, '>');
					e.focus();
				});
			}
		}, {
			name : 'code',
			theme : '<div class="btn-group"><button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" title="代码"><i class="fa fa-code"></i><span class="caret"></span></button><ul class="dropdown-menu"><li><a lang="none" class="bsmd-code" href="javascript:void(0);">片段</a></li><li><a lang="html" class="bsmd-code" href="javascript:void(0);">html</a></li><li><a lang="css" class="bsmd-code" href="javascript:void(0);">css</a></li><li><a lang="javascript" class="bsmd-code" href="javascript:void(0);">javascript</a></li><li><a lang="markdown" class="bsmd-code" href="javascript:void(0);">markdown</a></li><li><a lang="php" class="bsmd-code" href="javascript:void(0);">php</a></li><li><a lang="csharp" class="bsmd-code" href="javascript:void(0);">c#</a></li><li><a lang="velocity" class="bsmd-code" href="javascript:void(0);">velocity</a></li></ul></div>',
			callback : function(s, e) {
				$('a.bsmd-code', s).each(function(index) {
					//代码
					$(this).click(function() {
						var lang = $(this).attr('lang');
						if ('none' == lang) {
							addText(e, '`代码`');
							reText(e, 1, 3);
						} else {
							addLine(e, 2);
							addText(e, '```' + lang);
							addLine(e, 2);
							addText(e, '```');
							e.gotoLine(e.getSelection().getCursor().row, 0, false);
						}
						e.focus();
					});
				});
			}
		}, {
			name : 'picture',
			theme : '<button type="button" class="btn btn-default" title="图片" data-toggle="modal" data-target="#{0}-modal-picture"><i class="fa fa-picture-o"></i></button><form class="form-horizontal bsmd-form-picture modal fade" id="{0}-modal-picture" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title">图片</h4></div><div class="modal-body"><div class="form-group"><label for="{0}-picture-title" class="col-sm-2 control-label">标题：</label><div class="col-sm-10"><input type="text" name="title" class="form-control" id="{0}-picture-title" placeholder="标题"></div></div><div class="form-group"><label for="{0}-picture-url" class="col-sm-2 control-label">网址：</label><div class="col-sm-10"><input type="text" name="url" value="http://" class="form-control" id="{0}-picture-url" placeholder="网址"></div></div></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">关闭</button><button type="submit" class="btn btn-primary">确定</button></div></div></div></form>',
			callback : function(s, e) {
				//图片
				s.on('show.bs.modal', function(e) {
					var f = $(this)[0];
					f.title.value = '';
					f.url.value = 'http://';
				});
				s.submit(function() {
					var f = $(this)[0];
					addText(e, '![Alt ' + f.title.value + '](' + f.url.value + ' "' + f.title.value + '")');
					$(this).modal('hide');
					e.focus();
					return false;
				});
			}
		}], [{
			name : 'ol',
			theme : '<button type="button" class="btn btn-default bsmd-btn-ol" title="有序列表"><i class="fa fa-list-ol"></i></button>',
			callback : function(s, e) {
				//有序列表
				s.click(function() {
					addLine(e, 2);
					addText(e, '0. ');
					e.focus();
				});
			}
		}, {
			name : 'ul',
			theme : '<button type="button" class="btn btn-default bsmd-btn-ul" title="无序列表"><i class="fa fa-list-ul"></i></button>',
			callback : function(s, e) {
				//无序列表
				s.click(function() {
					addLine(e, 2);
					addText(e, '+ ');
					e.focus();
				});
			}
		}, {
			name : 'header',
			theme : '<div class="btn-group"><button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" title="标题"><i class="fa fa-header"></i><span class="caret"></span></button><ul class="dropdown-menu"><li><a class="bsmd-header" href="javascript:void(0);"><i class="fa fa-header"></i>1</a></li><li><a class="bsmd-header" href="javascript:void(0);"><i class="fa fa-header"></i>2</a></li><li><a class="bsmd-header" href="javascript:void(0);"><i class="fa fa-header"></i>3</a></li><li><a class="bsmd-header" href="javascript:void(0);"><i class="fa fa-header"></i>4</a></li><li><a class="bsmd-header" href="javascript:void(0);"><i class="fa fa-header"></i>5</a></li><li><a class="bsmd-header" href="javascript:void(0);"><i class="fa fa-header"></i>6</a></li></ul></div>',
			callback : function(s, e) {
				//标题
				$('a.bsmd-header', s).each(function(index) {
					$(this).click(function() {
						var c = '';

						for (var i = 0; i < (index + 1); i++) {
							c += '#';
						};

						addText(e, c + (index + 1) + '级标题' + c);
						reText(e, index + 1, index + 5);
						e.focus();
					});
				});
			}
		}, {
			name : 'ellipsis',
			theme : '<button type="button" class="btn btn-default bsmd-btn-ellipsis" title="分割线"><i class="fa fa-ellipsis-h"></i></button>',
			callback : function(s, e) {
				//分割线
				s.click(function() {
					addLine(e, 2);
					addText(e, '-------');
					addLine(e, 2);
					e.focus();
				});
			}
		}], [{
			name : 'undo',
			theme : '<button type="button" class="btn btn-default bsmd-btn-undo" title="撤消"><i class="fa fa-undo"></i></button>',
			callback : function(s, e) {
				//撤消
				s.click(function() {
					e.undo();
				});
			}
		}, {
			name : 'redo',
			theme : '<button type="button" class="btn btn-default bsmd-btn-redo" title="重置"><i class="fa fa-repeat"></i></button>',
			callback : function(s, e) {
				//重置
				s.click(function() {
					e.redo();
				});
			}
		}]],
		preview : true
	};
})(jQuery);
