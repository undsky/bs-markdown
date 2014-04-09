(function($) {
	/**
	 *bs-markdown
	 *
	 * @param {toolbar}
	 * @param {theme}
	 * @param {preview} true | false
	 */

	$.fn.bsmd = function(options) {
		var settings = $.extend(true, {}, $.fn.bsmd.defaults, options);

		var id = 'bsmd-' + (new Date).getTime();
		$('<div class="bsmd" id="' + id + '"><div class="btn-toolbar" role="toolbar"></div><div class="bsmd-editor"></div>' + (settings.preview ? '<div class="bsmd-preview"></div>' : '') + '</div>').insertAfter($(this));
		var mdText = $(this).is('textarea') ? $(this).val() : $(this).html();
		$(this).remove();

		for (var i in settings.toolbar) {
			var btnGroup = $('<div class="btn-group"></div>');
			btnGroup.appendTo($('#' + id + ' .btn-toolbar'));
			for (var j in settings.toolbar[i]) {
				var item = settings.toolbar[i][j].theme;

			}
			// for (var j in settings.toolbar[i].group) {
			// var btn = settings.toolbar[i].group[j];
			// switch(btn) {
			// case 'bold':
			// var bold = $(settings.theme.bold);
			// bold.appendTo(btnGroup);
			// bold.click(function() {
			// //粗体
			// addText(editor, '**粗体**');
			// reText(editor, 2, 4);
			// editor.focus();
			// });
			// break;
			// case 'italic':
			// var italic = $(settings.theme.italic);
			// italic.appendTo(btnGroup);
			// italic.click(function() {
			// //斜体
			// addText(editor, '*斜体*');
			// reText(editor, 1, 3);
			// editor.focus();
			// });
			// break;
			// case 'link':
			// var link = $(themeFormat(settings.theme.link, id));
			// link.appendTo(btnGroup);
			// link.on('show.bs.modal', function(e) {
			// var lform = $(this)[0];
			// lform.title.value = '';
			// lform.url.value = 'http://';
			// });
			// link.submit(function() {
			// //链接
			// var lform = $(this)[0];
			// addText(editor, '[' + lform.title.value + '](' + lform.url.value + ' "' + lform.title.value + '")');
			// $(this).modal('hide');
			// editor.focus();
			// return false;
			// });
			// break;
			// case 'quote':
			// var quote = $(settings.theme.quote);
			// quote.appendTo(btnGroup);
			// quote.click(function() {
			// //引用
			// addLine(editor, 2);
			// addText(editor, '>');
			// editor.focus();
			// });
			// break;
			// case 'code':
			// var code = $(settings.theme.code);
			// code.appendTo(btnGroup);
			// code.each(function(index) {
			// //代码
			// $(this).click(function() {
			// var lang = $(this).attr('lang');
			// if ('none' == lang) {
			// addText(editor, '`代码`');
			// reText(editor, 1, 3);
			// } else {
			// addLine(editor, 2);
			// addText(editor, '```' + lang);
			// addLine(editor, 2);
			// addText(editor, '```');
			// editor.gotoLine(editor.getSelection().getCursor().row, 0, false);
			// }
			// editor.focus();
			// });
			// });
			// break;
			// case 'picture':
			// var picture = $(themeFormat(settings.theme.picture, id));
			// picture.appendTo(btnGroup);
			// picture.on('show.bs.modal', function(e) {
			// var pform = $(this)[0];
			// pform.title.value = '';
			// pform.url.value = 'http://';
			// });
			// picture.submit(function() {
			// //图片
			// var pform = $(this)[0];
			// addText(editor, '![Alt ' + pform.title.value + '](' + pform.url.value + ' "' + pform.title.value + '")');
			// $(this).modal('hide');
			// editor.focus();
			// return false;
			// });
			// break;
			// case 'ol':
			// var ol = $(settings.theme.ol);
			// ol.appendTo(btnGroup);
			// ol.click(function() {
			// //有序列表
			// addLine(editor, 2);
			// addText(editor, '0. ');
			// editor.focus();
			// });
			// break;
			// case 'ul':
			// var ul = $(settings.theme.ul);
			// ul.appendTo(btnGroup);
			// ul.click(function() {
			// //无序列表
			// addLine(editor, 2);
			// addText(editor, '+ ');
			// editor.focus();
			// });
			// break;
			// case 'header':
			// var header = $(settings.theme.header);
			// header.appendTo(btnGroup);
			// header.each(function(index) {
			// //标题
			// $(this).click(function() {
			// var c = '';
			//
			// for (var i = 0; i < (index + 1); i++) {
			// c += '#';
			// };
			//
			// addText(editor, c + (index + 1) + '级标题' + c);
			// reText(editor, index + 1, index + 5);
			// editor.focus();
			// });
			// });
			// break;
			// case 'ellipsis':
			// var ellipsis = $(settings.theme.ellipsis);
			// ellipsis.appendTo(btnGroup);
			// ellipsis.click(function() {
			// //分割线
			// addLine(editor, 2);
			// addText(editor, '-------');
			// addLine(editor, 2);
			// editor.focus();
			// });
			// break;
			// case 'undo':
			// var undo = $(settings.theme.undo);
			// undo.appendTo(btnGroup);
			// undo.click(function() {
			// //撤消
			// editor.undo();
			// });
			// break;
			// case 'redo':
			// var redo = $(settings.theme.redo);
			// redo.appendTo(btnGroup);
			// redo.click(function() {
			// //重置
			// editor.redo();
			// });
			// break;
			// default:
			// var def = $(settings.theme[btn]);
			// def.data('method', btn);
			// def.appendTo(btnGroup);
			// def.click(function() {
			// settings.method[$(this).data('method')](editor);
			// });
			// break;
			// }
			// }
		}

		var editor = ace.edit($('#' + id + ' .bsmd-editor')[0]);
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

			}
		}, {
			name : 'quote',
			theme : '<button type="button" class="btn btn-default bsmd-btn-quote" title="引用"><i class="fa fa-quote-left"></i></button>',
			callback : function(s, e) {

			}
		}, {
			name : 'code',
			theme : '<div class="btn-group"><button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" title="代码"><i class="fa fa-code"></i><span class="caret"></span></button><ul class="dropdown-menu"><li><a lang="none" class="bsmd-code" href="javascript:void(0);">片段</a></li><li><a lang="html" class="bsmd-code" href="javascript:void(0);">html</a></li><li><a lang="css" class="bsmd-code" href="javascript:void(0);">css</a></li><li><a lang="javascript" class="bsmd-code" href="javascript:void(0);">javascript</a></li><li><a lang="markdown" class="bsmd-code" href="javascript:void(0);">markdown</a></li><li><a lang="php" class="bsmd-code" href="javascript:void(0);">php</a></li><li><a lang="csharp" class="bsmd-code" href="javascript:void(0);">c#</a></li><li><a lang="velocity" class="bsmd-code" href="javascript:void(0);">velocity</a></li></ul></div>',
			callback : function(s, e) {

			}
		}, {
			name : 'picture',
			theme : '<button type="button" class="btn btn-default" title="图片" data-toggle="modal" data-target="#{0}-modal-picture"><i class="fa fa-picture-o"></i></button><form class="form-horizontal bsmd-form-picture modal fade" id="{0}-modal-picture" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title">图片</h4></div><div class="modal-body"><div class="form-group"><label for="{0}-picture-title" class="col-sm-2 control-label">标题：</label><div class="col-sm-10"><input type="text" name="title" class="form-control" id="{0}-picture-title" placeholder="标题"></div></div><div class="form-group"><label for="{0}-picture-url" class="col-sm-2 control-label">网址：</label><div class="col-sm-10"><input type="text" name="url" value="http://" class="form-control" id="{0}-picture-url" placeholder="网址"></div></div></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">关闭</button><button type="submit" class="btn btn-primary">确定</button></div></div></div></form>',
			callback : function(s, e) {

			}
		}], [{
			name : 'ol',
			theme : '<button type="button" class="btn btn-default bsmd-btn-ol" title="有序列表"><i class="fa fa-list-ol"></i></button>',
			callback : function(s, e) {

			}
		}, {
			name : 'ul',
			theme : '<button type="button" class="btn btn-default bsmd-btn-ul" title="无序列表"><i class="fa fa-list-ul"></i></button>',
			callback : function(s, e) {

			}
		}, {
			name : 'header',
			theme : '<div class="btn-group"><button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" title="标题"><i class="fa fa-header"></i><span class="caret"></span></button><ul class="dropdown-menu"><li><a class="bsmd-header" href="javascript:void(0);"><i class="fa fa-header"></i>1</a></li><li><a class="bsmd-header" href="javascript:void(0);"><i class="fa fa-header"></i>2</a></li><li><a class="bsmd-header" href="javascript:void(0);"><i class="fa fa-header"></i>3</a></li><li><a class="bsmd-header" href="javascript:void(0);"><i class="fa fa-header"></i>4</a></li><li><a class="bsmd-header" href="javascript:void(0);"><i class="fa fa-header"></i>5</a></li><li><a class="bsmd-header" href="javascript:void(0);"><i class="fa fa-header"></i>6</a></li></ul></div>',
			callback : function(s, e) {

			}
		}, {
			name : 'ellipsis',
			theme : '<button type="button" class="btn btn-default bsmd-btn-ellipsis" title="分割线"><i class="fa fa-ellipsis-h"></i></button>',
			callback : function(s, e) {

			}
		}], [{
			name : 'undo',
			theme : '<button type="button" class="btn btn-default bsmd-btn-undo" title="撤消"><i class="fa fa-undo"></i></button>',
			callback : function(s, e) {

			}
		}, {
			name : 'redo',
			theme : '<button type="button" class="btn btn-default bsmd-btn-redo" title="重置"><i class="fa fa-repeat"></i></button>',
			callback : function(s, e) {

			}
		}]],
		preview : true
	};
})(jQuery);
