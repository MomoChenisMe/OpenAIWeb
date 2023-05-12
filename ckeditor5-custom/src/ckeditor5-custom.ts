/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

// The editor creator to use.
// import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';
import { BalloonEditor } from '@ckeditor/ckeditor5-editor-balloon';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { UploadAdapter } from '@ckeditor/ckeditor5-adapter-ckfinder';
import { Autoformat } from '@ckeditor/ckeditor5-autoformat';
import { Bold, Italic } from '@ckeditor/ckeditor5-basic-styles';
import { BlockQuote } from '@ckeditor/ckeditor5-block-quote';
import { CKFinder } from '@ckeditor/ckeditor5-ckfinder';
import { EasyImage } from '@ckeditor/ckeditor5-easy-image';
import { Heading } from '@ckeditor/ckeditor5-heading';
import { Image, ImageCaption, ImageStyle, ImageToolbar, ImageUpload, PictureEditing } from '@ckeditor/ckeditor5-image';
import { Indent } from '@ckeditor/ckeditor5-indent';
import { Link } from '@ckeditor/ckeditor5-link';
import { List } from '@ckeditor/ckeditor5-list';
import { MediaEmbed } from '@ckeditor/ckeditor5-media-embed';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { PasteFromOffice } from '@ckeditor/ckeditor5-paste-from-office';
import { Table, TableToolbar } from '@ckeditor/ckeditor5-table';
import { TableColumnResize } from '@ckeditor/ckeditor5-table';
import { CloudServices } from '@ckeditor/ckeditor5-cloud-services';
import { TextTransformation } from '@ckeditor/ckeditor5-typing';
import { CodeBlock } from '@ckeditor/ckeditor5-code-block';
import { Markdown } from '@ckeditor/ckeditor5-markdown-gfm';
import { EditorConfig } from '@ckeditor/ckeditor5-core';
import { HorizontalLine } from '@ckeditor/ckeditor5-horizontal-line';
import GFMDataProcessor from '@ckeditor/ckeditor5-markdown-gfm/src/gfmdataprocessor';
import { ViewDocument, ViewDocumentFragment } from '@ckeditor/ckeditor5-engine';

// import Prism from 'prismjs';
// import '../../src/theme/prism-one-dark.css'; // 預設主題
// 或其他可用的主題，如：
// import 'prismjs/themes/prism-okaidia.css';
// import 'prismjs/themes/prism-solarizedlight.css';


export default class QABalloonEditor extends BalloonEditor {
  constructor(sourceElementOrData: string | HTMLElement, config: EditorConfig | undefined) {
    super(sourceElementOrData, config);

    // // 當編輯器準備就緒時，應用語法高亮
    // this.on('ready', () => {
    //   this.applyPrismHighlighting();
    // });

    // // 當文檔數據發生變化時，應用語法高亮
    // this.model.document.on('change:data', () => {
    //   this.applyPrismHighlighting();
    // });
  }

  public static override builtinPlugins = [
    Autoformat,
    BlockQuote,
    Bold,
    CKFinder,
    CloudServices,
    CodeBlock,
    EasyImage,
    Essentials,
    Heading,
    Image,
    ImageCaption,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    Indent,
    Italic,
    Link,
    List,
    MediaEmbed,
    // Markdown,
    Paragraph,
    PasteFromOffice,
    PictureEditing,
    Table,
    TableToolbar,
    TableColumnResize,
    TextTransformation,
    UploadAdapter,
    HorizontalLine
  ];

  // Editor configuration.
  public static override defaultConfig = {
    toolbar: {
      items: [
        'undo',
        'redo',
        '|',
        'heading',
        '|',
        'bold',
        'italic',
        'link',
        'bulletedList',
        'numberedList',
        '|',
        'indent',
        'outdent',
        '|',
        'imageUpload',
        'blockQuote',
        'insertTable',
        'codeBlock',
        '|',
        'horizontalLine',
      ]
    },
    image: {
      toolbar: [
        'imageStyle:block',
        'imageStyle:side',
        '|',
        'imageTextAlternative'
      ]
    },
    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells'
      ]
    },
    // This value must be kept in sync with the language defined in webpack.config.js.
    language: 'zh',
    codeBlock: {
      languages: [
        { language: 'plaintext', label: 'Plain text' }, // The default language.
        { language: 'cs', label: 'C#' },
        { language: 'css', label: 'CSS' },
        { language: 'delphi', label: 'Delphi' },
        { language: 'html', label: 'HTML' },
        { language: 'javascript', label: 'JavaScript' },
        { language: 'python', label: 'Python' },
        { language: 'typescript', label: 'TypeScript' },
        { language: 'xml', label: 'XML' },
      ]
    }
  };

  // htmlToMarkdown(document: ViewDocument, viewFragment: ViewDocumentFragment, htmlString: string) {
  //   const gfmProcessor = new GFMDataProcessor(document);
  //   const domConverter = this.editing.view.domConverter;
  //   // const domParser = new DOMParser();
  //   // const domFragment = domParser.parseFromString(htmlString, 'text/html').body;

  //   // // Convert the DOM fragment to a View fragment
  //   // const viewFragment = domConverter.domToView(domFragment);

  //   return gfmProcessor.toData(viewFragment);
  // }

  // private applyPrismHighlighting(): void {
  //   // 獲取 CKEditor 中的程式碼區塊元素，如果 this.ui.view.editable.element 為 null，則使用空數組
  //   const domRoot = this.ui.getEditableElement();

  //   if (domRoot) {
  //     const codeElements = domRoot.querySelectorAll('pre code');
  //     // console.log(codeElements);
  //     codeElements.forEach((codeElement) => {
  //       // Prism.highlightElement(codeElement, true);
  //       // console.log(codeElement);
  //     });
  //   }
  // }

}
