function addLine(editor, num) {
	for (var i = 0; i < num; i++) {
		editor.getSession().getDocument().insertNewLine(editor.getSelection().getCursor());
	};
}

function addText(editor, text) {
	editor.getSession().getDocument().insertInLine(editor.getSelection().getCursor(), text);
}

function reText(editor, from, to) {
	var p = editor.getSelection().getCursor();
	editor.gotoLine(p.row + 1, p.column - from, false);
	editor.getSelection().selectTo(p.row, p.column - to);
}

(function($) {
	$.fn.bsmd = function(options) {
		var settings = $.extend({
			toolbar : [{
				group : ['bold', 'italic']
			}, {
				group : ['link', 'quote', 'code', 'picture']
			}, {
				group : ['ol', 'ul', 'header', 'ellipsis']
			}, {
				group : ['undo', 'redo']
			}],
			theme : {
				bold : '<button type="button" class="btn btn-default bsmd-btn-bold" title="粗体"><i class="fa fa-bold"></i></button>',
				italic : '<button type="button" class="btn btn-default bsmd-btn-italic" title="斜体"><i class="fa fa-italic"></i></button>',
				link : '<button type="button" class="btn btn-default" title="链接" data-toggle="modal" data-target="#' + id + '-modal-link"><i class="fa fa-link"></i></button><div class="modal fade" id="' + id + '-modal-link" role="dialog" aria-labelledby="' + id + '-title-link"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title" id="' + id + '-title-link">链接</h4></div><div class="modal-body"><form class="form-horizontal" role="form"><div class="form-group"><label for="' + id + '-link-title" class="col-sm-2 control-label">标题：</label><div class="col-sm-10"><input type="text" class="form-control" id="' + id + '-link-title" placeholder="标题"></div></div><div class="form-group"><label for="' + id + '-link-url" class="col-sm-2 control-label">网址：</label><div class="col-sm-10"><input type="text" value="http://" class="form-control" id="' + id + '-link-url" placeholder="网址"></div></div></form></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">关闭</button><button type="button" class="btn btn-primary bsmd-btn-link">确定</button></div></div></div></div>',
				quote : '<button type="button" class="btn btn-default bsmd-btn-quote" title="引用"><i class="fa fa-quote-left"></i></button>',
				code : '<div class="btn-group"><button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" title="代码"><i class="fa fa-code"></i><span class="caret"></span></button><ul class="dropdown-menu"><li><a lang="none" class="bsmd-code" href="javascript:void(0);">片段</a></li><li><a lang="html" class="bsmd-code" href="javascript:void(0);">html</a></li><li><a lang="css" class="bsmd-code" href="javascript:void(0);">css</a></li><li><a lang="javascript" class="bsmd-code" href="javascript:void(0);">javascript</a></li><li><a lang="markdown" class="bsmd-code" href="javascript:void(0);">markdown</a></li><li><a lang="php" class="bsmd-code" href="javascript:void(0);">php</a></li><li><a lang="csharp" class="bsmd-code" href="javascript:void(0);">c#</a></li><li><a lang="velocity" class="bsmd-code" href="javascript:void(0);">velocity</a></li></ul></div>',
				picture : '<button type="button" class="btn btn-default" title="图片" data-toggle="modal" data-target="#' + id + '-modal-picture"><i class="fa fa-picture-o"></i></button><div class="modal fade" id="' + id + '-modal-picture" role="dialog" aria-labelledby="' + id + '-title-picture"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title" id="' + id + '-title-picture">图片</h4></div><div class="modal-body"><form class="form-horizontal" role="form"><div class="form-group"><label for="' + id + '-picture-title" class="col-sm-2 control-label">标题：</label><div class="col-sm-10"><input type="text" class="form-control" id="' + id + '-picture-title" placeholder="标题"></div></div><div class="form-group"><label for="' + id + '-picture-url" class="col-sm-2 control-label">网址：</label><div class="col-sm-10"><input type="text" value="http://" class="form-control" id="' + id + '-picture-url" placeholder="网址"></div></div></form></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">关闭</button><button type="button" class="btn btn-primary bsmd-btn-picture">确定</button></div></div></div></div>',
				ol : '<button type="button" class="btn btn-default bsmd-btn-ol" title="有序列表"><i class="fa fa-list-ol"></i></button>',
				ul : '<button type="button" class="btn btn-default bsmd-btn-ul" title="无序列表"><i class="fa fa-list-ul"></i></button>',
				header : '<div class="btn-group"><button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" title="标题"><i class="fa fa-header"></i><span class="caret"></span></button><ul class="dropdown-menu"><li><a class="bsmd-header" href="javascript:void(0);"><i class="fa fa-header"></i>1</a></li><li><a class="bsmd-header" href="javascript:void(0);"><i class="fa fa-header"></i>2</a></li><li><a class="bsmd-header" href="javascript:void(0);"><i class="fa fa-header"></i>3</a></li><li><a class="bsmd-header" href="javascript:void(0);"><i class="fa fa-header"></i>4</a></li><li><a class="bsmd-header" href="javascript:void(0);"><i class="fa fa-header"></i>5</a></li><li><a class="bsmd-header" href="javascript:void(0);"><i class="fa fa-header"></i>6</a></li></ul></div>',
				ellipsis : '<button type="button" class="btn btn-default bsmd-btn-ellipsis" title="分割线"><i class="fa fa-ellipsis-h"></i></button>',
				undo : '<button type="button" class="btn btn-default bsmd-btn-undo" title="撤消"><i class="fa fa-undo"></i></button>',
				redo : '<button type="button" class="btn btn-default bsmd-btn-redo" title="重置"><i class="fa fa-repeat"></i></button>',
			},
			preview : true
		}, options);

		var id = 'bsmd-' + (new Date).getTime();
		$('<div style="width: 100%; height: 100%;" id="' + id + '"><div class="btn-toolbar" role="toolbar"></div><div class="bsmd-editor"></div>' + (settings.preview ? '<div class="bsmd-preview"></div></div>' : '')).insertAfter($(this));
		var mdText = $(this).is('textarea') ? $(this).val() : $(this).html();
		$(this).remove();

		for (var group in settings.toolbar) {
			var btnGroup = $('<div class="btn-group"></div>');
			btnGroup.appendTo($('#' + id + ' .btn-toolbar'));
			for (var i = 0; i < settings.toolbar[group].group.length; i++) {
				switch(settings.toolbar[group].group[i]) {
					case 'bold':
						btnGroup.append(settings.theme.bold);
						$('#' + id + ' .bsmd-btn-bold').click(function() {
							//粗体
							addText(editor, '**粗体**');
							reText(editor, 2, 4);
							editor.focus();
						});
						break;
					case 'italic':
						btnGroup.append(settings.theme.italic);
						$('#' + id + ' .bsmd-btn-italic').click(function() {
							//斜体
							addText(editor, '*斜体*');
							reText(editor, 1, 3);
							editor.focus();
						});
						break;
					case 'link':
						btnGroup.append(settings.theme.link);
						$('#' + id + ' .bsmd-btn-link').click(function() {
							//链接
							addText(editor, '[' + $('#' + id + '-link-title').val() + '](' + $('#' + id + '-link-url').val() + ' "' + $('#' + id + '-link-title').val() + '")');
							$('#' + id + '-modal-link').modal('hide');
							editor.focus();
						});
						break;
					case 'quote':
						btnGroup.append(settings.theme.quote);
						$('#' + id + ' .bsmd-btn-quote').click(function() {
							//引用
							addLine(editor, 2);
							addText(editor, '>');
							editor.focus();
						});
						break;
					case 'code':
						btnGroup.append(settings.theme.code);
						$('a.bsmd-code').each(function(index) {
							//代码
							$(this).click(function() {
								var lang = $(this).attr('lang');
								if ('none' == lang) {
									addText(editor, '`代码`');
									reText(editor, 1, 3);
								} else {
									addLine(editor, 2);
									addText(editor, '```' + lang);
									addLine(editor, 2);
									addText(editor, '```');
									editor.gotoLine(editor.getSelection().getCursor().row, 0, false);
								}
								editor.focus();
							});
						});
						break;
					case 'picture':
						btnGroup.append(settings.theme.picture);
						$('#' + id + ' .bsmd-btn-picture').click(function() {
							//图片
							addText(editor, '![Alt ' + $('#' + id + '-picture-title').val() + '](' + $('#' + id + '-picture-url').val() + ' "' + $('#' + id + '-picture-title').val() + '")');
							$('#' + id + '-modal-picture').modal('hide');
							editor.focus();
						});
						break;
					case 'ol':
						btnGroup.append(settings.theme.ol);
						$('#' + id + ' .bsmd-btn-ol').click(function() {
							//有序列表
							addLine(editor, 2);
							addText(editor, '0. ');
							editor.focus();
						});
						break;
					case 'ul':
						btnGroup.append(settings.theme.ul);
						$('#' + id + ' .bsmd-btn-ul').click(function() {
							//无序列表
							addLine(editor, 2);
							addText(editor, '+ ');
							editor.focus();
						});
						break;
					case 'header':
						btnGroup.append(settings.theme.header);
						$('a.bsmd-header').each(function(index) {
							//标题
							$(this).click(function() {
								var c = '';

								for (var i = 0; i < (index + 1); i++) {
									c += '#';
								};

								addText(editor, c + (index + 1) + '级标题' + c);
								reText(editor, index + 1, index + 5);
								editor.focus();
							});
						});
						break;
					case 'ellipsis':
						btnGroup.append(settings.theme.ellipsis);
						$('#' + id + ' .bsmd-btn-ellipsis').click(function() {
							//分割线
							addLine(editor, 2);
							addText(editor, '-------');
							addLine(editor, 2);
							editor.focus();
						});
						break;
					case 'undo':
						btnGroup.append(settings.theme.undo);
						$('#' + id + ' .bsmd-btn-undo').click(function() {
							//撤消
							editor.undo();
						});
						break;
					case 'redo':
						btnGroup.append(settings.theme.redo);
						$('#' + id + ' .bsmd-btn-redo').click(function() {
							//重置
							editor.redo();
						});
						break;
					default:
						break;
				}
			}
		}

		var editor = ace.edit($('#' + id + ' .bsmd-editor')[0]);
		editor.setTheme('ace/theme/chrome');
		editor.getSession().setMode('ace/mode/markdown');

		$('.bsmd-editor').css({
			"position" : "absolute",
			"top" : "40px",
			"right" : "50%",
			"bottom" : 0,
			"left" : 0
		});

		if (settings.preview) {
			$('.bsmd-preview').css({
				"position" : "absolute",
				"top" : "40px",
				"right" : 0,
				"bottom" : 0,
				"left" : "50%"
			});

			editor.on('change', function(e) {
				$('#' + id + ' .bsmd-preview').html(marked(editor.getValue()));
			});
		}

		if (mdText) {
			editor.setValue(mdText);
		}
	};
})(jQuery);
