/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* exported initSample */

// Render script.
// This script renders non editable DOM objects.
var js = document.createElement("script");
js.type = "text/javascript";
js.src = "http://venperacademy.com:9090/pluginwiris_engine/app//WIRISplugins.js?viewer=image";
document.head.appendChild(js);

if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 )
	CKEDITOR.tools.enableHtml5Elements( document );

// The trick to keep the editor in the sample quite small
// unless user specified own height.
CKEDITOR.config.height = 150;
CKEDITOR.config.width = 'auto';

var initSample = ( function() {
	var wysiwygareaAvailable = isWysiwygareaAvailable(),
		isBBCodeBuiltIn = !!CKEDITOR.plugins.get( 'bbcode' );

	return function() {
		var editorElement = CKEDITOR.document.getById( 'editor' );
        if (editorElement && !editorElement.getEditor()) {
            // :(((
            if (isBBCodeBuiltIn) {
                editorElement.setHtml(
                    'Hello world!\n\n' +
                    'I\'m an instance of [url=https://ckeditor.com]CKEditor[/url].'
                );
            }

            // Depending on the wysiwygare plugin availability initialize classic or inline editor.
            if (wysiwygareaAvailable) {
                CKEDITOR.replace('editor',  {
                    filebrowserBrowseUrl : 'js/libs/ckfinder/ckfinder.html',
                    filebrowserImageBrowseUrl : 'js/libs/ckfinder/ckfinder.html?type=Images',
                    filebrowserFlashBrowseUrl : 'js/libs/ckfinder/ckfinder.html?type=Flash',
                    ilebrowserUploadUrl : 'http://localhost:9090/CKFinderJava-2.6.2.1//ckfinder/core/connector/java/connector.java?command=QuickUpload&type=Files',
                    filebrowserImageUploadUrl : 'http://localhost:9090/CKFinderJava-2.6.2.1/ckfinder/core/connector/java/connector.java?command=QuickUpload&type=Images',
                    filebrowserFlashUploadUrl : 'http://localhost:9090/CKFinderJava-2.6.2.1/ckfinder/core/connector/java/connector.java?command=QuickUpload&type=Flash'
                });
            } else {
                editorElement.setAttribute('contenteditable', 'true');
                CKEDITOR.inline('editor');

                // TODO we can consider displaying some info box that
                // without wysiwygarea the classic editor may not work.
            }
        }
        for(var i= 1; i <= 20 ; i++) {
            var editorElement = CKEDITOR.document.getById('editor' + i);
            if (editorElement && !editorElement.getEditor()) {
                if (isBBCodeBuiltIn) {
                    editorElement.setHtml(
                        'Hello world!\n\n' +
                        'I\'m an instance of [url=https://ckeditor.com]CKEditor[/url].'
                    );
                }

                // Depending on the wysiwygare plugin availability initialize classic or inline editor.
                if (wysiwygareaAvailable) {
                    CKEDITOR.replace('editor' + i, {
                        filebrowserBrowseUrl : 'js/libs/ckfinder/ckfinder.html',
                        filebrowserImageBrowseUrl : 'js/libs/ckfinder/ckfinder.html?type=Images',
                        filebrowserFlashBrowseUrl : 'js/libs/ckfinder/ckfinder.html?type=Flash',
                        ilebrowserUploadUrl : 'http://localhost:9090/CKFinderJava-2.6.2.1//ckfinder/core/connector/java/connector.java?command=QuickUpload&type=Files',
                        filebrowserImageUploadUrl : 'http://localhost:9090/CKFinderJava-2.6.2.1/ckfinder/core/connector/java/connector.java?command=QuickUpload&type=Images',
                        filebrowserFlashUploadUrl : 'http://localhost:9090/CKFinderJava-2.6.2.1/ckfinder/core/connector/java/connector.java?command=QuickUpload&type=Flash'
                    });
                } else {
                    editorElement.setAttribute('contenteditable', 'true');
                    CKEDITOR.inline('editor' + i);

                    // TODO we can consider displaying some info box that
                    // without wysiwygarea the classic editor may not work.
                }
            }
        }
	};



	function isWysiwygareaAvailable() {
		// If in development mode, then the wysiwygarea must be available.
		// Split REV into two strings so builder does not replace it :D.
		if ( CKEDITOR.revision == ( '%RE' + 'V%' ) ) {
			return true;
		}

		return !!CKEDITOR.plugins.get( 'wysiwygarea' );
	}
} )();


var clearSample = ( function() {
    var wysiwygareaAvailable = isWysiwygareaAvailable(),
        isBBCodeBuiltIn = !!CKEDITOR.plugins.get( 'bbcode' );

    return function() {
        var editorElement =  CKEDITOR.document.getById('editor');
        if (editorElement && editorElement.getEditor()) {
            CKEDITOR.instances.editor.setData('')
        }
        for(var i= 1; i <= 20 ; i++) {
            var editorElement = CKEDITOR.document.getById('editor' + i);

            if (editorElement && editorElement.getEditor()) {
                CKEDITOR.instances['editor' + i].setData('')
            }
        }
    };



    function isWysiwygareaAvailable() {
        // If in development mode, then the wysiwygarea must be available.
        // Split REV into two strings so builder does not replace it :D.
        if ( CKEDITOR.revision == ( '%RE' + 'V%' ) ) {
            return true;
        }

        return !!CKEDITOR.plugins.get( 'wysiwygarea' );
    }
} )();

// %LEAVE_UNMINIFIED% %REMOVE_LINE%
